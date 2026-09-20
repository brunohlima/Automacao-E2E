const { expect } = require('@playwright/test');

class ListagemVaziaError extends Error {}

class PaginaCrud {
  constructor(page) {
    this.page = page;

    this.menuConexoes = page.getByTestId('menu-button-connections');
    this.botaoAdicionarConexao = page.getByTestId('services-list-button-create');
    this.cartaoSms = page.getByTestId('services-create-card-sms');
    this.avisoLimiteConexoes = page.getByRole('alertdialog', { name: 'Limite de conexões atingido' });
    this.filtroNomeConexao = page.getByTestId('services-list-input-filter');
    // A busca inclui arquivadas; restringir a aba evita selecionar massa antiga.
    this.abaAtivas = page.getByRole('tab', { name: /^Ativas/ });
    this.avisoSemResultados = page.getByText('Nenhum resultado encontrado', { exact: true });

    this.campoNomeSms = page.getByTestId('sms-form-input-name');
    // Substituir seletor CSS quando a aplicacao expuser data-testid.
    this.seletorDepartamento = page.locator(
      '#department > .nebula-ds.flex.w-full.items-center.border > .nebula-ds > .gap-1 > .p-0'
    );
    this.primeiraOpcaoDepartamento = page.getByRole('option').first();
    this.botaoSalvarSms = page.getByTestId('sms-form-button-submit');

    this.botaoAcoesCartao = page.getByTestId('services-list-card-sms-button-dropdown').first();
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
      const abriu = await this.botaoAcoesCartao
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
    await this.cartaoSms.click();

    // O alerta de cota substitui o formulario no ambiente compartilhado.
    await expect(this.campoNomeSms.or(this.avisoLimiteConexoes)).toBeVisible();
    await expect(
      this.avisoLimiteConexoes,
      'Limite de conexoes SMS atingido no ambiente de QA. Arquive ou remova conexoes existentes antes de rodar o teste.'
    ).toBeHidden();

    await this.campoNomeSms.fill(nomeConexao);
    await this.seletorDepartamento.click();
    await this.primeiraOpcaoDepartamento.click();
    await this.botaoSalvarSms.click();

    await expect(this.campoNomeSms).toBeHidden();
    await this.filtroNomeConexao.fill(nomeConexao);
  }

  async editarConexaoSms(novoNomeConexao) {
    await this.selecionarOpcaoMenuCard(this.opcaoEditar);
    await this.campoNomeSms.fill(novoNomeConexao);
    await this.botaoSalvarSms.click();

    await expect(this.campoNomeSms).toBeHidden();
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

    const botoesAcoes = this.page.getByTestId('services-list-card-sms-button-dropdown');

    for (let tentativa = 0; tentativa < 5; tentativa += 1) {
      await expect(this.botaoAcoesCartao.or(this.avisoSemResultados)).toBeVisible();
      if (await this.avisoSemResultados.isVisible()) return;

      const quantidadeAntes = await botoesAcoes.count();
      const aguardarRemocao = async () => {
        await expect(this.botaoConfirmarModal).toBeHidden();
        // O modal pode fechar antes de a listagem receber a atualizacao.
        await expect.poll(() => botoesAcoes.count(), {
          timeout: 5000,
          message: 'A conexao arquivada deve sair da listagem de ativas.',
        }).toBeLessThan(quantidadeAntes);
      };

      try {
        await this.arquivarConexaoSms();
      } catch (erro) {
        // Uma atualizacao concorrente pode remover o card durante a interacao.
        // So considere a limpeza concluida se a listagem comprovar a remocao.
        const removida = await aguardarRemocao().then(() => true).catch(() => false);
        if (removida) continue;

        console.warn(`[limparConexoesSms] Nao foi possivel confirmar o arquivamento de uma conexao: ${erro.message}`);
        break;
      }

      try {
        await aguardarRemocao();
      } catch (erro) {
        console.warn(`[limparConexoesSms] Nao foi possivel confirmar a remocao da conexao da listagem: ${erro.message}`);
        break;
      }
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

module.exports = { PaginaCrud };
