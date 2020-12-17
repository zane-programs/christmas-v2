const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const AudioPlayer = require("./core/AudioPlayer");

// TODO: Write JSdoc comments
class App {
  constructor(config) {
    this._config = config; // app config
    this.audioPlayer = new AudioPlayer({
      onStatusChange: this._emitStatus.bind(this),
      playerOpts: {},
    }); // initialize audio player
    this._app = express(); // express app
    this._server = http.createServer(this._app);
    this._io = socketIo(this._server, this._config.socketIo); // init Socket.io service
    this._initSocketIo();
    this._app.disable("x-powered-by"); // hide Express X-Powered-By header
  }

  // start server
  start(port = this._config.port) {
    // if no port provided, will use
    // port from config. the param
    // port is an override.
    this._registerRoutes();
    this._server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    // this._initSocketIo();
  }

  getStatus() {
    return {
      isPlaying: this.audioPlayer.isPlaying,
    };
  }

  /* PRIVATE METHODS */

  _cueShow() {
    if (!this.audioPlayer.isPlaying) {
      this.audioPlayer
        .playAudio("/Users/zooza310/node-christmas/mariahcarey.wav")
        .then(() => console.log("Done playing audio"))
        .catch((err) => console.log(err.message));
    }
  }

  _stopShow() {
    this.audioPlayer.stop();
  }

  // register routes with app
  _registerRoutes() {
    for (const middleware of this._config.middlewares) {
      this._app.use(middleware); // register middleware in app
    }
    for (const route of this._config.routes) {
      this._app.use(route.path, require(route.routerPath)(this, this._io)); // register router to route path
    }
    // catch-all 404 route (I will improve this later)
    this._app.all("*", (req, res) =>
      res.status(404).send({
        status: "error",
        message: "Not Found",
        requestInfo: {
          method: req.method,
          url: req.url,
          originalUrl: req.originalUrl,
        },
      })
    );
  }

  _initSocketIo() {
    const self = this;

    this._io.on("connection", (socket) => {
      socket.emit("status", this.getStatus());

      socket.on("play", (...args) => {
        self._cueShow();
      });
      socket.on("stop", (...args) => {
        self._stopShow();
      });
    });
  }

  _emitStatus() {
    // run this on play
    if (this._io && this._io.emit) this._io.emit("status", this.getStatus());
  }
}

module.exports = App;
