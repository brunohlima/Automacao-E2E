const { expect } = require('@playwright/test');

/**
 * Nivel 4 - Jornada do cliente ponta a ponta:
 * conexao SMS, cadastro de contato, abertura, transferencia,
 * mensagem e fechamento do chamado.
 */
class JornadaPage {
  constructor(page) {
    this.page = page;

    // Conexao SMS
    this.menuConnections = page.getByTestId('menu-button-connections');
    this.btnCreateService = page.getByTestId('services-list-button-create');
    this.cardSms = page.getByTestId('services-create-card-sms');
    this.inputSmsName = page.getByTestId('sms-form-input-name');
    // TODO: o dropdown de Departamento ainda nao expoe data-testid na aplicacao.
    this.selectDepartment = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    this.optionSuporte = page.getByRole('option', { name: 'Suporte' });
    this.btnSubmitSms = page.getByTestId('sms-form-button-submit');

    // Cadastro de contato
    this.menuContacts = page.getByTestId('menu-button-contacts');
    this.contactsTitle = page.getByTestId('contacts-label-title');
    this.btnCreateContact = page.getByTestId('contacts-button-create_contact');
    this.inputContactName = page.getByTestId('contacts-input_group-name');
    // TODO: o select de Grupo (react-select) ainda nao expoe data-testid na aplicacao.
    this.selectGroup = page.locator('.create-contact-select > .react_select__control > .react_select__value-container');
    this.inputContactNumber = page.getByTestId('contacts-input_group-number');
    this.labelNomeNoDigisac = page.getByText('Nome no Digisac *Pessoa');
    this.btnSaveContact = page.getByTestId('contacts-button-save_contact');

    // Chamado no chat
    this.btnActionsFirstContact = page.getByTestId('contacts-button-actions_0').getByRole('button');
    this.btnChatFirstContact = page.getByTestId('contacts-button-chat_0');
    this.btnCloseTicket = page.getByTestId('chat-button-close_ticket');
    this.btnTransferTicket = page.getByTestId('chat-button-transfer_ticket');
    this.indicatorClearSelect = page.locator(
      '.transfer-ticket-user-select > .react_select__control > .react_select__indicators > .react_select__clear-indicator'
    );
    this.btnConfirmTransfer = page.getByTestId('confirm-transfer-ticket-button');
    this.ticketStartMessage = page.getByTestId('ticket-start-message');
    this.textTransferLog = page.getByText('Chamado transferido por (');

    // Mensagem e fechamento
    this.chatInput = page.getByTestId('chat-container').getByRole('textbox');
    this.btnConfirmCloseTicket = page.getByTestId('confirm-closeTicket');
    this.ticketEndMessage = page.getByTestId('ticket-end-message');
  }

  async criarConexaoSms(nomeSms) {
    await this.menuConnections.click();
    await expect(this.btnCreateService).toBeVisible();

    await this.btnCreateService.click();
    await this.cardSms.click();
    await this.inputSmsName.fill(nomeSms);
    await this.selectDepartment.click();
    await this.optionSuporte.click();
    await this.btnSubmitSms.click();

    // O formulario fecha e a conexao passa a existir na listagem
    await expect(this.inputSmsName).toBeHidden();
    await expect(this.page.getByText(nomeSms, { exact: true })).toBeVisible();
  }

  async cadastrarContato(nomeContato, numeroContato, nomeGrupo) {
    await this.menuContacts.click();
    await expect(this.contactsTitle).toBeVisible();

    await this.btnCreateContact.click();
    await this.inputContactName.fill(nomeContato);

    await this.selectGroup.click();
    // TODO: sem data-testid nas opcoes do grupo, a selecao depende da posicao na lista.
    await this.page.locator('div').filter({ hasText: new RegExp(`^${nomeGrupo}$`) }).nth(4).click();

    await this.inputContactNumber.fill(numeroContato);
    // Clique no rotulo fecha o dropdown aberto antes de salvar
    await this.labelNomeNoDigisac.click();
    await this.btnSaveContact.click();

    // O contato precisa aparecer na listagem antes de abrirmos o chamado
    await expect(this.page.getByText(nomeContato, { exact: true }).first()).toBeVisible();
  }

  async abrirChamadoDoPrimeiroContato() {
    await this.btnActionsFirstContact.click();
    await this.btnChatFirstContact.click();
    await expect(this.ticketStartMessage).toBeVisible();
  }

  /** Transfere o chamado e valida o registro da transferencia no historico. */
  async transferirChamado() {
    await this.btnTransferTicket.click();
    await this.indicatorClearSelect.click();
    await this.btnConfirmTransfer.click();

    await expect(this.textTransferLog).toBeVisible();
  }

  async enviarMensagem(mensagem) {
    await this.chatInput.fill(mensagem);
    await this.chatInput.press('Enter');

    await expect(this.page.getByText(mensagem, { exact: true }).last()).toBeVisible();
  }

  async fecharChamado() {
    await this.btnCloseTicket.click();
    await this.btnConfirmCloseTicket.click();

    await expect(this.ticketEndMessage).toBeVisible();
  }
}

module.exports = { JornadaPage };
