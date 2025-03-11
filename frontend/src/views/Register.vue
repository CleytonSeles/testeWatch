<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Registrar</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  label="Nome de Usuário"
                  name="username"
                  prepend-icon="mdi-account"
                  v-model="username"
                  :error-messages="usernameErrors"
                  @input="usernameErrors = []"
                ></v-text-field>
  
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
  
                <v-text-field
                  label="Confirmar Senha"
                  name="confirmPassword"
                  prepend-icon="mdi-lock-check"
                  type="password"
                  v-model="confirmPassword"
                  :error-messages="confirmPasswordErrors"
                  @input="confirmPasswordErrors = []"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="onSubmit" :loading="isLoading">Registrar</v-btn>
            </v-card-actions>
            <v-card-text class="text-center">
              Já tem uma conta? 
              <v-btn text color="primary" to="/login">Faça login</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: 'RegisterView',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        usernameErrors: [],
        emailErrors: [],
        passwordErrors: [],
        confirmPasswordErrors: []
      }
    },
    computed: {
      ...mapGetters(['isLoading'])
    },
    methods: {
      ...mapActions(['register', 'login']),
      validate() {
        this.usernameErrors = [];
        this.emailErrors = [];
        this.passwordErrors = [];
        this.confirmPasswordErrors = [];
        
        let isValid = true;
        
        if (!this.username) {
          this.usernameErrors.push('Nome de usuário é obrigatório');
          isValid = false;
        }
        
        if (!this.email) {
          this.emailErrors.push('Email é obrigatório');
          isValid = false;
        }
        
        if (!this.password) {
          this.passwordErrors.push('Senha é obrigatória');
          isValid = false;
        } else if (this.password.length < 6) {
          this.passwordErrors.push('A senha deve ter pelo menos 6 caracteres');
          isValid = false;
        }
        
        if (this.password !== this.confirmPassword) {
          this.confirmPasswordErrors.push('As senhas não conferem');
          isValid = false;
        }
        
        return isValid;
      },
      async onSubmit() {
        if (!this.validate()) return;
        
        try {
          await this.register({
            username: this.username,
            email: this.email,
            password: this.password
          });
          
          // Após registro bem-sucedido, fazer login automaticamente
          await this.login({
            email: this.email,
            password: this.password
          });
          
          this.$router.push('/');
        } catch (error) {
          console.error('Erro no registro', error);
        }
      }
    }
  }
  </script>
