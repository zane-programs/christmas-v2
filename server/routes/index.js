const express = require("express");

module.exports = function IndexRouter(io) {
  const router = express.Router();

  router.get("/", (_req, res) => res.status(200).send("Hello, World!"));

  return router;
};
