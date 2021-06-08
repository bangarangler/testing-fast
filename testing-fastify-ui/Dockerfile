FROM node:16 as builder

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

RUN rm -rf build

RUN npm run build

# EXPOSE 3000

# COPY /home/jon/Documents/web-dev/playground/testing-fast/Caddyfile /etc/Caddyfile

# CMD ["npm", "start"]
FROM caddy

# COPY /home/jon/Documents/web-dev/playground/testing-fast//Caddyfile /etc/Caddyfile
COPY --from=builder /frontend/Caddyfile /etc/Caddyfile
COPY --from=builder /frontend/build /usr/share/caddy/html
