const redis = require('../Redis/RedisClient');
const prefix = 'bl:'; // chave prefixada da blacklist

module.exports = {
  async add(token, ttlSeconds) {
    if (ttlSeconds <= 0) ttlSeconds = 1;
    await redis.set(prefix + token, '1', { EX: ttlSeconds });
  },

  async has(token) {
    const value = await redis.get(prefix + token);
    return !!value;
  }
};