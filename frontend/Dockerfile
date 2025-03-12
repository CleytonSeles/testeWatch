FROM node:16-alpine

WORKDIR /app

# Copiar arquivos de configuração primeiro
COPY package*.json ./
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Garantir que o host esteja configurado para 0.0.0.0
ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

# Executar o servidor de desenvolvimento
CMD ["npm", "run", "serve"]


