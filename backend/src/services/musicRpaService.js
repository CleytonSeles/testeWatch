const { Pool } = require('pg');
const musicScraperService = require('./musicScraperService');

class MusicRpaService {
  constructor() {
    this.db = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    this.rpaStatus = {
      running: false,
      lastRun: null,
      songsAdded: 0,
      errors: []
    };
    
    console.log('MusicRpaService inicializado');
  }

  async initialize() {
    console.log('Inicializando serviço de RPA musical em modo serverless...');
    // Modo serverless não requer inicialização do Puppeteer
    return true;
  }

  async updateCatalogFromTrends() {
    if (this.rpaStatus.running) {
      return { success: false, message: 'RPA já está em execução' };
    }

    this.rpaStatus = {
      running: true,
      lastRun: new Date(),
      songsAdded: 0,
      errors: []
    };

    try {
      console.log('Iniciando atualização automática do catálogo...');

      // Obter músicas em tendência
      const trendingSongs = await musicScraperService.getTrendingSongs(20);
      console.log(`Obtidas ${trendingSongs.length} músicas em tendência para processar`);

      // Para cada música, enriquecer e adicionar ao catálogo
      for (const song of trendingSongs) {
        try {
          // Verificar se a música já existe no banco de dados
          const existingCheck = await this.db.query(
            'SELECT id FROM songs WHERE LOWER(title) = LOWER($1) AND LOWER(artist) = LOWER($2)',
            [song.title, song.artist]
          );

          if (existingCheck.rows.length > 0) {
            console.log(`Música "${song.title}" de ${song.artist} já existe no catálogo.`);
            continue;
          }

          // Dados enriquecidos da música (simplificado)
          const enriched = {
            title: song.title,
            artist: song.artist,
            album: song.album || 'Desconhecido',
            genre: song.genre || 'Pop',
            duration: song.duration || 240
          };

          // Inserir a nova música no banco de dados
          const result = await this.db.query(
            'INSERT INTO songs (title, artist, album, genre, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [enriched.title, enriched.artist, enriched.album, enriched.genre, enriched.duration]
          );

          const songId = result.rows[0].id;
          console.log(`Música "${enriched.title}" de ${enriched.artist} adicionada ao catálogo com ID ${songId}`);

          // Adicionar à playlist "Tendências" do sistema
          await this.addToTrendingPlaylist(songId);

          this.rpaStatus.songsAdded++;
        } catch (err) {
          console.error(`Erro ao processar música "${song.title}":`, err);
          this.rpaStatus.errors.push({
            song: `${song.title} - ${song.artist}`,
            error: err.message
          });
        }
      }

      console.log(`Atualização do catálogo concluída. Adicionadas ${this.rpaStatus.songsAdded} músicas.`);
      this.rpaStatus.running = false;
      return {
        success: true,
        songsAdded: this.rpaStatus.songsAdded,
        errors: this.rpaStatus.errors
      };
    } catch (error) {
      console.error('Erro geral na atualização do catálogo:', error);
      this.rpaStatus.running = false;
      this.rpaStatus.errors.push({
        general: true,
        error: error.message
      });
      return { success: false, error: error.message };
    }
  }

  async addToTrendingPlaylist(songId) {
    try {
      // Verificar se a playlist de tendências existe
      const playlistCheck = await this.db.query(
        'SELECT id FROM playlists WHERE name = $1 AND user_id = $2',
        ['Tendências Musicais', 1] // Assumindo que o usuário ID 1 é o admin/sistema
      );

      let playlistId;

      if (playlistCheck.rows.length === 0) {
        // Criar a playlist se não existir
        const newPlaylist = await this.db.query(
          'INSERT INTO playlists (name, is_public, user_id) VALUES ($1, $2, $3) RETURNING id',
          ['Tendências Musicais', true, 1]
        );
        playlistId = newPlaylist.rows[0].id;
      } else {
        playlistId = playlistCheck.rows[0].id;
      }

      // Verificar se a música já está na playlist
      const songCheck = await this.db.query(
        'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
        [playlistId, songId]
      );

      if (songCheck.rows.length === 0) {
        // Adicionar música à playlist
        await this.db.query(
          'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
          [playlistId, songId]
        );
        console.log(`Música ID ${songId} adicionada à playlist de tendências`);
      }

      return true;
    } catch (error) {
      console.error(`Erro ao adicionar música ${songId} à playlist de tendências:`, error);
      return false;
    }
  }

  async generatePersonalizedPlaylist(userId, name = null) {
    try {
      console.log(`Iniciando geração de playlist para usuário ${userId}`);
      
      // Validação do userId
      if (!userId) {
        console.error('ID do usuário não fornecido');
        return {
          success: false,
          error: 'ID do usuário é obrigatório'
        };
      }
      
      if (!name) {
        name = `Descobertas para Você - ${new Date().toLocaleDateString()}`;
      }
  
      console.log(`Gerando playlist personalizada: "${name}"`);
  
      // Mock de gêneros favoritos para evitar erro se o usuário não tiver histórico
      let favoriteGenres = ['Pop', 'Rock', 'Hip-Hop'];
      
      try {
        // 1. Obter o histórico musical do usuário
        const userHistory = await this.db.query(
          `SELECT s.* FROM songs s
           JOIN playlist_songs ps ON s.id = ps.song_id
           JOIN playlists p ON ps.playlist_id = p.id
           WHERE p.user_id = $1`,
          [userId]
        );
  
        // 2. Identificar gêneros favoritos (se houver histórico)
        if (userHistory.rows.length > 0) {
          const genreCounts = {};
          userHistory.rows.forEach(song => {
            if (song.genre) {
              if (!genreCounts[song.genre]) {
                genreCounts[song.genre] = 0;
              }
              genreCounts[song.genre]++;
            }
          });
  
          // Ordenar gêneros por popularidade
          favoriteGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);
          
          // Garantir que temos pelo menos um gênero
          if (favoriteGenres.length === 0) {
            favoriteGenres = ['Pop']; // Gênero padrão
          }
          
          console.log('Gêneros favoritos identificados:', favoriteGenres);
        } else {
          console.log('Usuário sem histórico musical, usando gêneros padrão');
        }
      } catch (historyError) {
        console.error('Erro ao obter histórico musical:', historyError);
        // Continuamos com gêneros padrão
      }
  
      // 3. Obter músicas em tendência
      console.log('Obtendo músicas em tendência');
      const trendingSongs = await musicScraperService.getTrendingSongs(50);
      
      // 4. Criar nova playlist
      console.log('Criando nova playlist');
      const newPlaylist = await this.db.query(
        'INSERT INTO playlists (name, is_public, user_id) VALUES ($1, $2, $3) RETURNING id',
        [name, true, userId]
      );
      const playlistId = newPlaylist.rows[0].id;
  
      // 5. Adicionar músicas à playlist (máximo 10)
      let songsAdded = 0;
      console.log(`Adicionando músicas à playlist ${playlistId}`);
      
      for (const song of trendingSongs.slice(0, 10)) {
        try {
          // Verificar se a música existe no catálogo
          let songId;
          const existingCheck = await this.db.query(
            'SELECT id FROM songs WHERE LOWER(title) = LOWER($1) AND LOWER(artist) = LOWER($2)',
            [song.title, song.artist]
          );
  
          if (existingCheck.rows.length > 0) {
            songId = existingCheck.rows[0].id;
          } else {
            // Adicionar ao catálogo se não existir
            const newSong = await this.db.query(
              'INSERT INTO songs (title, artist, album, genre, duration) VALUES ($1, $2, $3, $4, $5) RETURNING id',
              [
                song.title, 
                song.artist, 
                song.album || 'Desconhecido', 
                song.genre || 'Pop', 
                song.duration || 240
              ]
            );
            songId = newSong.rows[0].id;
          }
  
          // Adicionar à playlist
          await this.db.query(
            'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
            [playlistId, songId]
          );
          songsAdded++;
        } catch (songError) {
          console.error(`Erro ao adicionar música "${song.title}":`, songError);
          // Continua para a próxima música
        }
      }
  
      console.log(`Playlist personalizada criada com ${songsAdded} músicas`);
  
      return {
        success: true,
        playlistId,
        playlistName: name,
        songsCount: songsAdded
      };
    } catch (error) {
      console.error('Erro ao gerar playlist personalizada:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getRPAStatus() {
    return this.rpaStatus;
  }

  async shutdown() {
    console.log('Encerrando serviço RPA musical...');
    return true;
  }
}

module.exports = new MusicRpaService();

