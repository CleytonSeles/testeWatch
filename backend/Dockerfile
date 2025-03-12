FROM node:18-alpine

# Instalar dependências do Chrome/Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    python3 \
    make \
    g++

# Definir variáveis de ambiente para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Criar link simbólico se seu arquivo principal for app.js e não houver index.js
RUN if [ -f "app.js" ] && [ ! -f "index.js" ]; then ln -s app.js index.js; fi

EXPOSE 3000

CMD ["npm", "run", "dev"]
