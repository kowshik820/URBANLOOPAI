import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

export const TABLES = {
  RECYCLING: process.env.RECYCLING_TABLE || 'urbanloop-recycling-requests',
  EWASTE: process.env.EWASTE_TABLE || 'urbanloop-ewaste-requests',
  CATALOG: process.env.CATALOG_TABLE || 'urbanloop-waste-catalog',
  ACTIVITY: process.env.ACTIVITY_TABLE || 'urbanloop-user-activity',
};
