FROM node:12-slim

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

ENTRYPOINT ["npm"]
CMD ["run", "start"]