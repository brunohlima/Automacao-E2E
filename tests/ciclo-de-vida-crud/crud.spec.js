const { test } = require('../../support/fixtures');
const { LoginPage } = require('../../pages/loginPage');
const { CrudPage } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

// Prefixo usado em todos os nomes de conexao deste teste (ver nomeConexao
// abaixo), para o teardown so mexer em conexoes criadas por ele.
const PREFIXO_CONEXAO = 'conexao ';

/**
 * A conta de QA tem cota de conexoes SMS. Se o teste falhar no meio do fluxo,
 * a conexao criada continua ocupando a vaga e derruba a proxima execucao, entao
 * o teardown garante que a listagem volte ao estado anterior.
 */
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
