// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

/**
 * Carrega as variaveis do arquivo .env uma unica vez, para todo o projeto.
 * Assim nenhum spec ou page precisa chamar dotenv individualmente.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',

  /**
   * Os testes criam dados reais em um ambiente de QA compartilhado
   * (departamentos, usuarios, conexoes, contatos e chamados).
   * Rodar em paralelo faz um teste enxergar o dado do outro, entao
   * a execucao e sequencial de proposito.
   */
  fullyParallel: false,
  workers: 1,

  /* Falha o build no CI caso um test.only tenha ficado no codigo. */
  forbidOnly: !!process.env.CI,

  /* Retenta apenas no CI. */
  retries: process.env.CI ? 2 : 0,

  /* Reporters: HTML para analise local e lista para acompanhar a execucao. */
  reporter: [['html', { open: 'never' }], ['list']],

  /* A jornada do nivel 4 percorre varias telas e supera o timeout padrao de 30s. */
  timeout: 90 * 1000,

  use: {
    /* Permite usar caminhos relativos em page.goto(). */
    baseURL: process.env.BASE_URL,

    /* Evidencias apenas quando algo falha, para nao inflar o report. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /**
   * O desafio roda contra um ambiente de QA compartilhado, entao os testes
   * executam apenas em Chromium para nao duplicar a massa de dados criada.
   * Firefox e WebKit podem ser reativados abaixo quando houver ambiente isolado.
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
