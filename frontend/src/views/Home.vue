<template>
  <div>
    <h1 class="text-h3 font-weight-bold mb-8">Bem-vindo ao Awdio</h1>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card color="surface" class="mb-6">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start color="primary" class="mr-2">mdi-playlist-music</v-icon>
            Suas Playlists
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-0">
            <v-list v-if="userPlaylists && userPlaylists.length > 0" color="surface">
              <v-list-item 
                v-for="playlist in userPlaylists" 
                :key="playlist.id"
                :to="`/playlist/${playlist.id}`"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" class="mr-3">
                    <v-icon color="white">mdi-playlist-music</v-icon>
                  </v-avatar>
                </template>
                
                <v-list-item-title class="text-subtitle-1 font-weight-medium">
                  {{ playlist.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ playlist.is_public ? 'Pública' : 'Privada' }}
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-icon>mdi-chevron-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
            
            <v-sheet v-else color="surface" class="pa-8 d-flex flex-column align-center">
              <v-icon size="64" color="primary" class="mb-4">mdi-playlist-plus</v-icon>
              <p class="text-body-1 mb-4">Você ainda não tem playlists</p>
              <v-btn color="primary" to="/create-playlist" variant="elevated">
                Criar Playlist
              </v-btn>
            </v-sheet>
          </v-card-text>
        </v-card>
        
        <v-card color="surface">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start color="primary" class="mr-2">mdi-fire</v-icon>
            Recomendados para Você
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-0">
            <v-list color="surface">
              <v-list-item v-for="n in 3" :key="n">
                <template v-slot:prepend>
                  <v-avatar rounded size="40" class="mr-3">
                    <v-img src="https://via.placeholder.com/40"></v-img>
                  </v-avatar>
                </template>
                
                <v-list-item-title>Playlist Recomendada {{ n }}</v-list-item-title>
                <v-list-item-subtitle>Baseado no seu gosto musical</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card color="surface">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon start color="primary" class="mr-2">mdi-music-box-multiple</v-icon>
            Músicas Populares
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-0">
            <v-list v-if="songs && songs.length > 0" color="surface">
              <v-list-item v-for="song in songs.slice(0, 8)" :key="song.id">
                <template v-slot:prepend>
                  <v-avatar color="primary" rounded class="mr-3">
                    <span class="white--text">{{ song.title.charAt(0) }}</span>
                  </v-avatar>
                </template>
                
                <v-list-item-title>{{ song.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        v-bind="props"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-play</v-icon>
                        </template>
                        <v-list-item-title>Reproduzir</v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template v-slot:prepend>
                          <v-icon>mdi-playlist-plus</v-icon>
                        </template>
                        <v-list-item-title>Adicionar à Playlist</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-list-item>
            </v-list>
            
            <v-sheet v-else color="surface" class="pa-8 d-flex flex-column align-center">
              <v-icon size="64" color="primary" class="mb-4">mdi-music</v-icon>
              <p class="text-body-1 mb-4">Carregando músicas...</p>
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-sheet>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="primary" to="/songs">
              Ver todas as músicas
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// Manter o script existente sem alterações
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['getUserPlaylists', 'getAllSongs']),
    userPlaylists() {
      return this.getUserPlaylists;
    },
    songs() {
      return this.getAllSongs;
    }
  },
  methods: {
    ...mapActions(['fetchUserPlaylists', 'fetchAllSongs'])
  },
  created() {
    this.fetchUserPlaylists();
    this.fetchAllSongs();
  }
}
</script>
