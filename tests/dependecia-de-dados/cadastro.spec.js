require('dotenv').config(); // Carrega as variáveis do arquivo .env

const { test } = require('@playwright/test');
const { CadastroPage } = require('../../pages/cadastroPage'); // Importa a nossa Page Object

test('Nível 2 - Criar Departamento e Usuário Vinculado', async ({ page }) => {
  const cadastroPage = new CadastroPage(page); // Cria a instância da Page

  // Geradores Dinâmicos para o sitema não barrar e-mail e departamentos com nomes iguais
  const numeroAleatorio = Math.floor(Math.random() * 99) + 1;
  const nomeDepartamento = `quality assurance ${numeroAleatorio}`;
  const emailUsuario = `test${numeroAleatorio}@automation.com`;

  // Passo 1: Login usando os dados seguros do arquivo .env
  await page.goto(process.env.BASE_URL);
  await page.getByTestId('login-input-email').fill(process.env.EMAIL);
  await page.getByTestId('login-input-password').fill(process.env.PASSWORD);
  await page.getByTestId('login-button-submit').click();

  // Passo 2: Executa o método da Page Object para criar o departamento único
  await cadastroPage.criarDepartamento(nomeDepartamento);

  // Passo 3: Executa o método para criar o usuário (Passando o nome fixo 'Bruno Lima' direto aqui)
  await cadastroPage.criarUsuarioComDepartamento(
    'Bruno Lima', // Nome do usuário fixo
    emailUsuario, // E-mail dinâmico único
    process.env.USER_PASSWORD_NIVEL2, // Senha vinda do .env
    nomeDepartamento // Nome do departamento dinâmico para fazer o vínculo
  );

  // Passo 4: Executa a validação buscando o nome fixo na tabela
  await cadastroPage.validarUsuarioCriado('Bruno Lima');
});