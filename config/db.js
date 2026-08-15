const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('La variable MONGO_URI est absente. Ajoutez-la dans les variables d’environnement Render.');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    throw new Error(`Connexion MongoDB impossible: ${error.message}`);
  }
};

module.exports = connectDB;
