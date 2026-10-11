import { APIGatewayProxyResultV2 } from 'aws-lambda';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-User-Role, X-User-Id',
};

export const successResponse = (data: any, statusCode = 200): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(data),
});

export const badRequestResponse = (message: string, errors?: any): APIGatewayProxyResultV2 => ({
  statusCode: 400,
  headers: CORS_HEADERS,
  body: JSON.stringify({
    error: 'Bad Request',
    message,
    details: errors || null,
  }),
});

export const unauthorizedResponse = (message = 'Unauthorized'): APIGatewayProxyResultV2 => ({
  statusCode: 401,
  headers: CORS_HEADERS,
  body: JSON.stringify({
    error: 'Unauthorized',
    message,
  }),
});

export const forbiddenResponse = (message = 'Forbidden'): APIGatewayProxyResultV2 => ({
  statusCode: 403,
  headers: CORS_HEADERS,
  body: JSON.stringify({
    error: 'Forbidden',
    message,
  }),
});

export const notFoundResponse = (message = 'Resource Not Found'): APIGatewayProxyResultV2 => ({
  statusCode: 404,
  headers: CORS_HEADERS,
  body: JSON.stringify({
    error: 'Not Found',
    message,
  }),
});

export const serverErrorResponse = (err: any): APIGatewayProxyResultV2 => {
  console.error('Unhandled Lambda Error:', err);
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      error: 'Internal Server Error',
      message: err?.message || 'An unexpected error occurred processing your request.',
    }),
  };
};
