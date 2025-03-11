<template>
  <v-app>
    <!-- Barra lateral de navegação -->
    <v-navigation-drawer
      v-if="isAuthenticated"
      app
      dark
      permanent
      color="secondary"
      width="240"
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-h6 white--text">
            {{ getUser ? getUser.username : 'Usuário' }}
          </v-list-item-title>
          <v-list-item-subtitle class="white--text">Logado</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn block color="primary" to="/create-playlist" variant="elevated">
            <v-icon start>mdi-playlist-plus</v-icon>
            Nova Playlist
          </v-btn>
          <v-btn block color="error" @click="logout" variant="text" class="mt-2">
            <v-icon start>mdi-logout</v-icon>
            Sair
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Conteúdo principal -->
    <v-main class="background">
      <v-container fluid :class="isAuthenticated ? 'pa-8' : 'pa-0'" style="height: 100%">
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Snackbar para mensagens -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      timeout="5000"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          text
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Player de música (fixo na parte inferior) -->
    <v-footer
      v-if="isAuthenticated"
      app
      padless
      color="secondary"
      height="80"
    >
      <v-card
        flat
        tile
        width="100%"
        class="pa-2"
        color="secondary"
      >
        <v-row align="center" no-gutters>
          <v-col cols="3">
            <v-row no-gutters align="center">
              <v-col cols="4">
                <v-img
                  src="https://via.placeholder.com/60"
                  max-width="60"
                  class="ml-2"
                ></v-img>
              </v-col>
              <v-col cols="8">
                <div class="text-subtitle-2 white--text">Nome da Música</div>
                <div class="text-caption grey--text">Artista</div>
              </v-col>
            </v-row>
          </v-col>
          
          <v-col cols="6">
            <div class="text-center">
              <v-btn icon>
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>

              <v-btn icon class="mx-4" size="large">
                <v-icon size="large">mdi-play-circle</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>
            </div>
            <v-slider
              class="mt-0 pt-0"
              color="primary"
              hide-details
            ></v-slider>
          </v-col>

          <v-col cols="3">
            <v-row justify="end" align="center">
              <v-btn icon>
                <v-icon>mdi-volume-high</v-icon>
              </v-btn>
              <v-slider
                max="10"
                class="mt-0 pt-0 mr-4"
                color="primary"
                hide-details
                style="max-width: 100px;"
              ></v-slider>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'info',
      menuItems: [
        { title: 'Home', icon: 'mdi-home', to: '/' },
        { title: 'Explorar', icon: 'mdi-compass', to: '/songs' },
        { title: 'Biblioteca', icon: 'mdi-music-box-multiple', to: '/' },
        { title: 'Buscar', icon: 'mdi-magnify', to: '/songs' },
      ]
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'getUser', 'getError'])
  },
  methods: {
    ...mapActions(['logout', 'fetchUserProfile']),
    showError(message) {
      this.snackbarText = message;
      this.snackbarColor = 'error';
      this.snackbar = true;
    },
    showSuccess(message) {
      this.snackbarText = message;
      this.snackbarColor = 'success';
      this.snackbar = true;
    }
  },
  watch: {
    getError(error) {
      if (error) {
        this.showError(error);
      }
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserProfile().catch(err => {
        console.error('Erro ao buscar perfil:', err);
      });
    }
  },
  mounted() {
    // Adicionar método global para mostrar mensagens
    this.$root.showSuccess = this.showSuccess;
    this.$root.showError = this.showError;
  }
};
</script>

<style>
.v-application {
  background-color: #121212 !important;
}
.background {
  background-color: #121212;
}
</style>
