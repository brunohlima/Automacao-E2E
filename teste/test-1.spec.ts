import { test, expect } from '@playwright/test';

test('Smoke Test - Deve logar e validar as telas de Usuários e Departamentos', async ({ page }) => {
  // 1. Ação: Acessar a plataforma e fazer login
  await page.goto('https://exemplo.com/login');
  
  await page.getByTestId('login-input-email').fill('usuario@exemplo.com');
  await page.getByTestId('login-input-password').fill('SenhaExemplo123');
  await page.getByTestId('login-button-submit').click();

  // 2. Ação: Navegar até a tela de Usuários
  await page.locator('.lucide.lucide-layout-grid').click(); 
  await page.getByTestId('menu-button-users').click();

  // Validação: Garantir que a tela de Usuários carregou corretamente
  await expect(page.getByTestId('users-list-heading')).toBeVisible();

  // 3. Ação: Navegar até a tela de Departamentos
  await page.locator('.lucide.lucide-layout-grid').click();
  await page.getByTestId('menu-button-departments').click();

  // Validação: Garantir que a tela de Departamentos carregou corretamente
  await expect(page.getByTestId('departments-list-heading')).toBeVisible();
});
