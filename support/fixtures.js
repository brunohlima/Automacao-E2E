const base = require('@playwright/test');

/**
 * Fixture padrao dos testes.
 *
 * A plataforma embarca o AnnounceKit, um widget de novidades de terceiro que
 * abre um modal por cima da interface em momentos imprevisiveis e intercepta
 * os cliques do teste. Como ele nao faz parte de nenhum fluxo sob teste, e
 * neutralizado aqui: as requisicoes do widget sao bloqueadas e, como reforco,
 * qualquer elemento que ele injete fica sem efeito visual e sem captura de
 * ponteiro. Isso remove uma fonte de falha intermitente sem mascarar
 * comportamento da propria aplicacao.
 */
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
