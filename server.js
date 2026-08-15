const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
const defaultFrontendUrl = 'https://video-tutorials-platform-frontend-r8oodcxjp.vercel.app';
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || defaultFrontendUrl)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }
      return callback(new Error('Origine non autorisée par la politique CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'DevLearn API', status: 'online', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'devlearn-backend', timestamp: new Date().toISOString() });
});

app.get('/test-rapide', (req, res) => {
  res.json({ message: 'Ça fonctionne', status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/progress', progressRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  const status = error.status || 500;
  res.status(status).json({ message: status === 500 ? 'Erreur interne du serveur' : error.message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Origines CORS autorisées: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((error) => {
    console.error('Impossible de démarrer l’application:', error.message);
    process.exit(1);
  });

module.exports = app;
