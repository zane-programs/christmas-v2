const path = require("path");

module.exports = {
  paths: function (paths, _env) {
    paths.appIndexJs = path.resolve(__dirname, "client/index.tsx");
    paths.appSrc = path.resolve(__dirname, "client");
    paths.appTypeDeclarations = path.resolve(
      __dirname,
      "client/react-app-env.d.ts"
    );
    paths.testsSetup = path.resolve(__dirname, "client/setupTests");
    // paths.proxySetup = path.resolve(__dirname, "client/setupProxy.ts");
    // paths.swSrc = path.resolve(__dirname, "client/service-worker");

    return paths;
  },
};
