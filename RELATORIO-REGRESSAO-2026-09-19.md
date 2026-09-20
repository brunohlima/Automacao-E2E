# Relatório de regressão — 19/09/2026

## Objetivo e contexto

Verificar se os fluxos automatizados existentes continuam funcionando após mudanças de funcionalidades e layout da plataforma, conforme informado pelo responsável pelos testes.

Os casos estão descritos em [CENARIOS-DE-TESTE.md](CENARIOS-DE-TESTE.md). Este relatório registra os resultados observados na sessão de execução, sem dados dos cadastros ou de acesso ao ambiente.

## Ambiente e identificação

| Item | Registro |
|---|---|
| Ambiente | QA compartilhado |
| Navegador | Chromium |
| Ferramenta | Playwright |
| Execução | Sequencial, com um worker |
| Modos utilizados | Sem interface e com navegador visível |
| Versão/build da plataforma | Não registrada na sessão |
| Revisão da automação | Cópia de trabalho local com alterações; sem commit específico registrado para a bateria |

## Escopo e resultados

| Caso | Fluxo | Resultado |
|---|---|---|
| CT-001 | Login e acesso às telas de Usuários e Departamentos | Passou |
| CT-002 | Criação de departamento e usuário vinculado | Passou |
| CT-003 | Criação, consulta, edição e arquivamento de conexão SMS | Passou |
| CT-004 | Criação de conexão e contato, abertura de chamado, envio de mensagem e encerramento | Passou |

Os quatro níveis foram executados individualmente e, em seguida, em duas baterias completas com navegador visível. Cada bateria completa terminou com **4 testes aprovados**, em aproximadamente **1,6 minuto**, na ordem CT-003, CT-002, CT-004 e CT-001.

Comando das baterias completas:

```bash
npm run test:headed
```

## Ocorrência na automação e ajuste

Durante a limpeza do CT-004, a automação emitiu avisos de falha de interação com o menu ou de ausência do modal de arquivamento. O responsável informou que a conexão havia sido arquivada. Esses avisos não demonstravam, por si só, que o arquivamento havia falhado.

A rotina aguardava o fechamento do modal, mas não a atualização da listagem antes de iniciar outra tentativa. Foi identificada uma possível condição de corrida nessa sequência, sem confirmação de causa por rastreamento da execução original.

Em `pages/crudPage.js`, a limpeza foi ajustada para:

- Aguardar a redução da quantidade de cards na listagem após o arquivamento.
- Verificar a remoção também quando ocorre erro de interação, antes de registrar um aviso.
- Informar que não foi possível confirmar o resultado quando a verificação falhar, sem afirmar que a conexão necessariamente permaneceu ativa.

Os avisos são tratados pela rotina de limpeza e não reprovam automaticamente o teste. Por isso, o resultado aprovado deve ser analisado junto aos registros de limpeza.

## Revalidação após o ajuste

```bash
npx playwright test tests/ciclo-de-vida-crud tests/jornada-do-cliente
```

| Caso | Resultado | Duração do teste |
|---|---|---|
| CT-003 | Passou, sem aviso de limpeza | 22,2 s |
| CT-004 | Passou, sem aviso de limpeza | 29,3 s |

Resultado da revalidação: **2 testes aprovados em 53,0 segundos**, incluindo a inicialização da execução. Os níveis 1 e 2 não foram repetidos após esse ajuste.

## Evidências e confidencialidade

Os resultados acima foram transcritos da saída do Playwright. A configuração do projeto gera relatório HTML em `playwright-report/` e vídeos em `test-results/`. Esses artefatos locais podem ser substituídos por novas execuções; não constituem um arquivo permanente desta bateria.

Nenhum vídeo, captura de tela, log bruto, credencial, URL privada, telefone, e-mail ou identificador de cadastro foi anexado a este relatório. Antes de compartilhar evidências visuais ou relatórios gerados, revisar e ocultar dados sensíveis que possam aparecer na interface.

## Conclusão e limites

Os quatro cenários automatizados passaram após as mudanças informadas na plataforma. Após o ajuste da limpeza, os dois cenários afetados também passaram sem o aviso observado anteriormente.

O resultado cobre somente as verificações implementadas nesses casos. Não representa aprovação de todas as funcionalidades novas ou alteradas, nem validação visual completa do layout. Não foram avaliados outros navegadores, dispositivos móveis, desempenho, segurança ou acessibilidade nesta bateria. A ausência de versão/build registrada limita a rastreabilidade da plataforma testada.

