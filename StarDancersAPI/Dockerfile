FROM node:16

WORKDIR /usr/src/app/StarDancersAPI

COPY package*.json ./

RUN npm install && npm run build

CMD ["npm", "run", "start"]

EXPOSE 1337
