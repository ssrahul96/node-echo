FROM node:16.7-alpine3.14

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 80

CMD [ "node", "index.js" ]