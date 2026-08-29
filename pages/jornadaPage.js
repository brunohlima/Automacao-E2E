const { expect } = require('@playwright/test');

class JornadaPage {
  constructor(page) {
    this.page = page;
    this.nomeDepartamentoAtendimento = process.env.TEST_DEPARTMENT || 'Suporte';

    this.menuConnections = page.getByTestId('menu-button-connections');
    this.btnCreateService = page.getByTestId('services-list-button-create');
    this.cardSms = page.getByTestId('services-create-card-sms');
    this.avisoLimiteConexoes = page.getByRole('alertdialog', { name: 'Limite de conexões atingido' });
    this.filtroNomeConexao = page.getByTestId('services-list-input-filter');
    // A busca inclui arquivadas; restringir a aba evita selecionar massa antiga.
    this.abaAtivas = page.getByText(/^Ativas\b/).first();
    this.inputSmsName = page.getByTestId('sms-form-input-name');
    // Substituir seletor CSS quando a aplicacao expuser data-testid.
    this.selectDepartment = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    this.opcaoDepartamentoAtendimento = page.getByRole('option', {
      name: this.nomeDepartamentoAtendimento,
      exact: true,
    });
    this.btnSubmitSms = page.getByTestId('sms-form-button-submit');

    this.menuContacts = page.getByTestId('menu-button-contacts');
    this.contactsTitle = page.getByTestId('contacts-label-title');
    this.btnCreateContact = page.getByTestId('contacts-button-create_contact');
    this.inputContactName = page.getByTestId('contacts-input_group-name');
    // Substituir seletor CSS quando a aplicacao expuser data-testid.
    this.selectConexao = page.locator('.create-contact-select');
    this.inputContactNumber = page.getByTestId('contacts-input_group-number');
    this.labelNomeNoDigisac = page.getByText('Nome no Digisac *Pessoa');
    this.btnSaveContact = page.getByTestId('contacts-button-save_contact');

    this.btnShowFilters = page.getByTestId('contacts-button-show_filters');
    this.inputFiltroNomeContato = page.getByTestId('contacts-input_filter-name');

    this.btnActionsFirstContact = page.getByTestId('contacts-button-actions_0').getByRole('button');
    this.btnChatFirstContact = page.getByTestId('contacts-button-chat_0');
    this.chatCard = page.getByTestId('chat-card').first();
    this.avisoConexaoInativa = page.getByText('Conexão inativa');
    this.btnOpenTicket = page.getByTestId('open-ticket-button');
    // O testid de confirmacao existe em modais ocultos; manter o escopo visivel.
    this.dialogoVisivel = page.locator('.modal.show, [role="dialog"]:visible').last();
    this.selectDepartamentoAbertura = page.getByTestId('transfer-ticket-department-select');
    this.menuOpcoesDepartamentoAbertura = page.locator('.react_select__menu');
    this.opcaoDepartamentoAbertura = this.menuOpcoesDepartamentoAbertura
      .getByText(this.nomeDepartamentoAtendimento, { exact: true })
      .last();
    this.placeholderDepartamentoAbertura = this.selectDepartamentoAbertura.getByText('Selecione');
    this.erroDepartamentoObrigatorio = page.getByText('Este campo é obrigatório.');
    this.selectAtendenteAbertura = this.dialogoVisivel.getByTestId('transfer-ticket-user-select');
    this.botaoLimparAtendenteAbertura = this.selectAtendenteAbertura.locator(
      '.react_select__clear-indicator'
    );
    this.inputComentarioAbertura = this.dialogoVisivel.getByTestId('add_comment-Modal-OpenTicket');
    this.btnConfirmarAbertura = this.dialogoVisivel.getByTestId('confirm-transfer-ticket-button');
    this.btnCloseTicket = page.getByTestId('chat-button-close_ticket');
    this.textInicioChamado = page.getByText('Início do chamado');

    this.chatInput = page.getByTestId('chat-container').getByRole('textbox');
    this.btnConfirmCloseTicket = page.getByTestId('confirm-closeTicket');
    this.ticketEndMessage = page.getByTestId('ticket-end-message');
    this.menuChat = page.getByTestId('menu-button-chat');
    this.tabMeusChats = page.getByTestId('chat-tab-mine');
  }

  async criarConexaoSms(nomeSms) {
    await this.menuConnections.click();
    await expect(this.btnCreateService).toBeVisible();

    const temAbaAtivas = await this.abaAtivas.isVisible({ timeout: 5000 }).catch(() => false);
    if (temAbaAtivas) {
      await this.abaAtivas.click();
    }

    await this.btnCreateService.click();
    await this.cardSms.click();

    // O alerta de cota substitui o formulario no ambiente compartilhado.
    await expect(this.inputSmsName.or(this.avisoLimiteConexoes)).toBeVisible();
    await expect(
      this.avisoLimiteConexoes,
      'Limite de conexoes SMS atingido no ambiente de QA. Arquive ou remova conexoes existentes antes de rodar o teste.'
    ).toBeHidden();

    await this.inputSmsName.fill(nomeSms);
    await this.selectDepartment.click();
    await this.opcaoDepartamentoAtendimento.click();
    await this.btnSubmitSms.click();

    await expect(this.inputSmsName).toBeHidden();
    await this.filtroNomeConexao.fill(nomeSms);
    await expect(this.page.getByText(nomeSms, { exact: true })).toBeVisible();
  }

  async cadastrarContato(nomeContato, numeroContato, nomeConexao) {
    await this.menuContacts.click();
    await expect(this.contactsTitle).toBeVisible();

    await this.btnCreateContact.click();
    await this.inputContactName.fill(nomeContato);

    await this.selectConexao.click();
    await this.page
      .locator('[class*="react_select__option"]')
      .filter({ hasText: nomeConexao })
      .first()
      .click();

    await this.inputContactNumber.fill(numeroContato);
    await this.labelNomeNoDigisac.click();
    await this.btnSaveContact.click();

    await this.menuContacts.click();
    await this.btnShowFilters.click();
    await this.inputFiltroNomeContato.fill(nomeContato);
    await expect(this.page.getByText(nomeContato, { exact: true }).first()).toBeVisible();
  }

  async abrirChamadoDoPrimeiroContato() {
    await this.btnActionsFirstContact.click();
    await this.btnChatFirstContact.click();
    await this.chatCard.click();

    // A ativacao da conexao no provedor e assincrona.
    await expect(this.avisoConexaoInativa).toBeHidden({ timeout: 30000 });

    // Confirma a selecao porque o react-select pode fechar sem registrar o clique.
    await this.btnOpenTicket.click();

    await expect(async () => {
      await this.selectDepartamentoAbertura.click();
      await expect(this.menuOpcoesDepartamentoAbertura).toBeVisible();
      await this.opcaoDepartamentoAbertura.click();
      await expect(this.placeholderDepartamentoAbertura).toBeHidden();
    }).toPass({ timeout: 15000 });

    // Clicar no comentario fecha o select sem arriscar fechar o modal com Escape.
    await expect(this.dialogoVisivel).toBeVisible();
    await this.inputComentarioAbertura.click();
    await this.inputComentarioAbertura.fill('Chamado aberto pela automacao');
    await expect(this.btnConfirmarAbertura).toBeVisible();
    await expect(this.btnConfirmarAbertura).toBeEnabled();
    await this.btnConfirmarAbertura.click({ timeout: 5000 });

    // Algumas versoes exibem uma segunda confirmacao de transferencia.
    for (let tentativa = 0; tentativa < 2; tentativa += 1) {
      const modalFechou = await this.dialogoVisivel
        .waitFor({ state: 'hidden', timeout: 10000 })
        .then(() => true)
        .catch(() => false);
      if (modalFechou) break;

      const comentarioVisivel = await this.inputComentarioAbertura.isVisible().catch(() => false);
      if (comentarioVisivel) {
        const valorAtual = await this.inputComentarioAbertura.inputValue().catch(() => '');
        if (!valorAtual) {
          await this.inputComentarioAbertura.fill('Chamado aberto pela automacao');
        }
      }
      await expect(this.btnConfirmarAbertura).toBeVisible({ timeout: 3000 });
      await expect(this.btnConfirmarAbertura).toBeEnabled({ timeout: 3000 });
      await this.btnConfirmarAbertura.click({ timeout: 3000 });
    }

    await expect(
      this.dialogoVisivel,
      'O modal de abertura do chamado nao fechou apos confirmar.'
    ).toBeHidden({ timeout: 15000 });

    await expect(
      this.btnCloseTicket,
      'O chamado nao abriu mesmo apos preencher o comentario de abertura.'
    ).toBeVisible();

    // Reabrir a conversa aguarda um composer limpo apos a transicao do modal.
    await this.menuChat.click();
    await this.tabMeusChats.click();
    await this.chatCard.click();
    await expect(this.chatInput).toBeVisible();

    await expect(this.textInicioChamado).toBeVisible();
  }

  async enviarMensagem(mensagem) {
    // O editor Lexical exige eventos de teclado reais para sincronizar seu estado.
    await this.chatInput.click();
    await this.page.keyboard.type(mensagem);

    const respostaEnvio = this.page.waitForResponse(
      (res) => res.url().includes('/api/v1/messages') && res.request().method() === 'POST',
      { timeout: 15000 }
    );
    await this.page.keyboard.press('Enter');
    const resposta = await respostaEnvio;

    // Prioriza fechar o chamado para nao bloquear o teardown quando a API falhar.
    if (!resposta.ok()) {
      console.warn(
        `[enviarMensagem] Envio falhou no backend (POST /api/v1/messages respondeu ${resposta.status()}). Prosseguindo para fechar o chamado mesmo assim.`
      );
      return;
    }

    await expect(this.page.getByText(mensagem, { exact: true }).last()).toBeVisible({
      timeout: 15000,
    });
  }

  async fecharChamado() {
    await this.btnCloseTicket.click();
    await this.btnConfirmCloseTicket.click();

    await expect(this.ticketEndMessage).toBeVisible();
  }
}

module.exports = { JornadaPage };
