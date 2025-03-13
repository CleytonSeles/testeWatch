/**
 * Middleware para verificar se o usuário é administrador
 */
const admin = (req, res, next) => {
  // Verificar se temos dados de usuário
  if (!req.userData && !req.user) {
    console.log('Middleware admin: Dados de usuário não encontrados');
    return res.status(401).json({ message: 'Não autenticado' });
  }

  // Tentar obter role do usuário de diferentes fontes
  const userRole = req.userData?.role || req.user?.role;
  console.log('Middleware admin: Role do usuário:', userRole);

  if (userRole !== 'admin') {
    console.log('Middleware admin: Acesso negado, role não é admin');
    return res.status(403).json({ 
      message: 'Acesso negado. Apenas administradores podem acessar este recurso.' 
    });
  }

  console.log('Middleware admin: Acesso permitido para admin');
  next();
};

module.exports = admin;
  