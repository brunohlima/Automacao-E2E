class CrudPage {
  constructor(page) {
    this.page = page;

    // Elementos de Navegação Principal
    this.menuConexoes = page.getByTestId('menu-button-connections');
    this.botaoAdicionarConexao = page.getByTestId('services-list-button-create');
    this.cardSmsDisponivel = page.getByTestId('services-create-card-sms').locator('div').filter({ hasText: /^1 disponível$/ });

    // Formulário de Cadastro/Edição de SMS
    this.inputNomeSms = page.getByTestId('sms-form-input-name');
    this.dropdownDepartamento = page.locator('#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0');
    this.opcaoSuporte = page.getByRole('option', { name: 'Suporte' });
    this.botaoSalvarSms = page.getByTestId('sms-form-button-submit');

    // Componentes de Ação da Listagem (Card de Conexão)
    this.tresPontinhosCard = page.getByTestId('services-list-card-sms-button-dropdown');
    this.opcaoEditar = page.getByTestId('services-list-card-sms-dropdown-edit');
    this.opcaoArquivar = page.getByRole('link', { name: 'Arquivar' });
    this.botaoConfirmarModal = page.getByTestId('users-archive-button-confirm');
  }

  // Clica no menu, escolhe o canal SMS disponível e preenche os dados iniciais
  async criarConexaoSms(nomeConexao) {
    await this.menuConexoes.click();
    await this.botaoAdicionarConexao.click();
    await this.cardSmsDisponivel.click();
    await this.inputNomeSms.fill(nomeConexao);
    await this.dropdownDepartamento.click();
    await this.opcaoSuporte.click();
    await this.botaoSalvarSms.click();
  }

  // Localiza o card criado através do menu de opções e atualiza o nome do canal
  async editarConexaoSms(novoNomeConexao) {
    await this.tresPontinhosCard.click();
    await this.opcaoEditar.click();
    await this.inputNomeSms.fill(novoNomeConexao);
    await this.botaoSalvarSms.click();
  }

  // Remove a conexão da listagem principal através do fluxo de arquivamento do sistema
  async arquivarConexaoSms() {
    await this.tresPontinhosCard.click();
    await this.opcaoArquivar.click();
    await this.botaoConfirmarModal.click();
  }
}

module.exports = { CrudPage };