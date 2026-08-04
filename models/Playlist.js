const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Playlist', playlistSchema);