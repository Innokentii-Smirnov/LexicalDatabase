FROM docker.io/node:18.13.0

WORKDIR /data/app
COPY ./package.json ./
RUN npm install
COPY ./data /data/data
COPY ./app ./

CMD ["/usr/local/bin/node", "/data/app/index.js"]
