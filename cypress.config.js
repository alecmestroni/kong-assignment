const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:8002",
    setupNodeEvents(on, config) {
      require("cypress-env")(on, config, __dirname);
      return config;
    },
  },
});
