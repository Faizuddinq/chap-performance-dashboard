import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { redisClient } from './config/redis';
import rateLimiter from './middleware/rateLimiter';
import {redisCache} from './middleware/redisCache';
import {errorHandler} from './middleware/errorHandler';
import chapterRoutes from './routes/chapter.routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    redis: redisClient.isReady ? 'connected' : 'disconnected'
  });
});

// Apply rate limiting to all routes
app.use(rateLimiter);

// API Routes
app.use('/api/v1/chapters', redisCache, chapterRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
