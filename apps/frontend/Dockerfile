FROM node:20 as builder
WORKDIR /app
COPY package.json .
RUN npm install --force
COPY . .
RUN npm run build
ENTRYPOINT ["node", "./.output/server/index.mjs"]