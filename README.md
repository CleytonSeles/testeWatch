# Aplicação de Streaming de Música

Uma aplicação de streaming de música desenvolvida como teste técnico, onde os usuários podem criar contas, adicionar músicas às suas playlists, categorizar e acompanhar o histórico de reprodução.

## Tecnologias Utilizadas

### Frontend
- **Vue.js** - Framework JavaScript para construção de interfaces
- **Vuetify** - Biblioteca de componentes UI baseada em Material Design
- **Vuex** - Gerenciamento de estado centralizado
- **Vue Router** - Roteamento do lado do cliente

### Backend
- **Node.js** - Ambiente de execução JavaScript do lado do servidor
- **Express** - Framework web para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens

## Funcionalidades
- Registro e autenticação de usuários
- Catálogo de músicas com pesquisa e filtragem
- Criação e gerenciamento de playlists
- Adição de músicas a playlists
- Compartilhamento de playlists (privadas/públicas)

## Requisitos
- **Node.js** (v14 ou superior)
- **PostgreSQL** (v12 ou superior)
- **npm** ou **yarn**

## Instalação e Configuração

### Backend
Clone o repositório:
```bash
git clone https://github.com/seu-usuario/music-streaming-app.git
```

Navegue até a pasta do backend:
```bash
cd music-streaming-app/backend
```

Instale as dependências:
```bash
npm install
```

Configure o ambiente:
Renomeie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário.

Certifique-se de que o PostgreSQL está instalado e rodando.

Configure o banco de dados:
```bash
node src/config/setup.js
node src/config/seed.js
```

Inicie o servidor:
```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`.

### Frontend
Navegue até a pasta do frontend:
```bash
cd ../frontend
```

Instale as dependências:
```bash
npm install
```

Inicie o servidor de desenvolvimento:
```bash
npm run serve
```

O frontend estará rodando em `http://localhost:8080`.

## Endpoints da API

### Autenticação
- `POST /api/users/register` - Registrar um novo usuário
- `POST /api/users/login` - Fazer login e obter token JWT

### Usuários
- `GET /api/users/profile` - Obter perfil do usuário atual (autenticado)

### Músicas
- `GET /api/songs` - Listar todas as músicas
- `GET /api/songs/:id` - Obter detalhes de uma música
- `GET /api/songs/genre/:genre` - Buscar músicas por gênero
- `POST /api/songs` - Adicionar nova música (requer autenticação)

### Playlists
- `GET /api/playlists` - Listar playlists do usuário (requer autenticação)
- `GET /api/playlists/:id` - Obter detalhes de uma playlist (requer autenticação)
- `POST /api/playlists` - Criar nova playlist (requer autenticação)
- `POST /api/playlists/:id/songs` - Adicionar música à playlist (requer autenticação)
- `DELETE /api/playlists/:id/songs/:songId` - Remover música da playlist (requer autenticação)