<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 font-weight-bold mb-4">Tendências Musicais</h1>
          <p class="text-subtitle-1 mb-8">
            Descubra as músicas mais populares do momento, atualizadas automaticamente através de nossa tecnologia de scraping.
            <span v-if="lastUpdated" class="text-caption">
              Última atualização: {{ formatDate(lastUpdated) }}
            </span>
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">
              <v-icon left color="primary" class="mr-2">mdi-trending-up</v-icon>
              Músicas em Alta
            </v-card-title>
            
            <v-card-subtitle v-if="isAdmin">
              <v-btn 
                color="primary" 
                @click="updateCatalog" 
                :loading="updatingCatalog"
                :disabled="updatingCatalog"
              >
                <v-icon left>mdi-refresh</v-icon>
                Atualizar Catálogo
              </v-btn>
            </v-card-subtitle>

            <v-card-text v-if="loading">
              <div class="d-flex justify-center align-center" style="height: 200px">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </v-card-text>
            
            <template v-else>
              <v-list two-line>
                <v-list-item 
                  v-for="(song, index) in trendingSongs" 
                  :key="index"
                >
                  <v-list-item-avatar>
                    <v-avatar color="primary" class="white--text">
                      {{ index + 1 }}
                    </v-avatar>
                  </v-list-item-avatar>
                  
                  <v-list-item-content>
                    <v-list-item-title>{{ song.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
                  </v-list-item-content>
                  
                  <v-list-item-action>
                    <v-chip small :color="song.source === 'billboard' ? 'red' : 'green'" text-color="white">
                      {{ song.source === 'billboard' ? 'Billboard' : 'Spotify' }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </template>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title class="text-h5 font-weight-bold">
              <v-icon left color="primary" class="mr-2">mdi-playlist-music</v-icon>
              Descobertas para Você
            </v-card-title>
            
            <v-card-text>
              <p>Nossa tecnologia RPA analisa suas preferências musicais e as combina com as tendências atuais para criar playlists personalizadas.</p>
            </v-card-text>
            
            <v-card-actions>
              <v-btn 
                color="primary" 
                block 
                @click="generatePlaylist"
                :loading="generatingPlaylist"
                :disabled="generatingPlaylist"
              >
                <v-icon left>mdi-robot</v-icon>
                Gerar Playlist Personalizada
              </v-btn>
            </v-card-actions>
          </v-card>
          
          <v-card v-if="isAdmin">
            <v-card-title class="text-h5 font-weight-bold">
              <v-icon left color="primary" class="mr-2">mdi-robot</v-icon>
              Status do RPA
            </v-card-title>
            
            <v-card-text>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Status</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip 
                      :color="rpaStatus.running ? 'warning' : 'success'" 
                      text-color="white" 
                      small
                    >
                      {{ rpaStatus.running ? 'Em execução' : 'Inativo' }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Última execução</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ rpaStatus.lastRun ? formatDate(rpaStatus.lastRun) : 'Nunca' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Músicas adicionadas</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ rpaStatus.songsAdded || 0 }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Dialog para sucesso na geração de playlist -->
      <v-dialog v-model="playlistDialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
            Playlist Gerada com Sucesso
          </v-card-title>
          
          <v-card-text>
            <p>Sua playlist personalizada <strong>"{{ playlistResult.playlistName }}"</strong> foi criada com {{ playlistResult.songsCount }} músicas baseadas nas tendências atuais e em seu perfil musical.</p>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="playlistDialog = false">Fechar</v-btn>
            <v-btn 
              color="primary" 
              @click="goToPlaylist"
            >
              Ver Playlist
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'MusicTrends',
  data() {
    return {
      trendingSongs: [],
      lastUpdated: null,
      loading: true,
      
      // RPA Status
      rpaStatus: {
        running: false,
        lastRun: null,
        songsAdded: 0,
        errors: []
      },
      
      // Ações
      updatingCatalog: false,
      generatingPlaylist: false,
      
      // Dialog
      playlistDialog: false,
      playlistResult: {
        playlistId: null,
        playlistName: '',
        songsCount: 0
      }
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser']),
    isAdmin() {
      return this.getUser && this.getUser.role === 'admin';
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    },
    
    async fetchTrendingSongs() {
      this.loading = true;
      
      try {
        const response = await axios.get('/api/trends');
        this.trendingSongs = response.data.trendingSongs;
        this.lastUpdated = response.data.lastUpdated;
      } catch (error) {
        console.error('Erro ao obter músicas em tendência:', error);
        this.$root.showError('Erro ao carregar tendências musicais');
      } finally {
        this.loading = false;
      }
    },
    
    async fetchRPAStatus() {
      if (!this.isAdmin) return;
      
      try {
        const response = await axios.get('/api/trends/rpa-status');
        this.rpaStatus = response.data.status;
      } catch (error) {
        console.error('Erro ao obter status do RPA:', error);
      }
    },
    
    async updateCatalog() {
      if (!this.isAdmin) return;
      
      this.updatingCatalog = true;
      
      try {
        const response = await axios.post('/api/trends/update-catalog');
        
        if (response.data.success) {
          this.$root.showSuccess(`Catálogo atualizado com sucesso. Adicionadas ${response.data.songsAdded} músicas.`);
          
          // Atualizar status e lista de tendências
          await this.fetchRPAStatus();
          await this.fetchTrendingSongs();
        } else {
          this.$root.showError(`Falha ao atualizar catálogo: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Erro ao atualizar catálogo:', error);
        this.$root.showError('Erro ao atualizar catálogo');
      } finally {
        this.updatingCatalog = false;
      }
    },
    
    async generatePlaylist() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      
      this.generatingPlaylist = true;
      
      try {
        const response = await axios.post('/api/trends/personalized-playlist', {
          name: `Descobertas do Dia ${new Date().toLocaleDateString('pt-BR')}`
        });
        
        if (response.data.success) {
          this.playlistResult = {
            playlistId: response.data.playlistId,
            playlistName: response.data.playlistName,
            songsCount: response.data.songsCount
          };
          
          this.playlistDialog = true;
        } else {
          this.$root.showError(`Falha ao gerar playlist: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Erro ao gerar playlist:', error);
        this.$root.showError('Erro ao gerar playlist personalizada');
      } finally {
        this.generatingPlaylist = false;
      }
    },
    
    goToPlaylist() {
      this.playlistDialog = false;
      this.$router.push(`/playlist/${this.playlistResult.playlistId}`);
    }
  },
  created() {
    this.fetchTrendingSongs();
    
    if (this.isAuthenticated && this.isAdmin) {
      this.fetchRPAStatus();
    }
  }
};
</script>


  