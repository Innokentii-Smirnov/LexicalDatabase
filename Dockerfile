FROM node:18-alpine

WORKDIR /data/app
COPY ./package*.json ./
RUN npm install --omit=dev
COPY ./app ./

CMD ["/usr/local/bin/node", "/data/app/index.js"]
