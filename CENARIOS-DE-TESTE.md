# Cenários de Teste — Automação E2E Digisac

## 1. Objetivo

Este documento descreve os cenários funcionais e end-to-end utilizados para validar os principais fluxos da aplicação. A cobertura automatizada foi organizada em quatro níveis: smoke test, dependência de dados, ciclo de vida CRUD e jornada completa do cliente.

## 2. Escopo

### Dentro do escopo

- Autenticação de usuário administrador.
- Navegação para Usuários e Departamentos.
- Cadastro de departamento.
- Cadastro individual de usuário vinculado a um departamento.
- Criação, consulta, edição e arquivamento de conexão SMS.
- Cadastro de contato associado a uma conexão.
- Abertura, envio de mensagem e fechamento de chamado.

### Fora do escopo atual

- Cadastro de usuários em massa.
- Recuperação de senha.
- Controle de permissões por perfil.
- Compatibilidade com Firefox e WebKit.
- Execução paralela.
- Remoção automática do usuário e departamento criados no Nível 2.

## 3. Premissas e pré-condições gerais

- O ambiente de QA está disponível.
- As credenciais configuradas no `.env` são válidas.
- O usuário autenticado possui permissão administrativa.
- O departamento definido em `TEST_DEPARTMENT`, ou `Suporte` como padrão, existe e está acessível ao usuário.
- Há disponibilidade na cota de usuários e conexões SMS.
- O número definido em `TEST_PHONE` é aceito pelo ambiente.
- Os testes são executados sequencialmente por utilizarem um ambiente compartilhado.

## 4. Resumo da cobertura automatizada

| ID | Nível | Cenário | Tipo | Prioridade | Status |
|---|---:|---|---|---|---|
| CT-001 | 1 | Acessar Usuários e Departamentos | Smoke | Alta | Automatizado |
| CT-002 | 2 | Criar departamento e usuário vinculado | Funcional | Alta | Automatizado |
| CT-003 | 3 | Executar CRUD de conexão SMS | Regressão | Alta | Automatizado |
| CT-004 | 4 | Executar jornada completa do cliente | E2E | Crítica | Automatizado |

## 5. Cenários automatizados

### CT-001 — Acessar as telas de Usuários e Departamentos

**Objetivo:** validar que o usuário consegue autenticar e acessar as áreas administrativas essenciais.

**Pré-condições:**

- Credenciais válidas configuradas no ambiente.
- Usuário com acesso aos menus de Usuários e Departamentos.

**Passos:**

1. Acessar a aplicação.
2. Informar e-mail e senha válidos.
3. Confirmar o login.
4. Acessar a tela de Usuários.
5. Acessar a tela de Departamentos.

**Resultados esperados:**

- O login é concluído com sucesso.
- O título e o botão de adicionar usuário são exibidos.
- O título e o botão de adicionar departamento são exibidos.

**Automação:** `tests/smoke-test/login.spec.js`

---

### CT-002 — Criar departamento e usuário individual vinculado

**Objetivo:** validar a dependência entre o cadastro de um departamento e a criação de um usuário associado a ele.

**Pré-condições:**

- Usuário autenticado com permissão administrativa.
- Existência de vaga disponível no plano para um novo usuário.
- Senha de teste compatível com as regras de complexidade.

**Massa de dados:**

- Nome do departamento gerado dinamicamente.
- Nome e e-mail do usuário gerados dinamicamente.
- Senha obtida de `USER_PASSWORD_NIVEL2`.

**Passos:**

1. Acessar Departamentos.
2. Criar um departamento com nome único.
3. Filtrar a listagem pelo nome criado.
4. Confirmar a presença do departamento.
5. Acessar Usuários e clicar em Adicionar.
6. Selecionar a opção **Criar um usuário**.
7. Clicar em Continuar.
8. Preencher nome e e-mail.
9. Selecionar o cargo Administrador.
10. Vincular o departamento criado.
11. Preencher e confirmar a senha.
12. Salvar o usuário.
13. Filtrar a listagem pelo e-mail criado.

**Resultados esperados:**

- O departamento é criado e exibido na listagem.
- A opção de cadastro individual permanece selecionada.
- O usuário é criado com o departamento correto.
- O e-mail do usuário é exibido na listagem.

**Automação:** `tests/dependencia-de-dados/cadastro.spec.js`

**Observação:** o usuário permanece ativo após o teste e ocupa uma vaga do plano.

---

### CT-003 — Criar, consultar, editar e arquivar conexão SMS

**Objetivo:** validar o ciclo de vida de uma conexão SMS.

**Pré-condições:**

- Usuário autenticado com acesso às conexões.
- Existência de vaga disponível para conexão SMS.
- Existência de pelo menos um departamento selecionável.

**Massa de dados:**

- Nome inicial e nome editado gerados dinamicamente.

**Passos:**

1. Acessar Conexões.
2. Selecionar a aba de conexões ativas.
3. Adicionar uma conexão SMS.
4. Preencher nome e departamento.
5. Salvar a conexão.
6. Filtrar e validar o nome criado.
7. Editar o nome da conexão.
8. Validar a exibição do nome novo.
9. Validar que o nome antigo não é mais exibido.
10. Arquivar a conexão.
11. Validar que ela não permanece na listagem de ativas.

**Resultados esperados:**

- A conexão é criada e exibida na listagem.
- A edição é persistida corretamente.
- O registro antigo deixa de ser encontrado.
- A conexão é arquivada e removida da lista de ativas.

**Pós-condição:** conexões residuais com o prefixo do teste são arquivadas pelo teardown.

**Automação:** `tests/ciclo-de-vida-crud/crud.spec.js`

---

### CT-004 — Executar a jornada completa do cliente

**Objetivo:** validar o atendimento ponta a ponta, desde a preparação do canal até o encerramento do chamado.

**Pré-condições:**

- Usuário autenticado.
- Departamento de atendimento disponível ao usuário.
- Vaga disponível para conexão SMS.
- Número de contato válido no ambiente.

**Massa de dados:**

- Nome da conexão, contato e mensagem gerados dinamicamente.
- Número obtido de `TEST_PHONE`.
- Departamento obtido de `TEST_DEPARTMENT` ou `Suporte`.

**Passos:**

1. Criar uma conexão SMS no departamento de atendimento.
2. Confirmar a conexão na listagem de ativas.
3. Criar um contato associado à conexão.
4. Filtrar e localizar o contato criado.
5. Acessar o chat do contato.
6. Abrir um chamado.
7. Selecionar o departamento de atendimento.
8. Preencher o comentário de abertura.
9. Confirmar a abertura e eventual transferência.
10. Validar o registro de início do chamado.
11. Digitar e enviar uma mensagem.
12. Fechar o chamado.

**Resultados esperados:**

- A conexão e o contato são criados corretamente.
- O chamado é aberto no departamento esperado.
- O histórico registra o início do chamado.
- A mensagem é enviada quando a API responde com sucesso.
- O chamado é encerrado e o término aparece no histórico.

**Pós-condição:** a conexão criada pela execução é arquivada pelo teardown, desde que não exista chamado aberto associado.

**Automação:** `tests/jornada-do-cliente/jornada.spec.js`

## 6. Critérios de entrada e saída

### Critérios de entrada

- Ambiente acessível.
- Variáveis obrigatórias configuradas.
- Cotas necessárias disponíveis.
- Massa residual crítica removida.

### Critérios de saída

- Todos os cenários automatizados executados.
- Nenhuma falha crítica sem análise.
- Evidências disponíveis no relatório do Playwright.
- Conexões criadas pelos testes arquivadas quando possível.

## 7. Rastreabilidade

| Requisito | Cenário |
|---|---|
| Autenticar e acessar áreas administrativas | CT-001 |
| Criar departamento e usuário relacionado | CT-002 |
| Validar ciclo de vida de conexão SMS | CT-003 |
| Validar atendimento completo do cliente | CT-004 |

