const db = require('./db');
const bcrypt = require('bcryptjs'); 

async function seedDatabase() {
  try {
    // Criar usuário demo
    const hashedPassword = await bcrypt.hash('password123', 10);
    await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
      ['demo_user', 'demo@example.com', hashedPassword]
    );

    // Criar algumas músicas
    const songs = [
      ['Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 'Rock', 354],
      ['Billie Jean', 'Michael Jackson', 'Thriller', 'Pop', 294],
      ['Hotel California', 'Eagles', 'Hotel California', 'Rock', 390],
      ['Shape of You', 'Ed Sheeran', '÷', 'Pop', 233],
      ['Despacito', 'Luis Fonsi & Daddy Yankee', 'Vida', 'Reggaeton', 229],
      ['Stairway to Heaven', 'Led Zeppelin', 'Led Zeppelin IV', 'Rock', 482],
      ['Sweet Child O Mine', 'Guns N Roses', 'Appetite for Destruction', 'Rock', 355],
      ['Imagine', 'John Lennon', 'Imagine', 'Pop', 183],
      ['Thriller', 'Michael Jackson', 'Thriller', 'Pop', 357],
      ['Smells Like Teen Spirit', 'Nirvana', 'Nevermind', 'Grunge', 301]
    ];

    for (const song of songs) {
      await db.query(
        'INSERT INTO songs (title, artist, album, genre, duration) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        song
      );
    }

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

seedDatabase();

