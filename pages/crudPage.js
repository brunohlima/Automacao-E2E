const { expect } = require('@playwright/test');

class ListagemVaziaError extends Error {}

class CrudPage {
  constructor(page) {
    this.page = page;

    this.menuConexoes = page.getByTestId('menu-button-connections');
    this.botaoAdicionarConexao = page.getByTestId('services-list-button-create');
    this.cardSms = page.getByTestId('services-create-card-sms');
    this.avisoLimiteConexoes = page.getByRole('alertdialog', { name: 'Limite de conexões atingido' });
    this.filtroNomeConexao = page.getByTestId('services-list-input-filter');
    // A busca inclui arquivadas; restringir a aba evita selecionar massa antiga.
    this.abaAtivas = page.getByRole('tab', { name: /^Ativas/ });
    this.avisoSemResultados = page.getByText('Nenhum resultado encontrado', { exact: true });

    this.inputNomeSms = page.getByTestId('sms-form-input-name');
    // Substituir seletor CSS quando a aplicacao expuser data-testid.
    this.dropdownDepartamento = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    this.primeiraOpcaoDepartamento = page.getByRole('option').first();
    this.botaoSalvarSms = page.getByTestId('sms-form-button-submit');

    this.tresPontinhosCard = page.getByTestId('services-list-card-sms-button-dropdown').first();
    this.opcaoEditar = page.getByTestId('services-list-card-sms-dropdown-edit');
    this.opcaoArquivar = page.getByTestId('services-list-card-sms-dropdown-archive');
    // O modal de conexoes reutiliza o testid de usuarios.
    this.botaoConfirmarModal = page.getByTestId('users-archive-button-confirm');
    this.modalArquivamentoBloqueado = page.getByRole('dialog', {
      name: 'Você tem certeza que deseja arquivar essa conexão?',
    });
    this.avisoChamadosAbertos = this.modalArquivamentoBloqueado.getByText(
      /possui \d+ chamado\(s\) em aberto/
    );
    this.botaoCancelarArquivamento = this.modalArquivamentoBloqueado.getByRole('button', {
      name: 'Cancelar',
    });
  }

  async acessarConexoes() {
    await this.menuConexoes.click();
    await expect(this.botaoAdicionarConexao).toBeVisible();

    const temAbaAtivas = await this.abaAtivas.isVisible().catch(() => false);
    if (temAbaAtivas) {
      await this.abaAtivas.click();
    }
  }

  // O card sofre re-renderizacao em tempo real; cada retry reabre o menu.
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

    // O alerta de cota substitui o formulario no ambiente compartilhado.
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
    await this.filtroNomeConexao.fill(novoNomeConexao);
  }

  async arquivarConexaoSms() {
    await this.selecionarOpcaoMenuCard(this.opcaoArquivar);

    // Conexoes com chamados abertos exibem um modal sem botao de confirmacao.
    await expect(this.botaoConfirmarModal.or(this.avisoChamadosAbertos)).toBeVisible({
      timeout: 5000,
    });

    if (await this.avisoChamadosAbertos.isVisible().catch(() => false)) {
      await this.botaoCancelarArquivamento.click({ timeout: 3000 });
      throw new Error('Conexao possui chamado aberto e nao pode ser arquivada.');
    }

    await this.botaoConfirmarModal.click({ timeout: 3000 });
  }

  // Remove massa residual do teste para preservar a cota de conexoes do QA.
  async limparConexoesSms(prefixoNome) {
    await this.page.goto('/');
    await this.acessarConexoes();
    await this.filtroNomeConexao.fill(prefixoNome);

    for (let tentativa = 0; tentativa < 5; tentativa += 1) {
      await this.tresPontinhosCard.waitFor({ state: 'attached', timeout: 3000 }).catch(() => {});
      const existeConexao = (await this.tresPontinhosCard.count()) > 0;

      if (!existeConexao) return;

      try {
        await this.arquivarConexaoSms();
        await expect(this.botaoConfirmarModal).toBeHidden();
      } catch (erro) {
        if (!(erro instanceof ListagemVaziaError)) {
          console.warn(`[limparConexoesSms] Falha ao arquivar uma conexao, pulando: ${erro.message}`);
        }
        break;
      }

      await this.filtroNomeConexao.fill(prefixoNome);
    }
  }

  async validarConexaoNaListagem(nomeConexao) {
    await this.filtroNomeConexao.fill(nomeConexao);
    await expect(this.page.getByText(nomeConexao, { exact: true })).toBeVisible();
  }

  async validarConexaoRemovida(nomeConexao) {
    await this.filtroNomeConexao.fill(nomeConexao);
    await expect(this.page.getByText(nomeConexao, { exact: true })).toBeHidden();
  }
}

module.exports = { CrudPage };
