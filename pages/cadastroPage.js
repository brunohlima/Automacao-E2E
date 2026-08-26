const { expect } = require('@playwright/test');

/**
 * Nivel 2 - Dependencia de dados.
 * Cria um Departamento e, em seguida, um Usuario vinculado a ele.
 */
class CadastroPage {
  constructor(page) {
    this.page = page;

    // Menu principal
    this.botaoMenuGrid = page.locator('.lucide.lucide-layout-grid');
    this.opcaoMenuDepartamentos = page.getByTestId('menu-button-departments');
    this.opcaoMenuUsuarios = page.getByTestId('menu-button-users');

    // Tela de Departamentos
    this.tituloListaDepartamentos = page.getByTestId('departments-list-heading');
    this.botaoAdicionarDepartamento = page.getByTestId('departments-list-button-add');
    this.inputNomeDepartamento = page.getByTestId('departments-form-input-name');
    this.botaoConfirmarDepartamento = page.getByTestId('departments-form-button-confirm');
    // Com muitos departamentos no ambiente, o recem-criado nao fica na
    // primeira pagina da listagem sem filtrar pelo nome.
    this.filtroNomeDepartamento = page.getByTestId('departments-list-input-filter');

    // Tela de Usuarios
    this.tituloListaUsuarios = page.getByTestId('users-list-heading');
    this.botaoAdicionarUsuario = page.getByTestId('users-list-button-add');
    // O botao Adicionar abre um assistente de 2 passos: escolher o tipo de
    // cadastro (manual ou em massa) antes de chegar ao formulario em si.
    this.opcaoCriarUmUsuario = page.getByRole('radio', { name: /^Criar um usuário/ });
    this.botaoContinuarAssistente = page.getByRole('button', { name: 'Continuar' });
    this.inputNomeUsuario = page.getByTestId('users-form-input-name');
    this.inputEmailUsuario = page.getByTestId('users-form-input-email');
    // TODO: o dropdown de Perfil ainda nao expoe data-testid na aplicacao.
    this.dropdownPerfil = page.locator('.p-0.css-n9qnu9').first();
    this.opcaoAdministrador = page.getByText('Administrador');
    // TODO: o dropdown de Departamento ainda nao expoe data-testid na aplicacao.
    this.dropdownDepartamentoVincular = page.locator('.gap-1.css-14oxtc6 > .p-0').first();
    this.inputSenhaUsuario = page.getByTestId('users-form-input-password');
    this.inputConfirmarSenhaUsuario = page.getByTestId('users-form-input-passwordConfirmation');
    this.botaoSalvarUsuario = page.getByTestId('users-form-button-save');
    // Com muitos usuarios no ambiente, o recem-criado nao fica na primeira
    // pagina da listagem sem filtrar pelo nome ou email.
    this.filtroUsuario = page.getByTestId('users-list-input-filter');
  }

  async criarDepartamento(nomeDepartamento) {
    await this.botaoMenuGrid.click();
    await this.opcaoMenuDepartamentos.click();
    await expect(this.tituloListaDepartamentos).toBeVisible();

    await this.botaoAdicionarDepartamento.click();
    await this.inputNomeDepartamento.fill(nomeDepartamento);
    await this.botaoConfirmarDepartamento.click();

    // O formulario precisa fechar antes de seguir para o cadastro do usuario
    await expect(this.inputNomeDepartamento).toBeHidden();
  }

  /** Valida que o departamento recem-criado aparece na listagem. */
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
    await this.opcaoCriarUmUsuario.click();
    await this.botaoContinuarAssistente.click();

    await this.inputNomeUsuario.fill(nomeUsuario);
    await this.inputEmailUsuario.fill(emailUsuario);

    // Perfil do usuario
    await this.dropdownPerfil.click();
    await this.opcaoAdministrador.click();

    // Vinculo com o departamento criado neste mesmo teste. Com muitos
    // departamentos no ambiente, digitar o nome filtra a lista antes de
    // clicar na opcao.
    await this.dropdownDepartamentoVincular.click();
    await this.page.keyboard.type(nomeDepartamento);
    await this.page.getByText(nomeDepartamento, { exact: true }).click();

    await this.inputSenhaUsuario.fill(senhaUsuario);
    await this.inputConfirmarSenhaUsuario.fill(senhaUsuario);

    // A plataforma so habilita o Salvar depois de validar a complexidade da senha.
    // Checar aqui aponta o erro real (USER_PASSWORD_NIVEL2 fraca no .env) em vez de
    // estourar o timeout tentando clicar num botao desabilitado.
    await expect(this.botaoSalvarUsuario).toBeEnabled();
    await this.botaoSalvarUsuario.click();

    await expect(this.inputNomeUsuario).toBeHidden();
  }

  /** Valida que o usuario recem-criado aparece na listagem. */
  async validarUsuarioCriado(emailUsuario) {
    await this.filtroUsuario.fill(emailUsuario);
    await expect(
      this.page.getByRole('cell', { name: emailUsuario }).first()
    ).toBeVisible();
  }
}

module.exports = { CadastroPage };
