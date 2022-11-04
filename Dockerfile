# path: ./Dockerfile

FROM node:16-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add  build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY ./package.json ./package-lock.json ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN npm install
WORKDIR /opt/app
COPY ./ .
RUN npm run build
EXPOSE 1337

WORKDIR /srv/app

COPY ./Frontend/package*.json ./
RUN npm install -g npm-run-all --save-dev
RUN npm install -g vite --save-dev
RUN npm install

COPY ./Frontend ./

CMD ["npm", "run", "develop"]
