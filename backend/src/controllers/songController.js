const SongModel = require('../models/songModel');

const SongController = {
  // Criar nova música
  create: async (req, res) => {
    try {
      const { title, artist, album, genre, duration } = req.body;
      
      // Validação básica
      if (!title || !artist || !duration) {
        return res.status(400).json({ message: 'Título, artista e duração são obrigatórios' });
      }
      
      const song = await SongModel.create(title, artist, album, genre, duration);
      
      res.status(201).json({
        message: 'Música adicionada com sucesso',
        song
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Listar todas as músicas
  getAll: async (req, res) => {
    try {
      const songs = await SongModel.findAll();
      res.status(200).json({ songs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Obter detalhes de uma música
  getById: async (req, res) => {
    try {
      const songId = req.params.id;
      const song = await SongModel.findById(songId);
      
      if (!song) {
        return res.status(404).json({ message: 'Música não encontrada' });
      }
      
      res.status(200).json({ song });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Buscar músicas por gênero
  getByGenre: async (req, res) => {
    try {
      const genre = req.params.genre;
      const songs = await SongModel.findByGenre(genre);
      
      res.status(200).json({ songs });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = SongController;
