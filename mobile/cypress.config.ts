import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:19006',
    viewportWidth: 390,
    viewportHeight: 844, // viewport -> iphone-12
  },
});
