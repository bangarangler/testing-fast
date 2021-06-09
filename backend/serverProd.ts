import dotenv from "dotenv-safe";
dotenv.config();
import { fastify, log, URL } from "./constants";
import autoLoad from "fastify-autoload";
// import { fileURLToPath } from "url";
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
import path from "path";

fastify.register(autoLoad, {
  dir: join(__dirname, "plugins"),
  // dirNameRoutePrefix: false,
});
// Route behind Authentication
fastify.register(autoLoad, {
  dir: join(__dirname, "routes"),
  // dirNameRoutePrefix: true,
  // prefix: "/api",
});

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/", // optional: default '/'
});

fastify.get("/*", function (req, reply) {
  // @ts-ignore
  return reply.sendFile("index.html");
});

// const context = async (args: any) => {
//   console.log("args", args);
//   return args;
// };
// console.log("top level fastifyf", fastify);

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
const context = async ({
  request,
  reply,
  connection,
}: // fastify /*redis*/,
ServerContext) => {
  // const db = fastify.mongo.db;
  // console.log("fastify", fastify);
  console.log("connection", connection);
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
  return { request, reply, db: fastify?.mongo?.db, connection, pubsub };
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
    // await server.applyMiddleware({app, cors: false})
    // ======== new ======= //
    await server.start();
    const httpServer = await fastify.register(
      server.createHandler({ cors: false })
    );
    // const httpsServer = await fastify.register(
    //   server.createHandler({ cors: false })
    //   );
    // ======== old ======= //
    // const httpServer = await fastify.register(
    //   server.createHandler({ cors: false })
    // );
    // ======== end ======= //
    if (!httpServer) throw "No HTTP SERVER";
    server.installSubscriptionHandlers(httpServer);
    // await fastify.listen(process.env.PORT || 5000);
    // @ts-ignore
    await httpServer.listen(process.env.HTTP_PORT || 5000, () => {
      console.log(
        `Subscription ready at wss://${URL}:${process.env.HTTPS_PORT}${server.subscriptionsPath}`
      );
      console.log(
        `Server ready at https://${URL}:${process.env.HTTPS_PORT}${server.graphqlPath}`
      );
    });
    // await httpsServer.listen(process.env.HTTPS_PORT || 5000, () => {
    //   console.log(
    //     `Subscription ready at ws://${URL}:${process.env.HTTPS_PORT}${server.subscriptionsPath}`
    //   );
    //   console.log(
    //     `Server ready at http://${URL}:${process.env.HTTPS_PORT}${server.graphqlPath}`
    //   );
    // });

    const address = fastify.server.address();
    const port = typeof address === "string" ? address : address?.port;
    log.info(`Server started on port ${process.env.PORT}`);
    // log.warn("Warning");
    // log.err("ERROR!!");
    // throw "Error";
  } catch (err) {
    // server.log.error(err);
    log.err("error: " + err);
    console.log("err", err);
    process.exit(1);
  }
};
start();

// TODO ITEMS:
// [X] - Plugins (cors, helmet, cookie parser, ioredis, )
// [X] - Routes
// [X] - Figure out how to deal with mongo connection
// [x] - Fastify-csrf plugin
// [x] - Auth / Cookies
// [x] - Fastify with Apollog server
// [x] - Subscriptions
// [] - Figure out static file serving (Nginx, Caddy, traffic or serve static files with Fastify)
