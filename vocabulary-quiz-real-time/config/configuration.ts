export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_KEY,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  },
  rabbit: {
    url: process.env.RABBIT_MQ_URL,
    virtualHosts: process.env.RABBIT_MQ_VIRTUAL_HOSTS,
    username: process.env.RABBIT_MQ_USERNAME,
    password: process.env.RABBIT_MQ_PASSWORD,
  },
});