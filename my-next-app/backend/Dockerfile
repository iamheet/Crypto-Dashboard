FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# .env files are excluded via .dockerignore — secrets injected at runtime
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
