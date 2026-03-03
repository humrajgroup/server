const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('teacher'));

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
