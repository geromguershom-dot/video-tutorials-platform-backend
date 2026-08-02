const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 Mo max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('application/')) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté'), false);
    }
  },
});

module.exports = upload;