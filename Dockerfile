FROM node:16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install pm2 -g

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .


RUN npm run buildApp
RUN npm run buildSite



EXPOSE 4573

CMD pm2-runtime ecosystem.config.js