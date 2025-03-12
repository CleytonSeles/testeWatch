const musicScraperService = require('../services/musicScraperService');
const db = require('../config/database');

// Handler que será executado pelo evento agendado
module.exports.updateTrends = async (event, context) => {
  // Definir timeout para evitar que a função fique "presa"
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    console.log('Iniciando atualização de tendências musicais...');
    
    // Obter tendências musicais
    const trends = await musicScraperService.getTrendingSongs(50);
    console.log(`Obtidas ${trends.length} músicas em tendência`);
    
    // Armazenar no banco de dados
    let addedCount = 0;
    for (const song of trends) {
      try {
        // Verificar se a música já existe
        const existingCheck = await db.query(
          'SELECT id FROM songs WHERE LOWER(title) = LOWER($1) AND LOWER(artist) = LOWER($2)',
          [song.title, song.artist]
        );
        
        if (existingCheck.rows.length === 0) {
          // Adicionar ao catálogo
          await db.query(
            'INSERT INTO songs (title, artist, album, genre, duration) VALUES ($1, $2, $3, $4, $5)',
            [song.title, song.artist, song.album || 'Unknown', song.genre || 'Pop', song.duration || 240]
          );
          addedCount++;
        }
      } catch (songError) {
        console.error(`Erro ao processar música ${song.title}:`, songError);
      }
    }
    
    // Atualizar timestamp da última atualização
    await db.query(
      "INSERT INTO system_metadata (key, value_text, updated_at) VALUES ('last_trends_update', $1, NOW()) " +
      "ON CONFLICT (key) DO UPDATE SET value_text = $1, updated_at = NOW()",
      [new Date().toISOString()]
    );
    
    console.log(`Atualização concluída. Adicionadas ${addedCount} novas músicas.`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        totalProcessed: trends.length,
        newSongsAdded: addedCount
      })
    };
    
  } catch (error) {
    console.error('Erro ao atualizar tendências:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
