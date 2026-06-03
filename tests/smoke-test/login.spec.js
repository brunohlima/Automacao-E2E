const { test, expect } = require('@playwright/test');

const { LoginPage, NavigationMenu } = require('../../pages/loginPage');

test('Smoke Test - Deve validar o acesso às telas de Usuários e Departamentos', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const navMenu = new NavigationMenu(page);

  await loginPage.acessar();
  await loginPage.realizarLogin('usuario@exemplo.com', 'SenhaExemplo123');

  await navMenu.irParaUsuarios();
  await expect(page.getByTestId('users-list-heading')).toBeVisible();

  await navMenu.irParaDepartamentos();
  await expect(page.getByTestId('departments-list-heading')).toBeVisible();
});