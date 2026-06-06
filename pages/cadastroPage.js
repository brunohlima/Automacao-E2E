const { expect } = require('@playwright/test');

class CadastroPage {
  constructor(page) {
    this.page = page;

    // Seletores da tela de Departamentos
    this.botaoMenuGrid = page.locator('.lucide.lucide-layout-grid'); // Botão de menu (quadradinhos)
    this.opcaoMenuDepartamentos = page.getByText('Departamentos'); // Opção Departamentos no menu
    this.botaoAdicionarDepartamento = page.getByTestId('departments-list-button-add'); // Botão "+" para novo departamento
    this.inputNomeDepartamento = page.getByTestId('departments-form-input-name'); // Campo do nome do departamento
    this.botaoConfirmarDepartamento = page.getByTestId('departments-form-button-confirm'); // Botão Salvar departamento

    // Seletores da tela de Usuários
    this.opcaoMenuUsuarios = page.getByTestId('menu-button-users').getByText('Usuários'); // Opção Usuários no menu
    this.botaoAdicionarUsuario = page.getByTestId('users-list-button-add'); // Botão "+" para novo usuário
    this.inputNomeUsuario = page.getByTestId('users-form-input-name'); // Campo Nome do usuário
    this.inputEmailUsuario = page.getByTestId('users-form-input-email'); // Campo E-mail do usuário
    this.dropdownPerfil = page.locator('.p-0.css-n9qnu9').first(); // Campo para abrir a lista de Perfis
    this.opcaoAdministrador = page.getByText('Administrador'); // Opção Administrador dentro da lista
    this.dropdownDepartamentoVincular = page.locator('.gap-1.css-14oxtc6 > .p-0').first(); // Campo para abrir a lista de Departamentos
    this.inputSenhaUsuario = page.getByTestId('users-form-input-password'); // Campo Senha
    this.inputConfirmarSenhaUsuario = page.getByTestId('users-form-input-passwordConfirmation'); // Campo Confirmar Senha
    this.botaoSalvarUsuario = page.getByTestId('users-form-button-save'); // Botão Salvar usuário
  }

  // Método para criar um departamento passando o nome por parâmetro
  async criarDepartamento(nomeDepartamento) {
    await this.botaoMenuGrid.click();
    await this.opcaoMenuDepartamentos.click();
    await this.botaoAdicionarDepartamento.click();
    await this.inputNomeDepartamento.fill(nomeDepartamento);
    await this.botaoConfirmarDepartamento.click();
  }

  // Método para criar o usuário e vinculá-lo ao departamento dinâmico
  async criarUsuarioComDepartamento(nomeUsuario, emailUsuario, senhaUsuario, nomeDepartamento) {
    await this.botaoMenuGrid.click();
    await this.opcaoMenuUsuarios.click();
    await this.botaoAdicionarUsuario.click();

    await this.inputNomeUsuario.fill(nomeUsuario);
    await this.inputEmailUsuario.fill(emailUsuario);

    // Abre o campo de perfil e seleciona 'Administrador'
    await this.dropdownPerfil.click();
    await this.opcaoAdministrador.click();

    // Abre o campo de departamento e clica no departamento dinâmico criado neste teste
    await this.dropdownDepartamentoVincular.click();
    await this.page.getByText(nomeDepartamento).click();

    // Preenche as senhas e clica em salvar
    await this.inputSenhaUsuario.fill(senhaUsuario);
    await this.inputConfirmarSenhaUsuario.fill(senhaUsuario);
    await this.botaoSalvarUsuario.click();
  }

  // Validação para checar se o nome do usuário aparece na tabela da listagem
  async validarUsuarioCriado(nomeUsuario) {
    await expect(this.page.getByRole('cell', { name: nomeUsuario }).first()).toBeVisible();
  }
}

module.exports = { CadastroPage };