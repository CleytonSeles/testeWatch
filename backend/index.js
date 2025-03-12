const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const swaggerConfig = require('./src/config/swagger');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('public'));

// Middleware para depuração - ajuda a identificar problemas com tokens
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log('Authorization header:', req.headers.authorization);
  }
  next();
});

// Documentação Swagger
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

// Rotas básicas
app.use('/api/users', require('./src/routes/users'));
app.use('/api/songs', require('./src/routes/songs'));
app.use('/api/playlists', require('./src/routes/playlists'));
app.use('/api/trends', require('./src/routes/trends')); // Nova rota para tendências musicais

// Rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'Music Streaming API is running',
    swaggerDoc: '/api-docs',
    trends: '/api/trends'
  });
});

// Inicializar serviços de scraping e RPA
const musicScraperService = require('./src/services/musicScraperService');
const musicRpaService = require('./src/services/musicRpaService');

// Inicializar serviços se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
  musicScraperService.initialize().catch(err => {
    console.error('Erro ao inicializar scraper musical:', err);
  });
  
  musicRpaService.initialize().catch(err => {
    console.error('Erro ao inicializar RPA musical:', err);
  });
  
  // Adicionar graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM recebido, encerrando serviços...');
    await musicRpaService.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT recebido, encerrando serviços...');
    await musicRpaService.shutdown();
    process.exit(0);
  });
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Music trends available at http://localhost:${PORT}/api/trends`);
});
