const { test } = require('../../support/fixtures');
const { PaginaLogin } = require('../../pages/loginPage');
const { PaginaCadastro } = require('../../pages/cadastroPage');
const { gerarSufixoUnico } = require('../../support/dadosUnicos');

test('Nivel 2 - Criar Departamento e Usuario vinculado a ele', async ({ page }) => {
  const paginaLogin = new PaginaLogin(page);
  const paginaCadastro = new PaginaCadastro(page);

  const sufixo = gerarSufixoUnico();
  const nomeDepartamento = `garantia de qualidade ${sufixo}`;
  const nomeUsuario = `usuario automacao ${sufixo}`;
  const emailUsuario = `test${sufixo}@automation.com`;

  await paginaLogin.acessarEAutenticar();

  await paginaCadastro.criarDepartamento(nomeDepartamento);
  await paginaCadastro.validarDepartamentoCriado(nomeDepartamento);

  await paginaCadastro.criarUsuarioComDepartamento(
    nomeUsuario,
    emailUsuario,
    process.env.USER_PASSWORD_NIVEL2,
    nomeDepartamento
  );
  await paginaCadastro.validarUsuarioCriado(emailUsuario);
});
