const db = require('../config/db');

const PlaylistModel = {
  // Criar uma nova playlist
  create: async (name, userId, isPublic = false) => {
    const result = await db.query(
      'INSERT INTO playlists (name, user_id, is_public) VALUES ($1, $2, $3) RETURNING *',
      [name, userId, isPublic]
    );
    return result.rows[0];
  },

  // Buscar playlist por ID
  findById: async (id) => {
    const result = await db.query('SELECT * FROM playlists WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Listar playlists de um usuário
  findByUserId: async (userId) => {
    const result = await db.query('SELECT * FROM playlists WHERE user_id = $1', [userId]);
    return result.rows;
  },

  // Listar músicas de uma playlist
  getSongs: async (playlistId) => {
    const result = await db.query(`
      SELECT s.* 
      FROM songs s
      JOIN playlist_songs ps ON s.id = ps.song_id
      WHERE ps.playlist_id = $1
    `, [playlistId]);
    return result.rows;
  },

  // Adicionar música à playlist
  addSong: async (playlistId, songId) => {
    const result = await db.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *',
      [playlistId, songId]
    );
    return result.rows[0];
  },

  // Remover música da playlist
  removeSong: async (playlistId, songId) => {
    const result = await db.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING *',
      [playlistId, songId]
    );
    return result.rows[0];
  }
};

module.exports = PlaylistModel;
