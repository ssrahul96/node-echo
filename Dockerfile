FROM node:16.7-alpine3.14

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 80

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s CMD curl --fail http://localhost:80/health || exit 1

CMD [ "node", "index.js" ]