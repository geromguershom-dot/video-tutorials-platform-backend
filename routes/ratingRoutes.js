const express = require('express');
const router = express.Router();
const {
  createOrUpdateRating,
  getRatingsByVideo,
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrUpdateRating);
router.get('/video/:videoId', getRatingsByVideo);

module.exports = router;