const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  addVideoToPlaylist,
  deletePlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPlaylist);
router.get('/', protect, getMyPlaylists);
router.put('/:id/add-video', protect, addVideoToPlaylist);
router.delete('/:id', protect, deletePlaylist);

module.exports = router;