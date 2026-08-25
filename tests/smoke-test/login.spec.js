const { test, expect } = require('@playwright/test');
const { LoginPage, NavigationMenu } = require('../../pages/loginPage');

test('Nivel 1 - Smoke Test: acesso as telas de Usuarios e Departamentos', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const navMenu = new NavigationMenu(page);

  await loginPage.acessarEAutenticar();

  // Tela de Usuarios: titulo da listagem e botao de cadastro disponiveis
  await navMenu.irParaUsuarios();
  await expect(page.getByTestId('users-list-heading')).toBeVisible();
  await expect(page.getByTestId('users-list-button-add')).toBeVisible();

  // Tela de Departamentos: titulo da listagem e botao de cadastro disponiveis
  await navMenu.irParaDepartamentos();
  await expect(page.getByTestId('departments-list-heading')).toBeVisible();
  await expect(page.getByTestId('departments-list-button-add')).toBeVisible();
});
