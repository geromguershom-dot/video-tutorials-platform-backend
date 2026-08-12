const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Le contenu est requis'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['comment', 'question'],
      default: 'comment',
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);