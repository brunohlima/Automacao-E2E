const { test, expect } = require('../../support/fixtures');
const { LoginPage, NavigationMenu } = require('../../pages/loginPage');

test('Nivel 1 - Smoke Test: acesso as telas de Usuarios e Departamentos', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const navMenu = new NavigationMenu(page);

  await loginPage.acessarEAutenticar();

  await navMenu.irParaUsuarios();
  await expect(page.getByTestId('users-list-heading')).toBeVisible();
  await expect(page.getByTestId('users-list-button-add')).toBeVisible();

  await navMenu.irParaDepartamentos();
  await expect(page.getByTestId('departments-list-heading')).toBeVisible();
  await expect(page.getByTestId('departments-list-button-add')).toBeVisible();
});
