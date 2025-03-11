const express = require('express');
const router = express.Router();
const SongController = require('../controllers/songController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas
router.get('/', SongController.getAll);
router.get('/:id', SongController.getById);
router.get('/genre/:genre', SongController.getByGenre);

// Rotas protegidas
router.post('/', authMiddleware, SongController.create);

module.exports = router;
