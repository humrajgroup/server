const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { createClass } = require('../services/classService');

const router = express.Router();

router.use(authenticate, authorize('teacher'));

router.post('/classes', async (req, res) => {
  try {
    const classItem = await createClass({ teacherId: req.user.sub, payload: req.body });
    res.status(201).json({
      message: 'Class created',
      class: classItem
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/classes/:classId/sessions/start', (req, res) => {
  const { classId } = req.params;
  res.status(201).json({
    message: 'Session started',
    classId,
    teacherId: req.user.sub,
    startedAt: new Date().toISOString()
  });
});

module.exports = router;
