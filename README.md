# Inteli - Instituto de Tecnologia e Liderança

<p align="center">
  <a href="https://www.inteli.edu.br/">
    <img src="./assets/inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0">
  </a>
</p>

# Corrije Aí

<div style="width: 500px; text-align: center; margin: 0 auto;">
  <a href="https://git.inteli.edu.br/graduacao/2026-1b/t24/g05/">
    <img src="./assets/logo.png" alt="Corrije Aí" style="border: none; display: inline-block;">
  </a>
</div>

# Grupo 05

## Integrantes

<table align="center">
<tr>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/luiz-gustavo-campos-cazelatto/" target="_blank">
<img src="assets/fotos_integrantes/luiz.jpg" width="120" height="120"><br>
<b>Luiz Gustavo Campos Cazelatto</b>
</a>
</td>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/matheus-viana-de-almeida/" target="_blank">
<img src="assets/fotos_integrantes/matheus.png" width="120" height="120"><br>
<b>Matheus Viana de Almeida</b>
</a>
</td>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/heloisa-kadota/" target="_blank">
<img src="assets/fotos_integrantes/heloisa.jpg" width="120" height="120"><br>
<b>Heloísa Noda Kadota</b>
</a>
</td>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/pablo-marchina/" target="_blank">
<img src="assets/fotos_integrantes/pablo.jpeg" width="120" height="120"><br>
<b>Pablo Marchina Carvalho dos Santos</b>
</a>
</td>

</tr>

<tr>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/joanaracy/" target="_blank">
<img src="assets/fotos_integrantes/joana.jpg" width="120" height="120"><br>
<b>Joana Auriemo Racy</b>
</a>
</td>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/%C3%A1lvaro-leme-de-toledo-almeida-aa88503bb/recent-activity/all/" target="_blank">
<img src="assets/fotos_integrantes/alvaro.PNG" width="120" height="120"><br>
<b>Álvaro Leme de Toledo Almeida</b>
</a>
</td>

<td align="center" width="170">
<a href="https://www.linkedin.com/in/rafael-morgado-ferreira-811a1b3bb/" target="_blank">
<img src="assets/fotos_integrantes/rafael.png" width="120" height="120"><br>
<b>Rafael Morgado Ferreira</b>
</a>
</td>

</tr>
</table>

## Professores

### Orientadora

- <a href="https://www.linkedin.com/in/laizaribeiro/">Laíza Ribeiro Silva</a>

### Instrutores

- <a href="https://www.linkedin.com/in/silva-wesley/?locale=pt-BR">Wesley Santos</a>
- <a href="https://www.linkedin.com/in/pedroteberga/">Pedro Teberga</a>
- <a href="https://www.linkedin.com/in/geraldo-magela-severino-vasconcelos-22b1b220/">Geraldo Magela Severino Vasconcelos</a>
- <a href="https://www.linkedin.com/in/francisco-escobar/">Francisco Escobar</a>
- <a href="https://www.linkedin.com/in/camilanarantes/">Camila Naves Arantes</a>

## Descrição

O Corrije Aí é uma aplicação web desenvolvida para o Instituto Ponte com o objetivo de centralizar a criação, aplicação, correção e acompanhamento de avaliações remotas. A solução atende alunos em situação de vulnerabilidade social que estudam em modelo híbrido, oferecendo uma plataforma única para professores, coordenadores e estudantes realizarem o processo avaliativo com mais organização, segurança e transparência.

O projeto resolve a dispersão atual das avaliações, que podem envolver WhatsApp, e-mail e outras ferramentas não estruturadas. Com a plataforma, provas, questões, respostas, anexos e correções passam a ficar concentrados em um ambiente integrado. O aluno acessa a avaliação por link público, identifica-se, consulta instruções, responde às questões, envia anexos quando necessário e acompanha a conclusão do envio. Professores e coordenadores conseguem criar provas, montar questões, configurar prazos, corrigir respostas discursivas, liberar resultados e consultar indicadores de desempenho.

Além de reduzir perdas de arquivos e retrabalho operacional, o Corrije Aí busca tornar a correção mais padronizada e justa. A aplicação utiliza backend Fastify/TypeScript com PostgreSQL e frontend React/Vite, com testes automatizados, validações de API, regras de autenticação, controle de acesso, documentação OpenAPI/Swagger e evidências técnicas organizadas no WAD.

## Link de Demonstração

- [Demonstração do Corrije Aí](https://www.youtube.com/watch?v=qNYkW6TVNxA&feature=youtu.be)

Validação manual registrada em 26/06/2026: o vídeo possui duração de 3min01s conforme metadados do YouTube, apresenta as principais funcionalidades, possui narração explicativa, mantém qualidade visual adequada e não utiliza música de fundo ou sonoplastia.

## Demonstração e documentação da API

A demonstração funcional pode ser realizada localmente seguindo as instruções abaixo. Com o backend em execução, a documentação OpenAPI/Swagger fica disponível em `http://localhost:3333/docs`.

## Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- `assets`: imagens, logos, fotos dos integrantes, wireframes e materiais visuais utilizados na documentação.
- `documentos`: Web Application Document (WAD), evidências e documentos complementares.
- `documentos/outros`: materiais auxiliares, registros e evidências versionadas das execuções finais.
- `scripts`: scripts auxiliares de validação, incluindo o teste simples de carga/saúde da WebAPI.
- `src`: código-fonte da aplicação web.
- `src/backend`: WebAPI Fastify/TypeScript, regras de negócio, controllers, services, repositories, models, migrations e testes.
- `src/view`: frontend React/Vite, aplicações dos perfis de aluno, professor e coordenador, componentes, hooks, testes e build estático.
- `.gitlab-ci.yml`: pipeline de validação e publicação do frontend no GitLab Pages.
- `docker-compose.yml`: serviço PostgreSQL para desenvolvimento local.
- `package.json`: scripts agregadores para instalação, build, testes, lint, typecheck, coverage, migrations e auditoria.
- `package-lock.json`: travamento das dependências npm.
- `CHANGELOG.md`: histórico técnico detalhado da versão final.
- `README.md`: guia introdutório, institucional e operacional do projeto.

A organização em camadas está em `src`: apresentação em `src/view`; controllers, services e helpers em `src/backend/src`; models, repositories, database e configurações em `src/backend/src`.

## Configuração para Desenvolvimento e Execução do Código

### Pré-requisitos

- Node.js 20 ou superior.
- npm 10 ou superior.
- PostgreSQL 15 ou superior, local, via Docker ou Supabase.
- Navegador moderno.
- Acesso à internet para baixar dependências.

### 1. Clonar o repositório

```sh
git clone https://git.inteli.edu.br/graduacao/2026-1b/t24/g05.git
cd g05
```

### 2. Instalar dependências

Na raiz do repositório:

```sh
npm run install:all
```

Ou, separadamente:

```sh
npm --prefix src/backend ci
npm --prefix src/view ci
```

### 3. Configurar variáveis de ambiente do backend

Crie `src/backend/.env`:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/corrige_ai
DB_APPLICATION_NAME=instituto-ponte-api

SUPABASE_JWT_SECRET=cole_aqui_um_segredo_gerado
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_JWT_ISSUER=

GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
AUTH_MODE=

CPF_ENCRYPTION_KEY=troque-por-uma-chave-com-pelo-menos-32-caracteres
ALUNO_BASE_URL=http://localhost:5173/aluno/prova

DB_POOL_MAX=10
DB_CONNECTION_TIMEOUT_MS=8000
DB_IDLE_TIMEOUT_MS=30000
DB_STATEMENT_TIMEOUT_MS=15000

EMAIL_ADAPTER=fake
EMAIL_PROVIDER=
EMAIL_WEBHOOK_URL=
EMAIL_API_KEY=
EMAIL_FROM=
EMAIL_FAIL_MODE=
EMAIL_TIMEOUT_MS=5000
EMAIL_RETRY_ATTEMPTS=2
EMAIL_RETRY_BACKOFF_MS=100
EMAIL_CIRCUIT_FAILURE_THRESHOLD=3
EMAIL_CIRCUIT_RESET_MS=30000

EXPIRATION_SWEEP_INTERVAL_MS=60000

SUPABASE_STORAGE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=exports
STORAGE_TIMEOUT_MS=8000
STORAGE_RETRY_ATTEMPTS=2
STORAGE_RETRY_BACKOFF_MS=100
```

Gere segredos localmente:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use valores diferentes para `SUPABASE_JWT_SECRET` e `CPF_ENCRYPTION_KEY`. O projeto não usa `SESSION_SECRET`; o equivalente para assinatura/validação local de sessão é `SUPABASE_JWT_SECRET`, enquanto `CPF_ENCRYPTION_KEY` protege CPFs em repouso. Em produção, configure as mesmas variáveis no ambiente do servidor em vez de versionar `.env`.

Para enviar e-mails reais pela Brevo, troque o bloco de e-mail por:

```env
EMAIL_ADAPTER=
EMAIL_PROVIDER=brevo
EMAIL_API_KEY=xkeysib_sua_chave_da_brevo
EMAIL_FROM=Corrije Aí <noreply@seudominio.com>
```

O endpoint padrão usado pelo sistema é `https://api.brevo.com/v3/smtp/email`; `EMAIL_WEBHOOK_URL` só precisa ser preenchido se for necessário sobrescrever esse endpoint. Em produção, use em `EMAIL_FROM` um remetente validado na Brevo.

### 4. Configurar variáveis de ambiente do frontend

Crie `src/view/.env`:

```env
VITE_API_BASE_URL=http://localhost:3333/api/v1
VITE_ALUNO_BASE_URL=http://localhost:5173/aluno/prova
VITE_BASE_PATH=/

VITE_AUTH_MODE=
VITE_TEST_PROFESSOR_EMAIL=professor.avaliador@corrije.ai
VITE_TEST_COORDENADOR_EMAIL=coordenador.avaliador@corrije.ai

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### 4.1. Modo avaliador local sem Supabase/Google

Para permitir validação completa sem acesso ao projeto Supabase do grupo, use o modo local de avaliação.

No backend, defina:

```env
AUTH_MODE=test
EMAIL_ADAPTER=fake
```

No frontend, defina:

```env
VITE_AUTH_MODE=test
VITE_TEST_PROFESSOR_EMAIL=professor.avaliador@corrije.ai
VITE_TEST_COORDENADOR_EMAIL=coordenador.avaliador@corrije.ai
```

Depois de rodar as migrations, crie os usuários mínimos de avaliação:

```sh
cd src/backend
set -a
. ./.env
set +a
psql "$DATABASE_URL"
```

Execute o SQL abaixo:

```sql
WITH coordenador_seed AS (
  INSERT INTO coordenador (nome, email)
  VALUES ('Coordenador Avaliador', 'coordenador.avaliador@corrije.ai')
  ON CONFLICT (email) DO UPDATE SET nome = EXCLUDED.nome
  RETURNING id
),
materia_seed AS (
  INSERT INTO materia (nome, codigo, descricao)
  VALUES ('Matemática', 'MAT-AVAL', 'Matéria de avaliação local')
  ON CONFLICT (nome) DO UPDATE SET codigo = EXCLUDED.codigo, descricao = EXCLUDED.descricao
  RETURNING id
),
professor_seed AS (
  INSERT INTO professor (nome, email, coordenador_id)
  SELECT 'Professor Avaliador', 'professor.avaliador@corrije.ai', id
  FROM coordenador_seed
  ON CONFLICT (email) DO UPDATE
  SET nome = EXCLUDED.nome, coordenador_id = EXCLUDED.coordenador_id
  RETURNING id
)
INSERT INTO materia_professor (materia_id, professor_id)
SELECT materia_seed.id, professor_seed.id
FROM materia_seed, professor_seed
ON CONFLICT DO NOTHING;
```

Com `AUTH_MODE=test` e `VITE_AUTH_MODE=test`, o botão **Entrar com Google** usa o e-mail de avaliador configurado, passa pelo callback local `/auth/google/callback` e cria uma sessão compatível com os fluxos autenticados. Para testar como professor, selecione “Professor” na tela de login; para testar como coordenador, selecione “Coordenador”.

### 5. Subir banco e aplicar migrations

Para subir PostgreSQL local por Docker:

```sh
docker compose up -d postgres
```

Com `DATABASE_URL` apontando para um banco vazio:

```sh
npm run migrate
```

Se existir base legada com CPF em texto plano, execute a migração específica depois de definir `CPF_ENCRYPTION_KEY`:

```sh
npm run migrate:cpf
```

As migrations ficam em `src/backend/src/database/migrations` e rodam em ordem numérica. O schema inicial canônico é `001_initial_schema.sql`.

### 6. Executar em desenvolvimento

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

### 7. Build e execução de produção

```sh
npm run build
npm --prefix src/backend start
npm --prefix src/view preview
```

Em hospedagem real, sirva `src/view/dist` como estático e mantenha o backend com as variáveis de ambiente acima.

### 8. Deploy do frontend no GitLab Pages

O GitLab Pages publica apenas arquivos estáticos. Portanto, antes do deploy, o backend deve estar em uma URL pública HTTPS e com CORS liberado para a URL do Pages.

O repositório inclui `.gitlab-ci.yml` para publicar o frontend em GitLab Pages. No GitLab, configure em `Settings > CI/CD > Variables`:

```env
VITE_API_BASE_URL=https://sua-api-publica.example.com/api/v1
VITE_BASE_PATH=/nome-do-projeto/
VITE_ALUNO_BASE_URL=https://namespace.gitlab.io/nome-do-projeto/aluno/prova
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Fluxo:

1. Envie o código para a branch padrão do GitLab.
2. O job `frontend-check` instala dependências, roda typecheck e testes de contrato.
3. O job `deploy-pages` gera `src/view/dist`, copia para `public` e publica no Pages.
4. Acesse `Deploy > Pages` no GitLab para ver a URL publicada.

Para validação local em modo produção, execute:

```sh
npm run build
npm --prefix src/backend start
npm --prefix src/view preview
```

O preview do frontend fica disponível em `http://localhost:4173` e deve apontar para a WebAPI definida em `VITE_API_BASE_URL`.

### 9. Executar testes e cobertura

Verificações principais:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run audit
```

Cobertura:

```sh
npm run coverage
```

Executar por módulo:

```sh
npm --prefix src/backend run test:unit
npm --prefix src/backend test
npm --prefix src/view test
```

Os testes de integração do backend usam PostgreSQL real. Antes de rodá-los, aponte `DATABASE_URL` para um banco de teste isolado e execute `npm run migrate`.

O script agregador de validação é:

```sh
npm run verify
```

Para incluir o teste simples de carga/saúde, mantenha backend iniciado em `http://127.0.0.1:3333` ou configure `LOAD_TEST_BASE_URL`.

Evidências versionadas da versão final:

- `documentos/outros/evidencias/webapi-npm-test.txt`: `npm test` com backend 54 suítes/438 testes e frontend 31 arquivos/123 testes passando.
- `documentos/outros/evidencias/webapi-npm-test-coverage.txt`: `npm run coverage` com backend em 88,90% statements/89,87% linhas e frontend em 90,84% statements/linhas.

## Validação ponta a ponta autenticada

1. Suba banco, backend e frontend seguindo os passos anteriores.
2. Se estiver em validação local, habilite `AUTH_MODE=test` no backend, `VITE_AUTH_MODE=test` no frontend e rode o SQL de bootstrap do modo avaliador.
3. Abra `http://localhost:5173`.
4. Entre como professor ou coordenador pelo fluxo de autenticação configurado.
5. Como professor, crie uma prova em `Provas > Nova prova`.
6. Adicione questões do banco ou crie uma nova questão.
7. Em `Prova > Configurações`, defina duração, embaralhamento e demais opções.
8. Clique em `Publicar` e informe uma data/hora limite futura.
9. Copie o link de aluno exibido no modal de compartilhamento.
10. Acesse o link em janela anônima, informe os dados do aluno, inicie a prova, responda, anexe arquivos quando permitido e envie.
11. Volte ao professor, abra `Correção`, filtre provas com pendências, corrija respostas discursivas e salve.
12. Abra `Liberação das Notas`, confira pendências, exporte resultados/anexos se necessário e envie os resultados.
13. Entre como coordenador e valide `Painel`, `Gestão de Professores`, `Gestão de Alunos`, listagem de provas, resultados e exportações.

## Resiliência e qualidade

- Timeout de banco configurado em `src/backend/src/database/pool.ts` por `DB_CONNECTION_TIMEOUT_MS`, `DB_IDLE_TIMEOUT_MS` e `DB_STATEMENT_TIMEOUT_MS`.
- Timeout, retry com backoff e circuit breaker de e-mail ficam em `src/backend/src/helpers/resilience.ts` e `src/backend/src/services/email-adapter.ts`.
- Regras de período da prova são validadas no backend ao iniciar, salvar resposta, salvar anexo e finalizar.
- Operações críticas usam constraints, upserts, status condicionais e chaves idempotentes quando aplicável.
- Cliente HTTP do frontend aplica retry/backoff em falhas transitórias, mantendo erros de validação sem retry.
- CPF é cifrado com AES-256-GCM e indexado por HMAC-SHA256.
- Publicação de prova e reversão para rascunho são controladas no backend.

## Checklist de avaliação

- `npm run migrate` sobe banco limpo.
- `npm run lint` passa no frontend.
- `npm run typecheck` passa em backend e frontend.
- `npm --prefix src/backend run test:unit` passa.
- `npm --prefix src/view test` passa.
- `npm test` passa em backend e frontend.
- `npm run build` gera backend e frontend sem erros.
- Backend inicia sem dados obrigatórios preexistentes.
- Frontend abre sem erros impeditivos no terminal ou console.
- Swagger fica disponível em `/docs`.

## Histórico de Lançamentos

### 0.1.0 - 26/06/2026

- Entregue a versão final do MVP.
- Consolidada a criação, aplicação, correção e acompanhamento de provas.
- Corrigida a ordem das migrations para banco limpo.
- Consolidada a proteção de CPF em repouso.
- Implementado bloqueio server-side de tempo de prova para respostas, finalização e anexos.
- Adicionadas estratégias de resiliência para dependências externas.
- Estabilizadas as suítes de testes, build, lint e typecheck da versão final.

## Licença/License

<a href="https://git.inteli.edu.br/graduacao/2026-1b/t24/g05">Corrije Aí</a> © 2026 by
<a href="https://www.inteli.edu.br/">Inteli</a>,
<a href="https://www.linkedin.com/in/%C3%A1lvaro-leme-de-toledo-almeida-aa88503bb/recent-activity/all/">Álvaro Leme de Toledo Almeida</a>,
<a href="https://www.linkedin.com/in/heloisa-kadota/">Heloísa Noda Kadota</a>,
<a href="https://www.linkedin.com/in/joanaracy/">Joana Auriemo Racy</a>,
<a href="https://www.linkedin.com/in/luiz-gustavo-campos-cazelatto/">Luiz Gustavo Campos Cazelatto</a>,
<a href="https://www.linkedin.com/in/matheus-viana-de-almeida/">Matheus Viana de Almeida</a>,
<a href="https://www.linkedin.com/in/pablo-marchina/">Pablo Marchina</a> and
<a href="https://www.linkedin.com/in/rafael-morgado-ferreira-811a1b3bb/">Rafael Morgado Ferreira</a>.

Is licensed under
<a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a>
<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="Creative Commons" style="max-width: 1em; max-height:1em; margin-left: .2em;">
<img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="Attribution" style="max-width: 1em; max-height:1em; margin-left: .2em;">
