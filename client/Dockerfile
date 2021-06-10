FROM node:16

WORKDIR /client

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

# RUN npm run build

EXPOSE 3000

ENV REACT_APP_BASE_URL=http://localhost:5000/api

CMD ["npm", "start"]
