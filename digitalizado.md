## RTM — Matriz de Rastreabilidade

| Persona | RF | RN | História / Fluxo | Endpoint / Tela | Evidência | Status / Justificativa |
|---|---|---|---|---|---|---|
| Aluno — Edgar Romeo | RF009: identificação por nome, e-mail e CPF sem senha complexa | RN08: identificar aluno e impedir múltiplas submissões | US08 — Acessar prova pelo portal do aluno | `POST /api/v1/public/provas/:urlAcesso/iniciar` | `documentos/wad.md` linhas de RF009/RN08; `src/backend/src/tests/aluno-portal.integration.spec.ts` | Implementado no backend |
| Aluno — Edgar Romeo | RF012: upload de múltiplas imagens ou arquivos por questão | RN04: controlar envio de arquivos permitidos | US09 — Responder prova no mobile com anexos | `POST /api/v1/public/respostas/:respostaId/anexos` | `src/backend/src/tests/resposta-anexo.integration.spec.ts`; `resposta-anexo.routes.ts` | Implementado no backend |
| Aluno — Edgar Romeo | RF026: avisos de questões em branco e resumo antes do envio | RN12: validar submissão da prova | US11 — Revisar e confirmar envio final | `POST /api/v1/public/provas-aluno/:provaAlunoId/enviar` | `src/backend/src/tests/resposta-aluno.integration.spec.ts` | Implementado no backend |
| Professor — Ronaldo Silva | RF014: correção isonômica por questão | RN13: permitir correção por questão | US12 — Corrigir prova por item | `GET /api/v1/provas/:provaId/correcao/questoes` e respostas por questão | `src/backend/src/routes/correcao.routes.ts`; `src/backend/src/tests/correcao.integration.spec.ts`; evidência do `alvaro.spec.ts` | Implementado no backend |
| Professor — Ronaldo Silva | RF015: campos de nota e comentário na resposta | RN13: atribuição de notas e comentários | US12 — Correção manual de resposta | `PATCH /respostas/:respostaId/nota` na atividade Alvaro; contrato WAD também referencia `PUT /api/v1/respostas/:respostaId/correcao` | Evidência terminal: 4 testes em `alvaro.spec.ts` passaram; `correcao.repository.ts` | Implementado e testado na Ponderada 2 |
| Professor — Ronaldo Silva | RF016: galeria para ampliação de fotos durante correção | RN13: visualização adequada dos anexos | US12 — Correção com anexos | Respostas de correção retornam anexos | `src/backend/src/routes/correcao.routes.ts`; `src/backend/src/repositories/resposta-anexo.repository.ts` | Parcial: backend entrega anexos; galeria visual depende do frontend |
| Professor — Ronaldo Silva | RF021: professor cria, edita e exclui avaliações | RN18: somente professor autenticado pode gerir avaliações | US03 — Criar prova | `POST /api/v1/provas`; `PUT /api/v1/provas/:provaId`; `DELETE /api/v1/provas/:provaId` | `src/backend/src/tests/prova-publicacao.integration.spec.ts`; `prova.service.ts` | Implementado no backend |
| Coordenadora — Valéria dos Santos | RF018: coordenador visualiza todas as provas | RN17: coordenador visualiza e filtra provas | Painel coordenador | `GET /api/v1/coordenador/provas` | `src/backend/src/tests/coordenador-prova.integration.spec.ts`; `coordenador.routes.ts` | Implementado no backend |
| Coordenadora — Valéria dos Santos | RF019: relatórios de desempenho e estatísticas | RN17: gerar relatórios e analytics | Analytics de prova | `GET /api/v1/provas/:provaId/analytics`; `POST /api/v1/logs` | `src/backend/src/tests/analytics.integration.spec.ts`; `analytics.service.ts` | Implementado no backend |
| Coordenadora — Valéria dos Santos | RF017: planilhas Excel com resultados por aluno e questão | RN14: processar e disponibilizar resultados | US14 — Exportar resultados | `GET /api/v1/provas/:provaId/resultados`; `POST /api/v1/provas/:provaId/resultados/exportar` | `src/backend/src/tests/resultado.integration.spec.ts`; `resultado.service.ts` | Implementado no backend |

## RNFs — 8 Eixos

| Eixo | RNF definido na Ponderada 1 | Como o projeto atende | Evidência concreta |
|---|---|---|---|
| USAB — Usabilidade | Sistema utilizável em mobile e compreensível para alunos com baixo letramento digital | O WAD define interface simplificada, portal do aluno e fluxo por link único; o backend entrega dados públicos da prova e instruções para a tela inicial | `documentos/wad.md` seção 3.1.3; `aluno-portal.integration.spec.ts` |
| CONF — Confiabilidade | Integridade de respostas e arquivos enviados | Respostas, anexos, correções e resultados são persistidos em PostgreSQL; testes validam persistência real | `resposta-aluno.integration.spec.ts`, `resposta-anexo.integration.spec.ts`, `alvaro.spec.ts` |
| DES — Desempenho | Responder ações principais de forma eficiente | Backend Node/Fastify, pool PostgreSQL e endpoints segmentados por recurso; pendente teste de carga formal | Evidência parcial: `src/backend/src/app.ts`, `src/backend/src/database/pool.ts`; pendente k6/Artillery |
| SUP — Suportabilidade | Arquitetura modular e testes para evitar regressão | Projeto organizado em controller, service, repository, schema, routes e tests; Ponderada 2 reforçou fluxo completo | `src/backend/src/controllers`, `services`, `repositories`, `tests`; `alvaro.spec.ts` |
| SEG — Segurança | Restringir acesso, proteger dados pessoais e validar inputs | Auth para perfis internos, validação Zod, consentimento LGPD do aluno e rotas protegidas | `auth.routes.ts`, `middlewares/auth.ts`, `aluno-portal.integration.spec.ts`, `documentos/wad.md` |
| CAP — Capacidade | Suportar múltiplos usuários simultâneos | Arquitetura assíncrona Node.js e pool de conexões; pendente teste formal de carga | Evidência parcial: `pool.ts`; pendente teste de carga |
| REST — Restrições de Design | Aluno sem login/senha e sem APIs externas não autorizadas | Aluno acessa por URL única; OAuth apenas para professor/coordenador; Ponderada 2 usa banco real e não mocka repository | `documentos/wad.md` RF008/RF009/RF002; `auth.service.ts`; `alvaro.spec.ts` |
| ORG — Organizacionais | Documentação e entrega reproduzível | WAD documenta RF/RN/RNF, rotas e evidências; testes Jest executáveis por `npm test` | `documentos/wad.md`; evidência terminal do `npm test -- alvaro.spec.ts --verbose` |

## Registro de Mudanças de Contrato

| Item | Modelado / esperado | Implementado / observado | Impacto | Justificativa / rastreabilidade |
|---|---|---|---|---|
| Endpoint da atividade Alvaro | WAD referencia correção manual em `/api/v1/respostas/:respostaId/correcao` com método `PUT` | Ponderada 2 testou `PATCH /respostas/:respostaId/nota` | Mudança de contrato de rota e método | Mantém o mesmo objetivo funcional RF015/RN13, mas deve ser registrado para alinhamento futuro |
| Nome do comentário | WAD/backend usam `observacao` em `correcao` | Payload da atividade usa `comentario` | Mapeamento de contrato entre API e banco | Repository persiste `comentario` como `observacao` |
| Publicação da prova no seed | Seria simples criar prova publicada | Banco real impede publicar prova sem questão e enunciado | Seed precisou respeitar triggers reais | `alvaro.spec.ts` cria prova como `rascunho`, adiciona enunciado/questão e depois publica |
| Banco real da atividade | Teste poderia usar banco fake ou mock | Atividade foi conectada ao PostgreSQL/Supabase real via `.env` | Aumenta fidelidade do teste | Evidência terminal mostra `.env` carregado e 4 testes passando |
| Enum `questao_tipo` | Migration local esperava `multipla_escolha`, `verdadeiro_falso`, `discursiva` | Banco real tinha diferença inicial no enum | Ajuste de compatibilidade necessário antes do seed | Registrado como mudança de contrato/schema entre modelagem e banco real |



## Evidência da Ponderada 2

```text
alvarolemedetoledoalmeida@Alvaros-MacBook-Air g05 % cd /Users/alvarolemedetoledoalmeida/Desktop/g05/src/backend
npm test -- alvaro.spec.ts --verbose

> servidor@1.0.0 test
> node --experimental-vm-modules node_modules/jest/bin/jest.js alvaro.spec.ts --verbose

  console.log
    ◇ injected env (2) from .env // tip: ⌘ suppress logs { quiet: true }

      at _log (node_modules/dotenv/lib/main.js:131:11)

(node:87599) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
 PASS  src/tests/alvaro.spec.ts
  PATCH /respostas/:respostaId/nota - fluxo controller/service/repository/banco
    ✓ deve corrigir uma resposta existente com sucesso (497 ms)
    ✓ deve rejeitar nota maior que a pontuacao maxima da questao (438 ms)
    ✓ deve rejeitar payload invalido (652 ms)
    ✓ deve persistir nota e comentario no banco (449 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        3.121 s
```
