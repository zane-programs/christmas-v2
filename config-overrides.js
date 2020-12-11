const path = require("path");

module.exports = {
  paths: function(paths, env) {
    paths.appIndexJs = path.resolve(__dirname, "client/index.tsx");
    paths.appSrc = path.resolve(__dirname, "client");
    paths.appTypeDeclarations = path.resolve(__dirname, "client/react-app-env.d.ts");
    return paths;
  },
};
