<template>
  <div class="landing-page">
    <!-- Cabeçalho com botão de login no canto superior direito -->
    <v-app-bar flat color="transparent">
      <v-toolbar-title class="text-h4 font-weight-bold white--text">AWDIO</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="tonal"
        to="/login"
        size="large"
        rounded
      >
        Entrar
      </v-btn>
    </v-app-bar>

    <!-- Conteúdo principal da página -->
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" md="6" class="text-center">
          <h1 class="text-h2 font-weight-bold white--text mb-6">Streaming de Música</h1>
          <p class="text-h5 mb-8">Ouça suas músicas favoritas em qualquer lugar, a qualquer momento.</p>
          
          <v-row justify="center">
            <v-col cols="12" sm="6" md="5">
              <v-btn
                block
                color="primary"
                size="x-large"
                to="/register"
                height="56"
                rounded
              >
                Registre-se Grátis
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="5">
              <v-btn
                block
                variant="outlined"
                color="white"
                size="x-large"
                to="/login"
                height="56"
                rounded
              >
                Já tenho uma conta
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Rodapé da página -->
    <v-footer app color="transparent" class="text-center">
      <v-row justify="center">
        <span class="text-caption text-grey">&copy; {{ new Date().getFullYear() }} AWDIO - Todos os direitos reservados</span>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
.landing-page {
  background: linear-gradient(to bottom, #191414, #121212);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

