const JWTProvider = require('../Providers/JWTProvider');

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || '';
    const [, token] = auth.split(' ');
    if (!token) return res.status(401).json({ message: 'Token não informado' });

    const payload = await JWTProvider.validateToken(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};