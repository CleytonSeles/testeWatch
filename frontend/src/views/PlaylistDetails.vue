<template>
    <div class="playlist-details">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="text-h4">
                {{ playlistName }}
              </v-card-title>
              <v-card-subtitle>Playlist</v-card-subtitle>
              
              <v-card-text>
                <div v-if="loading" class="text-center py-5">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  <p class="mt-3">Carregando detalhes da playlist...</p>
                </div>
                
                <div v-else-if="error" class="text-center py-5">
                  <v-icon size="large" color="error">mdi-alert-circle</v-icon>
                  <p class="text-body-1 mt-3">{{ error }}</p>
                  <v-btn color="primary" @click="goBack">Voltar</v-btn>
                </div>
                
                <div v-else>
                  <v-list v-if="songs.length > 0">
                    <v-list-item 
                      v-for="song in songs" 
                      :key="song.id"
                      @click="playSong(song)"
                    >
                      <v-list-item-title>{{ song.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ song.artist }}</v-list-item-subtitle>
                      
                      <template v-slot:append>
                        <v-btn icon @click.stop="removeSong(song)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <div v-else class="text-center py-5">
                    <v-icon size="large" color="info">mdi-playlist-music</v-icon>
                    <p class="text-body-1 mt-3">Esta playlist está vazia. Adicione músicas para começar.</p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PlaylistDetails',
    props: {
      id: {
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        playlistName: 'Minha Playlist',
        songs: [],
        loading: true,
        error: null
      };
    },
    methods: {
      async fetchPlaylist() {
        this.loading = true;
        try {
          const response = await axios.get(`/api/playlists/${this.id}`);
          this.playlistName = response.data.playlist.name;
          this.songs = response.data.playlist.songs || [];
          this.loading = false;
        } catch (error) {
          this.error = 'Erro ao carregar a playlist. Por favor, tente novamente.';
          this.loading = false;
          console.error('Erro ao buscar detalhes da playlist:', error);
        }
      },
      playSong(song) {
        console.log('Tocando música:', song);
        // Aqui você implementaria a lógica para tocar a música
      },
      async removeSong(song) {
        try {
          await axios.delete(`/api/playlists/${this.id}/songs/${song.id}`);
          this.songs = this.songs.filter(s => s.id !== song.id);
          this.$root.showSuccess('Música removida da playlist com sucesso');
        } catch (error) {
          this.$root.showError('Erro ao remover música da playlist');
          console.error('Erro ao remover música:', error);
        }
      },
      goBack() {
        this.$router.push('/home');
      }
    },
    mounted() {
      this.fetchPlaylist();
    }
  };
  </script>
  