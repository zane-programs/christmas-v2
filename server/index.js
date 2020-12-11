const express = require("express");

// grab environment variables from .env
require("dotenv").config();

const app = express();

app.get("/", (_req, res) => res.status(200).send("Hello world!"));

const listener = app.listen(process.env.API_PORT, () =>
  console.log(`Server listening on port ${listener.address().port}`)
);
