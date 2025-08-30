const express = require('express');
const auth = require('../Infra/Middlewares/authMiddleware');

const router = express.Router();

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/ping', auth, (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

module.exports = router;