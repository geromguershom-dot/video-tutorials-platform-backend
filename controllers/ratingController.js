const Rating = require('../models/Rating');
const Video = require('../models/Video');

// Recalcule la moyenne des notes d'une vidéo
const updateAverageRating = async (videoId) => {
  const ratings = await Rating.find({ video: videoId });
  const average =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
      : 0;

  await Video.findByIdAndUpdate(videoId, { averageRating: average.toFixed(1) });
};

// @route POST /api/ratings
exports.createOrUpdateRating = async (req, res) => {
  try {
    const { value, video } = req.body;

    const rating = await Rating.findOneAndUpdate(
      { video, student: req.user._id },
      { value },
      { new: true, upsert: true, runValidators: true }
    );

    await updateAverageRating(video);

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/ratings/video/:videoId
exports.getRatingsByVideo = async (req, res) => {
  try {
    const ratings = await Rating.find({ video: req.params.videoId }).populate(
      'student',
      'name'
    );
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};