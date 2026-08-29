// Evita colisao de massa no ambiente de QA compartilhado.
function gerarSufixoUnico() {
  return Date.now().toString();
}

module.exports = { gerarSufixoUnico };
