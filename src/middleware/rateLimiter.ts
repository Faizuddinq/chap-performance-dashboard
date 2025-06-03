import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../config/redis';
import { TooManyRequestsError } from '../utils/errors';

// Rate limiting configuration
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: 30, // 30 requests
  duration: 60, // per 60 seconds per IP
  blockDuration: 60 * 10, // Block for 10 minutes if limit is exceeded
});

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip rate limiting for health checks
  if (req.path === '/health') {
    return next();
  }

  rateLimiter.consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      next(new TooManyRequestsError('Too many requests, please try again later.'));
    });
};

export default rateLimiterMiddleware;