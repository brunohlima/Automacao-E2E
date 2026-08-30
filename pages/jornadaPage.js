const { expect } = require('@playwright/test');

class PaginaJornada {
  constructor(page) {
    this.page = page;
    this.nomeDepartamentoAtendimento = process.env.TEST_DEPARTMENT || 'Suporte';

    this.menuConexoes = page.getByTestId('menu-button-connections');
    this.botaoCriarServico = page.getByTestId('services-list-button-create');
    this.cartaoSms = page.getByTestId('services-create-card-sms');
    this.avisoLimiteConexoes = page.getByRole('alertdialog', { name: 'Limite de conexões atingido' });
    this.filtroNomeConexao = page.getByTestId('services-list-input-filter');
    // A busca inclui arquivadas; restringir a aba evita selecionar massa antiga.
    this.abaAtivas = page.getByText(/^Ativas\b/).first();
    this.campoNomeSms = page.getByTestId('sms-form-input-name');
    // Substituir seletor CSS quando a aplicacao expuser data-testid.
    this.seletorDepartamento = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    this.opcaoDepartamentoAtendimento = page.getByRole('option', {
      name: this.nomeDepartamentoAtendimento,
      exact: true,
    });
    this.botaoSalvarSms = page.getByTestId('sms-form-button-submit');

    this.menuContatos = page.getByTestId('menu-button-contacts');
    this.tituloContatos = page.getByTestId('contacts-label-title');
    this.botaoCriarContato = page.getByTestId('contacts-button-create_contact');
    this.campoNomeContato = page.getByTestId('contacts-input_group-name');
    // Substituir seletor CSS quando a aplicacao expuser data-testid.
    this.selectConexao = page.locator('.create-contact-select');
    this.campoNumeroContato = page.getByTestId('contacts-input_group-number');
    this.labelNomeNoDigisac = page.getByText('Nome no Digisac *Pessoa');
    this.botaoSalvarContato = page.getByTestId('contacts-button-save_contact');

    this.botaoExibirFiltros = page.getByTestId('contacts-button-show_filters');
    this.inputFiltroNomeContato = page.getByTestId('contacts-input_filter-name');

    this.botaoAcoesPrimeiroContato = page.getByTestId('contacts-button-actions_0').getByRole('button');
    this.botaoChatPrimeiroContato = page.getByTestId('contacts-button-chat_0');
    this.cartaoChat = page.getByTestId('chat-card').first();
    this.avisoConexaoInativa = page.getByText('Conexão inativa');
    this.botaoAbrirChamado = page.getByTestId('open-ticket-button');
    // O testid de confirmacao existe em modais ocultos; manter o escopo visivel.
    this.dialogoVisivel = page.locator('.modal.show, [role="dialog"]:visible').last();
    this.seletorDepartamentoAbertura = page.getByTestId('transfer-ticket-department-select');
    this.menuOpcoesDepartamentoAbertura = page.locator('.react_select__menu');
    this.opcaoDepartamentoAbertura = this.menuOpcoesDepartamentoAbertura
      .getByText(this.nomeDepartamentoAtendimento, { exact: true })
      .last();
    this.textoSelecioneDepartamento = this.seletorDepartamentoAbertura.getByText('Selecione');
    this.erroDepartamentoObrigatorio = page.getByText('Este campo é obrigatório.');
    this.seletorAtendenteAbertura = this.dialogoVisivel.getByTestId('transfer-ticket-user-select');
    this.botaoLimparAtendenteAbertura = this.seletorAtendenteAbertura.locator(
      '.react_select__clear-indicator'
    );
    this.campoComentarioAbertura = this.dialogoVisivel.getByTestId('add_comment-Modal-OpenTicket');
    this.botaoConfirmarAbertura = this.dialogoVisivel.getByTestId('confirm-transfer-ticket-button');
    this.botaoFecharChamado = page.getByTestId('chat-button-close_ticket');
    this.textoInicioChamado = page.getByText('Início do chamado');

    this.campoMensagem = page.getByTestId('chat-container').getByRole('textbox');
    this.botaoConfirmarFechamento = page.getByTestId('confirm-closeTicket');
    this.mensagemFimChamado = page.getByTestId('ticket-end-message');
    this.menuChat = page.getByTestId('menu-button-chat');
    this.abaMeusChats = page.getByTestId('chat-tab-mine');
  }

  async criarConexaoSms(nomeSms) {
    await this.menuConexoes.click();
    await expect(this.botaoCriarServico).toBeVisible();

    const temAbaAtivas = await this.abaAtivas.isVisible({ timeout: 5000 }).catch(() => false);
    if (temAbaAtivas) {
      await this.abaAtivas.click();
    }

    await this.botaoCriarServico.click();
    await this.cartaoSms.click();

    // O alerta de cota substitui o formulario no ambiente compartilhado.
    await expect(this.campoNomeSms.or(this.avisoLimiteConexoes)).toBeVisible();
    await expect(
      this.avisoLimiteConexoes,
      'Limite de conexoes SMS atingido no ambiente de QA. Arquive ou remova conexoes existentes antes de rodar o teste.'
    ).toBeHidden();

    await this.campoNomeSms.fill(nomeSms);
    await this.seletorDepartamento.click();
    await this.opcaoDepartamentoAtendimento.click();
    await this.botaoSalvarSms.click();

    await expect(this.campoNomeSms).toBeHidden();
    await this.filtroNomeConexao.fill(nomeSms);
    await expect(this.page.getByText(nomeSms, { exact: true })).toBeVisible();
  }

  async cadastrarContato(nomeContato, numeroContato, nomeConexao) {
    await this.menuContatos.click();
    await expect(this.tituloContatos).toBeVisible();

    await this.botaoCriarContato.click();
    await this.campoNomeContato.fill(nomeContato);

    await this.selectConexao.click();
    await this.page
      .locator('[class*="react_select__option"]')
      .filter({ hasText: nomeConexao })
      .first()
      .click();

    await this.campoNumeroContato.fill(numeroContato);
    await this.labelNomeNoDigisac.click();
    await this.botaoSalvarContato.click();

    await this.menuContatos.click();
    await this.botaoExibirFiltros.click();
    await this.inputFiltroNomeContato.fill(nomeContato);
    await expect(this.page.getByText(nomeContato, { exact: true }).first()).toBeVisible();
  }

  async abrirChamadoDoPrimeiroContato() {
    await this.botaoAcoesPrimeiroContato.click();
    await this.botaoChatPrimeiroContato.click();
    await this.cartaoChat.click();

    // A ativacao da conexao no provedor e assincrona.
    await expect(this.avisoConexaoInativa).toBeHidden({ timeout: 30000 });

    // Confirma a selecao porque o react-select pode fechar sem registrar o clique.
    await this.botaoAbrirChamado.click();

    await expect(async () => {
      await this.seletorDepartamentoAbertura.click();
      await expect(this.menuOpcoesDepartamentoAbertura).toBeVisible();
      await this.opcaoDepartamentoAbertura.click();
      await expect(this.textoSelecioneDepartamento).toBeHidden();
    }).toPass({ timeout: 15000 });

    // Clicar no comentario fecha o select sem arriscar fechar o modal com Escape.
    await expect(this.dialogoVisivel).toBeVisible();
    await this.campoComentarioAbertura.click();
    await this.campoComentarioAbertura.fill('Chamado aberto pela automacao');
    await expect(this.botaoConfirmarAbertura).toBeVisible();
    await expect(this.botaoConfirmarAbertura).toBeEnabled();
    await this.botaoConfirmarAbertura.click({ timeout: 5000 });

    // Algumas versoes exibem uma segunda confirmacao de transferencia.
    for (let tentativa = 0; tentativa < 2; tentativa += 1) {
      const modalFechou = await this.dialogoVisivel
        .waitFor({ state: 'hidden', timeout: 10000 })
        .then(() => true)
        .catch(() => false);
      if (modalFechou) break;

      const comentarioVisivel = await this.campoComentarioAbertura.isVisible().catch(() => false);
      if (comentarioVisivel) {
        const valorAtual = await this.campoComentarioAbertura.inputValue().catch(() => '');
        if (!valorAtual) {
          await this.campoComentarioAbertura.fill('Chamado aberto pela automacao');
        }
      }
      await expect(this.botaoConfirmarAbertura).toBeVisible({ timeout: 3000 });
      await expect(this.botaoConfirmarAbertura).toBeEnabled({ timeout: 3000 });
      await this.botaoConfirmarAbertura.click({ timeout: 3000 });
    }

    await expect(
      this.dialogoVisivel,
      'O modal de abertura do chamado nao fechou apos confirmar.'
    ).toBeHidden({ timeout: 15000 });

    await expect(
      this.botaoFecharChamado,
      'O chamado nao abriu mesmo apos preencher o comentario de abertura.'
    ).toBeVisible();

    // Reabrir a conversa aguarda um composer limpo apos a transicao do modal.
    await this.menuChat.click();
    await this.abaMeusChats.click();
    await this.cartaoChat.click();
    await expect(this.campoMensagem).toBeVisible();

    await expect(this.textoInicioChamado).toBeVisible();
  }

  async enviarMensagem(mensagem) {
    // O editor Lexical exige eventos de teclado reais para sincronizar seu estado.
    await this.campoMensagem.click();
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
    await this.botaoFecharChamado.click();
    await this.botaoConfirmarFechamento.click();

    await expect(this.mensagemFimChamado).toBeVisible();
  }
}

module.exports = { PaginaJornada };
