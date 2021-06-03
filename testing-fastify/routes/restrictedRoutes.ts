import { fastify, log } from "../constants";
// Auth Routes
export default async function restrictedRoutes(fastify: any, opts: any) {
  const db = fastify.mongo.db;
  fastify.addHook("onRequest", fastify.authorize);

  fastify.get("/restricted", {}, async (request: any, reply: any) => {
    return { message: "restricted route hit" };
  });

  fastify.get("/ping", {}, async (request: any, reply: any) => {
    return { pong: "PONG!" };
  });
}
