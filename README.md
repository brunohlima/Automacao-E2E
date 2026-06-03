## 📋 Sobre o projeto

Este projeto contém uma automação E2E desenvolvida com Playwright para validar um fluxo básico da plataforma Digisac.

O teste realiza:

* 🔐 Login na aplicação
* 👥 Acesso à tela de Usuários
* ✅ Validação da listagem de usuários
* 🏢 Acesso à tela de Departamentos
* ✅ Validação da listagem de departamentos

## 🛠️ Tecnologias utilizadas

* JavaScript
* Node.js
* Playwright

## 📁 Estrutura do projeto

```text
project/
├── pages/
│   └── loginPage.js
├── tests/
│   └── smoke/
│       └── login.spec.js
├── package.json
└── README.md
```

## 📌 Pré-requisitos

Para executar o projeto é necessário ter instalado:

* Node.js
* NPM

Para verificar as versões:

```bash
node -v
npm -v
```

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/brunohlima/Automacao-E2E-Digisac
```

Acesse a pasta do projeto:

```bash
cd Automacao-E2E-Digisac
```

Instale as dependências:

```bash
npm install
```

Instale os navegadores utilizados pelo Playwright:

```bash
npx playwright install
```

## ▶️ Executando os testes

Executar todos os testes:

```bash
npx playwright test
```

Executar o teste implementado:

```bash
npx playwright test login.spec.js
```

Executar com navegador aberto:

```bash
npx playwright test --headed
```

Abrir a interface do Playwright:

```bash
npx playwright test --ui
```

## 🧪 Cenário validado

O teste realiza o login com um usuário válido e verifica se é possível acessar corretamente as telas de **Usuários** e **Departamentos**, validando o carregamento de ambas após a autenticação.

### Fluxo executado

1. 🔐 Acessa a página de login;
2. ✍️ Realiza a autenticação;
3. 👥 Navega até a tela de Usuários;
4. ✅ Valida a exibição da listagem de usuários;
5. 🏢 Navega até a tela de Departamentos;
6. ✅ Valida a exibição da listagem de departamentos.

## 🏗️ Padrão utilizado

Foi utilizado o padrão **Page Object Model (POM)**, separando as ações da interface da lógica dos testes para facilitar:

* ♻️ Reutilização de código
* 🔧 Manutenção dos testes
* 📖 Melhor legibilidade
* 📈 Escalabilidade do projeto

## 👨‍💻 Autor

**Bruno Lima**
