import { Request, Response, NextFunction } from 'express';
import {
  ApiError,
  ValidationError,
  InternalServerError,
} from '../utils/errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Default to 500 (Internal Server Error) if status code is not set
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: Record<string, string[]> | undefined;

  // Handle different types of errors
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  // Handle Mongoose validation errors
  else if ((err as any).name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};
    
    for (const field in (err as any).errors) {
      errors[field] = [(err as any).errors[field].message];
    }
  } 
  // Handle duplicate key errors
  else if ((err as MongoServerError).code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
    const key = Object.keys((err as MongoServerError).keyPattern || {})[0];
    if (key) {
      errors = {
        [key]: [`${key} already exists`],
      };
    }
  } 
  // Handle JWT errors
  else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
  }
  // Handle validation errors from express-validator
  else if (err instanceof ValidationError) {
    statusCode = 422;
    message = 'Validation Error';
    errors = err.errors;
  }

  // Log the error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.message,
    }),
  });
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('Unhandled Rejection at:', reason.stack || reason);
  // Consider logging to an external service here
});

// Catch uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception thrown:', error);
  // Consider logging to an external service here
  process.exit(1);
});