import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import fastifyLog from "fastify-log";
import fastifyCors from "fastify-cors";
import helmet from "fastify-helmet";
import cookie, { FastifyCookieOptions } from "fastify-cookie";
import fastifyMongodb from "fastify-mongodb";
import csrf from "fastify-csrf";
import path from "path";
export const __prod_cors__ =
  process.env.NODE_ENV !== "production"
    ? {
        origin: [
          "http://localhost:3000",
          "http://localhost:5000/api",
          "http://localhost:5000/graphql",
          "ws://localhost:5000/graphql",
          "https://studio.apollographql.com",
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
