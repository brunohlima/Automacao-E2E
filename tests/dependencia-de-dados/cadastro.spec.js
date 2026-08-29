const { test } = require('../../support/fixtures');
const { LoginPage } = require('../../pages/loginPage');
const { CadastroPage } = require('../../pages/cadastroPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

test('Nivel 2 - Criar Departamento e Usuario vinculado a ele', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cadastroPage = new CadastroPage(page);

  const sufixo = gerarSufixoUnico();
  const nomeDepartamento = `quality assurance ${sufixo}`;
  const nomeUsuario = `usuario automacao ${sufixo}`;
  const emailUsuario = `test${sufixo}@automation.com`;

  await loginPage.acessarEAutenticar();

  await cadastroPage.criarDepartamento(nomeDepartamento);
  await cadastroPage.validarDepartamentoCriado(nomeDepartamento);

  await cadastroPage.criarUsuarioComDepartamento(
    nomeUsuario,
    emailUsuario,
    process.env.USER_PASSWORD_NIVEL2,
    nomeDepartamento
  );
  await cadastroPage.validarUsuarioCriado(emailUsuario);
});
