const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const AudioPlayer = require("./core/AudioPlayer");
const WemoAdapter = require("./core/WemoAdapter");
const State = require("./core/State");

// TODO: Write JSdoc comments
class App {
  constructor(config) {
    this._config = config; // app config
    this.audioPlayer = new AudioPlayer({
      // MAY BRING THIS BACK. Experimenting with
      // holding state in the App class
      // onStatusChange: this._emitStatus.bind(this),
    }); // initialize audio player
    this.wemoAdapter = new WemoAdapter(config.wemoSerialNumber); // create adapter for Wemo switch

    this._showIsPlaying = new State(false); // whether or not the show is currently playing
    this._showIsPlaying.addChangeListener(this._emitStatus.bind(this));

    this._app = express(); // express app
    this._server = http.createServer(this._app); // create HTTP server
    this._io = socketIo(this._server, this._config.socketIo); // init Socket.io service
    this._initSocketIo();
    this._app.disable("x-powered-by"); // hide Express X-Powered-By header
  }

  // start server
  async start(port = this._config.port) {
    // if no port provided, will use
    // port from config. the param
    // port is an override.
    this._registerRoutes(); // add all routes
    // await this._initWemo();
    this._initWemo(); // initialize Wemo adapter
    // listen on provided port
    this._server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  async getStatus() {
    return {
      // isPlaying: this._showIsPlaying.currentState || this.audioPlayer.isPlaying,
      isPlaying: this._showIsPlaying.currentState,
      lightsOn: await this.wemoAdapter.getState(),
    };
  }

  /* PRIVATE METHODS */

  async _cueShow() {
    // don't run if currently playing
    const status = await this.getStatus();
    if (status.isPlaying) return;

    /* START THE SHOW */
    this._showIsPlaying.setState(true);

    // shut the lights off if necessary
    this.wemoAdapter.setState(false);

    try {
      // play "Ho, ho, ho!" track
      await this.audioPlayer.playAudio(
        "/Users/zooza310/node-christmas/hohoho.wav"
      );

      // turn on the lights
      await this.wemoAdapter.setState(true); // start wemo switch

      await this.audioPlayer.playAudio(
        "/Users/zooza310/node-christmas/mariahcarey.wav"
      );
    } catch (e) {
      // any error message will be spit out
      // here (most likely saying that audio
      // stopped early)
      console.log(e.message);
    }

    /* STOP THE SHOW */
    await this._stopShow();
  }

  async _stopShow() {
    this.audioPlayer.stop();
    await this.wemoAdapter.setState(false);
    this._showIsPlaying.setState(false);
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
    this._io.on("connection", async (socket) => {
      // emit status on client connection
      socket.emit("status", await this.getStatus());

      // listen for play/stop events
      socket.on("play", this._cueShow.bind(this));
      socket.on("stop", this._stopShow.bind(this));

      socket.on(
        "toggleLight",
        this.wemoAdapter.toggleState.bind(this.wemoAdapter)
      );
    });
  }

  _initWemo() {
    return new Promise((resolve) => {
      this.wemoAdapter.init(() => {
        this.wemoAdapter.addChangeListener(this._emitStatus.bind(this));
        resolve();
      });
    });
  }

  async _emitStatus() {
    // emit status (for when status changes)
    console.log("Status change"); // will prob remove later
    if (this._io && this._io.emit)
      this._io.emit("status", await this.getStatus());
  }
}

module.exports = App;
