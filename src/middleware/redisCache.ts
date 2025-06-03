import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';
import logger from '../utils/logger';

// Default cache expiration time in seconds (1 hour)
const DEFAULT_EXPIRATION = 60 * 60;

/**
 * Middleware to cache responses in Redis
 * @param expiration - Cache expiration time in seconds (default: 1 hour)
 */
export const redisCache = (expiration: number = DEFAULT_EXPIRATION) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip cache for specific routes if needed
    if (req.path.includes('no-cache')) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get cached data from Redis
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        logger.debug(`Cache hit for ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      // Override res.json to cache the response before sending
      const originalJson = res.json;
      res.json = (body: any) => {
        // Only cache successful responses (status 200-299)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Stringify the response body for storage
          const responseBody = JSON.stringify(body);
          
          // Store in Redis with expiration
          redisClient.setEx(key, expiration, responseBody)
            .catch((err) => {
              logger.error('Error caching data in Redis:', err);
            });
        }
        return originalJson.call(res, body);
      };

      next();
    } catch (error) {
      logger.error('Redis cache error:', error);
      next();
    }
  };
};

/**
 * Clears cache for a specific key or pattern
 * @param pattern - Redis key pattern to clear (supports * as wildcard)
 */
export const clearCache = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.debug(`Cleared ${keys.length} cache entries for pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Error clearing cache:', error);
    throw error;
  }
};

/**
 * Middleware to clear cache for specific routes
 * @param patterns - Array of route patterns to clear cache for
 */
export const clearRouteCache = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear cache for each pattern
      await Promise.all(
        patterns.map(pattern => clearCache(`cache:${pattern}`))
      );
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Clear entire cache (use with caution)
export const clearAllCache = async (): Promise<void> => {
  await clearCache('cache:*');
};