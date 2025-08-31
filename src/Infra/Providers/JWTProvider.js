const jwt = require('jsonwebtoken');
const blacklistRepo = require('../Repositories/RedisTokenBlacklistRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '15m';

class JWTProvider {
  static generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const decoded = jwt.decode(token);
    return { token, exp: decoded.exp }; // exp em epoch seconds
  }

  // >>> AQUI a validação fica completa (JWT + Redis blacklist)
  static async validateToken(token) {
    // 1) Checar se o token está na blacklist (revogado)
    const isBlacklisted = await blacklistRepo.has(token);
    if (isBlacklisted) {
      const err = new Error('Token revogado');
      err.name = 'TokenRevoked';
      throw err;
    }

    // 2) Validar assinatura e expiração do JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  }

  // Coloca o token na blacklist com o TTL = tempo restante até o expirar natural do JWT
  static async blacklist(token) {
    const decoded = jwt.decode(token);
    if (!decoded?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    let ttl = decoded.exp - now;
    if (ttl <= 0) ttl = 1; // segurança: evita setar sem TTL

    await blacklistRepo.add(token, ttl);
  }
}

module.exports = JWTProvider;