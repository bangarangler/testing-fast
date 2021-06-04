import { fastify, log, URL } from "../constants";
// Auth Routes
export default async function authRoutes(fastify: any, opts: any) {
  const db = fastify.mongo.db;
  // fastify.addHook("onRequest", fastify.authorize);

  fastify.post("/api/register", {}, async (request: any, reply: any) => {
    // console.log("request :>> ", request);
    // console.log("request.cookies :>> ", request?.cookies);
    const { email, password } = request?.body;
    if (!email || !password) {
      reply.status(400).send({ message: "you must send email and pass" });
    }

    const res = await db.collection("users").insertOne({ email });
    console.log("res :>> ", res);

    const now = new Date();
    const refreshExp = now.setDate(now.getDate() + 30);
    const fakeToken = "m2m2m2mkfikgkgkg4848484";
    reply
      .status(200)
      .setCookie("fastify-test", fakeToken, {
        path: URL,
        domain: URL,
        httpOnly: true,
        secure: true,
        expires: refreshExp,
      })
      .send(`added new user`);
    // return { message: "register route hit" };
  });

  fastify.post("/api/login", {}, async (request: any, reply: any) => {
    console.log("request :>> ", request);
    // console.log("request.cookies :>> ", request?.cookies);

    const { email, password } = request?.body;
    if (!email || !password) {
      reply.status(400).send({ message: "you must send email and pass" });
    }

    const res = await db.collection("users").findOne({ email });
    if (res) {
      console.log("res :>> ", res);
      const now = new Date();
      const refreshExp = now.setDate(now.getDate() + 30);
      const fakeToken = "m2m2m2mkfikgkgkg4848484";
      reply
        .status(200)
        .setCookie("fastify-test", fakeToken, {
          path: URL,
          domain: URL,
          httpOnly: true,
          secure: true,
          expires: refreshExp,
        })
        .send(res);
    } else {
      // if (res) {
      //   reply
      //     .status(200)
      //     .setCookie("fastify-test")
      //     .send({ message: "login route hit" });
      // } else {
      reply.status(404).clearCookie("fastify-test").send();
    }
    // return { message: "login route hit" };
  });

  fastify.post("/logout", {}, async (request: any, reply: any) => {
    // console.log("request :>> ", request);
    // console.log("request.cookies :>> ", request?.cookies);
    reply.status(200).clearCookie("fastify-test").send("Logged out");

    // return { message: "logout route hit" };
  });
  fastify.get("/show", {}, async (req: any, reply: any) => {
    if (req?.email) {
      console.log("req.email", req.email);
      reply
        .status(200)
        .send({ message: "hey you could have done something with db here" });
    } else {
      console.log("we have no req.email");
      reply.status(400).send({ message: "Nope nope def not... try again" });
    }
  });
}
