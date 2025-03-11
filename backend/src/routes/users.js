const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rotas protegidas
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;
