Fala, Bruno! Chegou a hora do Boss ~~quase~~ Final.

Sua missão agora é automatizar fluxos reais da nossa plataforma utilizando Playwright. Eu quero ver o seu código simulando um usuário de verdade, garantindo que o sistema está funcionando do básico ao avançado.

Crie um repositório **privado** no GitHub para este desafio e me adicione como colaborador para que eu possa fazer o Code Review depois. O desafio está dividido em 4 níveis de complexidade. Você deve automatizar todos eles:

### ⚙️ Ambiente de Teste
As credenciais do ambiente de QA foram entregues em particular e não são versionadas.
Configure-as no arquivo `.env` local, conforme o `.env.example`:

* **URL:** variável `BASE_URL`
* **Usuário:** variável `EMAIL`
* **Senha:** variável `PASSWORD`

### 🟢 Nível 1: O "Smoke Test" (Pequeno)
* **Ação:** Fazer login na plataforma.
* **Ação:** Navegar até as telas de CRUD de "Usuários" e "Departamentos".
* **Validação:** Garantir que as telas carregam corretamente, validando elementos visuais e a usabilidade básica (verificar se botões principais e grids existem).

### 🟡 Nível 2: Dependência de Dados (Médio)
* **Ação:** Acessar a tela de Departamentos e criar um novo Departamento.
* **Ação:** Acessar a tela de Usuários e criar um novo Usuário.
* **Validação:** O usuário criado precisa ser vinculado obrigatoriamente ao Departamento que você acabou de criar no passo anterior.

### 🟠 Nível 3: Ciclo de Vida CRUD (Médio-Grande)
* **Ação:** Automatizar o fluxo completo de uma Conexão SMS.
* **Validação:** O fluxo deve Criar, Visualizar (validar se está na lista), Atualizar (editar um dado) e Arquivar a conexão SMS no final.

### 🔴 Nível 4: A Jornada do Cliente E2E (Grande)
* **Ação:** Cadastro e validação na tela de Contatos.
* **Ação:** Criação de um contato focado em Conexão SMS.
* **Ação:** Abertura de um chamado.
* **Ação:** Transferência do chamado para a sua própria fila de atendimento.
* **Ação:** Envio de uma mensagem.
* **Validação:** Validar se a mensagem foi enviada corretamente e, em seguida, fechar o chamado.

---

### 📌 O que eu espero na entrega:
1. Me adicionar como colaborador no repositório **privado** (Meu usuário: `renannasc2`).
2. Um `README.md` no projeto com o passo a passo de como eu faço para instalar as dependências e rodar os seus testes aqui na minha máquina.
3. **Branches e Commits:** Quero uma branch separada para cada nível (ex: `feature/nivel-1`, `feature/nivel-2`). Não é para fazer tudo e commitar de uma vez só! Vá commitando passo a passo durante a construção para eu ver a sua linha de raciocínio.
4. **Prazo:** Leve o tempo que for necessário para fazer bem feito, mas não vai levar a vida toda, hein! kkk

### 🔍 Como vai funcionar a Avaliação (Code Review):
Você vai me avisar a cada entrega. Eu vou analisar todo o seu projeto sozinho primeiro, lendo o código e mapeando os pontos de melhoria, sem estarmos em call. 
Depois que eu tiver tudo anotado, vamos marcar uma call 1:1. Nessa reunião, vou te passar os pontos de Code Review, tirar dúvidas e te dar a missão de resolver os apontamentos, exatamente como trabalhamos no dia a dia entre QAs!

Boa sorte e manda bala! 🚀