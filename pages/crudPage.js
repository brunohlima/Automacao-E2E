const { expect } = require('@playwright/test');

/**
 * Erro especifico para quando a listagem filtrada genuinamente nao tem
 * nenhuma conexao (aviso "Nenhum resultado encontrado" exibido pela
 * aplicacao). Serve para diferenciar esse caso esperado de uma falha real
 * de UI em quem consome o erro (ex: limparConexoesSms).
 */
class ListagemVaziaError extends Error {}

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
    // A listagem mistura conexoes ativas e arquivadas na mesma busca por nome.
    // Uma conexao arquivada de uma execucao anterior quebrada (mesmo prefixo)
    // pode aparecer primeiro e ser pega por engano; clicar nela navega para
    // uma tela de "nao e possivel reativar" em vez de abrir o menu normal.
    // Restringir a aba Ativas evita esse zumbi.
    this.abaAtivas = page.getByRole('tab', { name: /^Ativas/ });
    // Aviso exibido pela aplicacao quando o filtro nao encontra nenhum item.
    // Aparece na hora (nao e estado de carregamento), entao serve pra sair
    // rapido de retries que nao tem chance nenhuma de dar certo.
    this.avisoSemResultados = page.getByText('Nenhum resultado encontrado', { exact: true });

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

    // Garante que a listagem esteja na aba Ativas, nunca em Arquivadas,
    // evitando que conexoes zumbis arquivadas sejam pegas por engano.
    const temAbaAtivas = await this.abaAtivas.isVisible().catch(() => false);
    if (temAbaAtivas) {
      await this.abaAtivas.click();
    }
  }

  /**
   * Abre o menu do card e clica em uma das opcoes (Editar/Arquivar),
   * reabrindo o menu do zero a cada tentativa.
   *
   * O card e re-renderizado periodicamente pela aplicacao (provavelmente
   * por atualizacao em tempo real do status da conexao), o que as vezes
   * desmonta o elemento do DOM bem no meio do clique. Reabrir o menu do
   * zero a cada tentativa garante que estamos sempre mirando em um
   * elemento que acabou de ser confirmado como presente na tela.
   */
  async selecionarOpcaoMenuCard(opcao) {
    for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
      await this.abrirMenuCardSms();
      try {
        await opcao.click({ timeout: 3000 });
        return;
      } catch (erro) {
        if (tentativa === 3) throw erro;
      }
    }
  }

  /**
   * Abre o menu de acoes (3 pontinhos) do card SMS na listagem.
   *
   * O menu e um Radix UI dropdown que se mostrou instavel com clique unico:
   * as vezes nao abre, ou abre e fecha sozinho antes do proximo clique.
   * Por isso, clica e confere se abriu; se nao abriu (ou fechou de novo),
   * tenta de novo, ate 3 vezes, em vez de assumir que um clique basta.
   *
   * Apos uma tentativa de clique falhar, confere se o aviso "Nenhum
   * resultado encontrado" esta na tela antes de tentar de novo. A checagem
   * fica DEPOIS do clique (nao antes) de proposito: a listagem tem uma
   * re-renderizacao periodica que pode "piscar" esse aviso por uma fracao
   * de segundo antes de repopular, e o clique com seu proprio timeout ja
   * da tempo suficiente pra esse flash passar. Se, mesmo apos a tentativa
   * de clique, o aviso ainda estiver visivel, ai sim e um sinal confiavel
   * de que insistir mais e inutil.
   */
  async abrirMenuCardSms() {
    for (let tentativa = 1; tentativa <= 3; tentativa += 1) {
      const abriu = await this.tresPontinhosCard
        .click({ timeout: 3000 })
        .then(() => this.opcaoEditar.waitFor({ state: 'visible', timeout: 2000 }))
        .then(() => true)
        .catch(() => false);

      if (abriu) return;

      const semResultados = await this.avisoSemResultados.isVisible().catch(() => false);
      if (semResultados) {
        throw new ListagemVaziaError(
          'Listagem filtrada nao encontrou nenhuma conexao ("Nenhum resultado encontrado"); menu nao pode ser aberto.'
        );
      }
    }

    throw new Error('Menu de acoes do card SMS (3 pontinhos) nao abriu apos 3 tentativas.');
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
    await this.selecionarOpcaoMenuCard(this.opcaoEditar);
    await this.inputNomeSms.fill(novoNomeConexao);
    await this.botaoSalvarSms.click();

    await expect(this.inputNomeSms).toBeHidden();
    // O filtro ainda tem o nome antigo: sem atualizar, a linha editada some
    // da lista filtrada e as proximas acoes (arquivar) perdem o alvo.
    await this.filtroNomeConexao.fill(novoNomeConexao);
  }

  async arquivarConexaoSms() {
    await this.selecionarOpcaoMenuCard(this.opcaoArquivar);
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
      // Espera curta (3s) so pra dar tempo da listagem assincrona renderizar;
      // depois disso, count() diz na hora se ha algo pra arquivar ou nao,
      // em vez de segurar ate 10s so pra descobrir que esta vazia.
      await this.tresPontinhosCard.waitFor({ state: 'attached', timeout: 3000 }).catch(() => {});
      const existeConexao = (await this.tresPontinhosCard.count()) > 0;

      if (!existeConexao) return;

      // Uma conexao antiga/problematica nao pode travar a limpeza inteira
      // nem derrubar o teste: registra o problema e segue para a proxima.
      // Excecao: ListagemVaziaError e o caso esperado (nao ha mais nada pra
      // arquivar), entao nao precisa de warn - so encerra silenciosamente.
      try {
        await this.arquivarConexaoSms();
        await expect(this.botaoConfirmarModal).toBeHidden();
      } catch (erro) {
        if (!(erro instanceof ListagemVaziaError)) {
          console.warn(`[limparConexoesSms] Falha ao arquivar uma conexao, pulando: ${erro.message}`);
        }
        break;
      }

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