const db = require('./db');

async function setupDatabase() {
  try {
    // Criação da tabela de usuários
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criação da tabela de músicas
    await db.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        artist VARCHAR(200) NOT NULL,
        album VARCHAR(200),
        genre VARCHAR(100),
        duration INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criação da tabela de playlists
    await db.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Criação da tabela de músicas nas playlists
    await db.query(`
      CREATE TABLE IF NOT EXISTS playlist_songs (
        id SERIAL PRIMARY KEY,
        playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
        song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(playlist_id, song_id)
      )
    `);

    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setupDatabase();
