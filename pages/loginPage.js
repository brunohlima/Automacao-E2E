const { expect } = require('@playwright/test');

class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.campoEmail = page.getByTestId('login-input-email');
    this.campoSenha = page.getByTestId('login-input-password');
    this.botaoEntrar = page.getByTestId('login-button-submit');
  }

  async acessar() {
    await this.page.goto('/');
  }

  async realizarLogin(email, senha) {
    await this.campoEmail.fill(email);
    await this.campoSenha.fill(senha);
    await this.botaoEntrar.click();
  }

  async acessarEAutenticar() {
    await this.acessar();
    await this.realizarLogin(process.env.EMAIL, process.env.PASSWORD);
    await expect(this.botaoEntrar).toBeHidden();
  }
}

class MenuNavegacao {
  constructor(page) {
    this.page = page;
    this.botaoMenuGrade = page.locator('.lucide.lucide-layout-grid');
    this.opcaoUsuarios = page.getByTestId('menu-button-users');
    this.opcaoDepartamentos = page.getByTestId('menu-button-departments');
  }

  async irParaUsuarios() {
    await this.botaoMenuGrade.click();
    await this.opcaoUsuarios.click();
  }

  async irParaDepartamentos() {
    await this.botaoMenuGrade.click();
    await this.opcaoDepartamentos.click();
  }
}

module.exports = { PaginaLogin, MenuNavegacao };
