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
              <h2 class="text-h5 font-weight-bold">Login</h2>
            </div>
            <v-form @submit.prevent="onSubmit">
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
                class="mb-4"
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
                class="mb-4"
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
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center" class="mb-4">
              <span class="grey--text">Não tem uma conta?</span>
              <v-btn variant="text" color="primary" to="/register" class="ml-2">Registre-se</v-btn>
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

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: bold;
}
</style>
