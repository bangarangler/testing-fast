import fastifyPlugin from "fastify-plugin";

async function authorization(fastify: any, opts: any) {
  const { httpErrors, config } = fastify;

  fastify.decorateRequest("email", null);

  fastify.decorate("authorize", authorize);

  async function authorize(req: any, reply: any) {
    // console.log("running authrize decorator");
    console.log("req from authorize middlewareish", req);

    const fakeDecode = req?.cookies?.["fastify-test"];

    console.log("fakeDecode", fakeDecode);

    if (!fakeDecode) {
      console.log("nope throwing error");
      // throw httpErrors.unauthorized("Missing cookie");
      reply
        .status(401)
        .send({ message: "nope unauth do the things on the frontend" });
    }

    console.log("req.email should be showing up?");

    const email = "userstuffFrom@fakeDecoded.com";
    // decode / loolup user
    // return user info
    req.email = email;
  }
}

export default fastifyPlugin(authorization, { name: "authorization" });
