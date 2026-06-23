require('dotenv').config();
const { test, expect } = require('@playwright/test');

test('Login, Criar Conexão SMS, Contato e mandar mensagem no chat', async ({ page }) => {
  
  // 1. Login
  await page.goto(process.env.BASE_URL);
  await page.getByTestId('login-input-email').fill(process.env.EMAIL);
  await page.getByTestId('login-input-password').fill(process.env.PASSWORD);
  await page.getByTestId('login-button-submit').click();

  // 2. Nova conexão SMS
  await page.getByTestId('menu-button-connections').click();
  await page.getByTestId('services-list-button-create').click();
  await page.getByText('1 disponívelSMSConfigure sua').click();
  await page.getByTestId('sms-form-input-name').fill('teste');
  
  // Seleção de departamento
  await page.locator('#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0').click();
  await page.getByRole('option', { name: 'Suporte' }).click();
  await page.getByTestId('sms-form-button-submit').click();
  await page.getByTestId('organizations-list-heading').click();

  // 3. Cadastro de contato
  await page.getByTestId('menu-button-contacts').click();
  await page.getByTestId('contacts-label-title').click();
  await page.getByTestId('contacts-button-create_contact').click();
  await page.getByTestId('contacts-input_group-name').fill('teste');
  
  // Dropdown do grupo do contato
  await page.locator('.create-contact-select > .react_select__control > .react_select__value-container').click();
  await page.locator('div').filter({ hasText: /^teste$/ }).nth(4).click();
  
  await page.getByTestId('contacts-input_group-number').fill('5511900000000');
  await page.getByText('Nome no Digisac *Pessoa').click();
  await page.getByTestId('contacts-button-save_contact').click();
  await page.getByText('ContatosImportar').click();

  // 4. Transferência do chamado no chat
  await page.getByTestId('contacts-button-actions_0').getByRole('button').click();
  await page.getByTestId('contacts-button-chat_0').click();
  await page.getByTestId('chat-button-close_ticket').click();
  await page.locator('.transfer-ticket-user-select > .react_select__control > .react_select__indicators > .react_select__indicator.react_select__clear-indicator > .css-19bqh2r > path').click();
  await page.getByTestId('confirm-transfer-ticket-button').click();
  await page.getByTestId('ticket-start-message').click();
  await page.getByTestId('chat-button-transfer_ticket').click();
  await page.getByTestId('confirm-transfer-ticket-button').click();
  await page.getByText('Chamado transferido por (').click();
  await page.getByRole('paragraph').click();

  // 5. Envio de mensagem e fechamento do chamado
  const chatInput = page.getByTestId('chat-container').getByRole('textbox');
  await chatInput.fill('teste');
  await chatInput.press('Enter');

  await page.getByTestId('chat-button-close_ticket').click();
  await page.getByTestId('confirm-closeTicket').click();
  await page.getByTestId('ticket-end-message').click();
});