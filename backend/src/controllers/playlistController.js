const PlaylistModel = require('../models/playlistModel');

const PlaylistController = {
  // Criar nova playlist
  create: async (req, res) => {
    try {
      const { name, isPublic } = req.body;
      const userId = req.userData.userId;
      
      // Validação básica
      if (!name) {
        return res.status(400).json({ message: 'Nome da playlist é obrigatório' });
      }
      
      const playlist = await PlaylistModel.create(name, userId, isPublic || false);
      
      res.status(201).json({
        message: 'Playlist criada com sucesso',
        playlist
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Obter playlists do usuário
  getUserPlaylists: async (req, res) => {
    try {
      const userId = req.userData.userId;
      const playlists = await PlaylistModel.findByUserId(userId);
      
      res.status(200).json({ playlists });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Obter detalhes da playlist
  getById: async (req, res) => {
    try {
      const playlistId = req.params.id;
      const playlist = await PlaylistModel.findById(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist não encontrada' });
      }
      
      // Verificar se é o dono da playlist ou se ela é pública
      const userId = req.userData.userId;
      if (playlist.user_id !== userId && !playlist.is_public) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar esta playlist' });
      }
      
      // Buscar músicas da playlist
      const songs = await PlaylistModel.getSongs(playlistId);
      
      res.status(200).json({
        playlist,
        songs
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  // Adicionar música à playlist
  addSong: async (req, res) => {
    try {
      const playlistId = req.params.id;
      const { songId } = req.body;
      const userId = req.userData.userId;
      
      // Validação básica
      if (!songId) {
        return res.status(400).json({ message: 'ID da música é obrigatório' });
      }
      
      // Verificar se a playlist existe e pertence ao usuário
      const playlist = await PlaylistModel.findById(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist não encontrada' });
      }
      
      if (playlist.user_id !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para modificar esta playlist' });
      }
      
      // Adicionar música à playlist
      const result = await PlaylistModel.addSong(playlistId, songId);
      
      res.status(201).json({
        message: 'Música adicionada à playlist com sucesso',
        result
      });
    } catch (error) {
      // Verificar se é um erro de duplicação (música já está na playlist)
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Esta música já está na playlist' });
      }
      res.status(500).json({ message: error.message });
    }
  },
  
  // Remover música da playlist
  removeSong: async (req, res) => {
    try {
      const playlistId = req.params.id;
      const songId = req.params.songId;
      const userId = req.userData.userId;
      
      // Verificar se a playlist existe e pertence ao usuário
      const playlist = await PlaylistModel.findById(playlistId);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist não encontrada' });
      }
      
      if (playlist.user_id !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para modificar esta playlist' });
      }
      
      // Remover música da playlist
      const result = await PlaylistModel.removeSong(playlistId, songId);
      
      if (!result) {
        return res.status(404).json({ message: 'Música não encontrada na playlist' });
      }
      
      res.status(200).json({
        message: 'Música removida da playlist com sucesso'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = PlaylistController;
