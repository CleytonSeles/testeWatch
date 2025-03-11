<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  v-model="email"
                  :error-messages="emailErrors"
                  @input="emailErrors = []"
                ></v-text-field>
  
                <v-text-field
                  label="Senha"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="password"
                  :error-messages="passwordErrors"
                  @input="passwordErrors = []"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="onSubmit" :loading="isLoading">Login</v-btn>
            </v-card-actions>
            <v-card-text class="text-center">
              Não tem uma conta? 
              <v-btn text color="primary" to="/register">Registre-se</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: 'LoginView',
    data() {
      return {
        email: '',
        password: '',
        emailErrors: [],
        passwordErrors: []
      }
    },
    computed: {
      ...mapGetters(['isLoading'])
    },
    methods: {
      ...mapActions(['login']),
      validate() {
        this.emailErrors = [];
        this.passwordErrors = [];
        
        let isValid = true;
        
        if (!this.email) {
          this.emailErrors.push('Email é obrigatório');
          isValid = false;
        }
        
        if (!this.password) {
          this.passwordErrors.push('Senha é obrigatória');
          isValid = false;
        }
        
        return isValid;
      },
      async onSubmit() {
        if (!this.validate()) return;
        
        try {
          await this.login({
            email: this.email,
            password: this.password
          });
          
          this.$router.push('/');
        } catch (error) {
          console.error('Erro no login', error);
        }
      }
    }
  }
  </script>
