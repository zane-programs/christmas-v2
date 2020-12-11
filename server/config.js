// grab environment variables from .env
require("dotenv").config();

module.exports = {
  port: process.env.API_PORT,
  routes: [
    {
      path: "/",
      routerPath: "./routes", // index.js is inferred
    },
  ],
  // this will hold any middleware I add later
  middlewares: [],
};
