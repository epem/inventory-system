import { createOrder } from '../commands/orderCommands.js';
import { orderSchema } from '../validations/orderValidation.js';
import { ValidationError, InsufficientStockError } from '../errors/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
const PRODUCTS_TABLE = process.env.DYNAMODB_TABLE_PRODUCTS;
const ORDERS_TABLE = process.env.DYNAMODB_TABLE_ORDERS;

export const createOrderHandler = asyncHandler(async (req, res) => {
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
        throw new ValidationError(error.details[0].message);
    }

    try {
        const newOrder = await createOrder(ORDERS_TABLE, PRODUCTS_TABLE, value);
        return res.status(201).json(newOrder);
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            throw new InsufficientStockError();
        }
        throw err;
    }
});