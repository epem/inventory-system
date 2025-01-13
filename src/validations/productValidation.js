import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(50).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required()
});

export const stockSchema = Joi.object({
  quantity: Joi.number().integer().positive().max(10000).required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.positive': 'Quantity must be positive',
      'number.max': 'Quantity cannot exceed 10000',
      'any.required': 'Quantity is required'
    })
});