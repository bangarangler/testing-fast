FROM node:16

WORKDIR /backend

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
