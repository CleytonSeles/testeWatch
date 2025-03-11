FROM node:16-alpine

WORKDIR /app

# Instalar dependências para compilação nativa
RUN apk add --no-cache make gcc g++ python3

COPY package*.json ./

# Instalar dependências
RUN npm install

# Se ainda houver problemas com bcrypt especificamente, tente reconstruí-lo
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
