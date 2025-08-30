const bcrypt = require('bcryptjs');
const User = require('../Sequencialize/models/UserModel');
const JWTProvider = require('../Infra/Providers/JWTProvider');

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: 'name, email e password são obrigatórios' });

      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(409).json({ message: 'Email já cadastrado' });

      const password_hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password_hash });

      return res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (err) {
      return res.status(500).json({ message: 'Erro no registro' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) return res.status(401).json({ message: 'Senha inválida' });

      const { token, exp } = JWTProvider.generateToken({ id: user.id, email: user.email });
      return res.json({ token, expires_at: exp, user: { id: user.id, name: user.name, email: user.email } });
    } catch {
      return res.status(500).json({ message: 'Erro interno no login' });
    }
  }

  static async refresh(req, res) {
    try {
      const oldToken = req.headers['authorization']?.split(' ')[1];
      if (!oldToken) return res.status(401).json({ message: 'Token não informado' });

      const payload = await JWTProvider.validateToken(oldToken);
      await JWTProvider.blacklist(oldToken);

      const { token, exp } = JWTProvider.generateToken({ id: payload.id, email: payload.email });
      return res.json({ token, expires_at: exp });
    } catch {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  }

  static async logout(req, res) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token não informado' });

      await JWTProvider.blacklist(token);
      return res.json({ message: 'Logout realizado com sucesso' });
    } catch {
      return res.status(500).json({ message: 'Erro no logout' });
    }
  }
}

module.exports = AuthController;