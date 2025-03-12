const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

class MusicScraperService {
  constructor() {
    this.trendsCache = {
      lastUpdated: null,
      billboard: [],
      spotify: []
    };
    this.updateInterval = 6 * 60 * 60 * 1000; // 6 horas em ms
  }

  async initialize() {
    console.log('Inicializando serviço de scraping musical...');
    // Faz a primeira atualização imediatamente
    await this.updateTrends();
    
    // Configura atualizações periódicas
    setInterval(async () => {
      await this.updateTrends();
    }, this.updateInterval);
  }

  async updateTrends() {
    console.log('Atualizando tendências musicais...');
    try {
      // Para uso em desenvolvimento/teste, apenas atualiza o timestamp
      this.trendsCache = {
        lastUpdated: new Date(),
        billboard: [],
        spotify: []
      };
      
      console.log('Tendências simuladas atualizadas');
      return true;
      
      // Código original comentado:
      // const [billboardTrends, spotifyTrends] = await Promise.all([
      //   this.scrapeBillboardHot100(),
      //   this.scrapeSpotifyCharts()
      // ]);
      // 
      // this.trendsCache = {
      //   lastUpdated: new Date(),
      //   billboard: billboardTrends,
      //   spotify: spotifyTrends
      // };
      // 
      // console.log(`Tendências atualizadas: ${billboardTrends.length} do Billboard, ${spotifyTrends.length} do Spotify`);
      // return true;
    } catch (error) {
      console.error('Erro ao atualizar tendências:', error);
      return false;
    }
  }

  async scrapeBillboardHot100() {
    try {
      console.log('Iniciando scraping do Billboard Hot 100...');
      const response = await axios.get('https://www.billboard.com/charts/hot-100/');
      const $ = cheerio.load(response.data);
      
      const songs = [];
      
      // Seletor específico para Billboard - ajuste conforme necessário
      $('.chart-element').each((i, el) => {
        if (i >= 50) return false; // Limita aos top 50
        
        const title = $(el).find('.chart-element__information__song').text().trim();
        const artist = $(el).find('.chart-element__information__artist').text().trim();
        const rank = $(el).find('.chart-element__rank__number').text().trim();
        
        songs.push({
          title,
          artist,
          rank: parseInt(rank),
          source: 'billboard'
        });
      });
      
      return songs;
    } catch (error) {
      console.error('Erro no scraping do Billboard:', error);
      return [];
    }
  }

  async scrapeSpotifyCharts() {
    try {
      console.log('Iniciando scraping do Spotify Charts...');
      // Usando Puppeteer para páginas que requerem JavaScript
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.goto('https://spotifycharts.com/regional/global/daily/latest', {
        waitUntil: 'networkidle2'
      });
      
      const songs = await page.evaluate(() => {
        const results = [];
        const rows = document.querySelectorAll('table.chart-table tr:not(:first-child)');
        
        rows.forEach((row, index) => {
          if (index >= 50) return; // Limitar aos top 50
          
          const title = row.querySelector('td.chart-table-track strong')?.textContent.trim();
          let artist = row.querySelector('td.chart-table-track span')?.textContent.trim();
          
          // Limpar string do artista (remover "por " ou "by ")
          artist = artist?.replace(/^by\s|^por\s/i, '');
          
          if (title && artist) {
            results.push({
              title,
              artist,
              rank: index + 1,
              source: 'spotify'
            });
          }
        });
        
        return results;
      });
      
      await browser.close();
      return songs;
    } catch (error) {
      console.error('Erro no scraping do Spotify:', error);
      return [];
    }
  }

  async enrichSongData(song) {
    try {
      // Buscar informações adicionais da API do Last.fm
      const apiKey = process.env.LASTFM_API_KEY || 'sua_api_key_aqui';
      const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(song.artist)}&track=${encodeURIComponent(song.title)}&format=json`);
      
      const trackInfo = response.data?.track;
      
      return {
        ...song,
        album: trackInfo?.album?.title || 'Desconhecido',
        genre: trackInfo?.toptags?.tag?.[0]?.name || 'Pop',
        duration: parseInt(trackInfo?.duration || 0) / 1000 || 240, // Duração em segundos
        popularity: 100 - song.rank
      };
    } catch (error) {
      console.log(`Não foi possível enriquecer dados para ${song.title}: ${error.message}`);
      // Retorna dados padrão se a API falhar
      return {
        ...song,
        album: 'Desconhecido',
        genre: 'Pop',
        duration: 240,
        popularity: 100 - song.rank
      };
    }
  }

  async getTrendingSongs(limit = 10) {
    // Para fins de teste/desenvolvimento, retornamos dados simulados
    console.log('Retornando dados de tendências simulados');
    const mockedTrends = [
      {
        title: "As It Was",
        artist: "Harry Styles",
        rank: 1,
        source: "billboard",
        album: "Harry's House",
        genre: "Pop" 
      },
      {
        title: "First Class",
        artist: "Jack Harlow", 
        rank: 2,
        source: "spotify",
        album: "Come Home the Kids Miss You",
        genre: "Hip-Hop"
      },
      {
        title: "Wait For U",
        artist: "Future ft. Drake & Tems",
        rank: 3, 
        source: "billboard",
        album: "I Never Liked You",
        genre: "Hip-Hop"
      },
      {
        title: "Running Up That Hill",
        artist: "Kate Bush",
        rank: 4,
        source: "spotify", 
        album: "Hounds of Love",
        genre: "Rock"
      },
      {
        title: "About Damn Time",
        artist: "Lizzo",
        rank: 5,
        source: "billboard",
        album: "Special", 
        genre: "Pop"
      },
      {
        title: "Heat Waves",
        artist: "Glass Animals",
        rank: 6,
        source: "spotify",
        album: "Dreamland",
        genre: "Indie Pop"
      },
      {
        title: "Break My Soul",
        artist: "Beyoncé",
        rank: 7,
        source: "billboard",
        album: "Renaissance",
        genre: "Dance-Pop"
      },
      {
        title: "Bad Habit",
        artist: "Steve Lacy",
        rank: 8,
        source: "spotify",
        album: "Gemini Rights",
        genre: "R&B"
      },
      {
        title: "Stay",
        artist: "The Kid LAROI & Justin Bieber",
        rank: 9,
        source: "billboard",
        album: "F*CK LOVE 3: OVER YOU",
        genre: "Pop"
      },
      {
        title: "Enemy",
        artist: "Imagine Dragons & JID",
        rank: 10,
        source: "spotify",
        album: "Mercury - Act 1",
        genre: "Rock"
      }
    ];
    
    return mockedTrends.slice(0, limit);
    
    // Código original comentado:
    // if (!this.trendsCache.lastUpdated || 
    //     (new Date() - this.trendsCache.lastUpdated) > this.updateInterval) {
    //   await this.updateTrends();
    // }
    // 
    // // Combina e ordena resultados do Billboard e Spotify
    // const combined = [
    //   ...this.trendsCache.billboard,
    //   ...this.trendsCache.spotify
    // ];
    // 
    // // Remove duplicatas (mesma música de diferentes fontes)
    // const unique = Array.from(new Map(
    //   combined.map(song => [`${song.title}-${song.artist}`, song])
    // ).values());
    // 
    // // Ordena por rank médio se a música aparece em ambas as fontes
    // const rankMap = {};
    // combined.forEach(song => {
    //   const key = `${song.title}-${song.artist}`;
    //   if (!rankMap[key]) {
    //     rankMap[key] = { sum: song.rank, count: 1 };
    //   } else {
    //     rankMap[key].sum += song.rank;
    //     rankMap[key].count += 1;
    //   }
    // });
    // 
    // unique.sort((a, b) => {
    //   const keyA = `${a.title}-${a.artist}`;
    //   const keyB = `${b.title}-${b.artist}`;
    //   
    //   const avgA = rankMap[keyA].sum / rankMap[keyA].count;
    //   const avgB = rankMap[keyB].sum / rankMap[keyB].count;
    //   
    //   return avgA - avgB;
    // });
    // 
    // // Limitar ao número especificado
    // return unique.slice(0, limit);
  }
  
  async getLastUpdated() {
    return this.trendsCache.lastUpdated || new Date();
  }
}

module.exports = new MusicScraperService();

