# Chapter Performance Dashboard API

A RESTful API for managing and tracking chapter performance metrics with MongoDB, Redis, and TypeScript.

## 🚀 Features

- RESTful API with Express.js
- MongoDB for data storage with Mongoose
- Redis for caching and rate limiting
- JWT Authentication for admin routes
- Swagger API documentation
- TypeScript support
- Environment-based configuration
- Request validation
- Error handling
- Logging

## 📦 Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 4.0.0
- Redis >= 6.0.0
- npm >= 7.0.0 or yarn >= 1.22.0

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chapter-dashboard-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🚀 Running the Application

- Development: `npm run dev`
- Production: `npm run build && npm start`
- Test: `npm test`
- Lint: `npm run lint`
- Format: `npm run format`

## 🔧 Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chapter-dashboard

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# Admin
ADMIN_TOKEN=your_admin_token_here
```

## 📚 API Documentation

After starting the server, visit `/api-docs` in your browser to view the Swagger documentation.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
