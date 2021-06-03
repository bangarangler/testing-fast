export const REST_BASE_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? `https://nodereacttesting.nowigence.ai`
    : "http://localhost:5000";

export const REST_BASE_ENDPOINT_CADDY =
  process.env.NODE_ENV === "production"
    ? `https://nodereacttesting.nowigence.ai`
    : "http://localhost:5000";
// :"https://fastify-auth.dev";

export const URL =
  process.env.NODE_ENV === "production"
    ? "nodereacttesting.nowigence.ai"
    : "localhost:3000";

export const GQL_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? `https://nodereacttesting.nowigence.ai/graphql`
    : "http://localhost:5000/graphql";

export const GQL_SUBSCRIPTION_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? `wss://nodereacttesting.nowigence.ai/graphql`
    : "ws://localhost:5000/graphql";
