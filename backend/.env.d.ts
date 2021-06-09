declare namespace NodeJS {
  interface ProcessEnv {
    DEV_PORT: string;
    HTTP_PORT: string;
    HTTPS_PORT: string;
    MONGO_STRING: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
  }
}