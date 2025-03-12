const { Pool } = require('pg');
const fs = require('fs');

// Cria um pool de conexão otimizado para Lambda
const createPool = () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
    // Configurações otimizadas para Lambda
    max: 1, // Reduz número de conexões simultâneas
    idleTimeoutMillis: 120000, // 2 minutos
    connectionTimeoutMillis: 10000,
  });

  // Logging de erros
  pool.on('error', (err) => {
    console.error('Erro inesperado no pool PostgreSQL:', err);
  });

  return pool;
};

// Armazenar o pool em escopo global para reutilização entre invocações do Lambda
let pool;

const getPool = () => {
  if (!pool) {
    pool = createPool();
    console.log('Novo pool de conexão PostgreSQL criado');
  }
  return pool;
};

const query = async (text, params) => {
  const client = await getPool().connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

module.exports = {
  query,
  getPool
};
