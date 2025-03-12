# Music Streaming API

Uma API completa para streaming de música, disponibilizando recursos para gerenciamento de usuários, músicas, playlists e análise de tendências musicais. Implementada em arquitetura serverless utilizando AWS Lambda.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Recursos](#recursos)
- [Requisitos Técnicos](#requisitos-técnicos)
- [Configuração e Instalação](#configuração-e-instalação)
- [Execução Local](#execução-local)
- [Deploy para AWS Lambda](#deploy-para-aws-lambda)
- [Documentação da API](#documentação-da-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Estrutura do Código](#estrutura-do-código)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Licença](#licença)

## 🔍 Visão Geral

O Music Streaming API é um serviço backend que permite gerenciar músicas, criar playlists personalizadas e descobrir tendências musicais através de web scraping e RPA (Robotic Process Automation). A API foi construída em uma arquitetura serverless utilizando AWS Lambda, proporcionando escalabilidade automática e redução de custos operacionais.

## 🏗️ Arquitetura

O projeto está disponível em duas arquiteturas:

### Versão Container (Docker)

- Backend: Node.js + Express
- Banco de Dados: PostgreSQL
- Persistência: Volumes Docker
- Documentação: Swagger UI

### Versão Serverless (AWS)

- Computação: AWS Lambda
- API Gateway: Para exposição de endpoints RESTful
- Banco de Dados: Amazon RDS PostgreSQL
- Agendamento: CloudWatch Events para scraping periódico
- Monitoramento: CloudWatch Logs e Métricas

## 🚀 Recursos

- Registro e autenticação de usuários com JWT
- CRUD completo para músicas e playlists
- Compartilhamento de playlists (públicas/privadas)
- Web scraping de tendências musicais
- Geração automatizada de playlists baseadas em tendências
- Documentação interativa da API com Swagger

## 💻 Requisitos Técnicos

- Node.js 16+
- Docker e Docker Compose (para execução em contêiner)
- Conta AWS (para deploy serverless)
- AWS CLI configurado
- Serverless Framework
- PostgreSQL (para desenvolvimento local sem Docker)

## ⚙️ Configuração e Instalação

### Clonando o Repositório

```bash
git clone https://github.com/username/music-streaming-api.git
cd music-streaming-api
```

### Configurando Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Para versão Docker
cp backend/.env.example backend/.env

# Para versão Serverless
cp backend-serverless/.env.example backend-serverless/.env
```

Configure as variáveis de ambiente:

```env
# Ambiente
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost # Para Docker use: postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456 # Ajuste com uma senha segura
DBNAME=musicstreaming

# Segurança
JWTSECRET=suachavejwtsegura # Importante: use uma chave forte em produção
```

### Instalando Dependências

```bash
# Para a versão em container
cd backend
npm install

# Para a versão serverless
cd backend-serverless
npm install
```

## 🏃‍♂️ Execução Local

### Usando Docker

O método mais simples para executar o projeto localmente:

```bash
# Na raiz do projeto
docker-compose up
```

Isso iniciará:

- PostgreSQL na porta 5432
- Backend na porta 3000
- Frontend na porta 8082

### Executando Localmente sem Docker

```bash
# Na pasta backend
npm run dev
```

### Executando a versão serverless localmente

```bash
# Na pasta backend-serverless
serverless offline
```

A API estará disponível em: [http://localhost:3000](http://localhost:3000)

A documentação Swagger estará em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🚢 Deploy para AWS Lambda

### Pré-requisitos

Instalar AWS CLI e configurar credenciais

```bash
npm install -g aws-cli
aws configure
```

Instalar Serverless Framework

```bash
npm install -g serverless
```

### Preparando o Banco de Dados RDS

- Crie uma instância RDS PostgreSQL via AWS Console ou CLI
- Atualize as configurações de banco de dados no `.env` da versão serverless
- Execute o script de inicialização:

```bash
cd backend-serverless
node scripts/setup-db.js
```

### Deploy da API

```bash
cd backend-serverless
serverless deploy
```

Após o deploy bem-sucedido, você receberá uma URL de endpoint para sua API.

## 📚 Documentação da API

### Endpoints Principais

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST   | /api/users/register | Registrar novo usuário | Não |
| POST   | /api/users/login | Login e obtenção de token JWT | Não |
| GET    | /api/users/profile | Obter perfil do usuário | Sim |
| GET    | /api/songs | Listar todas as músicas | Não |
| POST   | /api/songs | Adicionar nova música | Sim |
| GET    | /api/songs/{id} | Detalhes de uma música | Não |
| GET    | /api/playlists | Listar playlists do usuário | Sim |
| POST   | /api/playlists | Criar nova playlist | Sim |
| POST   | /api/playlists/{id}/songs | Adicionar música à playlist | Sim |
| GET    | /api/trends | Obter músicas em tendência | Não |

### Autenticação

Para endpoints protegidos, inclua o token JWT no cabeçalho:

```
Authorization: Bearer seutokenaqui
```

### Documentação Swagger

Uma documentação interativa completa está disponível em:

- Versão local: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- Versão serverless: `https://seu-api-id.execute-api.us-east-1.amazonaws.com/dev/api-docs`

## 🔍 Exemplos de Uso

### Registrar um Usuário

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username": "usuario_teste", "email": "teste@exemplo.com", "password": "senha123"}'
```

### Fazer Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com", "password": "senha123"}'
```

### Criar uma Playlist (Autenticado)

```bash
curl -X POST http://localhost:3000/api/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_aqui" \
  -d '{"name": "Minhas Favoritas", "isPublic": true}'
```

### Obter Músicas em Tendência

```bash
curl -X GET http://localhost:3000/api/trends
```

## 📁 Estrutura do Código

### Versão em Container

```
backend/
├── db/init/ # Scripts de inicialização do banco
├── src/
│   ├── config/ # Configurações (banco, swagger)
│   ├── controllers/ # Lógica de controle
│   ├── middleware/ # Middlewares (auth, admin)
│   ├── models/ # Modelos de dados
│   ├── routes/ # Definição de rotas
│   └── services/ # Serviços (scraping, RPA)
├── .env # Variáveis de ambiente
├── Dockerfile # Configuração Docker
├── index.js # Ponto de entrada
└── package.json # Dependências
```

### Versão Serverless

```
backend-serverless/
├── scripts/ # Scripts utilitários
├── src/
│   ├── config/ # Configurações adaptadas para serverless
│   ├── controllers/ # Controladores
│   ├── handlers/ # Handlers Lambda
│   ├── middleware/ # Middlewares
│   ├── models/ # Modelos
│   ├── routes/ # Rotas Express
│   └── services/ # Serviços
├── .env # Variáveis de ambiente para desenvolvimento
├── serverless.yml # Configuração do Serverless Framework
└── package.json # Dependências
```

## 🛠️ Tecnologias Utilizadas

- Backend: Node.js, Express
- Banco de Dados: PostgreSQL
- Autenticação: JWT (JSON Web Tokens)
- Documentação: Swagger/OpenAPI
- Cloud: AWS Lambda, API Gateway, RDS
- Framework Serverless: Serverless Framework
- Web Scraping: Puppeteer, Cheerio
- Contêineres: Docker, Docker Compose

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.