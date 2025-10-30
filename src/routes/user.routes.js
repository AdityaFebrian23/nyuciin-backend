const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
// placeholder user controller routes
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
