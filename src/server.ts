import app from './app';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import { setupSwagger } from './config/swagger';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Setup Swagger documentation
setupSwagger(app);

// Connect to MongoDB and Redis, then start the server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
