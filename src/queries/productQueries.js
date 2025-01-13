import { dbClient } from '../database/dbClient.js';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export async function getAllProducts(tableName) {
  const params = {
    TableName: tableName
  };
  
  const result = await dbClient.send(new ScanCommand(params));
// result.Items is an array of DynamoDB format objects
// Parse each item into a regular JavaScript object
  return result.Items.map(item => unmarshall(item));
}