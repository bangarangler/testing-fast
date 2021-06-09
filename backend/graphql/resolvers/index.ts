import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./userResolvers";

const combinedResolvers = [userResolvers];

export const resolvers = mergeResolvers(combinedResolvers as []);
