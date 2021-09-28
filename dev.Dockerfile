FROM node:current-alpine

WORKDIR /app

RUN yarn install

CMD ["yarn", "dev"]
