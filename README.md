# Corrije ai

Sistema web para criacao, aplicacao, correcao e acompanhamento de provas do Instituto Ponte. A aplicacao possui backend Fastify/TypeScript com PostgreSQL e frontend React/Vite para os perfis de professor, coordenador e aluno.

## Estrutura

- `src/backend`: WebAPI, regras de negocio, repositories, models, migrations e testes.
- `src/view`: frontend React/Vite e testes de interface/contrato.
- `documentos`: WAD, evidencias e documentacao complementar.
- `assets`: imagens, wireframes e materiais do projeto.

A organizacao em camadas esta em `src`: apresentacao em `src/view`, controllers/services/helpers em `src/backend/src`, models/repositories/database/config em `src/backend/src`.

## Pre-requisitos

- Node.js 20 ou superior.
- npm 10 ou superior.
- PostgreSQL 15 ou superior, local, Docker ou Supabase.
- Navegador moderno.

## Instalacao

Na raiz do repositorio:

```sh
npm run install:all
```

Ou, separadamente:

```sh
npm --prefix src/backend ci
npm --prefix src/view ci
```

## Configuracao do backend

Crie `src/backend/.env`:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/corrije_ai

# Segredo JWT usado pelo middleware de autenticacao (equivalente ao SESSION_SECRET).
SUPABASE_JWT_SECRET=cole_aqui_um_segredo_gerado
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_JWT_ISSUER=

# OAuth Google usado pelo login de professor/coordenador.
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# Opcional apenas para validacao local sem OAuth real.
AUTH_MODE=

# Chave de 32+ caracteres usada na cifragem/migracao de CPF.
CPF_ENCRYPTION_KEY=troque-por-uma-chave-com-pelo-menos-32-caracteres

# Frontend do aluno usado para gerar links publicos de prova.
ALUNO_BASE_URL=http://localhost:5173/aluno/prova

# Banco/resiliencia.
DB_POOL_MAX=10
DB_CONNECTION_TIMEOUT_MS=8000
DB_IDLE_TIMEOUT_MS=30000
DB_STATEMENT_TIMEOUT_MS=15000

# Provedor de email opcional para envio de resultados.
EMAIL_ADAPTER=fake
EMAIL_WEBHOOK_URL=
EMAIL_API_KEY=

# Storage opcional para exportacoes/anexos.
SUPABASE_STORAGE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=exports
```

Gere segredos localmente:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use valores diferentes para `SUPABASE_JWT_SECRET` e `CPF_ENCRYPTION_KEY`. Em producao, configure as mesmas variaveis no ambiente do servidor em vez de versionar `.env`.

## Configuracao do frontend

Crie `src/view/.env`:

```env
VITE_API_URL=http://localhost:3333/api/v1
VITE_ALUNO_BASE_URL=http://localhost:5173/aluno/prova

# Apenas se a autenticacao externa/Supabase for usada no ambiente.
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Banco e migrations

Com `DATABASE_URL` apontando para um banco vazio:

```sh
npm run migrate
```

Se existir base legada com CPF em texto plano, execute a migracao especifica depois de definir `CPF_ENCRYPTION_KEY`:

```sh
npm run migrate:cpf
```

As migrations ficam em `src/backend/src/database/migrations` e rodam em ordem numerica. O schema inicial cria tabelas, enums, triggers, RLS compativel com Supabase e regras de janela de prova.

## Executar em desenvolvimento

Terminal 1:

```sh
npm --prefix src/backend run dev
```

Terminal 2:

```sh
npm --prefix src/view run dev
```

URLs:

- Frontend: `http://localhost:5173`
- WebAPI: `http://localhost:3333`
- Swagger/OpenAPI: `http://localhost:3333/docs`
- Healthcheck: `http://localhost:3333/api/v1/health`

## Build e execucao de producao

```sh
npm run build
npm --prefix src/backend start
npm --prefix src/view preview
```

Em hospedagem real, sirva `src/view/dist` como estatico e mantenha o backend com as variaveis de ambiente acima.

## Testes

Verificacoes principais:

```sh
npm run typecheck
npm test
```

Cobertura:

```sh
npm run coverage
```

Executar por modulo:

```sh
npm --prefix src/backend run test:unit
npm --prefix src/backend test
npm --prefix src/view test
```

Os testes de integracao do backend usam PostgreSQL real. Antes de roda-los, aponte `DATABASE_URL` para um banco de teste isolado e rode `npm run migrate`.

## Validacao ponta a ponta autenticada

1. Suba banco, backend e frontend seguindo os passos anteriores.
2. Abra `http://localhost:5173`.
3. Entre como professor ou coordenador pelo fluxo de autenticacao configurado. Em ambiente de avaliacao sem OAuth real, use os endpoints documentados em `/docs` para criar/validar uma sessao de teste conforme `auth.controller.ts`.
4. Como professor, crie uma prova em `Provas > Nova prova`. Confirme o feedback de rascunho salvo.
5. Adicione questoes do banco ou crie uma nova questao. Questoes aceitam imagem no enunciado e alternativas quando informado `urlImagem`; respostas de aluno aceitam anexos conforme regras da API.
6. Em `Prova > Configuracoes`, defina duracao, embaralhamento e demais opcoes.
7. Clique em `Publicar` e informe apenas uma data/hora limite futura. O backend define `dataInicio` como o momento da publicacao e grava `dataFim` com o limite informado.
8. Copie o link de aluno exibido no modal de compartilhamento.
9. Acesse o link em janela anonima, informe os dados do aluno, inicie a prova, responda, anexe arquivos quando permitido e envie.
10. Volte ao professor, abra `Correcao`, filtre provas com pendencias, corrija respostas discursivas e salve. O sistema exibe confirmacao e atualiza pendencias.
11. Abra `Liberacao das Notas`, confira pendencias, exporte resultados/anexos se necessario e envie os resultados.

## Resiliencia e qualidade

- Timeout de banco configurado em `src/backend/src/database/pool.ts` por `DB_CONNECTION_TIMEOUT_MS`, `DB_IDLE_TIMEOUT_MS` e `DB_STATEMENT_TIMEOUT_MS`.
- Regras de periodo da prova sao validadas no backend ao iniciar, salvar resposta e finalizar.
- Operacoes criticas usam constraints, upserts, status condicionais e chaves idempotentes onde aplicavel.
- Cliente HTTP do frontend aplica retry/backoff em falhas transitorias, mantendo erros de validacao sem retry.
- Fluxos de professor possuem filtros, busca, status visual, priorizacao de provas abertas/com correcao pendente, aviso de alteracoes nao salvas e feedbacks padronizados.
- Publicacao de prova e reversao para rascunho sao controladas no backend; provas com tentativas/submissoes nao podem ser tiradas da publicacao.

## Checklist de avaliacao

- `npm run migrate` sobe banco limpo.
- `npm run typecheck` passa em backend e frontend.
- `npm --prefix src/backend run test:unit` passa.
- `npm --prefix src/view test` passa.
- Backend inicia sem dados obrigatorios preexistentes.
- Frontend abre sem erros impeditivos no terminal ou console.
- Swagger fica disponivel em `/docs`.

## Licenca

Corrije ai (2026), projeto academico Inteli/Instituto Ponte. Consulte a documentacao do repositorio para creditos completos dos integrantes e orientadores.
