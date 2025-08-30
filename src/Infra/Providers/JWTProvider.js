const jwt = require('jsonwebtoken');
const blacklistRepo = require('../Repositories/RedisTokenBlacklistRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m';

class JWTProvider {
  static generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const decoded = jwt.decode(token);
    return { token, exp: decoded.exp }; // exp é epoch seconds
  }

  static async validateToken(token) {
    // já expira sozinho pelo JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // checa blacklist
    const isBlacklisted = await blacklistRepo.has(token);
    if (isBlacklisted) throw new Error('Token revogado');

    return decoded;
  }

  static async blacklist(token) {
    const decoded = jwt.decode(token);
    if (!decoded?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    await blacklistRepo.add(token, ttl);
  }
}

module.exports = JWTProvider;