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
* GitHub Actions

---

# 📁 Estrutura do projeto

```bash
Automacao-E2E-Digisac/
├── .github/
│   └── workflows/
│       └── e2e.yml
├── pages/
│   ├── cadastroPage.js
│   ├── crudPage.js
│   ├── jornadaPage.js
│   └── loginPage.js
├── support/
│   └── dadosUnicos.js
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
├── LICENSE
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

Antes de executar os testes, copie o arquivo `.env.example` para `.env` e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Utilizada em | Descrição |
| --- | --- | --- |
| `BASE_URL` | Todos os níveis | URL de login da plataforma no ambiente de QA. |
| `EMAIL` | Todos os níveis | E-mail do usuário administrador usado no login. |
| `PASSWORD` | Todos os níveis | Senha do usuário administrador usado no login. |
| `USER_PASSWORD_NIVEL2` | Nível 2 | Senha atribuída ao usuário criado durante o teste. Precisa atender à política da plataforma (veja abaixo). |
| `TEST_PHONE` | Nível 4 | Número usado no cadastro do contato, evitando expor números reais no código. |

> ⚠️ A plataforma valida a complexidade da senha do usuário criado no nível 2. `USER_PASSWORD_NIVEL2` precisa ter no mínimo 8 caracteres, ao menos 1 letra maiúscula, 1 minúscula, 1 número e 1 caractere especial, sem sequências ou palavras conhecidas. Sem isso o botão Salvar permanece desabilitado e o teste falha.

> ⚠️ Uma conexão SMS recém-criada leva alguns instantes para ativar no provedor. Enquanto isso, a plataforma exibe "Conexão inativa" no lugar do botão de abrir o chamado — o nível 4 aguarda essa ativação antes de seguir.

O arquivo `.env` está no `.gitignore`: nenhuma credencial é versionada. O carregamento é centralizado no `playwright.config.js`, e a `BASE_URL` alimenta o `baseURL` do Playwright.

---

# ▶️ Executando os testes

```bash
npm test                # todos os níveis
npm run test:nivel1     # smoke test
npm run test:nivel2     # dependência de dados
npm run test:nivel3     # ciclo de vida CRUD
npm run test:nivel4     # jornada do cliente
```

Modos auxiliares:

```bash
npm run test:headed     # com o navegador visível
npm run test:ui         # interface interativa do Playwright
npm run report          # abre o último relatório HTML
```

> ⚠️ Os testes criam dados reais (departamentos, usuários, conexões, contatos e chamados) em um ambiente de QA compartilhado. Por isso a execução é sequencial (`fullyParallel: false`, `workers: 1`) e roda apenas em Chromium, evitando que uma execução interfira na outra.

---

# 🧪 Níveis do desafio

## 🟢 Nível 1 — Smoke Test
Login na plataforma e navegação até as telas de **Usuários** e **Departamentos**, validando que o título da listagem e o botão de cadastro de cada tela ficam visíveis.

## 🟡 Nível 2 — Dependência de Dados
Criação de um **Departamento** com nome único e validação dele na listagem. Em seguida, criação de um **Usuário** vinculado obrigatoriamente a esse departamento recém-criado, validado pelo e-mail na listagem.

## 🟠 Nível 3 — Ciclo de Vida CRUD
Ciclo completo de uma **Conexão SMS**:

* **Create** — cria a conexão vinculada a um departamento
* **Read** — valida a conexão na listagem
* **Update** — edita o nome e valida que o nome novo entrou e o antigo saiu da listagem
* **Delete** — arquiva a conexão e valida que ela saiu da listagem

## 🔴 Nível 4 — Jornada do Cliente E2E
Fluxo ponta a ponta de um atendimento:

* Criação da **Conexão SMS** que serve de canal, validada na listagem
* Cadastro do **Contato**, validado na listagem
* Abertura do **chamado** no chat, validada pela mensagem de início
* **Transferência** do chamado, validada pelo registro no histórico
* **Envio da mensagem**, validado pela mensagem no chat
* **Fechamento** do chamado, validado pela mensagem de encerramento

---

# 🤖 Integração contínua

O workflow `.github/workflows/e2e.yml` roda a cada push e pull request na `main`, instalando as dependências e validando que a suíte carrega sem erros.

A execução do smoke test contra o ambiente de QA fica em um job separado, acionado manualmente (`workflow_dispatch`), porque depende de credenciais privadas. Para habilitá-lo, cadastre `BASE_URL`, `EMAIL` e `PASSWORD` em **Settings > Secrets and variables > Actions**.

---

# 🌿 Estratégia de branches

Cada nível foi desenvolvido em uma branch própria, com commits incrementais registrando o passo a passo da construção:

* `feature/nivel-1`
* `feature/nivel-2`
* `feature/nivel-3`
* `feature/nivel-4`

---

# 🏗️ Padrão utilizado

Foi utilizado o padrão **Page Object Model (POM)**, separando as ações da interface da lógica dos testes:

* ♻️ **Reutilização** — o login vive apenas na `LoginPage` e é reaproveitado pelos quatro níveis
* 🎯 **Seletores estáveis** — preferência por `data-testid` sobre classes de CSS geradas em build
* 🔀 **Massa dinâmica** — `support/dadosUnicos.js` gera nomes únicos por execução, evitando colisão de dados
* ✅ **Asserções explícitas** — cada etapa termina em um `expect`, e não apenas no clique
* 🔧 **Manutenção e escalabilidade** — mudanças de tela ficam concentradas nas Pages

---

# ⚠️ Aviso

Este é um projeto pessoal de estudo em automação de testes, criado em ambiente de QA com autorização. Não possui afiliação oficial.

---

# 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).

---

# 👨‍💻 Autor

**Bruno Lima**
