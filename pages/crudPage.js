const { expect } = require('@playwright/test');

/**
 * Nivel 3 - Ciclo de vida CRUD de uma Conexao SMS:
 * criar, validar na listagem, editar e arquivar.
 */
class CrudPage {
  constructor(page) {
    this.page = page;

    // Navegacao
    this.menuConexoes = page.getByTestId('menu-button-connections');
    this.botaoAdicionarConexao = page.getByTestId('services-list-button-create');
    this.cardSms = page.getByTestId('services-create-card-sms');
    this.avisoLimiteConexoes = page.getByRole('alertdialog', { name: 'Limite de conexões atingido' });

    // Formulario de cadastro/edicao
    this.inputNomeSms = page.getByTestId('sms-form-input-name');
    // TODO: o dropdown de Departamento ainda nao expoe data-testid na aplicacao.
    this.dropdownDepartamento = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    this.opcaoSuporte = page.getByRole('option', { name: 'Suporte' });
    this.botaoSalvarSms = page.getByTestId('sms-form-button-submit');

    // Acoes do card na listagem
    this.tresPontinhosCard = page.getByTestId('services-list-card-sms-button-dropdown');
    this.opcaoEditar = page.getByTestId('services-list-card-sms-dropdown-edit');
    this.opcaoArquivar = page.getByRole('link', { name: 'Arquivar' });
    // TODO: a aplicacao reaproveita o testid do modal de usuarios na confirmacao de arquivamento.
    this.botaoConfirmarModal = page.getByTestId('users-archive-button-confirm');
  }

  async acessarConexoes() {
    await this.menuConexoes.click();
    await expect(this.botaoAdicionarConexao).toBeVisible();
  }

  async criarConexaoSms(nomeConexao) {
    await this.botaoAdicionarConexao.click();
    await this.cardSms.click();

    // A conta de QA tem um limite contratado de conexoes SMS. Quando ele estoura,
    // a plataforma abre um alerta no lugar do formulario. Sem esta checagem o teste
    // apenas estouraria o timeout esperando por um formulario que nunca abre.
    await expect(
      this.avisoLimiteConexoes,
      'Limite de conexoes SMS atingido no ambiente de QA. Arquive ou remova conexoes existentes antes de rodar o teste.'
    ).toBeHidden();

    await this.inputNomeSms.fill(nomeConexao);
    await this.dropdownDepartamento.click();
    await this.opcaoSuporte.click();
    await this.botaoSalvarSms.click();

    await expect(this.inputNomeSms).toBeHidden();
  }

  async editarConexaoSms(novoNomeConexao) {
    await this.tresPontinhosCard.click();
    await this.opcaoEditar.click();
    await this.inputNomeSms.fill(novoNomeConexao);
    await this.botaoSalvarSms.click();

    await expect(this.inputNomeSms).toBeHidden();
  }

  async arquivarConexaoSms() {
    await this.tresPontinhosCard.click();
    await this.opcaoArquivar.click();
    await this.botaoConfirmarModal.click();
  }

  /** Valida que a conexao aparece na listagem. */
  async validarConexaoNaListagem(nomeConexao) {
    await expect(this.page.getByText(nomeConexao, { exact: true })).toBeVisible();
  }

  /** Valida que a conexao saiu da listagem apos o arquivamento. */
  async validarConexaoRemovida(nomeConexao) {
    await expect(this.page.getByText(nomeConexao, { exact: true })).toBeHidden();
  }
}

module.exports = { CrudPage };
