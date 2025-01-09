import { getAllProducts } from '../queries/productQueries.js';
import { createProduct, updateStock } from '../commands/productCommands.js';
import { productSchema, stockSchema } from '../validations/productValidation.js';
import { ValidationError, NotFoundError, InsufficientStockError } from '../errors/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const TABLE_NAME = process.env.DYNAMODB_TABLE_PRODUCTS;

export const getProductsHandler = asyncHandler(async (req, res) => {
    logger.debug('[getProductsHandler] Starting to fetch all products');
    logger.debug(`[getProductsHandler] Using table: ${TABLE_NAME}`);
    
    const products = await getAllProducts(TABLE_NAME);
    logger.debug(`[getProductsHandler] Successfully fetched ${products.length} products`);
    
    return res.status(200).json({
        status: 'success',
        data: products
    });
});

export const createProductHandler = asyncHandler(async (req, res) => {
    logger.debug(`[createProductHandler] Starting product creation with body: ${JSON.stringify(req.body)}`);
    
    const { error, value } = productSchema.validate(req.body, {
        abortEarly: false // get all validation errors
    });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        throw new ValidationError(errors.join(', '));
    }
    
    logger.debug(`[createProductHandler] Creating product in table: ${TABLE_NAME}`);
    logger.debug(`[createProductHandler] Validated product data: ${JSON.stringify(value)}`);
    
    const newProduct = await createProduct(TABLE_NAME, value);
    logger.debug(`[createProductHandler] Product created successfully: ${JSON.stringify(newProduct)}`);
    
    return res.status(201).json({
        status: 'success',
        data: newProduct
    });
});

export const restockHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    logger.debug(`[restockHandler] Starting restock for product ${id} with body: ${JSON.stringify(req.body)}`);
    
    const { error, value } = stockSchema.validate(req.body);
    if (error) {
        throw new ValidationError(error.details[0].message);
    }

    try {
        const updatedProduct = await updateStock(TABLE_NAME, id, value.quantity);
        logger.debug(`[restockHandler] Successfully restocked product ${id}: ${JSON.stringify(updatedProduct)}`);
        
        return res.status(200).json({
            status: 'success',
            data: updatedProduct
        });
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            throw new NotFoundError('Product');
        }
        throw err;
    }
});

export const sellHandler = asyncHandler(async (req, res) => {
    const { id } = req.params;
    logger.debug(`[sellHandler] Starting sell for product ${id} with body:`, req.body);
    
    const { error, value } = stockSchema.validate(req.body);
    if (error) {
        throw new ValidationError(error.details[0].message);
    }

    try {
        const updatedProduct = await updateStock(TABLE_NAME, id, -Math.abs(value.quantity));
        logger.debug(`[sellHandler] Successfully sold product ${id}:`, updatedProduct);
        
        return res.status(200).json({
            status: 'success',
            data: updatedProduct
        });
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            throw new InsufficientStockError();
        }
        throw err;
    }
});