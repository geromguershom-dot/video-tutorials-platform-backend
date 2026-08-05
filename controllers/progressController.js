const Progress = require('../models/Progress');
const Video = require('../models/Video');

// @route PUT /api/progress
exports.updateProgress = async (req, res) => {
  try {
    const { video, watchedSeconds } = req.body;

    const videoDoc = await Video.findById(video);
    if (!videoDoc) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }

    const completed = watchedSeconds >= videoDoc.duration * 0.9;

    const progress = await Progress.findOneAndUpdate(
      { student: req.user._id, video },
      { watchedSeconds, completed },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/progress (toute la progression de l'étudiant connecté)
exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.user._id }).populate(
      'video',
      'title thumbnailUrl duration'
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};