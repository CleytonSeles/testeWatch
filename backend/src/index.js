const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas básicas
app.use('/api/users', require('./routes/users'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));

// Rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Music Streaming API is running' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
