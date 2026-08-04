const Playlist = require('../models/Playlist');

// @route POST /api/playlists
exports.createPlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;

    const playlist = await Playlist.create({
      title,
      description,
      owner: req.user._id,
      videos: [],
    });

    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/playlists (playlists de l'utilisateur connecté)
exports.getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate(
      'videos',
      'title thumbnailUrl duration'
    );
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/playlists/:id/add-video
exports.addVideoToPlaylist = async (req, res) => {
  try {
    const { videoId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trouvée' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ message: 'Vidéo déjà dans la playlist' });
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/playlists/:id
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist non trouvée' });
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await playlist.deleteOne();
    res.json({ message: 'Playlist supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};