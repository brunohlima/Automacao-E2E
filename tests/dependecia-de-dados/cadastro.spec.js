import { test, expect } from '@playwright/test';

test('Nível 2 - Dependência de Dados: Criar Departamento e Usuário Vinculado', async ({ page }) => {
  // Gera um número aleatório simples entre 1 e 99
  const numeroAleatorio = Math.floor(Math.random() * 99) + 1;
  
  // Dados dinâmicos e limpos
  const nomeDinamicoDepartamento = `quality assurance ${numeroAleatorio}`;
  const nomeDinamicoUsuario = `Bruno Lima ${numeroAleatorio}`;
  const emailDinamicoUsuario = `test${numeroAleatorio}@automation.com`;

  // 1. Ação: Acessar a plataforma e fazer login
  await page.goto('https://exemplo.com/login');
  
  await page.getByTestId('login-input-email').fill('usuario@exemplo.com');
  await page.getByTestId('login-input-password').fill('SenhaExemplo123');
  await page.getByTestId('login-button-submit').click();

  // 2. Ação: Navegar até a tela de Departamentos e criar um novo
  await page.locator('.lucide.lucide-layout-grid').click();
  await page.getByText('Departamentos').click();
  await page.getByTestId('departments-list-button-add').click();
  
  await page.getByTestId('departments-form-input-name').fill(nomeDinamicoDepartamento);
  await page.getByTestId('departments-form-button-confirm').click();

  // 3. Ação: Navegar até a tela de Usuários e abrir o formulário de cadastro
  await page.locator('.lucide.lucide-layout-grid').click();
  await page.getByTestId('menu-button-users').getByText('Usuários').click();
  await page.getByTestId('users-list-button-add').click();

  // 4. Ação: Preencher os dados gerais do usuário e selecionar o perfil
  await page.getByTestId('users-form-input-name').fill(nomeDinamicoUsuario);
  await page.getByTestId('users-form-input-email').fill(emailDinamicoUsuario);
  
  // Seleciona o perfil de 'Administrador' no primeiro dropdown
  await page.locator('.p-0.css-n9qnu9').first().click();
  await page.getByText('Administrador').click();

  // 5. Ação: Vincular o usuário ao Departamento dinâmico criado no passo anterior
  await page.locator('.gap-1.css-14oxtc6 > .p-0').first().click();
  await page.getByText(nomeDinamicoDepartamento).click();

  // 6. Ação: Preencher as senhas e salvar o usuário
  await page.getByTestId('users-form-input-password').fill('Exemplo@Qa2026');
  await page.getByTestId('users-form-input-passwordConfirmation').fill('Exemplo@Qa2026');
  await page.getByTestId('users-form-button-save').click();

  // Validação: Garantir que o usuário dinâmico criado aparece listado na tela
  await expect(page.getByRole('cell', { name: nomeDinamicoUsuario }).first()).toBeVisible();
});