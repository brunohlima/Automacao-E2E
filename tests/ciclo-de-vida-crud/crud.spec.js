require('dotenv').config(); // Carrega o .env
const { test } = require('@playwright/test');
const { CrudPage } = require('../../pages/crudPage'); // Importa a crudPage com o nome correto

test('Fluxo de Conexão SMS - Criar, Editar e Arquivar', async ({ page }) => {
  const crudPage = new CrudPage(page); // Instancia a CrudPage

  // Geradores Dinâmicos de nomes únicos
  const numeroAleatorio = Math.floor(Math.random() * 99) + 1;
  const nomeConexaoCriar = `teste ${numeroAleatorio}`;
  const nomeConexaoEditar = `teste editado ${numeroAleatorio}`;

  // Passo 1: Login via .env
  await page.goto(process.env.BASE_URL);
  await page.getByTestId('login-input-email').fill(process.env.EMAIL);
  await page.getByTestId('login-input-password').fill(process.env.PASSWORD);
  await page.getByTestId('login-button-submit').click();

  // Passo 2: Criar Conexão
  await crudPage.criarConexaoSms(nomeConexaoCriar);

  // Passo 3: Editar Conexão
  await crudPage.editarConexaoSms(nomeConexaoEditar);

  // Passo 4: Arquivar Conexão
  await crudPage.arquivarConexaoSms();
});