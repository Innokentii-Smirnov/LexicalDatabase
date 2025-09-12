# Build Stage
FROM node:18-alpine AS build
WORKDIR /data
COPY ./package*.json ./
RUN npm install
COPY ./tsconfig.json ./
COPY ./src ./src
RUN npx tsc

# Production Stage
FROM node:18-alpine
WORKDIR /data/app
COPY ./package*.json ./
RUN npm install --omit=dev
COPY --from=build /data/app ./
CMD ["/usr/local/bin/node", "/data/app/index.js"]
