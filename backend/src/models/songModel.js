const db = require('../config/db');

const SongModel = {
  // Criar uma nova música
  create: async (title, artist, album, genre, duration) => {
    const result = await db.query(
      'INSERT INTO songs (title, artist, album, genre, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, artist, album, genre, duration]
    );
    return result.rows[0];
  },

  // Buscar música por ID
  findById: async (id) => {
    const result = await db.query('SELECT * FROM songs WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Listar todas as músicas
  findAll: async () => {
    const result = await db.query('SELECT * FROM songs');
    return result.rows;
  },

  // Buscar músicas por gênero
  findByGenre: async (genre) => {
    const result = await db.query('SELECT * FROM songs WHERE genre = $1', [genre]);
    return result.rows;
  }
};

module.exports = SongModel;
