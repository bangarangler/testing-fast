// import { Request, Response } from "fastify";
// import {} from "fastify";

import { User } from "codeGenBE";

// export interface User {
//   id: string;
//   email: string;
//   // company: string;
//   // iat: number;
//   // exp: number;
// }
export interface ServerContext {
  // req?: Request & { session: { userId: string } };
  request?: any; // TODO: figure out how to type this fastify
  reply?: any; // TODO: figure out how to type this fastify
  db?: any;
  connection?: any;
  fastify: any;
  redis?: any;
  pubsub?: any;
  user?: User;
}
