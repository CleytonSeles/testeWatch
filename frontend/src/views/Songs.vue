<template>
  <div>
    <h1 class="mb-5">Catálogo de Músicas</h1>
    
    <v-card>
      <v-card-title>
        Todas as Músicas
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
        :items="songs || []"
        :search="search"
        :loading="isLoading"
        class="elevation-1"
      >
        <template #duration="{ item }">
          {{ formatDuration(item.duration) }}
        </template>
        
        <template #actions="{ item }">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                text
                color="primary"
                v-bind="attrs"
                v-on="on"
              >
                Adicionar à Playlist
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                v-for="playlist in userPlaylists"
                :key="playlist.id"
                @click="addToPlaylist(playlist.id, item.id)"
              >
                <v-list-item-title>{{ playlist.name }}</v-list-item-title>
              </v-list-item>
              
              <v-divider v-if="userPlaylists.length"></v-divider>
              
              <v-list-item to="/create-playlist">
                <v-list-item-title>Criar Nova Playlist</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <div v-if="songs && songs.length">
      <ul>
        <li v-for="song in songs" :key="song.id">{{ song.name }}</li>
      </ul>
    </div>
    <div v-else>
      <p>No songs available.</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'SongsView',
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
      ]
    };
  },
  computed: {
    ...mapGetters(['getAllSongs', 'getUserPlaylists', 'isLoading']),
    songs() {
      return this.getAllSongs || [];
    },
    userPlaylists() {
      return this.getUserPlaylists || [];
    }
  },
  methods: {
    ...mapActions(['fetchAllSongs', 'fetchUserPlaylists', 'addSongToPlaylist']),
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },
    async addToPlaylist(playlistId, songId) {
      try {
        await this.addSongToPlaylist({ playlistId, songId });
        this.$emit('success', 'Música adicionada à playlist com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar música à playlist', error);
        this.$emit('error', 'Erro ao adicionar a música. Tente novamente.');
      }
    }
  },
  created() {
    this.fetchAllSongs();
    this.fetchUserPlaylists();
  }
};
</script>
