const { test } = require('../../support/fixtures');
const { LoginPage } = require('../../pages/loginPage');
const { JornadaPage } = require('../../pages/jornadaPage');
const { CrudPage } = require('../../pages/crudPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

// Prefixo usado no nome da conexao deste teste (ver nomeConexao abaixo),
// para o teardown so mexer em conexoes criadas por ele.
const PREFIXO_CONEXAO = 'sms jornada ';

/**
 * A jornada tambem cria uma conexao SMS, que ocupa a cota da conta de QA.
 * Sem o teardown, uma execucao interrompida no meio bloqueia a proxima.
 */
test.afterEach(async ({ page }) => {
  await new CrudPage(page).limparConexoesSms(PREFIXO_CONEXAO);
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

  // 3. Atendimento: abre o chamado (a transferencia para o departamento
  // acontece dentro deste passo, ver abrirChamadoDoPrimeiroContato), envia
  // a mensagem e encerra o chamado.
  await jornadaPage.abrirChamadoDoPrimeiroContato();
  await jornadaPage.enviarMensagem(mensagem);
  await jornadaPage.fecharChamado();
});
