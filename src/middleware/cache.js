const client = require('../config/redisClient');
const CACHE_TTL = 60 * 10;
const APP_ENV = process.env.APP_ENV || 'dev';

const getNamespacedKey = (key) => `${APP_ENV}:${key}`;

module.exports = {
  async get(key) {
    if (!client.isOpen) await client.connect();
    const data = await client.get(getNamespacedKey(key));
    return data ? JSON.parse(data) : null;
  },

  async set(key, value, ttl = CACHE_TTL) {
    if (!client.isOpen) await client.connect();
    await client.setEx(getNamespacedKey(key), ttl, JSON.stringify(value));
  },

  async del(key) {
    if (!client.isOpen) await client.connect();
    await client.del(getNamespacedKey(key));
  },

  async delByPrefix(prefix) {
    if (!client.isOpen) await client.connect();
    const keys = await client.keys(getNamespacedKey(`${prefix}*`));
    if (keys.length) {
      await client.del(keys);
    }
  },

  // 🚀 Flush all keys under current environment namespace
  async flushEnvCache() {
    if (!client.isOpen) await client.connect();
    const keys = await client.keys(`${APP_ENV}:*`);
    if (keys.length) {
      await client.del(keys);
      console.log(`Flushed ${keys.length} cache keys for env: ${APP_ENV}`);
    } else {
      console.log(`No cache keys found for env: ${APP_ENV}`);
    }
  }
};