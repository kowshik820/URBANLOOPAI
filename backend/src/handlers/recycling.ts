import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ScanCommand, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '../utils/dynamodb.js';
import { authenticateRequest } from '../utils/auth.js';
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  forbiddenResponse
} from '../utils/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method;
  const auth = authenticateRequest(event);

  try {
    // --- GET /api/recycling ---
    if (method === 'GET') {
      try {
        const scanRes = await docClient.send(
          new ScanCommand({
            TableName: TABLES.RECYCLING,
            Limit: 50,
          })
        );
        return successResponse(scanRes.Items || []);
      } catch (err: any) {
        // If table empty or freshly deployed
        return successResponse([]);
      }
    }

    // --- POST /api/recycling ---
    if (method === 'POST') {
      if (!event.body) {
        return badRequestResponse('Missing JSON request body');
      }

      let body: any;
      try {
        body = JSON.parse(event.body);
      } catch {
        return badRequestResponse('Invalid JSON syntax');
      }

      // Input Validation
      if (!body.userName || typeof body.userName !== 'string' || !body.userName.trim()) {
        return badRequestResponse('Field "userName" is required');
      }
      if (!body.address || typeof body.address !== 'string' || !body.address.trim()) {
        return badRequestResponse('Field "address" is required');
      }
      if (!body.wasteType || typeof body.wasteType !== 'string') {
        return badRequestResponse('Field "wasteType" is required');
      }
      const estimatedKg = parseFloat(body.estimatedKg);
      if (isNaN(estimatedKg) || estimatedKg <= 0 || estimatedKg > 1000) {
        return badRequestResponse('Field "estimatedKg" must be a positive number between 0.1 and 1000 kg');
      }

      const id = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord = {
        id,
        userId: auth?.userId || body.userId || 'user-01',
        userName: body.userName.trim(),
        contactNumber: body.contactNumber?.trim() || '+1 (555) 000-0000',
        address: body.address.trim(),
        wasteType: body.wasteType,
        estimatedKg,
        status: 'PENDING',
        scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
        pickupTimeSlot: body.pickupTimeSlot || 'Morning (8AM - 12PM)',
        notes: body.notes?.trim() || '',
        createdAt: new Date().toISOString(),
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLES.RECYCLING,
          Item: newRecord,
        })
      );

      return successResponse(newRecord, 201);
    }

    // --- PATCH /api/recycling/{id} ---
    if (method === 'PATCH') {
      const id = event.pathParameters?.id;
      if (!id) return badRequestResponse('Missing request ID parameter');

      if (!event.body) return badRequestResponse('Missing request body');
      const body = JSON.parse(event.body);

      const allowedStatuses = ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'COLLECTED', 'CANCELLED'];
      if (body.status && !allowedStatuses.includes(body.status)) {
        return badRequestResponse(`Status must be one of: ${allowedStatuses.join(', ')}`);
      }

      // Verify item exists
      const existing = await docClient.send(
        new GetCommand({
          TableName: TABLES.RECYCLING,
          Key: { id },
        })
      );

      if (!existing.Item) {
        return notFoundResponse(`Recycling request '${id}' not found`);
      }

      const updatedStatus = body.status || existing.Item.status;
      const collectorName = body.collectorName || existing.Item.collectorName || 'Urban Green Fleet';
      const pointsAwarded = updatedStatus === 'COLLECTED' ? Math.round(existing.Item.estimatedKg * 3) : existing.Item.pointsAwarded;

      await docClient.send(
        new UpdateCommand({
          TableName: TABLES.RECYCLING,
          Key: { id },
          UpdateExpression: 'SET #st = :st, collectorName = :cn, updatedAt = :ua, pointsAwarded = :pa',
          ExpressionAttributeNames: { '#st': 'status' },
          ExpressionAttributeValues: {
            ':st': updatedStatus,
            ':cn': collectorName,
            ':ua': new Date().toISOString(),
            ':pa': pointsAwarded || null,
          },
        })
      );

      return successResponse({
        ...existing.Item,
        status: updatedStatus,
        collectorName,
        pointsAwarded,
        updatedAt: new Date().toISOString(),
      });
    }

    return badRequestResponse(`Unsupported method ${method}`);
  } catch (err: any) {
    return serverErrorResponse(err);
  }
};
