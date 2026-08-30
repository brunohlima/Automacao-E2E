const { test } = require('../../support/fixtures');
const { PaginaLogin } = require('../../pages/loginPage');
const { PaginaJornada } = require('../../pages/jornadaPage');
const { PaginaCrud } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

let nomeConexaoCriada;

// Limpa apenas a massa desta execucao para preservar a cota de conexoes.
test.afterEach(async ({ page }) => {
  if (nomeConexaoCriada) {
    await new PaginaCrud(page).limparConexoesSms(nomeConexaoCriada);
  }
});

test('Nivel 4 - Jornada do cliente: conexao, contato, chamado, mensagem e fechamento', async ({ page }) => {
  const paginaLogin = new PaginaLogin(page);
  const paginaJornada = new PaginaJornada(page);

  const sufixo = gerarSufixoUnico();
  const nomeConexao = `sms jornada ${sufixo}`;
  nomeConexaoCriada = nomeConexao;
  const nomeContato = `contato ${sufixo}`;
  const mensagem = `mensagem automatizada ${sufixo}`;

  await paginaLogin.acessarEAutenticar();

  await paginaJornada.criarConexaoSms(nomeConexao);

  await paginaJornada.cadastrarContato(nomeContato, process.env.TEST_PHONE, nomeConexao);

  await paginaJornada.abrirChamadoDoPrimeiroContato();
  await paginaJornada.enviarMensagem(mensagem);
  await paginaJornada.fecharChamado();
});
