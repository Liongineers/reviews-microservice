FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "node", "dist/main.js" ]