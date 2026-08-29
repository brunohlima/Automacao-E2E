const { test } = require('../../support/fixtures');
const { LoginPage } = require('../../pages/loginPage');
const { CrudPage } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

const PREFIXO_CONEXAO = 'conexao ';

// Preserva a cota de conexoes mesmo quando o teste falha.
test.afterEach(async ({ page }) => {
  await new CrudPage(page).limparConexoesSms(PREFIXO_CONEXAO);
});

test('Nivel 3 - Conexao SMS: criar, validar, editar e arquivar', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const crudPage = new CrudPage(page);

  const sufixo = gerarSufixoUnico();
  const nomeConexao = `conexao ${sufixo}`;
  const nomeConexaoEditada = `conexao editada ${sufixo}`;

  await loginPage.acessarEAutenticar();
  await crudPage.acessarConexoes();

  await crudPage.criarConexaoSms(nomeConexao);
  await crudPage.validarConexaoNaListagem(nomeConexao);

  await crudPage.editarConexaoSms(nomeConexaoEditada);
  await crudPage.validarConexaoNaListagem(nomeConexaoEditada);
  await crudPage.validarConexaoRemovida(nomeConexao);

  // Restaura o filtro para que o arquivamento encontre o nome editado.
  await crudPage.validarConexaoNaListagem(nomeConexaoEditada);

  await crudPage.arquivarConexaoSms();
  await crudPage.validarConexaoRemovida(nomeConexaoEditada);
});
