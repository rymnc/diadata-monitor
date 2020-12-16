FROM node:12-slim

ARG emailPassword

ENV emailPassword=${emailPassword}

WORKDIR /app

COPY ./package*.json ./

RUN yarn install

COPY . .

ENTRYPOINT ["npm"]
CMD ["run", "start"]