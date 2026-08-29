const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByTestId('login-input-email');
    this.passwordInput = page.getByTestId('login-input-password');
    this.submitButton = page.getByTestId('login-button-submit');
  }

  async acessar() {
    await this.page.goto('/');
  }

  async realizarLogin(email, senha) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(senha);
    await this.submitButton.click();
  }

  async acessarEAutenticar() {
    await this.acessar();
    await this.realizarLogin(process.env.EMAIL, process.env.PASSWORD);
    await expect(this.submitButton).toBeHidden();
  }
}

class NavigationMenu {
  constructor(page) {
    this.page = page;
    this.menuGrid = page.locator('.lucide.lucide-layout-grid');
    this.usersOption = page.getByTestId('menu-button-users');
    this.departmentsOption = page.getByTestId('menu-button-departments');
  }

  async irParaUsuarios() {
    await this.menuGrid.click();
    await this.usersOption.click();
  }

  async irParaDepartamentos() {
    await this.menuGrid.click();
    await this.departmentsOption.click();
  }
}

module.exports = { LoginPage, NavigationMenu };
