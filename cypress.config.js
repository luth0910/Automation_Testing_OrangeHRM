const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      return {
        baseUrl: "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
        viewportWidth: 1280,
        viewportHeight: 720,
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 30000,
        video: false,
        screenshotOnRunFailure: true,
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
      };
    },
  },
});
