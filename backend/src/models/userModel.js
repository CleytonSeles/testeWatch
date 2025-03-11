const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserModel = {
  // Criar um novo usuário
  create: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    return result.rows[0];
  },

  // Buscar usuário por email
  findByEmail: async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Buscar usuário por ID
  findById: async (id) => {
    const result = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Listar todos os usuários
  findAll: async () => {
    const result = await db.query('SELECT id, username, email, created_at FROM users');
    return result.rows;
  }
};

module.exports = UserModel;
