FROM node:16 AS builder

WORKDIR /client

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

RUN npm run build

# EXPOSE 3000

# CMD ["npm", "start"]

FROM caddy
COPY --from=builder /client/build/ /client

EXPOSE 80

EXPOSE 443
