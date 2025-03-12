const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging para debugar
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Importar rotas
const userRoutes = require('../routes/users');
const songRoutes = require('../routes/songs');
const playlistRoutes = require('../routes/playlists');
const trendRoutes = require('../routes/trends');

// Definir rotas
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/trends', trendRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Music Streaming API',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Handler para erros
app.use((err, req, res, next) => {
  console.error('Erro na API:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Exportar o handler para AWS Lambda
module.exports.handler = serverless(app);
