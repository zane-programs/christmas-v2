const App = require("./App"); // express wrapper

// create server from config
const server = new App(require("./config"));

// start server
server.start();