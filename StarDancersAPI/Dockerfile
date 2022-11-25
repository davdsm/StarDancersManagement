FROM node:16

WORKDIR /usr/src/app/StarDancersAPI

COPY package*.json ./

RUN npm install && npm run build

EXPOSE 1337
