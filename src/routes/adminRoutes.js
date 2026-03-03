const express = require('express');
const config = require('../config');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/features', (req, res) => {
  res.json({ features: config.features });
});

router.put('/features', (req, res) => {
  const { video, chat, whiteboard } = req.body;
  if (typeof video === 'boolean') config.features.video = video;
  if (typeof chat === 'boolean') config.features.chat = chat;
  if (typeof whiteboard === 'boolean') config.features.whiteboard = whiteboard;

  res.json({ features: config.features, note: 'Runtime only; persist in env/config store for production' });
});

module.exports = router;
