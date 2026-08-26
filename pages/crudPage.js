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
    // Com muitas conexoes no ambiente, a recem-criada nao fica na primeira
    // pagina da listagem sem filtrar pelo nome.
    this.filtroNomeConexao = page.getByTestId('services-list-input-filter');

    // Formulario de cadastro/edicao
    this.inputNomeSms = page.getByTestId('sms-form-input-name');
    // TODO: o dropdown de Departamento ainda nao expoe data-testid na aplicacao.
    this.dropdownDepartamento = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    // O nome dos departamentos varia entre ambientes de QA, entao a primeira
    // opcao da lista e usada em vez de fixar um nome que pode nao existir.
    this.primeiraOpcaoDepartamento = page.getByRole('option').first();
    this.botaoSalvarSms = page.getByTestId('sms-form-button-submit');

    // Acoes do card na listagem
    this.tresPontinhosCard = page.getByTestId('services-list-card-sms-button-dropdown').first();
    this.opcaoEditar = page.getByTestId('services-list-card-sms-dropdown-edit');
    this.opcaoArquivar = page.getByTestId('services-list-card-sms-dropdown-archive');
    // A aplicacao reaproveita o testid do modal de usuarios na confirmacao de arquivamento.
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
    // a plataforma abre um alerta no lugar do formulario. Esperar primeiro por um
    // dos dois evita checar o alerta antes de ele ter tido tempo de renderizar,
    // o que deixaria a verificacao passar por engano.
    await expect(this.inputNomeSms.or(this.avisoLimiteConexoes)).toBeVisible();
    await expect(
      this.avisoLimiteConexoes,
      'Limite de conexoes SMS atingido no ambiente de QA. Arquive ou remova conexoes existentes antes de rodar o teste.'
    ).toBeHidden();

    await this.inputNomeSms.fill(nomeConexao);
    await this.dropdownDepartamento.click();
    await this.primeiraOpcaoDepartamento.click();
    await this.botaoSalvarSms.click();

    await expect(this.inputNomeSms).toBeHidden();
    await this.filtroNomeConexao.fill(nomeConexao);
  }

  async editarConexaoSms(novoNomeConexao) {
    await this.tresPontinhosCard.click();
    await this.opcaoEditar.click();
    await this.inputNomeSms.fill(novoNomeConexao);
    await this.botaoSalvarSms.click();

    await expect(this.inputNomeSms).toBeHidden();
    // O filtro ainda tem o nome antigo: sem atualizar, a linha editada some
    // da lista filtrada e as proximas acoes (arquivar) perdem o alvo.
    await this.filtroNomeConexao.fill(novoNomeConexao);
  }

  async arquivarConexaoSms() {
    await this.tresPontinhosCard.click();
    await this.opcaoArquivar.click();
    await this.botaoConfirmarModal.click();
  }

  /**
   * Arquiva as conexoes SMS criadas por este teste que sobraram na listagem.
   *
   * A conta de QA tem cota de conexoes SMS, entao uma execucao que falha no
   * meio do fluxo deixa a conexao criada ocupando a vaga e derruba a proxima
   * execucao. Chamado no teardown, isso mantem a suite repetivel.
   *
   * Recebe o prefixo usado nos nomes de conexao deste teste (ex: "conexao ",
   * "sms jornada ") e filtra por ele antes de arquivar. Sem esse filtro, com
   * o ambiente tendo dezenas de conexoes de outras origens, o teardown
   * arquivaria a primeira conexao SMS que encontrasse na listagem inteira,
   * que pode nao ter sido criada por este teste.
   */
  async limparConexoesSms(prefixoNome) {
    await this.page.goto('/');
    await this.acessarConexoes();
    await this.filtroNomeConexao.fill(prefixoNome);

    // Limite defensivo: evita laco infinito caso o card nao suma da listagem
    for (let tentativa = 0; tentativa < 5; tentativa += 1) {
      // A listagem carrega de forma assincrona: contar o card antes disso
      // retornaria zero e encerraria a limpeza sem arquivar nada.
      const existeConexao = await this.tresPontinhosCard
        .waitFor({ state: 'visible', timeout: 10000 })
        .then(() => true)
        .catch(() => false);

      if (!existeConexao) return;

      await this.arquivarConexaoSms();
      await expect(this.botaoConfirmarModal).toBeHidden();
      // O filtro persiste apos arquivar; reaplica para a proxima iteracao
      // do loop encontrar apenas conexoes deste teste, se sobrar mais de uma.
      await this.filtroNomeConexao.fill(prefixoNome);
    }
  }

  /** Valida que a conexao aparece na listagem (filtrando por ela, ja que o ambiente tem muitas). */
  async validarConexaoNaListagem(nomeConexao) {
    await this.filtroNomeConexao.fill(nomeConexao);
    await expect(this.page.getByText(nomeConexao, { exact: true })).toBeVisible();
  }

  /** Valida que a conexao saiu da listagem apos o arquivamento. */
  async validarConexaoRemovida(nomeConexao) {
    await this.filtroNomeConexao.fill(nomeConexao);
    await expect(this.page.getByText(nomeConexao, { exact: true })).toBeHidden();
  }
}

module.exports = { CrudPage };
