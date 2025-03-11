const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/playlistController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de playlist requerem autenticação
router.use(authMiddleware);

router.post('/', PlaylistController.create);
router.get('/', PlaylistController.getUserPlaylists);
router.get('/:id', PlaylistController.getById);
router.post('/:id/songs', PlaylistController.addSong);
router.delete('/:id/songs/:songId', PlaylistController.removeSong);

module.exports = router;
