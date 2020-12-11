const express = require("express");

// TODO: Write JSdoc comments
class App {
  constructor(config) {
    this._config = config; // app config
    this._app = express(); // express app
    this._app.disable("x-powered-by"); // hide Express X-Powered-By header
  }

  // start server
  start(port = this._config.port) {
    // if no port provided, will use
    // port from config. the param
    // port is an override.
    this._registerRoutes();
    this._app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  /* PRIVATE METHODS */

  // register routes with app
  _registerRoutes() {
    for (const middleware of this._config.middlewares) {
      this._app.use(middleware); // register middleware in app
    }
    for (const route of this._config.routes) {
      this._app.use(route.path, require(route.routerPath)); // register router to route path
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
}

module.exports = App;