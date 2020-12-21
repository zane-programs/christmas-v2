// grab environment variables from .env
require("dotenv").config();

module.exports = {
  port: process.env.API_PORT, // API port
  // Express route config
  routes: [
    {
      path: "/",
      routerPath: "./routes", // index.js is inferred
    },
  ],
  // Express/Connect middleware
  middlewares: [
    require("cors")({
      credentials: true,
      origin: "*",
    }),
  ],
  // Socket.io config
  socketIo: {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  },
  // Audio show config
  audio: {
    directory: "audio",
    intro: process.env.AUDIO_INTRO_FILENAME,
    main: process.env.AUDIO_MAIN_FILENAME,
  },
  // Wemo config
  wemoSerialNumber: process.env.WEMO_SERIAL_NUMBER,
};
