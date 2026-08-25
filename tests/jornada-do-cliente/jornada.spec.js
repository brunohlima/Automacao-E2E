const { test } = require('../../support/fixtures');
const { LoginPage } = require('../../pages/loginPage');
const { JornadaPage } = require('../../pages/jornadaPage');
const { CrudPage } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

/**
 * A jornada tambem cria uma conexao SMS, que ocupa a cota da conta de QA.
 * Sem o teardown, uma execucao interrompida no meio bloqueia a proxima.
 */
test.afterEach(async ({ page }) => {
  await new CrudPage(page).limparConexoesSms();
});

test('Nivel 4 - Jornada do cliente: conexao, contato, chamado, mensagem e fechamento', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const jornadaPage = new JornadaPage(page);

  const sufixo = gerarSufixoUnico();
  const nomeConexao = `sms jornada ${sufixo}`;
  const nomeContato = `contato ${sufixo}`;
  const mensagem = `mensagem automatizada ${sufixo}`;

  await loginPage.acessarEAutenticar();

  // 1. Canal de atendimento
  await jornadaPage.criarConexaoSms(nomeConexao);

  // 2. Cliente que sera atendido
  await jornadaPage.cadastrarContato(nomeContato, process.env.TEST_PHONE, nomeConexao);

  // 3. Atendimento: abre, transfere, responde e encerra o chamado
  await jornadaPage.abrirChamadoDoPrimeiroContato();
  await jornadaPage.transferirChamado();
  await jornadaPage.enviarMensagem(mensagem);
  await jornadaPage.fecharChamado();
});
