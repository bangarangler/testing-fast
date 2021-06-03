import { ServerContext } from "serverContext";
import { QueryResolvers, SubscriptionResolvers, User } from "../../codeGenBE";

interface UserResolvers {
  Query: QueryResolvers;
  Subscription: SubscriptionResolvers;
}
const HEY = "HEY";
export const userResolvers: UserResolvers = {
  Query: {
    getUser: async (
      _: any,
      { email },
      { db, pubsub }: ServerContext,
      ____: any
    ): Promise<User> => {
      try {
        console.log("hitting getUser route...");
        if (!email) throw "no email provided";
        // const { db } = fastify.mongo.db;
        // console.log("db", db);
        // console.log("fastify", fastify);
        const user = await db.collection("users").findOne({ email });
        // console.log("user", user);
        // return { id: "mongoId", email: "yo@yo.com" };
        pubsub.publish(HEY, {
          sayHey: "HELLO!!!!",
        });
        return { id: user._id, email: user.email };
      } catch (err) {
        console.log("err", err);
        throw new Error(`${err}`);
      }
    },
  },
  Subscription: {
    sayHey: {
      subscribe: (_: any, __: any, { connection }: any) => {
        console.log("connection from subscribe", connection);
        console.log("connection.context", connection.context);
        return connection.pubsub.asyncIterator(HEY);
      },
    },
  },
};
