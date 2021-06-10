import Fastify, { FastifyInstance } from "fastify";
import cookie, { FastifyCookieOptions } from "fastify-cookie";
import fastifyCors from "fastify-cors";
import csrf from "fastify-csrf";
import helmet from "fastify-helmet";
import fastifyLog from "fastify-log";
import fastifyMongodb from "fastify-mongodb";
import fs, { readFileSync } from "fs";
export const __prod_cors__ =
  process.env.NODE_ENV !== "production"
    ? {
        origin: [
          "http://localhost:3000",
          "http://localhost:5000/api",
          "http://localhost:5000/graphql",
          "ws://localhost:5000/graphql",
          "https://studio.apollographql.com",
          "http://fastify-frontend:3000",
          "http://fastify-backend:5000/api",
          "http://fastify-backend:5000/graphql",
          "ws://fastify-backend:5000/graphql",
        ],
        credentials: true,
      }
    : {
        origin: [
          "https://studio.apollographql.com",
          "https://hydra.nowigence.ai/graphql",
          "https://hydra.nowigence.ai/api",
          "wss://hydra.nowigence.ai/graphql",
        ],
        credentials: true,
      };

interface OurFastifyInstance extends FastifyInstance {
  logger?: {
    info: (arg: string) => void;
    warn: (arg: string) => void;
    error: (arg: string) => void;
  };
}

export const fastify: OurFastifyInstance = Fastify();

//@ts-ignore
// export const fastifyProd: OurFastifyInstance = Fastify({
//   //@ts-ignore
//   https: {
//     allowHTTP1: true,
//     key: readFileSync(
//       `/etc/letsencrypt/live/${process.env.SUBDOMAIN}.nowigence.ai/privkey.pem`
//     ),
//     cert: readFileSync(
//       `/etc/letsencrypt/live/${process.env.SUBDOMAIN}.nowigence.ai/cert.pem`
//     ),
//   },
// });

//! Make sure to change these for our production app
const corsConfig = __prod_cors__;
fastify.register(fastifyCors, corsConfig);
// console.log("fastifyCors", fastifyCors);
fastify.register(helmet, {});

fastify.register(cookie, {
  // secret: process.env.secret,
  // parseOptions: {},
} as FastifyCookieOptions);

fastify.register(csrf, {
  sessionPlugin: "fastify-cookie",
  // cookieOpts: { signed: true }
});

fastify.register(fastifyLog, {
  allInOne: true,
  timeFormat: "MM/dd/YY-HH:mm:ss ",
  info: "#58a6ff",
  warn: "#d9910b",
  error: "#fc7970",
});

fastify.register(fastifyMongodb, {
  forceClose: true,
  url: process.env.MONGO_STRING,
});

export const log = {
  info: (arg: string) => fastify?.logger?.info(arg),
  warn: (arg: string) => fastify?.logger?.warn(arg),
  err: (arg: string) => fastify?.logger?.error(arg),
};

export const URL =
  process.env.NODE_ENV !== "production" ? "localhost" : "hydra.nowigence.ai";
