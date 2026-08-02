const Comment = require('../models/Comment');

// @route POST /api/comments
exports.createComment = async (req, res) => {
  try {
    const { content, video } = req.body;

    const comment = await Comment.create({
      content,
      video,
      author: req.user._id,
    });

    const populatedComment = await comment.populate('author', 'name role avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/comments/video/:videoId
exports.getCommentsByVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('author', 'name role avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
    }

    await comment.deleteOne();
    res.json({ message: 'Commentaire supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};