const { test } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage');
const { CrudPage } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

test('Nivel 3 - Conexao SMS: criar, validar, editar e arquivar', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const crudPage = new CrudPage(page);

  const sufixo = gerarSufixoUnico();
  const nomeConexao = `conexao ${sufixo}`;
  const nomeConexaoEditada = `conexao editada ${sufixo}`;

  await loginPage.acessarEAutenticar();
  await crudPage.acessarConexoes();

  // CREATE + READ
  await crudPage.criarConexaoSms(nomeConexao);
  await crudPage.validarConexaoNaListagem(nomeConexao);

  // UPDATE: o nome novo entra na listagem e o antigo sai
  await crudPage.editarConexaoSms(nomeConexaoEditada);
  await crudPage.validarConexaoNaListagem(nomeConexaoEditada);
  await crudPage.validarConexaoRemovida(nomeConexao);

  // DELETE (arquivamento)
  await crudPage.arquivarConexaoSms();
  await crudPage.validarConexaoRemovida(nomeConexaoEditada);
});
