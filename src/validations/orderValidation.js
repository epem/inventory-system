import Joi from 'joi';

export const orderSchema = Joi.object({
    customerId: Joi.string().required()
      .messages({
        'string.base': 'Customer ID must be a string',
        'any.required': 'Customer ID is required'
      }),
    products: Joi.array().items(
      Joi.object({
        id: Joi.string().required()
          .messages({
            'string.base': 'Product ID must be a string',
            'any.required': 'Product ID is required'
          }),
        quantity: Joi.number().integer().positive().max(1000).required()
          .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.positive': 'Quantity must be positive',
            'number.max': 'Maximum quantity per product is 1000',
            'any.required': 'Quantity is required'
          }),
      })
    ).min(1).max(100).required()
      .messages({
        'array.min': 'Order must contain at least one product',
        'array.max': 'Order cannot contain more than 100 products',
        'any.required': 'Products are required'
      })
  });