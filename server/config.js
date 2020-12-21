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
  middlewares: [
    require("cors")({
      credentials: true,
      origin: "*",
    }),
  ],
  socketIo: {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  },
  audio: {
    directory: "audio",
    intro: process.env.AUDIO_INTRO_FILENAME,
    main: process.env.AUDIO_MAIN_FILENAME,
  },
  wemoSerialNumber: process.env.WEMO_SERIAL_NUMBER,
};
