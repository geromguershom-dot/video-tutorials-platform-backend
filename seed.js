const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const categories = [
  { name: 'Mathematiques', description: 'Algebre, geometrie, analyse' },
  { name: 'SVT', description: 'Sciences de la Vie et de la Terre' },
  { name: 'PCT', description: 'Physique-Chimie-Technologie' },
  { name: 'Francais', description: 'Litterature, grammaire, expression ecrite' },
  { name: 'Anglais', description: 'Langue et communication anglaise' },
  { name: 'Histoire', description: "Histoire du Cameroun et du monde" },
  { name: 'Geographie', description: 'Geographie physique et humaine' },
  { name: 'ECM', description: 'Education Civique et Morale' },
  { name: 'Informatique', description: 'Programmation et outils numeriques' },
  { name: 'Philosophie', description: 'Reflexion et pensee critique' },
  { name: 'Economie', description: "Notions d'economie generale" },
  { name: 'Arts Plastiques', description: 'Dessin, peinture, creativite' },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecte, insertion des categories...');

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log('Ajoutee: ' + cat.name);
      } else {
        console.log('Deja existante: ' + cat.name);
      }
    }

    console.log('Termine !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur: ' + error.message);
    process.exit(1);
  }
};

run();