const { test, expect } = require('../../support/fixtures');
const { PaginaLogin, MenuNavegacao } = require('../../pages/loginPage');

test('Nivel 1 - Teste de fumaca: acesso as telas de Usuarios e Departamentos', async ({ page }) => {
  const paginaLogin = new PaginaLogin(page);
  const menuNavegacao = new MenuNavegacao(page);

  await paginaLogin.acessarEAutenticar();

  await menuNavegacao.irParaUsuarios();
  await expect(page.getByTestId('users-list-heading')).toBeVisible();
  await expect(page.getByTestId('users-list-button-add')).toBeVisible();

  await menuNavegacao.irParaDepartamentos();
  await expect(page.getByTestId('departments-list-heading')).toBeVisible();
  await expect(page.getByTestId('departments-list-button-add')).toBeVisible();
});
