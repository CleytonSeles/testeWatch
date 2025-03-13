const musicScraperService = require('../services/musicScraperService');
const musicRpaService = require('../services/musicRpaService');

class TrendController {
  async getTrendingSongs(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const trendingSongs = await musicScraperService.getTrendingSongs(limit);

      const lastUpdated = await musicScraperService.getLastUpdated();

      res.status(200).json({
        success: true,
        lastUpdated,
        trendingSongs
      });
    } catch (error) {
      console.error('Erro ao obter músicas em tendência:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao obter músicas em tendência',
        error: error.message
      });
    }
  }

  async updateCatalog(req, res) {
    try {
      console.log('updateCatalog - dados do usuário:', req.userData);
      
      // Verificar dados de usuário
      if (!req.userData) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      // Verificar se o usuário é admin
      if (req.userData.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem atualizar o catálogo'
        });
      }

      const result = await musicRpaService.updateCatalogFromTrends();
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao atualizar catálogo:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar catálogo',
        error: error.message
      });
    }
  }

  async generatePersonalizedPlaylist(req, res) {
    try {
      console.log('generatePersonalizedPlaylist - dados do usuário:', req.userData);
      
      const userId = req.userData?.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado ou ID inválido'
        });
      }
      
      const { name } = req.body;

      const result = await musicRpaService.generatePersonalizedPlaylist(userId, name);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erro ao gerar playlist personalizada:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao gerar playlist personalizada',
        error: error.message
      });
    }
  }

  async getRPAStatus(req, res) {
    try {
      console.log('getRPAStatus - dados do usuário:', req.userData);
      
      // Verificar dados de usuário
      if (!req.userData) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      // Verificar se o usuário é admin
      if (req.userData.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem ver o status do RPA'
        });
      }

      const status = await musicRpaService.getRPAStatus();
      res.status(200).json({
        success: true,
        status
      });
    } catch (error) {
      console.error('Erro ao obter status do RPA:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao obter status do RPA',
        error: error.message
      });
    }
  }
}

module.exports = new TrendController();
