FROM node:9-alpine

WORKDIR /usr/src/app

#install dependencies
COPY package.json .

RUN npm install --quiet && \
    npm cache clean --force

COPY . .

EXPOSE 3001

#CMD ["node", "src/index.js"]
CMD npm run start
