<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="4">
        <div class="text-center mb-8">
          <h1 class="text-h2 font-weight-bold white--text">AWDIO</h1>
          <p class="text-subtitle-1 grey--text">Streaming de Música</p>
        </div>
        
        <v-card class="elevation-12" color="surface">
          <v-card-text class="pt-6">
            <div class="text-center mb-6">
              <h2 class="text-h5 font-weight-bold">Criar Conta</h2>
            </div>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                label="Nome de Usuário"
                name="username"
                prepend-inner-icon="mdi-account"
                v-model="username"
                :error-messages="usernameErrors"
                @input="usernameErrors = []"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                label="Email"
                name="email"
                prepend-inner-icon="mdi-email"
                type="email"
                v-model="email"
                :error-messages="emailErrors"
                @input="emailErrors = []"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                label="Senha"
                name="password"
                prepend-inner-icon="mdi-lock"
                type="password"
                v-model="password"
                :error-messages="passwordErrors"
                @input="passwordErrors = []"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              ></v-text-field>
              
              <v-text-field
                label="Confirmar Senha"
                name="confirmPassword"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                v-model="confirmPassword"
                :error-messages="confirmPasswordErrors"
                @input="confirmPasswordErrors = []"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              ></v-text-field>
              
              <v-btn 
                block 
                color="primary" 
                height="44" 
                class="mt-6" 
                :loading="isLoading"
                @click="onSubmit"
                size="large"
              >
                Registrar
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center" class="mb-4">
              <span class="grey--text">Já tem uma conta?</span>
              <v-btn variant="text" color="primary" to="/login" class="ml-2">Faça login</v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Manter o script existente sem alterações
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

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: bold;
}
</style>
