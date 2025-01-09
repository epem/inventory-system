import { dbClient } from '../database/dbClient.js';
import { PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { InsufficientStockError } from '../errors/index.js';
import logger from '../utils/logger.js';

export async function createProduct(tableName, productData) {
  logger.debug(`[createProduct] Starting with data: ${JSON.stringify(productData)}`);
  
  const newItem = {
    ...productData,
    id: uuidv4()
  };

  const params = {
    TableName: tableName,
    Item: marshall(newItem)
  };

  logger.debug(`[createProduct] DynamoDB params: ${JSON.stringify(params)}`);
  await dbClient.send(new PutItemCommand(params));
  logger.debug('[createProduct] Product created successfully');
  
  return newItem;
}

export async function updateStock(tableName, productId, quantityChange) {
  logger.debug(`[updateStock] Starting with params: ${JSON.stringify({
    tableName,
    productId,
    quantityChange
  })}`, );

// For sale (negative change) we check that there is enough product in stock
  const minRequired = quantityChange < 0 ? Math.abs(quantityChange) : 0;

  const params = {
    TableName: tableName,
    Key: marshall({ id: productId }),
    UpdateExpression: 'SET stock = stock + :qty',
    ConditionExpression: 'stock >= :minRequired',
    ExpressionAttributeValues: marshall({
      ':qty': quantityChange,
      ':minRequired': minRequired
    }),
    ReturnValues: 'ALL_NEW'
  };

  logger.debug(`[updateStock] DynamoDB params: ${JSON.stringify(params)}`);

  try {
    const result = await dbClient.send(new UpdateItemCommand(params));
    logger.debug('[updateStock] Stock updated successfully');
    return unmarshall(result.Attributes);
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      logger.warning('[updateStock] Insufficient stock for operation');
      throw new InsufficientStockError();
    }
    logger.error('[updateStock] Error:', error);
    throw error;
  }
}