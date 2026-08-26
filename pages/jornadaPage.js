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
    this.avisoLimiteConexoes = page.getByRole('alertdialog', { name: 'Limite de conexões atingido' });
    // Com muitas conexoes no ambiente, a recem-criada nao fica na primeira
    // pagina da listagem sem filtrar pelo nome.
    this.filtroNomeConexao = page.getByTestId('services-list-input-filter');
    this.inputSmsName = page.getByTestId('sms-form-input-name');
    // TODO: o dropdown de Departamento ainda nao expoe data-testid na aplicacao.
    this.selectDepartment = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    // O nome dos departamentos varia entre ambientes de QA, entao a primeira
    // opcao da lista e usada em vez de fixar um nome que pode nao existir.
    this.primeiraOpcaoDepartamento = page.getByRole('option').first();
    this.btnSubmitSms = page.getByTestId('sms-form-button-submit');

    // Cadastro de contato
    this.menuContacts = page.getByTestId('menu-button-contacts');
    this.contactsTitle = page.getByTestId('contacts-label-title');
    this.btnCreateContact = page.getByTestId('contacts-button-create_contact');
    this.inputContactName = page.getByTestId('contacts-input_group-name');
    // TODO: o select de Conexao (react-select) ainda nao expoe data-testid na aplicacao.
    this.selectConexao = page.locator('.create-contact-select');
    this.inputContactNumber = page.getByTestId('contacts-input_group-number');
    this.labelNomeNoDigisac = page.getByText('Nome no Digisac *Pessoa');
    this.btnSaveContact = page.getByTestId('contacts-button-save_contact');

    // Filtro da listagem de contatos: com muitos contatos no ambiente, o
    // recem-criado nao fica na primeira posicao sem filtrar pelo nome.
    this.btnShowFilters = page.getByTestId('contacts-button-show_filters');
    this.inputFiltroNomeContato = page.getByTestId('contacts-input_filter-name');

    // Chamado no chat
    this.btnActionsFirstContact = page.getByTestId('contacts-button-actions_0').getByRole('button');
    this.btnChatFirstContact = page.getByTestId('contacts-button-chat_0');
    this.chatCard = page.getByTestId('chat-card').first();
    this.avisoConexaoInativa = page.getByText('Conexão inativa');
    this.btnOpenTicket = page.getByTestId('open-ticket-button');
    // O modal de abertura reaproveita o testid do botao de confirmar do modal
    // de transferencia, que fica montado (oculto) na pagina o tempo todo.
    // Por isso o botao e escopado ao dialogo visivel, e nao buscado solto.
    this.dialogoVisivel = page.locator('.modal.show, [role="dialog"]:visible').last();
    this.selectDepartamentoAbertura = page.getByTestId('transfer-ticket-department-select');
    // Este select nao expoe role="option" nas suas opcoes (diferente do
    // select de departamento do formulario de conexao SMS), entao a opcao
    // e escolhida pelo item de menu renderizado.
    this.menuOpcoesDepartamentoAbertura = page.locator('.react_select__menu');
    this.primeiraOpcaoDepartamentoAbertura = this.menuOpcoesDepartamentoAbertura.locator('div').first();
    this.placeholderDepartamentoAbertura = this.selectDepartamentoAbertura.getByText('Selecione');
    this.erroDepartamentoObrigatorio = page.getByText('Este campo é obrigatório.');
    // "Transferir para atendente" vem pre-preenchido com outro usuario. Sem
    // limpar, o chamado abre mas e atribuido a esse atendente e nao aparece
    // como aberto para quem esta logado, entao a tela volta a mostrar
    // "Abrir chamado" como se nada tivesse acontecido.
    this.selectAtendenteAbertura = this.dialogoVisivel.getByTestId('transfer-ticket-user-select');
    this.botaoLimparAtendenteAbertura = this.selectAtendenteAbertura.locator(
      '.react_select__clear-indicator'
    );
    this.inputComentarioAbertura = page.getByTestId('add_comment-Modal-OpenTicket');
    this.btnConfirmarAbertura = this.dialogoVisivel.getByTestId('confirm-transfer-ticket-button');
    this.btnCloseTicket = page.getByTestId('chat-button-close_ticket');
    this.textInicioChamado = page.getByText('Início do chamado');

    // Mensagem e fechamento
    this.chatInput = page.getByTestId('chat-container').getByRole('textbox');
    this.btnConfirmCloseTicket = page.getByTestId('confirm-closeTicket');
    this.ticketEndMessage = page.getByTestId('ticket-end-message');
    this.menuChat = page.getByTestId('menu-button-chat');
    this.tabMeusChats = page.getByTestId('chat-tab-mine');
  }

  async criarConexaoSms(nomeSms) {
    await this.menuConnections.click();
    await expect(this.btnCreateService).toBeVisible();

    await this.btnCreateService.click();
    await this.cardSms.click();

    // A conta de QA tem um limite contratado de conexoes SMS. Quando ele estoura,
    // a plataforma abre um alerta no lugar do formulario. Esperar primeiro por um
    // dos dois evita checar o alerta antes de ele ter tido tempo de renderizar.
    await expect(this.inputSmsName.or(this.avisoLimiteConexoes)).toBeVisible();
    await expect(
      this.avisoLimiteConexoes,
      'Limite de conexoes SMS atingido no ambiente de QA. Arquive ou remova conexoes existentes antes de rodar o teste.'
    ).toBeHidden();

    await this.inputSmsName.fill(nomeSms);
    await this.selectDepartment.click();
    await this.primeiraOpcaoDepartamento.click();
    await this.btnSubmitSms.click();

    // O formulario fecha e a conexao passa a existir na listagem
    await expect(this.inputSmsName).toBeHidden();
    await this.filtroNomeConexao.fill(nomeSms);
    await expect(this.page.getByText(nomeSms, { exact: true })).toBeVisible();
  }

  /**
   * Cadastra o contato ja vinculado a conexao criada no inicio da jornada:
   * e por ela que o chamado sera aberto no chat.
   */
  async cadastrarContato(nomeContato, numeroContato, nomeConexao) {
    await this.menuContacts.click();
    await expect(this.contactsTitle).toBeVisible();

    await this.btnCreateContact.click();
    await this.inputContactName.fill(nomeContato);

    // A conexao e escolhida pelo nome, e nao pela posicao na lista, para o
    // teste continuar valido quando o ambiente tiver outras conexoes.
    await this.selectConexao.click();
    await this.page
      .locator('[class*="react_select__option"]')
      .filter({ hasText: nomeConexao })
      .first()
      .click();

    await this.inputContactNumber.fill(numeroContato);
    // Clique no rotulo fecha o dropdown aberto antes de salvar
    await this.labelNomeNoDigisac.click();
    await this.btnSaveContact.click();

    // Volta a listagem e filtra pelo nome: com muitos contatos no ambiente,
    // o recem-criado nao aparece na primeira posicao sem esse filtro, e as
    // proximas acoes (abrir o chamado) dependem de agir sobre a linha certa.
    await this.menuContacts.click();
    await this.btnShowFilters.click();
    await this.inputFiltroNomeContato.fill(nomeContato);
    await expect(this.page.getByText(nomeContato, { exact: true }).first()).toBeVisible();
  }

  /** Abre o chamado do contato filtrado na listagem (ver cadastrarContato). */
  async abrirChamadoDoPrimeiroContato() {
    await this.btnActionsFirstContact.click();
    await this.btnChatFirstContact.click();
    await this.chatCard.click();

    // Uma conexao SMS recem-criada pode levar alguns instantes para ativar no
    // provedor. Enquanto isso, a plataforma exibe "Conexao inativa" no lugar
    // do botao de abrir o chamado.
    await expect(this.avisoConexaoInativa).toBeHidden({ timeout: 30000 });

    // O chat abre em modo leitura: e preciso abrir o chamado explicitamente,
    // escolhendo um departamento (obrigatorio) e um comentario, antes do
    // campo de mensagem existir. Nesta versao do app nao existe mais um
    // botao separado "Transferir chamado" (chat-button-transfer_ticket, do
    // roteiro original do desafio); a transferencia para o departamento
    // acontece aqui, dentro do proprio fluxo de abertura.
    // A selecao do departamento e instavel: o
    // menu as vezes fecha sem registrar o clique, deixando o campo em
    // "Selecione" e a submissao falha calada. Por isso confirma-se que o
    // placeholder sumiu antes de seguir, com uma nova tentativa se preciso.
    await this.btnOpenTicket.click();

    await expect(async () => {
      await this.selectDepartamentoAbertura.click();
      await expect(this.menuOpcoesDepartamentoAbertura).toBeVisible();
      await this.primeiraOpcaoDepartamentoAbertura.click();
      await expect(this.placeholderDepartamentoAbertura).toBeHidden();
    }).toPass({ timeout: 15000 });

    // Limpa o atendente pre-selecionado para o chamado abrir para quem esta
    // logado, e nao ser transferido direto para outra fila. O indicador de
    // limpar so existe quando ha um atendente pre-preenchido, entao o passo
    // e condicional. O clique tambem se mostrou instavel logo apos a selecao
    // de departamento (o React ainda re-renderizando o formulario); esperar
    // um instante evita interagir com um elemento em transicao.
    await this.page.waitForTimeout(500);
    if (await this.botaoLimparAtendenteAbertura.isVisible()) {
      await this.botaoLimparAtendenteAbertura.click();
    }

    await this.inputComentarioAbertura.fill('Chamado aberto pela automacao');
    await this.btnConfirmarAbertura.click();

    // Apos o clique, o modal fica em estado de carregamento (spinner no
    // Salvar, campos limpos) antes de fechar de fato. Esperar o dialogo
    // sumir evita seguir com a submissao ainda em andamento.
    await expect(
      this.dialogoVisivel,
      'O modal de abertura do chamado nao fechou apos confirmar.'
    ).toBeHidden({ timeout: 15000 });

    // ticket-start-message nao existe nesta versao do app; chat-button-close_ticket
    // so aparece com o chamado de fato aberto, entao serve como prova do estado.
    await expect(
      this.btnCloseTicket,
      'O chamado nao abriu mesmo apos preencher o comentario de abertura.'
    ).toBeVisible();

    // Logo apos o modal de abertura fechar, o chat-container ainda nao
    // renderizou o campo de mensagem (o DOM que aparece nesse instante e o
    // do proprio modal se desfazendo, e interagir com ele trava a aba).
    // Sair da conversa e voltar forca um render limpo, com o composer real.
    await this.menuChat.click();
    await this.tabMeusChats.click();
    await this.chatCard.click();
    await expect(this.chatInput).toBeVisible();

    // A abertura fica registrada no historico da conversa, com o comentario
    // preenchido no modal. Quando ha um atendente pre-preenchido no momento
    // da abertura, tambem aparece um log "Chamado transferido por (...)",
    // mas isso e condicional ao estado do formulario e nao sempre presente.
    await expect(this.textInicioChamado).toBeVisible();
  }

  async enviarMensagem(mensagem) {
    // O composer e um editor rico (Lexical). locator.fill() manipula o valor
    // via JS e deixa o estado interno do editor dessincronizado do DOM, o
    // que se mostrou instavel (chegou a travar a aba). Clicar e digitar de
    // verdade, como um usuario faria, e o caminho estavel.
    await this.chatInput.click();
    await this.page.keyboard.type(mensagem);

    // POST /api/v1/messages pode responder 500 nesse ambiente (falha real do
    // backend, nao da automacao): o editor limpa (atualizacao otimista da
    // interface) mas a mensagem nunca chega a existir. Capturar a resposta
    // aponta a causa real em vez de so estourar o timeout da assercao final.
    const respostaEnvio = this.page.waitForResponse(
      (res) => res.url().includes('/api/v1/messages') && res.request().method() === 'POST',
      { timeout: 15000 }
    );
    await this.page.keyboard.press('Enter');
    const resposta = await respostaEnvio;

    expect(
      resposta.ok(),
      `O envio da mensagem falhou no backend: POST /api/v1/messages respondeu ${resposta.status()}.`
    ).toBeTruthy();

    // O envio real da SMS pode levar alguns instantes para refletir no chat.
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
