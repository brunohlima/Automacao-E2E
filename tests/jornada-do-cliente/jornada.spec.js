const { test } = require('../../support/fixtures');
const { LoginPage } = require('../../pages/loginPage');
const { JornadaPage } = require('../../pages/jornadaPage');
const { CrudPage } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

let nomeConexaoCriada;

// Limpa apenas a massa desta execucao para preservar a cota de conexoes.
test.afterEach(async ({ page }) => {
  if (nomeConexaoCriada) {
    await new CrudPage(page).limparConexoesSms(nomeConexaoCriada);
  }
});

test('Nivel 4 - Jornada do cliente: conexao, contato, chamado, mensagem e fechamento', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const jornadaPage = new JornadaPage(page);

  const sufixo = gerarSufixoUnico();
  const nomeConexao = `sms jornada ${sufixo}`;
  nomeConexaoCriada = nomeConexao;
  const nomeContato = `contato ${sufixo}`;
  const mensagem = `mensagem automatizada ${sufixo}`;

  await loginPage.acessarEAutenticar();

  await jornadaPage.criarConexaoSms(nomeConexao);

  await jornadaPage.cadastrarContato(nomeContato, process.env.TEST_PHONE, nomeConexao);

  await jornadaPage.abrirChamadoDoPrimeiroContato();
  await jornadaPage.enviarMensagem(mensagem);
  await jornadaPage.fecharChamado();
});
