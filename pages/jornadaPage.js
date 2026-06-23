class JornadaPage {
  constructor(page) {
    this.page = page;
    
    // 1. Login
    this.inputEmail = page.getByTestId('login-input-email');
    this.inputPassword = page.getByTestId('login-input-password');
    this.btnSubmit = page.getByTestId('login-button-submit');

    // 2. Nova conexão SMS
    this.menuConnections = page.getByTestId('menu-button-connections');
    this.btnCreateService = page.getByTestId('services-list-button-create');
    this.optionSMS = page.getByText('1 disponívelSMSConfigure sua');
    this.inputSmsName = page.getByTestId('sms-form-input-name');
    this.selectDepartment = page.locator('#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0');
    this.optionSuporte = page.getByRole('option', { name: 'Suporte' });
    this.btnSubmitSms = page.getByTestId('sms-form-button-submit');
    this.orgHeading = page.getByTestId('organizations-list-heading');

    // 3. Cadastro de contato
    this.menuContacts = page.getByTestId('menu-button-contacts');
    this.contactsTitle = page.getByTestId('contacts-label-title');
    this.btnCreateContact = page.getByTestId('contacts-button-create_contact');
    this.inputContactName = page.getByTestId('contacts-input_group-name');
    this.selectGroup = page.locator('.create-contact-select > .react_select__control > .react_select__value-container');
    this.optionGroupTeste = page.locator('div').filter({ hasText: /^teste$/ }).nth(4);
    this.inputContactNumber = page.getByTestId('contacts-input_group-number');
    this.labelNomeDigisac = page.getByText('Nome no Digisac *Pessoa');
    this.btnSaveContact = page.getByTestId('contacts-button-save_contact');
    this.btnImportarContatos = page.getByText('ContatosImportar');

    // 4. Transferência do chamado no chat
    this.btnActionsFirstContact = page.getByTestId('contacts-button-actions_0').getByRole('button');
    this.btnChatFirstContact = page.getByTestId('contacts-button-chat_0');
    this.btnCloseTicket = page.getByTestId('chat-button-close_ticket');
    this.indicatorClearSelect = page.locator('.transfer-ticket-user-select > .react_select__control > .react_select__indicators > .react_select__indicator.react_select__clear-indicator > .css-19bqh2r > path');
    this.btnConfirmTransfer = page.getByTestId('confirm-transfer-ticket-button');
    this.ticketStartMessage = page.getByTestId('ticket-start-message');
    this.btnTransferTicket = page.getByTestId('chat-button-transfer_ticket');
    this.textTransferLog = page.getByText('Chamado transferido por (');
    this.paragraphRole = page.getByRole('paragraph');

    // 5. Envio de mensagem e fechamento do chamado
    this.chatInput = page.getByTestId('chat-container').getByRole('textbox');
    this.btnConfirmCloseTicket = page.getByTestId('confirm-closeTicket');
    this.ticketEndMessage = page.getByTestId('ticket-end-message');
  }

  async realizarLogin(email, password) {
    await this.page.goto(process.env.BASE_URL);
    await this.inputEmail.fill(email);
    await this.inputPassword.fill(password);
    await this.btnSubmit.click();
  }

  async criarConexaoSms(nomeSms) {
    await this.menuConnections.click();
    await this.btnCreateService.click();
    await this.optionSMS.click();
    await this.inputSmsName.fill(nomeSms);
    await this.selectDepartment.click();
    await this.optionSuporte.click();
    await this.btnSubmitSms.click();
    await this.orgHeading.click();
  }

  async cadastrarContato(nomeContato, numeroContato) {
    await this.menuContacts.click();
    await this.contactsTitle.click();
    await this.btnCreateContact.click();
    await this.inputContactName.fill(nomeContato);
    await this.selectGroup.click();
    await this.optionGroupTeste.click();
    await this.inputContactNumber.fill(numeroContato);
    await this.labelNomeDigisac.click();
    await this.btnSaveContact.click();
    await this.btnImportarContatos.click();
  }

  async transferirChamadoNoChat() {
    await this.btnActionsFirstContact.click();
    await this.btnChatFirstContact.click();
    await this.btnCloseTicket.click();
    await this.indicatorClearSelect.click();
    await this.btnConfirmTransfer.click();
    await this.ticketStartMessage.click();
    await this.btnTransferTicket.click();
    await this.btnConfirmTransfer.click();
    await this.textTransferLog.click();
    await this.paragraphRole.click();
  }

  async enviarMensagemEFecharChamado(mensagem) {
    await this.chatInput.fill(mensagem);
    await this.chatInput.press('Enter');
    await this.btnCloseTicket.click();
    await this.btnConfirmCloseTicket.click();
    await this.ticketEndMessage.click();
  }
}

module.exports = { JornadaPage };