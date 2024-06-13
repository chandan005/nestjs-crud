FROM node:19-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
