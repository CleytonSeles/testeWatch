/**
 * Middleware para verificar se o usuário é administrador
 */
const admin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
    }
    
    next();
  };
  
  module.exports = admin;
  