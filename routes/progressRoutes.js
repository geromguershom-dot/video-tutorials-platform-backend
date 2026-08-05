const express = require('express');
const router = express.Router();
const { updateProgress, getMyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.put('/', protect, updateProgress);
router.get('/', protect, getMyProgress);

module.exports = router;