const baseConfig = require("./jest.config.js");

module.exports = {
  ...baseConfig,
  testTimeout: 120000,
  globalSetup: "./test/jest.setup.e2e.js",
};
