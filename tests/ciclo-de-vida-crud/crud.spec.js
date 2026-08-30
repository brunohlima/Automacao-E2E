const { test } = require('../../support/fixtures');
const { PaginaLogin } = require('../../pages/loginPage');
const { PaginaCrud } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

const PREFIXO_CONEXAO = 'conexao ';

// Preserva a cota de conexoes mesmo quando o teste falha.
test.afterEach(async ({ page }) => {
  await new PaginaCrud(page).limparConexoesSms(PREFIXO_CONEXAO);
});

test('Nivel 3 - Conexao SMS: criar, validar, editar e arquivar', async ({ page }) => {
  const paginaLogin = new PaginaLogin(page);
  const paginaCrud = new PaginaCrud(page);

  const sufixo = gerarSufixoUnico();
  const nomeConexao = `conexao ${sufixo}`;
  const nomeConexaoEditada = `conexao editada ${sufixo}`;

  await paginaLogin.acessarEAutenticar();
  await paginaCrud.acessarConexoes();

  await paginaCrud.criarConexaoSms(nomeConexao);
  await paginaCrud.validarConexaoNaListagem(nomeConexao);

  await paginaCrud.editarConexaoSms(nomeConexaoEditada);
  await paginaCrud.validarConexaoNaListagem(nomeConexaoEditada);
  await paginaCrud.validarConexaoRemovida(nomeConexao);

  // Restaura o filtro para que o arquivamento encontre o nome editado.
  await paginaCrud.validarConexaoNaListagem(nomeConexaoEditada);

  await paginaCrud.arquivarConexaoSms();
  await paginaCrud.validarConexaoRemovida(nomeConexaoEditada);
});
