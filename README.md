# 📋 Sobre o projeto

Este projeto é a entrega do **Desafio Prático de Automação E2E**, desenvolvido com **Playwright**, simulando fluxos reais de um usuário na plataforma **Digisac**.

O desafio é dividido em 4 níveis de complexidade, cada um automatizado em sua própria branch, indo do básico (smoke test) até uma jornada completa de atendimento ao cliente.

> 📌 A branch `main` reflete o projeto completo (nível 4). As branches `feature/nivel-1` a `feature/nivel-4` foram mantidas como histórico da evolução incremental do desenvolvimento, com commits passo a passo.

---

# 🛠️ Tecnologias utilizadas

* JavaScript
* Node.js
* Playwright
* Page Object Model (POM)

---

# 📁 Estrutura do projeto

```bash
Automacao-E2E-Digisac/
├── pages/
│   ├── cadastroPage.js
│   ├── crudPage.js
│   ├── jornadaPage.js
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
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

---

# 📌 Pré-requisitos

Para executar o projeto é necessário ter instalado:

* Node.js
* NPM

Para verificar as versões:

```bash
node -v
npm -v
```

---

# ⚙️ Instalação

## Clone o repositório

```bash
git clone https://github.com/brunohlima/Automacao-E2E-Digisac
```

## Acesse a pasta do projeto

```bash
cd Automacao-E2E-Digisac
```

## Instale as dependências

```bash
npm install
```

## Instale os navegadores utilizados pelo Playwright

```bash
npx playwright install
```

---

# 🔒 Configuração das variáveis de ambiente

Antes de executar os testes, crie um arquivo `.env` na raiz do projeto com as informações de acesso:

```env
BASE_URL=https://
EMAIL=seu_email
PASSWORD=sua_senha
TEST_PHONE=numero_de_teste
```

* `BASE_URL`: URL da plataforma Digisac utilizada no ambiente de QA.
* `EMAIL` / `PASSWORD`: credenciais de acesso ao ambiente de QA.
* `TEST_PHONE`: número utilizado no cadastro de contato no teste de jornada do cliente (evita expor números reais no código-fonte).

O projeto utiliza variáveis de ambiente para evitar que credenciais fiquem expostas diretamente no código-fonte. Um arquivo `.env.example` é disponibilizado como referência.

---

# ▶️ Executando os testes

## Executar todos os testes

```bash
npx playwright test
```

## Executar um nível específico

```bash
npx playwright test tests/smoke-test/login.spec.js
npx playwright test tests/dependencia-de-dados/cadastro.spec.js
npx playwright test tests/ciclo-de-vida-crud/crud.spec.js
npx playwright test tests/jornada-do-cliente/jornada.spec.js
```

## Executar com navegador aberto

```bash
npx playwright test --headed
```

## Abrir a interface do Playwright

```bash
npx playwright test --ui
```

---

# 🧪 Níveis do desafio

## 🟢 Nível 1 — Smoke Test
Login na plataforma e navegação até as telas de CRUD de **Usuários** e **Departamentos**, validando que ambas carregam corretamente (elementos visuais, botões principais e grids).

## 🟡 Nível 2 — Dependência de Dados
Criação de um **Departamento**, seguida da criação de um **Usuário** vinculado obrigatoriamente a esse Departamento recém-criado.

## 🟠 Nível 3 — Ciclo de Vida CRUD
Fluxo completo de uma **Conexão SMS**: criar, visualizar (validar na listagem), atualizar (editar um dado) e arquivar ao final.

## 🔴 Nível 4 — Jornada do Cliente E2E
Fluxo completo simulando o atendimento a um cliente:
* Cadastro e validação de um Contato
* Criação do contato focado em Conexão SMS
* Abertura de um chamado
* Transferência do chamado para a própria fila de atendimento
* Envio de mensagem, validação do envio e fechamento do chamado

---

# 🌿 Estratégia de branches

Cada nível foi desenvolvido em uma branch própria, com commits incrementais registrando o passo a passo da construção:

* `feature/nivel-1`
* `feature/nivel-2`
* `feature/nivel-3`
* `feature/nivel-4`

---

# 🏗️ Padrão utilizado

Foi utilizado o padrão **Page Object Model (POM)**, separando as ações da interface da lógica dos testes para facilitar:

* ♻️ Reutilização de código
* 🔧 Manutenção dos testes
* 📖 Melhor legibilidade
* 📈 Escalabilidade do projeto

---

# ⚠️ Aviso

Este é um projeto pessoal de estudo em automação de testes, criado em ambiente de QA com autorização. Não possui afiliação oficial.

---

# 👨‍💻 Autor

**Bruno Lima**
