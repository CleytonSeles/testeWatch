const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/playlistController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de playlist requerem autenticação
router.use(authMiddleware);

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Criar nova playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Playlist criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', PlaylistController.create);

/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Listar playlists do usuário
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de playlists do usuário
 */
router.get('/', PlaylistController.getUserPlaylists);

/**
 * @swagger
 * /playlists/{id}:
 *   get:
 *     summary: Obter detalhes de uma playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da playlist
 *     responses:
 *       200:
 *         description: Detalhes da playlist
 *       404:
 *         description: Playlist não encontrada
 */
router.get('/:id', PlaylistController.getById);

/**
 * @swagger
 * /playlists/{id}/songs:
 *   post:
 *     summary: Adicionar música à playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da playlist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Música adicionada à playlist
 *       404:
 *         description: Playlist não encontrada
 */
router.post('/:id/songs', PlaylistController.addSong);

/**
 * @swagger
 * /playlists/{id}/songs/{songId}:
 *   delete:
 *     summary: Remover música da playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da playlist
 *       - in: path
 *         name: songId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da música
 *     responses:
 *       200:
 *         description: Música removida da playlist
 *       404:
 *         description: Playlist ou música não encontrada
 */
router.delete('/:id/songs/:songId', PlaylistController.removeSong);

module.exports = router;

