require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { JornadaPage } = require('../../pages/jornadaPage');

test('Login, Criar Conexão SMS, Contato e mandar mensagem no chat', async ({ page }) => {
  const jornadaPage = new JornadaPage(page);

  // 1. Login
  await jornadaPage.realizarLogin(process.env.EMAIL, process.env.PASSWORD);

  // 2. Nova conexão SMS
  await jornadaPage.criarConexaoSms('teste');

  // 3. Cadastro de contato
  await jornadaPage.cadastrarContato('teste', process.env.TEST_PHONE || '5511900000000');
  
  // 4. Transferência do chamado no chat
  await jornadaPage.transferirChamadoNoChat();

  // 5. Envio de mensagem e fechamento do chamado
  await jornadaPage.enviarMensagemEFecharChamado('teste');
});