import { redisClient } from "./redisConfig.js";

/**
 * Middleware to cache responses in Redis
 * @param {number} expiryTime - Time in seconds for cached data to expire
 * @param {boolean} userSpecific - Whether the cache should be specific to each user
 * @returns {Function} Express middleware function
 */
export const cacheMiddleware = (expiryTime = 3600, userSpecific = false) => {
  return async (req, res, next) => {
    try {
      if (!redisClient.isReady) {
        console.log("Redis not ready, skipping cache");
        return next();
      }

      // Create a cache key based on the request URL, optionally including user ID
      let cacheKey = `api:${req.originalUrl}`;

      // If this is user-specific data, include the user ID in the cache key
      if (userSpecific && req.user?.id) {
        cacheKey = `api:user:${req.user.id}:${req.originalUrl}`;
      }

      // Check if data exists in cache
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        // If cached data exists, parse it and send as response
        const data = JSON.parse(cachedData);

        // If there were headers cached, set them in the response
        if (data.headers) {
          Object.keys(data.headers).forEach((key) => {
            res.set(key, data.headers[key]);
          });
        }

        console.log(`Cache hit for ${cacheKey}`);
        return res.status(200).json(data.body);
      }

      // If no cached data, proceed to the next middleware
      console.log(`Cache miss for ${cacheKey}`);

      // Capture the original res.json method
      const originalSend = res.json;

      // Override res.json method to cache the response
      res.json = function (body) {
        if (res.statusCode === 200) {
          const dataToCache = {
            body,
            headers: {},
          };

          // Store headers that should be cached (like pagination headers)
          const headersToCache = ["X-total-count"];
          headersToCache.forEach((header) => {
            if (res.get(header)) {
              dataToCache.headers[header] = res.get(header);
            }
          });

          redisClient
            .setEx(cacheKey, expiryTime, JSON.stringify(dataToCache))
            .catch((err) => console.error("Redis cache error:", err));

          // Tag this key with its collection for easier invalidation
          const parts = req.originalUrl.split("/");
          const collection = parts[1]; // E.g., "products", "categories"

          // If this is user-specific data, include the user ID in the collection tag
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

        // Call the original res.json method with the body
        return originalSend.call(this, body);
      };

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next(); // Continue without caching if there's an error
    }
  };
};

/**
 * Clear all cache entries for a specific collection
 * @param {string} collection - Collection name (e.g., "products", "categories", "user:123:cart")
 */
export const clearCache = async (collection) => {
  try {
    if (!redisClient.isReady) {
      console.log("Redis not ready, skipping cache clear");
      return;
    }

    // Get all cache keys for this collection
    const keys = await redisClient.sMembers(`collection:${collection}`);

    if (keys.length > 0) {
      // Delete all cache entries
      await redisClient.del(keys);
      // Delete the set itself
      await redisClient.del(`collection:${collection}`);
      console.log(`Cleared ${keys.length} cache entries for ${collection}`);
    }
  } catch (err) {
    console.error("Error clearing cache:", err);
  }
};
