import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { successResponse } from '../utils/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  return successResponse({
    status: 'HEALTHY',
    service: 'UrbanLoop AI Serverless Backend',
    region: process.env.AWS_REGION || 'us-east-1',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0',
    environment: 'AWS Serverless Production'
  });
};
