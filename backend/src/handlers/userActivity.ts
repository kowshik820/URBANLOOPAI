import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '../utils/dynamodb.js';
import { authenticateRequest } from '../utils/auth.js';
import { successResponse, badRequestResponse, serverErrorResponse } from '../utils/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const method = event.requestContext.http.method;
  const auth = authenticateRequest(event);

  try {
    if (method === 'GET') {
      try {
        const scanRes = await docClient.send(
          new ScanCommand({
            TableName: TABLES.ACTIVITY,
            Limit: 50,
          })
        );
        return successResponse(scanRes.Items || []);
      } catch {
        return successResponse([]);
      }
    }

    if (method === 'POST') {
      if (!event.body) return badRequestResponse('Missing JSON body');
      const body = JSON.parse(event.body);

      const newAct = {
        id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: auth?.userId || body.userId || 'user-01',
        activityType: body.activityType || 'COMMUNITY_ACTION',
        title: body.title || 'Eco Action Recorded',
        description: body.description || '',
        pointsEarned: parseInt(body.pointsEarned) || 10,
        co2SavedKg: parseFloat(body.co2SavedKg) || 0,
        timestamp: new Date().toISOString(),
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLES.ACTIVITY,
          Item: newAct,
        })
      );

      return successResponse(newAct, 201);
    }

    return badRequestResponse(`Unsupported method ${method}`);
  } catch (err: any) {
    return serverErrorResponse(err);
  }
};
