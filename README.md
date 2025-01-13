# Inventory Management System

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![DynamoDB](https://img.shields.io/badge/DynamoDB-AWS-orange)
![License](https://img.shields.io/badge/License-ISC-yellow)

A RESTful API for managing product inventory and orders using Node.js, Express, and DynamoDB. Built with clean architecture principles and CQRS pattern.

## Features

- Product management (CRUD operations)
- Stock control with restock and sell operations
- Order processing with stock validation
- Input validation using Joi
- Error handling middleware
- DynamoDB for data persistence
- Serverless deployment ready

## Prerequisites

- Node.js 18.x
- AWS Account (for DynamoDB)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone git@github.com:epem/inventory-system.git
cd inventory-system
```

2. Install dependencies
```bash
npm install
npm install serverless -g
serverless dynamodb install
```

3. Set up environment variables
```bash
# Create .env file
cp .env.example .env

# Configure your environment variables
AWS_REGION=eu-central-1
DYNAMODB_TABLE_PRODUCTS=inventory-system-products-dev
DYNAMODB_TABLE_ORDERS=inventory-system-orders-dev
STAGE=dev
NODE_ENV=development
IS_OFFLINE=true
```

4. Start the development server
```bash
npm run start:local
```

The API will be available at `http://localhost:3000`

## API Documentation

### Products

#### Get all products
```http
GET /products
```

**Response**
```json
{
    "status": "success",
    "data": [
        {
            "id": "uuid",
            "name": "Product Name",
            "description": "Product Description",
            "price": 29.99,
            "stock": 100
        }
    ]
}
```

#### Create product
```http
POST /products
```

**Request Body**
```json
{
    "name": "Product Name",
    "description": "Product Description",
    "price": 29.99,
    "stock": 100
}
```

#### Restock product
```http
POST /products/{id}/restock
```

**Request Body**
```json
{
    "quantity": 50
}
```

#### Sell product
```http
POST /products/{id}/sell
```

**Request Body**
```json
{
    "quantity": 5
}
```

### Orders

#### Create order
```http
POST /orders
```

**Request Body**
```json
{
    "customerId": "customer-uuid",
    "products": [
        {
            "id": "product-uuid",
            "quantity": 2
        }
    ]
}
```

## Error Handling

The API uses standard HTTP response codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, insufficient stock)
- `404` - Not Found
- `500` - Internal Server Error

Error Response Format:
```json
{
    "status": "error",
    "message": "Error description"
}
```

## Project Structure

```
├── src/
│   ├── commands/           # Command handlers (CQRS)
│   ├── queries/           # Query handlers (CQRS)
│   ├── controllers/       # Route controllers
│   ├── database/         # Database configuration
│   ├── errors/           # Custom error classes
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── validations/      # Joi validation schemas
│   └── index.js          # Application entry point
├── package.json
├── serverless.yml        # Serverless configuration
└── .env                  # Environment variables
```

## Development

### Running Tests
```bash
npm test
```

### Local DynamoDB
The project uses `serverless-dynamodb-local` for local development. Local DynamoDB will start automatically with `npm run start:local`.

## Deployment

The application is configured for deployment using the Serverless Framework:

```bash
# Deploy to dev stage
serverless deploy

# Deploy to production stage
serverless deploy --stage prod
```

## Built With

- [Node.js](https://nodejs.org/) - Runtime environment
- [Express](https://expressjs.com/) - Web framework
- [DynamoDB](https://aws.amazon.com/dynamodb/) - Database
- [Serverless Framework](https://www.serverless.com/) - Deployment
- [Joi](https://joi.dev/) - Validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Express.js Documentation](https://expressjs.com/)