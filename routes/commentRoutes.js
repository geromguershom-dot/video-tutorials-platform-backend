const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByVideo,
  deleteComment,
  createQuestion,
  getQuestionsByCategory,
  createAnswer,
  getAnswers,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createComment);
router.get('/video/:videoId', getCommentsByVideo);
router.delete('/:id', protect, deleteComment);

router.post('/question', protect, createQuestion);
router.get('/questions/:categoryId', getQuestionsByCategory);
router.post('/answer', protect, createAnswer);
router.get('/answers/:questionId', getAnswers);

module.exports = router;