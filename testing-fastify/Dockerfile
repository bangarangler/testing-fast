FROM node:16

WORKDIR /backend

COPY package.json .

RUN npm install

COPY . .

RUN rm -rf dist

RUN npm run build


RUN cp -r ./graphql/types/ ./dist/graphql/

EXPOSE 5000

CMD ["npm", "start"]
