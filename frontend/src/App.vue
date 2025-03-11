<template>
  <v-app>
    <v-app-bar
      app
      color="secondary"
      dark
      v-if="isAuthenticated"
    >
      <v-toolbar-title>Streaming de Música</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/songs">Músicas</v-btn>
      <v-btn text to="/create-playlist">Nova Playlist</v-btn>
      <v-btn @click="logout" text>Sair</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      timeout="5000"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
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
  data: () => ({
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'info'
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'getError'])
  },
  methods: {
    ...mapActions(['logout']),
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
  }
};
</script>
