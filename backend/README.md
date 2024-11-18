# E-commerce Backend API

This project is a backend application for an e-commerce platform, built using **NestJS**, **Prisma**, and **PostgreSQL**. It provides APIs for managing products, orders, categories, and order statuses. It also includes optional features like authentication and order reviews.

## Features

- **Product Management**: Create, update, and retrieve product details.
- **Category Management**: Retrieve a predefined list of categories.
- **Order Management**: Place orders, update their status, and fetch order details.
- **Order Status Management**: Retrieve all predefined order statuses.
- **Validation**: Strict validation for user inputs to prevent invalid data.
- **Error Handling**: Informative error messages and appropriate HTTP status codes.
- **Authentication**: Secure sensitive API endpoints with JWT.
- **SEO Description**: Generate SEO-optimized descriptions for products.
- **Database Initialization**: Initialize products in the database using JSON or CSV files.
- **Order Reviews**: Add reviews for completed or canceled orders.

## Technologies

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (for JWT-based authentication)
- **Validation**: [class-validator](https://github.com/typestack/class-validator)
- **Environment Configuration**: [dotenv](https://www.npmjs.com/package/dotenv)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [PostgreSQL](https://www.postgresql.org/) (v12 or later)

### Installation

1. Clone the repository:

```bash
  git clone https://github.com/Podziuu/AJI.git
  cd backend
```

2. Install dependencies:

```bash
  npm install
```

3. Configure environment variables: <br/>
Create a `.env` file in the root directory and add the following:

```bash
  POSTGRES_PRISMA_URL=
  POSTGRES_URL_NON_POOLING=
```

4. Set up the database:
   * Apply database migrations:
     
```bash
  npx prisma migrate dev
```

  * Seed the database (for categories and order statuses):
    
```bash
  npx prisma db seed
```

5. Start the server:
```bash
  npm run start:dev
```
&emsp; The server will be available at `http://localhost:3000`

### API Endpoints

#### Products
* `GET /api/products` - Retrieve all products.
* `GET /api/products/:id` - Retrieve a specific product.
* `POST /api/products` - Create a new product.
* `PUT /api/products/:id` - Update a product.

#### Categories
* `GET /api/categories` - Retrieve all categories

#### Orders
* `GET /api/orders` - Retrieve all orders.
* `POST /api/orders` - Create a new order.
* `PATCH /api/orders/:id` - Update an order.
* `GET /api/orders/:status/:id` - Retrieve a status of specific order.

#### Status
* `GET /api/status` - Retrieve all statuses.

#### Auth
* `POST /api/auth/register` - Register a new user.
* `POST /api/auth/login` - Login a existing user.
* `POST /api/auth/logout` - Logout an user.

#### Database Initialization
* `POST /api/init` - Initialize prodcuts from a JSON or CSV file.

### License
This project is licensed under the MIT License.
