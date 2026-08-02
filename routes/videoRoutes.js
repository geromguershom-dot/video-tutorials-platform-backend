const express = require('express');
const router = express.Router();
const {
  uploadVideo,
  getVideos,
  getVideoById,
  deleteVideo,
} = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/', protect, authorize('teacher', 'admin'), upload.single('video'), uploadVideo);
router.delete('/:id', protect, deleteVideo);

module.exports = router;