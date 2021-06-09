import dotenv from "dotenv-safe";
dotenv.config();
import { fastify, fastifyProd, log, URL } from "./constants";
import Fastify, { FastifyInstance } from "fastify";
import autoLoad from "fastify-autoload";
import fs from "fs";
import { join } from "path";
import http from "http";
import https from "https";
// import { Server, IncomingMessage, ServerResponse } from "http";
import { ApolloServer } from "apollo-server-fastify";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { ServerContext } from "./serverContext";
import { User } from "./codeGenBE";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

const whichFastify = process.env.TEST_SERVER === "true" ? fastifyProd : fastify;

whichFastify.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

// Route behind Authentication
whichFastify.register(autoLoad, {
  dir: join(__dirname, "routes"),
});

const redisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || "6379",
  // password: process.env.REDIS_PASSWORD,
  // tls: true,
  retryStrategy: (times: any) => {
    return Math.min(times * 50, 2000);
  },
};

const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions as any),
  subscriber: new Redis(redisOptions as any),
});
const context = async ({ request, reply, connection }: ServerContext) => {
  if (connection) {
    connection.pubsub = pubsub;
    return { connection };
  }
  // const token = req?.headers?.authorization ? req?.headers?.authorization?.split(" ")?.[1] : ""
  let user = <User>{};
  try {
    // user = <User>verify(token, process.env.JWT_SECRET_KEY!)
  } catch (err) {
    console.log("err", err);
  }
  // return { request, reply, fastify, db: fastify?.mongo?.db };
  return { request, reply, db: whichFastify?.mongo?.db, connection, pubsub };
};

const start = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context,
      playground: {
        endpoint: "/graphql",
        settings: { "request.credentials": "include" },
      },
    });

    await server.start();
    const httpServer = await whichFastify.register(
      server.createHandler({ cors: false })
    );
    // const httpsServer = await whichFastify.register(server.createHandler({cors: false, }))

    if (!httpServer) throw "No HTTP SERVER";
    server.installSubscriptionHandlers(httpServer);

    // @ts-ignore
    await httpServer.listen(process.env.HTTPS_PORT || 5000, () => {
      console.log(
        `Subscription ready at wss://${URL}:${process.env.HTTPS_PORT}${server.subscriptionsPath}`
      );
      console.log(
        `Server ready at https://${URL}:${process.env.HTTPS_PORT}${server.graphqlPath}`
      );
    });
    httpsServer.listen(process.env.PORT_HTTPS, () => {
      console.log(
        `HTTPS Subscription ready at wss://${URL}:${process.env.PORT_HTTPS}${server.subscriptionsPath}`
      );
      console.log(
        `HTTPS Server ready at http://${URL}:${process.env.PORT_HTTPS}${server.graphqlPath}`
      );
    });
  } catch (err) {
    log.err("error: " + err);
    console.log("err", err);
    process.exit(1);
  }
};
start();
