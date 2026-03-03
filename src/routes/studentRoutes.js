const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { joinClassByCode } = require('../services/classService');

const router = express.Router();

router.use(authenticate, authorize('student'));

router.post('/classes/join-by-code', async (req, res) => {
  try {
    const joined = await joinClassByCode({ studentId: req.user.sub, payload: req.body });
    res.status(201).json({
      message: 'Joined class successfully',
      class: joined
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/classes', (req, res) => {
  res.json({
    message: 'Return enrolled classes from database in production',
    studentId: req.user.sub,
    items: []
  });
});

module.exports = router;
