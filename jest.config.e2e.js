const baseConfig = require("./jest.config.js");

module.exports = {
  ...baseConfig,
  testTimeout: 120000,
  // globalSetup: "./test/common/jest.setup.e2e.js",
};
