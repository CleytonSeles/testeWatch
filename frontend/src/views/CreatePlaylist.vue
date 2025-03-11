<template>
    <div>
      <h1 class="mb-5">Criar Nova Playlist</h1>
      
      <v-card class="elevation-6">
        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <v-text-field
              v-model="name"
              label="Nome da Playlist"
              required
              :error-messages="nameErrors"
              @input="nameErrors = []"
            ></v-text-field>
            
            <v-switch
              v-model="isPublic"
              label="Playlist Pública"
              hint="Playlists públicas podem ser vistas por outros usuários"
              persistent-hint
            ></v-switch>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text to="/">Cancelar</v-btn>
          <v-btn 
            color="primary" 
            @click="submitForm"
            :loading="isLoading"
          >
            Criar Playlist
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: 'CreatePlaylist',
    data() {
      return {
        name: '',
        isPublic: false,
        nameErrors: []
      }
    },
    computed: {
      ...mapGetters(['isLoading'])
    },
    methods: {
      ...mapActions(['createPlaylist']),
      validate() {
        this.nameErrors = [];
        
        if (!this.name) {
          this.nameErrors.push('O nome da playlist é obrigatório');
          return false;
        }
        
        return true;
      },
      async submitForm() {
        if (!this.validate()) return;
        
        try {
          await this.createPlaylist({
            name: this.name,
            isPublic: this.isPublic
          });
          
          this.$root.showSuccess('Playlist criada com sucesso!');
          this.$router.push('/');
        } catch (error) {
          console.error('Erro ao criar playlist', error);
        }
      }
    }
  }
  </script>
  