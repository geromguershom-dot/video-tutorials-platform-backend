const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByVideo,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createComment);
router.get('/video/:videoId', getCommentsByVideo);
router.delete('/:id', protect, deleteComment);

module.exports = router;