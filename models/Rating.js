const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, 'La note est requise'],
      min: 1,
      max: 5,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Un utilisateur ne peut noter une même vidéo qu'une seule fois
ratingSchema.index({ video: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);