FROM node:16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install pm2 -g

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm run buildApp
RUN npm run buildSite

COPY . .

RUN git config --global credential.helper store && npm run git-pull

EXPOSE 4573

CMD pm2-runtime ecosystem.config.js