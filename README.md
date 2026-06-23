📋 Sobre o projeto

Este projeto contém uma automação E2E desenvolvida com Playwright para validar fluxos da plataforma Digisac, estruturada progressivamente em 4 níveis de complexidade.

Os testes realizam:
🔐 Nível 1: Smoke Test (Acesso rápido e validação de telas)
📦 Nível 2: Dependência de Dados (Cenários de pré-requisitos e cadastros isolados)
🧬 Nível 3: Ciclo de Vida CRUD (Criação, leitura, atualização e exclusão)
🚀 Nível 4: Jornada do Cliente (Fluxo completo ponta a ponta integrado)

🛠️ Tecnologias utilizadas

* JavaScript
* Node.js
* Playwright

📁 Estrutura do projeto

Automacao-E2E-Digisac/
├── pages/
│   └── loginPage.js
├── tests/
│   ├── smoke-test/
│   │   └── login.spec.js
│   ├── dependencia-de-dados/
│   │   └── cadastro.spec.js
│   ├── ciclo-de-vida-crud/
│   │   └── crud.spec.js
│   └── jornada-do-cliente/
│       └── jornada.spec.js
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

📌 Pré-requisitos

Para executar o projeto é necessário ter instalado:
* Node.js
* NPM

Para verificar as versões:
```bash
node -v
npm -v
⚙️ Instalação

Clone o repositório:

Bash
git clone [https://github.com/brunohlima/Automacao-E2E-Digisac](https://github.com/brunohlima/Automacao-E2E-Digisac)
Acesse a pasta do projeto:

Bash
cd Automacao-E2E-Digisac
Instale as dependências:

Bash
npm install
Instale os navegadores utilizados pelo Playwright:

Bash
npx playwright install
🔒 Configuração das variáveis de ambiente

Antes de executar os testes, crie um arquivo .env na raiz do projeto seguindo o modelo abaixo:

Snippet de código
BASE_URL=[https://exemplo.com/login](https://exemplo.com/login)
EMAIL=seu_email@app.com
PASSWORD=sua_senha
USER_PASSWORD_NIVEL2=sua_senha_nivel2
O projeto utiliza variáveis de ambiente para evitar que credenciais fiquem expostas diretamente no código-fonte. Também é disponibilizado um arquivo .env.example como referência.

▶️ Executando os testes

Executar todos os testes da suite:

Bash
npx playwright test
Executar apenas o Smoke Test (Nível 1):

Bash
npx playwright test tests/smoke-test/login.spec.js
Executar apenas a Jornada do Cliente (Nível 4):

Bash
npx playwright test tests/jornada-do-cliente/jornada.spec.js
Executar com navegador aberto (Modo Headed):

Bash
npx playwright test --headed
Abrir a interface visual do Playwright (Modo UI):

Bash
npx playwright test --ui
🧪 Cenários validados por Nível

1. Smoke Test
Valida o login e o carregamento básico das listagens de Usuários e Departamentos após a autenticação.

2. Dependência de Dados
Valida os fluxos de criação e persistência de dados que servem como pré-requisitos para outros módulos.

3. Ciclo de Vida CRUD
Testa o fluxo completo de manipulação de dados (Criação, Leitura, Atualização e Exclusão) de uma entidade.

4. Jornada do Cliente E2E
Simula a experiência real e contínua de um operador utilizando as principais funções da plataforma:

🔐 Realiza o login utilizando credenciais seguras do ambiente.

📶 Cria e configura uma nova conexão de serviço (SMS) vinculando-a a um departamento.

👥 Navega até a aba de contatos e realiza o cadastro completo de um novo cliente.

💬 Abre o chat do contato gerado, limpa tickets anteriores e simula transferências internas de workflow.

✍️ Digita uma mensagem no campo de texto e faz o disparo utilizando o evento nativo de teclado (Enter).

🏁 Conclui com sucesso o encerramento definitivo do ticket de atendimento.

🏗️ Padrão utilizado

O projeto utiliza o padrão Page Object Model (POM) nas suites estruturadas, separando as ações e mapeamentos da interface da lógica direta dos testes. Isso facilita a reutilização de código, a manutenção ágil dos seletores e eleva a legibilidade dos cenários automatizados.

👨‍💻 Autor

Bruno Lima
