import { redisClient } from "./redisConfig.js";

/**
 * Checks if Redis is available for caching
 * @returns {boolean} True if Redis is ready to use
 */
const isRedisAvailable = () => {
  return redisClient.isReady;
};

/**
 * Middleware to cache responses in Redis
 * @param {number} expiryTime - Time in seconds for cached data to expire
 * @param {boolean} userSpecific - Whether the cache should be specific to each user
 * @returns {Function} Express middleware function
 */
export const cacheMiddleware = (expiryTime = 3600, userSpecific = false) => {
  return async (req, res, next) => {
    try {
      if (!isRedisAvailable()) {
        console.log("Redis not ready, skipping cache");
        return next();
      }

      let cacheKey = `api:${req.originalUrl}`;

      if (userSpecific && req.user?.id) {
        cacheKey = `api:user:${req.user.id}:${req.originalUrl}`;
      }

      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        const data = JSON.parse(cachedData);

        if (data.headers) {
          Object.keys(data.headers).forEach((key) => {
            res.set(key, data.headers[key]);
          });
        }

        console.log(`Cache hit for ${cacheKey}`);
        return res.status(200).json(data.body);
      }

      console.log(`Cache miss for ${cacheKey}`);

      const originalSend = res.json;

      res.json = function (body) {
        if (res.statusCode === 200 && isRedisAvailable()) {
          const dataToCache = {
            body,
            headers: {},
          };

          const headersToCache = ["X-total-count"];
          headersToCache.forEach((header) => {
            if (res.get(header)) {
              dataToCache.headers[header] = res.get(header);
            }
          });

          redisClient
            .setEx(cacheKey, expiryTime, JSON.stringify(dataToCache))
            .catch((err) => console.error("Redis cache error:", err));

          const parts = req.originalUrl.split("/");

          const collectionTag =
            userSpecific && req.user?.id
              ? `user:${req.user.id}:${collection}`
              : collection;

          if (collection) {
            redisClient
              .sAdd(`collection:${collectionTag}`, cacheKey)
              .catch((err) => console.error("Redis tagging error:", err));
          }
        }

        return originalSend.call(this, body);
      };

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
    }
  };
};

/**
 * Clear all cache entries for a specific collection
 * @param {string} collection - Collection name (e.g., "products", "categories", "user:123:cart")
 */
export const clearCache = async (collection) => {
  try {
    if (!isRedisAvailable()) {
      console.log("Redis not ready, skipping cache clear");
      return;
    }

    const keys = await redisClient.sMembers(`collection:${collection}`);

    if (keys.length > 0) {
      await redisClient.del(keys);
      await redisClient.del(`collection:${collection}`);
      console.log(`Cleared ${keys.length} cache entries for ${collection}`);
    }
  } catch (err) {
    console.error("Error clearing cache:", err);
  }
};
