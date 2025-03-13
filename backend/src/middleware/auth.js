const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    // Verificar se o header Authorization está presente
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: 'Authorization header não fornecido'
      });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Token não fornecido'
      });
    }

    console.log('Verificando token:', token.substring(0, 20) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    req.userData = decoded;
    
    // Transferindo dados do token para req.user para compatibilidade
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };
    
    console.log('Autenticação bem-sucedida para usuário:', req.user);
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error.message);
    return res.status(401).json({
      message: 'Não autenticado',
      error: error.message
    });
  }
};
