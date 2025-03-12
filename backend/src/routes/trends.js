const express = require('express');
const router = express.Router();
const trendController = require('../controllers/trendController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

/**
 * @swagger
 * /trends:
 *   get:
 *     summary: Obter músicas em tendência
 *     tags: [Tendências]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de músicas a retornar
 *     responses:
 *       200:
 *         description: Lista de músicas em tendência
 */
router.get('/', trendController.getTrendingSongs);

/**
 * @swagger
 * /trends/update-catalog:
 *   post:
 *     summary: Atualizar catálogo com músicas em tendência (apenas admin)
 *     tags: [Tendências]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resultado da atualização
 *       403:
 *         description: Acesso negado
 */
router.post('/update-catalog', authMiddleware, adminMiddleware, trendController.updateCatalog);

/**
 * @swagger
 * /trends/personalized-playlist:
 *   post:
 *     summary: Gerar playlist personalizada baseada no histórico e tendências
 *     tags: [Tendências]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da playlist (opcional)
 *     responses:
 *       201:
 *         description: Playlist gerada com sucesso
 *       500:
 *         description: Erro ao gerar playlist
 */
router.post('/personalized-playlist', authMiddleware, trendController.generatePersonalizedPlaylist);

/**
 * @swagger
 * /trends/rpa-status:
 *   get:
 *     summary: Obter status do RPA (apenas admin)
 *     tags: [Tendências]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status atual do RPA
 *       403:
 *         description: Acesso negado
 */
router.get('/rpa-status', authMiddleware, adminMiddleware, trendController.getRPAStatus);

module.exports = router;
