<template>
    <div>
      <h1 class="mb-5">Bem-vindo ao Streaming de Música</h1>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Suas Playlists</v-card-title>
            <v-card-text>
              <v-list v-if="userPlaylists.length > 0">
                <v-list-item 
                  v-for="playlist in userPlaylists" 
                  :key="playlist.id"
                  :to="`/playlist/${playlist.id}`"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-playlist-music</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ playlist.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ playlist.is_public ? 'Pública' : 'Privada' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div v-else class="text-center pa-5">
                <p>Você ainda não tem playlists</p>
                <v-btn color="primary" to="/create-playlist">Criar Playlist</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Músicas Populares</v-card-title>
            <v-card-text>
              <v-list v-if="songs.length > 0">
                <v-list-item v-for="song in songs.slice(0, 5)" :key="song.id">
                  <v-list-item-icon>
                    <v-icon>mdi-music-note</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ song.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div v-else class="text-center pa-5">
                <p>Carregando músicas...</p>
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" to="/songs">Ver todas as músicas</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
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
