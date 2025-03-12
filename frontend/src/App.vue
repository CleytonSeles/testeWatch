<template>
  <v-app>
    <!-- Barra lateral de navegação apenas para usuários logados -->
    <template v-if="isAuthenticated">
      <v-navigation-drawer
        app
        permanent
        color="secondary"
        width="240"
      >
        <v-list-item class="px-2">
          <template v-slot:prepend>
            <v-avatar>
              <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title class="text-h6">
            {{ getUser ? getUser.username : 'Usuário' }}
          </v-list-item-title>
          <v-list-item-subtitle>Logado</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list
          density="compact"
          nav
        >
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            link
          ></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-4">
            <v-btn block color="primary" to="/create-playlist" variant="elevated" class="mb-2">
              <v-icon start>mdi-playlist-plus</v-icon>
              Nova Playlist
            </v-btn>
            <v-btn block color="error" @click="logout" variant="text">
              <v-icon start>mdi-logout</v-icon>
              Sair
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <!-- Player de música (fixo na parte inferior) para usuários logados -->
      <v-footer
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
    </template>
    <!-- Conteúdo principal -->
    <v-main :class="{ 'authenticated': isAuthenticated }">
      <router-view></router-view>
    </v-main>
    <!-- Snackbar para mensagens -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      :timeout="5000"
      location="bottom"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
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
        { title: 'Home', icon: 'mdi-home', to: '/home' },
        { title: 'Explorar', icon: 'mdi-compass', to: '/songs' },
        { title: 'Biblioteca', icon: 'mdi-music-box-multiple', to: '/home' },
        { title: 'Buscar', icon: 'mdi-magnify', to: '/songs' },
        { title: 'Tendências', icon: 'mdi-trending-up', to: '/trends' } // Novo item para tendências
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
.v-main.authenticated {
  padding-left: 256px !important; /* Ajustar para o tamanho da barra lateral */
  padding-bottom: 80px !important; /* Ajustar para o tamanho do player */
}
</style>


