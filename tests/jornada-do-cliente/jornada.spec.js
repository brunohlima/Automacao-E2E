const { test } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage');
const { JornadaPage } = require('../../pages/jornadaPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

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
  await jornadaPage.cadastrarContato(nomeContato, process.env.TEST_PHONE, 'teste');

  // 3. Atendimento: abre, transfere, responde e encerra o chamado
  await jornadaPage.abrirChamadoDoPrimeiroContato();
  await jornadaPage.transferirChamado();
  await jornadaPage.enviarMensagem(mensagem);
  await jornadaPage.fecharChamado();
});
