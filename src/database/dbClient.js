import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const isLocal = process.env.IS_OFFLINE || process.env.NODE_ENV === 'development';

const config = {
  region: process.env.AWS_REGION || 'us-east-1'
};

if (isLocal) {
  Object.assign(config, {
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'local',
      secretAccessKey: 'local'
    },
    forcePathStyle: true
  });
}

export const dbClient = new DynamoDBClient(config);