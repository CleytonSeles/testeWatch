<template>
    <div>
      <div v-if="playlist">
        <v-row>
          <v-col cols="12" md="8">
            <h1>{{ playlist.playlist.name }}</h1>
            <p class="text-subtitle-1">
              {{ playlist.playlist.is_public ? 'Playlist Pública' : 'Playlist Privada' }}
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-right">
            <v-btn
              color="primary"
              to="/songs"
            >
              Adicionar Músicas
            </v-btn>
          </v-col>
        </v-row>
        
        <v-card class="mt-4">
          <v-card-title>
            Músicas
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="playlist.songs"
            :search="search"
            :loading="isLoading"
            class="elevation-1"
          >
            <template v-slot:[`item.duration`]="{ item }">
              {{ formatDuration(item.duration) }}
            </template>
            
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                small
                icon
                color="error"
                @click="removeSong(item.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </div>
      
      <div v-else-if="isLoading" class="text-center pa-5">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-2">Carregando playlist...</p>
      </div>
      
      <div v-else class="text-center pa-5">
        <p>Playlist não encontrada</p>
        <v-btn color="primary" to="/">Voltar para Home</v-btn>
      </div>
    </div>
    <div v-if="playlists.length">
      <ul>
        <li v-for="playlist in playlists" :key="playlist.id">
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No playlists available.</p>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: 'PlaylistView',
    data() {
      return {
        search: '',
        headers: [
          { text: 'Título', value: 'title' },
          { text: 'Artista', value: 'artist' },
          { text: 'Álbum', value: 'album' },
          { text: 'Gênero', value: 'genre' },
          { text: 'Duração', value: 'duration' },
          { text: 'Ações', value: 'actions', sortable: false }
        ],
        playlists: []
      }
    },
    computed: {
      ...mapGetters(['getCurrentPlaylist', 'isLoading']),
      playlist() {
        return this.getCurrentPlaylist;
      },
      playlistId() {
        return parseInt(this.$route.params.id);
      }
    },
    methods: {
      ...mapActions(['fetchPlaylistById', 'removeSongFromPlaylist']),
      formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      },
      async removeSong(songId) {
        try {
          await this.removeSongFromPlaylist({
            playlistId: this.playlistId,
            songId
          });
          this.$root.showSuccess('Música removida da playlist com sucesso!');
        } catch (error) {
          console.error('Erro ao remover música da playlist', error);
        }
      }
    },
    created() {
      this.fetchPlaylistById(this.playlistId);
    },
    watch: {
      // Atualizar quando o ID da playlist mudar na URL
      '$route.params.id'() {
        this.fetchPlaylistById(this.playlistId);
      }
    }
  }
  </script>
