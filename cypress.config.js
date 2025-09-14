const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // sometimes we got cross-origin uncaught exception
    retries: 1,
    baseUrl: "http://localhost:8002",
    setupNodeEvents(on, config) {
      require("cypress-env")(on, config, __dirname);
      return config;
    },
  },
});
