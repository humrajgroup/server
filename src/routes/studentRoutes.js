const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorize('student'));

router.get('/classes', (req, res) => {
  res.json({
    message: 'Return enrolled classes from database in production',
    studentId: req.user.sub,
    items: []
  });
});

module.exports = router;
