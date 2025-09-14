const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // sometimes we got cross-origin uncaught exception
    defaultCommandTimeout: 10_000,
    retries: 1,
    betterRetries: true,
    deleteVideoOnPassed: true,
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "spec, cypress-xray-junit-reporter",
      cypressXrayJunitReporterReporterOptions: {
        mochaFile: "./report/[suiteFilename].xml",
        useFullSuiteTitle: false,
        xrayMode: true,
        attachScreenshot: true,
        shortenLogMode: true,
      },
    },
    baseUrl: "http://localhost:8002",
    setupNodeEvents(on, config) {
      require("cypress-env")(on, config, __dirname);
      require("cypress-xray-junit-reporter/plugin")(on, config, {});
      return config;
    },
  },
  env: {
    ENV_LOG_MODE: "silent",
  },
});
