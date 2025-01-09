import { dbClient } from '../database/dbClient.js';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { updateStock } from './productCommands.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';

export async function createOrder(ordersTable, productsTable, orderData) {
  logger.debug(`[createOrder] Starting with data: ${JSON.stringify(orderData)}`);

  const orderId = uuidv4();

  try {
    // Reduce stock by the required amount for each product
    for (const product of orderData.products) {
      logger.debug(`[createOrder] Updating stock for product ${product.id}`);
      await updateStock(productsTable, product.id, -Math.abs(product.quantity));
    }

    const orderItem = {
      id: orderId,
      customerId: orderData.customerId,
      products: orderData.products,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: ordersTable,
      Item: marshall(orderItem)
    };

    logger.debug(`[createOrder] Saving order with params: ${JSON.stringify(params)}`);
    await dbClient.send(new PutItemCommand(params));
    logger.debug('[createOrder] Order created successfully');

    return orderItem;
  } catch (error) {
    logger.error('[createOrder] Error:', error);
    throw error; // Pass the error forward for processing in the controller
  }
}