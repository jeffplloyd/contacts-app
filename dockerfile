FROM node:20-alpine

WORKDIR /

COPY api/package*.json ./

COPY packages/scheme ./packages/scheme

RUN npm install file:./packages/scheme

COPY ./api ./

EXPOSE 3000

CMD [ "npm", "start" ]