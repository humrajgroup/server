const express = require('express');
const { authenticate } = require('../middleware/auth');
const { login } = require('../services/authService');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const result = await login(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

router.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
