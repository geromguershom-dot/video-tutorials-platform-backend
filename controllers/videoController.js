const cloudinary = require('../config/cloudinary');
const Video = require('../models/Video');

// Fonction utilitaire : upload un buffer vers Cloudinary via un stream
const uploadToCloudinary = (fileBuffer, folder, resourceType = 'video') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// @route POST /api/videos
exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier vidéo fourni' });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'video-tutorials-platform/videos',
      'video'
    );

    const video = await Video.create({
      title,
      description,
      category,
      teacher: req.user._id,
      videoUrl: result.secure_url,
      cloudinaryId: result.public_id,
      thumbnailUrl: result.secure_url.replace('.mp4', '.jpg'),
      duration: result.duration || 0,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/videos
exports.getVideos = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const videos = await Video.find(filter)
      .populate('teacher', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/videos/:id
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('category', 'name');

    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }

    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/videos/:id
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Vidéo non trouvée' });
    }

    if (video.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette vidéo' });
    }

    await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
    await video.deleteOne();

    res.json({ message: 'Vidéo supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};