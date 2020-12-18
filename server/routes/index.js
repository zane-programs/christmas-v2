const express = require("express");

module.exports = function IndexRouter(app, _io) {
  const router = express.Router();

  router.get("/", (_req, res) => res.status(200).send("Hello, World!"));

  router.get("/isPlaying", (_req, res) =>
    res.status(200).send(app.audioPlayer.isPlaying)
  );

  router.get("/internalState", (_req, res) =>
    res.status(200).send(app.audioPlayer._isPlayingInternalState.currentState)
  );

  router.get("/play", (_req, res) => {
    app.audioPlayer
      .playAudio("/Users/zooza310/node-christmas/mariahcarey.wav", true)
      .then(() => console.log("done playing audio"))
      .catch((error) => console.error(error));
    res.status(200).send("started audio");
  });

  router.get("/stop", (_req, res) => {
    app.audioPlayer.stop();
    res.status(200).send("ok");
  });

  router.get("/on", (_req, res) =>
    app.wemoAdapter
      .setState(true)
      .then(() => res.status(200).send({ status: "ok" }))
      .catch((err) =>
        res.status(500).send({ status: "error", message: err.message })
      )
  );

  router.get("/off", (_req, res) =>
    app.wemoAdapter
      .setState(false)
      .then(() => res.status(200).send({ status: "ok" }))
      .catch((err) =>
        res.status(500).send({ status: "error", message: err.message })
      )
  );

  router.get("/wemoClientReady", (_req, res) =>
    res.status(200).send(app.wemoAdapter.clientReady)
  );

  return router;
};
