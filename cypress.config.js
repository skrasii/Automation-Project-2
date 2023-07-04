const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1200,
  viewportHeight: 760,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://jira.ivorreic.com/project/board',
    env: {
      baseUrl: 'https://jira.ivorreic.com/',
    },
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
  },
});