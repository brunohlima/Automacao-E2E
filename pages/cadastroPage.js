const { expect } = require('@playwright/test');

class PaginaCadastro {
  constructor(page) {
    this.page = page;

    this.botaoMenuGrid = page.locator('.lucide.lucide-layout-grid');
    this.opcaoMenuDepartamentos = page.getByTestId('menu-button-departments');
    this.opcaoMenuUsuarios = page.getByTestId('menu-button-users');

    this.tituloListaDepartamentos = page.getByTestId('departments-list-heading');
    this.botaoAdicionarDepartamento = page.getByTestId('departments-list-button-add');
    this.campoNomeDepartamento = page.getByTestId('departments-form-input-name');
    this.botaoConfirmarDepartamento = page.getByTestId('departments-form-button-confirm');
    this.filtroNomeDepartamento = page.getByTestId('departments-list-input-filter');

    this.tituloListaUsuarios = page.getByTestId('users-list-heading');
    this.botaoAdicionarUsuario = page.getByTestId('users-list-button-add');
    this.opcaoCriarUsuarioUnico = page.locator('#import-type-single');
    this.botaoContinuarTipoCadastro = page.getByRole('button', { name: 'Continuar' });
    this.campoNomeUsuario = page.getByTestId('users-form-input-name');
    this.campoEmailUsuario = page.getByTestId('users-form-input-email');
    // Substituir seletores CSS quando a aplicacao expuser data-testid.
    this.seletorCargo = page.locator('.p-0.css-n9qnu9').first();
    this.opcaoAdministrador = page.getByText('Administrador');
    this.seletorDepartamentoVincular = page.locator('.gap-1.css-14oxtc6 > .p-0').first();
    this.campoSenhaUsuario = page.getByTestId('users-form-input-password');
    this.campoConfirmarSenhaUsuario = page.getByTestId('users-form-input-passwordConfirmation');
    this.botaoSalvarUsuario = page.getByTestId('users-form-button-save');
    this.filtroUsuario = page.getByTestId('users-list-input-filter');
  }

  async criarDepartamento(nomeDepartamento) {
    await this.botaoMenuGrid.click();
    await this.opcaoMenuDepartamentos.click();
    await expect(this.tituloListaDepartamentos).toBeVisible();

    await this.botaoAdicionarDepartamento.click();
    await this.campoNomeDepartamento.fill(nomeDepartamento);
    await this.botaoConfirmarDepartamento.click();

    await expect(this.campoNomeDepartamento).toBeHidden();
  }

  async validarDepartamentoCriado(nomeDepartamento) {
    await this.filtroNomeDepartamento.fill(nomeDepartamento);
    await expect(
      this.page.getByRole('cell', { name: nomeDepartamento }).first()
    ).toBeVisible();
  }

  async criarUsuarioComDepartamento(nomeUsuario, emailUsuario, senhaUsuario, nomeDepartamento) {
    await this.botaoMenuGrid.click();
    await this.opcaoMenuUsuarios.click();
    await expect(this.tituloListaUsuarios).toBeVisible();

    await this.botaoAdicionarUsuario.click();

    await expect(this.opcaoCriarUsuarioUnico).toBeVisible();
    await this.opcaoCriarUsuarioUnico.click();
    await expect(this.opcaoCriarUsuarioUnico).toHaveAttribute('aria-checked', 'true');
    await this.botaoContinuarTipoCadastro.click();

    await expect(this.campoNomeUsuario).toBeVisible();

    await this.campoNomeUsuario.fill(nomeUsuario);
    await this.campoEmailUsuario.fill(emailUsuario);

    await this.seletorCargo.click();
    await this.opcaoAdministrador.click();

    await this.seletorDepartamentoVincular.click();
    await this.page.keyboard.type(nomeDepartamento);
    await this.page.getByText(nomeDepartamento, { exact: true }).click();

    await this.campoSenhaUsuario.fill(senhaUsuario);
    await this.campoConfirmarSenhaUsuario.fill(senhaUsuario);

    // Explicita falhas de complexidade da senha antes do clique.
    await expect(this.botaoSalvarUsuario).toBeEnabled();
    await this.botaoSalvarUsuario.click();
    await expect(this.campoNomeUsuario).toBeHidden();
  }

  async validarUsuarioCriado(emailUsuario) {
    await this.filtroUsuario.fill(emailUsuario);
    await expect(
      this.page.getByRole('cell', { name: emailUsuario }).first()
    ).toBeVisible();
  }

}

module.exports = { PaginaCadastro };
