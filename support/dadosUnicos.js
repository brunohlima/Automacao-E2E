/**
 * Gera um sufixo unico por execucao.
 *
 * Os testes rodam contra um ambiente de QA compartilhado, onde nomes de
 * departamento, e-mail de usuario e nome de conexao precisam ser unicos.
 * Math.random() com faixa curta colide depois de poucas execucoes, entao
 * o sufixo usa o timestamp da execucao.
 */
function gerarSufixoUnico() {
  return Date.now().toString();
}

module.exports = { gerarSufixoUnico };
