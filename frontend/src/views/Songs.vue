<template>
  <div>
    <h1 class="text-h3 font-weight-bold mb-8">Explorar músicas</h1>
    
    <v-card color="surface">
      <v-card-title class="pb-0">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Pesquisar por título, artista ou gênero"
          variant="outlined"
          density="comfortable"
          hide-details
          class="search-field mb-4"
          color="primary"
          bg-color="#2a2a2a"
        ></v-text-field>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="songs || []"
          :search="search"
          :loading="isLoading"
          class="elevation-0"
        >
          <template item.image="{ item }">
            <v-avatar size="40" color="primary" class="mr-3">
              <span class="white--text text-h6">{{ item.title ? item.title.charAt(0) : 'M' }}</span>
            </v-avatar>
          </template>
          
          <template item.title="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.title }}</div>
              <div class="text-caption grey--text">{{ item.album }}</div>
            </div>
          </template>
          
          <template item.duration="{ item }">
            {{ formatDuration(item.duration) }}
          </template>
          
          <template item.actions="{ item }">
            <div class="d-flex">
              <v-btn icon small class="mr-2">
                <v-icon small>mdi-heart-outline</v-icon>
              </v-btn>
              
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    icon
                    small
                    v-bind="props"
                  >
                    <v-icon small>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-subheader>Adicionar à Playlist</v-list-subheader>
                  <v-list-item
                    v-for="playlist in userPlaylists"
                    :key="playlist.id"
                    @click="addToPlaylist(playlist.id, item.id)"
                    density="compact"
                  >
                    <template #prepend>
                      <v-icon small>mdi-playlist-music</v-icon>
                    </template>
                    <v-list-item-title>{{ playlist.name }}</v-list-item-title>
                  </v-list-item>
                  
                  <v-divider></v-divider>
                  
                  <v-list-item to="/create-playlist" density="compact">
                    <template #prepend>
                      <v-icon small>mdi-playlist-plus</v-icon>
                    </template>
                    <v-list-item-title>Criar Nova Playlist</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// Atualizar apenas os headers no script para incluir a coluna image
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'SongsView',
  data() {
    return {
      search: '',
      headers: [
        { title: '', key: 'image', sortable: false, width: '60px' },
        { title: 'TÍTULO', key: 'title', align: 'start' },
        { title: 'ARTISTA', key: 'artist' },
        { title: 'GÊNERO', key: 'genre' },
        { title: 'DURAÇÃO', key: 'duration', align: 'end' },
        { title: '', key: 'actions', sortable: false, align: 'end', width: '100px' }
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
        this.$root.showSuccess('Música adicionada à playlist com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar música à playlist', error);
        this.$root.showError('Erro ao adicionar música à playlist');
      }
    }
  },
  created() {
    this.fetchAllSongs();
    this.fetchUserPlaylists();
  }
};
</script>

<style scoped>
.search-field :deep(.v-input__slot) {
  background-color: #2a2a2a !important;
}
</style>

