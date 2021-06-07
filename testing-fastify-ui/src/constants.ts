export const REST_BASE_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? `https://hydra.nowigence.ai/api`
    : "http://localhost:5000/api";

export const URL =
  process.env.NODE_ENV === "production"
    ? "hydra.nowigence.ai"
    : "localhost:3000";

export const GQL_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? `https://hydra.nowigence.ai/api/graphql`
    : "http://localhost:5000/api/graphql";

export const GQL_SUBSCRIPTION_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? `wss://hydra.nowigence.ai/api/graphql`
    : "ws://localhost:5000/api/graphql";
