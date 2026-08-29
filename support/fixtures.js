const base = require('@playwright/test');

// Neutraliza o widget externo AnnounceKit, fora do escopo dos fluxos testados.
const test = base.test.extend({
  page: async ({ page }, use) => {
    await page.route(/announcekit|novidades\.ikatec\.com\.br/i, (route) => route.abort());

    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        [class*="announcekit"] {
          display: none !important;
          pointer-events: none !important;
        }
      `;
      document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
    });

    await use(page);
  },
});

module.exports = { test, expect: base.expect };
