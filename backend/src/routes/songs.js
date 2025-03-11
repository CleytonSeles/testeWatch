const express = require('express');
const router = express.Router();
const SongController = require('../controllers/songController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Listar todas as músicas
 *     tags: [Músicas]
 *     responses:
 *       200:
 *         description: Lista de músicas
 */
router.get('/', SongController.getAll);

/**
 * @swagger
 * /songs/{id}:
 *   get:
 *     summary: Obter detalhes de uma música
 *     tags: [Músicas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da música
 *     responses:
 *       200:
 *         description: Detalhes da música
 *       404:
 *         description: Música não encontrada
 */
router.get('/:id', SongController.getById);

/**
 * @swagger
 * /songs/genre/{genre}:
 *   get:
 *     summary: Buscar músicas por gênero
 *     tags: [Músicas]
 *     parameters:
 *       - in: path
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do gênero
 *     responses:
 *       200:
 *         description: Lista de músicas do gênero
 */
router.get('/genre/:genre', SongController.getByGenre);

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Adicionar nova música
 *     tags: [Músicas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - artist
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               album:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Música adicionada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, SongController.create);

module.exports = router;

