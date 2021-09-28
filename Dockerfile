FROM node:current-alpine

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install

COPY . .
RUN npm i -g pm2

CMD ["pm2-runtime", "src/index.js", "--name $BOT_NAME"]
