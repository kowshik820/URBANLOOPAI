import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ScanCommand, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '../utils/dynamodb.js';
import { authenticateRequest } from '../utils/auth.js';
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse
} from '../utils/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method;
  const auth = authenticateRequest(event);

  try {
    // --- GET /api/ewaste ---
    if (method === 'GET') {
      try {
        const scanRes = await docClient.send(
          new ScanCommand({
            TableName: TABLES.EWASTE,
            Limit: 50,
          })
        );
        return successResponse(scanRes.Items || []);
      } catch {
        return successResponse([]);
      }
    }

    // --- POST /api/ewaste ---
    if (method === 'POST') {
      if (!event.body) return badRequestResponse('Missing JSON body');
      let body: any;
      try {
        body = JSON.parse(event.body);
      } catch {
        return badRequestResponse('Invalid JSON');
      }

      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return badRequestResponse('At least one electronic device must be registered in "items"');
      }
      if (!body.facilityName || typeof body.facilityName !== 'string') {
        return badRequestResponse('Target certified "facilityName" is required');
      }

      const id = `EW-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord = {
        id,
        userId: auth?.userId || body.userId || 'user-01',
        userName: body.userName || 'Resident User',
        address: body.address || 'Eco District',
        contactNumber: body.contactNumber || '+1 (555) 000-0000',
        items: body.items,
        facilityId: body.facilityId || 'fac-1',
        facilityName: body.facilityName,
        status: 'PICKUP_SCHEDULED',
        scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
        certificateId: `CERT-AWS-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLES.EWASTE,
          Item: newRecord,
        })
      );

      return successResponse(newRecord, 201);
    }

    // --- PATCH /api/ewaste/{id} ---
    if (method === 'PATCH') {
      const id = event.pathParameters?.id;
      if (!id) return badRequestResponse('Missing ID parameter');
      if (!event.body) return badRequestResponse('Missing body');
      const body = JSON.parse(event.body);

      const existing = await docClient.send(
        new GetCommand({
          TableName: TABLES.EWASTE,
          Key: { id },
        })
      );
      if (!existing.Item) return notFoundResponse(`E-Waste request '${id}' not found`);

      const status = body.status || existing.Item.status;
      await docClient.send(
        new UpdateCommand({
          TableName: TABLES.EWASTE,
          Key: { id },
          UpdateExpression: 'SET #st = :st, updatedAt = :ua',
          ExpressionAttributeNames: { '#st': 'status' },
          ExpressionAttributeValues: {
            ':st': status,
            ':ua': new Date().toISOString(),
          },
        })
      );

      return successResponse({
        ...existing.Item,
        status,
        updatedAt: new Date().toISOString(),
      });
    }

    return badRequestResponse(`Unsupported method ${method}`);
  } catch (err: any) {
    return serverErrorResponse(err);
  }
};
