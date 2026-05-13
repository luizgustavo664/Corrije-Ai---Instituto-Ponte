-- Migration revisada para Supabase/PostgreSQL
-- Gerada a partir do export do DrawSQL.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "coordenador" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coordenador_email_unique" UNIQUE ("email")
);

CREATE TABLE "professor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "coordenador_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "professor_email_unique" UNIQUE ("email")
);

CREATE INDEX "professor_coordenador_id_index"
    ON "professor" ("coordenador_id");

CREATE TABLE "materia" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "descricao" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "materia_nome_unique" UNIQUE ("nome")
);

CREATE TABLE "materia_professor" (
    "materia_id" UUID NOT NULL,
    "professor_id" UUID NOT NULL,
    PRIMARY KEY ("materia_id", "professor_id")
);

CREATE TABLE "aluno" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "aluno_email_unique" UNIQUE ("email"),
    CONSTRAINT "aluno_cpf_unique" UNIQUE ("cpf")
);

CREATE TABLE "prova" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "professor_id" UUID NOT NULL,
    "materia_id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "instrucoes" TEXT NULL,
    "tempo_limite_min" INTEGER NULL,
    "data_inicio" TIMESTAMPTZ NULL,
    "data_fim" TIMESTAMPTZ NULL,
    "embaralhar_questoes" BOOLEAN NOT NULL DEFAULT TRUE,
    "embaralhar_alternativas" BOOLEAN NOT NULL DEFAULT TRUE,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "url_acesso" TEXT NULL,
    "qr_code" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "prova_url_acesso_unique" UNIQUE ("url_acesso")
);

CREATE INDEX "prova_professor_id_index"
    ON "prova" ("professor_id");

CREATE INDEX "prova_materia_id_index"
    ON "prova" ("materia_id");

CREATE INDEX "prova_status_index"
    ON "prova" ("status");

CREATE TABLE "questao" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prova_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "ordem_original" INTEGER NOT NULL,
    "pontuacao_max" NUMERIC(5, 2) NOT NULL DEFAULT 1,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "questao_prova_id_ordem_original_unique" UNIQUE ("prova_id", "ordem_original")
);

CREATE INDEX "questao_prova_id_index"
    ON "questao" ("prova_id");

CREATE TABLE "enunciado" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "questao_id" UUID NOT NULL,
    "conteudo_latex" TEXT NOT NULL,
    "url_imagem" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "enunciado_questao_id_unique" UNIQUE ("questao_id")
);

CREATE TABLE "alternativa" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "questao_id" UUID NOT NULL,
    "ordem_original" INTEGER NOT NULL,
    "conteudo_latex" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alternativa_questao_id_ordem_original_unique" UNIQUE ("questao_id", "ordem_original")
);

CREATE INDEX "alternativa_questao_id_index"
    ON "alternativa" ("questao_id");

CREATE TABLE "prova_aluno" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prova_id" UUID NOT NULL,
    "aluno_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'nao_iniciada',
    "inicio_em" TIMESTAMPTZ NULL,
    "enviada_em" TIMESTAMPTZ NULL,
    "ordem_questoes" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "ordem_alternativas" JSONB NOT NULL DEFAULT '[]'::jsonb,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "prova_aluno_prova_id_aluno_id_unique" UNIQUE ("prova_id", "aluno_id")
);

CREATE INDEX "prova_aluno_prova_id_index"
    ON "prova_aluno" ("prova_id");

CREATE INDEX "prova_aluno_aluno_id_index"
    ON "prova_aluno" ("aluno_id");

CREATE INDEX "prova_aluno_status_index"
    ON "prova_aluno" ("status");

CREATE TABLE "resposta_aluno" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prova_aluno_id" UUID NOT NULL,
    "questao_id" UUID NOT NULL,
    "alternativa_id" UUID NULL,
    "resposta_texto" TEXT NULL,
    "url_imagem" TEXT NULL,
    "respondida_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resposta_aluno_prova_aluno_id_questao_id_unique" UNIQUE ("prova_aluno_id", "questao_id")
);

CREATE INDEX "resposta_aluno_prova_aluno_id_index"
    ON "resposta_aluno" ("prova_aluno_id");

CREATE INDEX "resposta_aluno_questao_id_index"
    ON "resposta_aluno" ("questao_id");

CREATE INDEX "resposta_aluno_alternativa_id_index"
    ON "resposta_aluno" ("alternativa_id");

CREATE TABLE "correcao" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "resposta_id" UUID NOT NULL,
    "professor_id" UUID NOT NULL,
    "nota" NUMERIC(5, 2) NOT NULL,
    "comentario" TEXT NULL,
    "corrigida_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "correcao_resposta_id_unique" UNIQUE ("resposta_id")
);

CREATE INDEX "correcao_professor_id_index"
    ON "correcao" ("professor_id");

CREATE TABLE "relatorio" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prova_id" UUID NOT NULL,
    "coordenador_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "url_arquivo" TEXT NULL,
    "gerado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "relatorio_prova_id_index"
    ON "relatorio" ("prova_id");

CREATE INDEX "relatorio_coordenador_id_index"
    ON "relatorio" ("coordenador_id");

ALTER TABLE "professor"
    ADD CONSTRAINT "professor_coordenador_id_foreign"
    FOREIGN KEY ("coordenador_id") REFERENCES "coordenador" ("id");

ALTER TABLE "materia_professor"
    ADD CONSTRAINT "materia_professor_materia_id_foreign"
    FOREIGN KEY ("materia_id") REFERENCES "materia" ("id");

ALTER TABLE "materia_professor"
    ADD CONSTRAINT "materia_professor_professor_id_foreign"
    FOREIGN KEY ("professor_id") REFERENCES "professor" ("id");

ALTER TABLE "prova"
    ADD CONSTRAINT "prova_professor_id_foreign"
    FOREIGN KEY ("professor_id") REFERENCES "professor" ("id");

ALTER TABLE "prova"
    ADD CONSTRAINT "prova_materia_id_foreign"
    FOREIGN KEY ("materia_id") REFERENCES "materia" ("id");

ALTER TABLE "questao"
    ADD CONSTRAINT "questao_prova_id_foreign"
    FOREIGN KEY ("prova_id") REFERENCES "prova" ("id");

ALTER TABLE "enunciado"
    ADD CONSTRAINT "enunciado_questao_id_foreign"
    FOREIGN KEY ("questao_id") REFERENCES "questao" ("id");

ALTER TABLE "alternativa"
    ADD CONSTRAINT "alternativa_questao_id_foreign"
    FOREIGN KEY ("questao_id") REFERENCES "questao" ("id");

ALTER TABLE "prova_aluno"
    ADD CONSTRAINT "prova_aluno_prova_id_foreign"
    FOREIGN KEY ("prova_id") REFERENCES "prova" ("id");

ALTER TABLE "prova_aluno"
    ADD CONSTRAINT "prova_aluno_aluno_id_foreign"
    FOREIGN KEY ("aluno_id") REFERENCES "aluno" ("id");

ALTER TABLE "resposta_aluno"
    ADD CONSTRAINT "resposta_aluno_prova_aluno_id_foreign"
    FOREIGN KEY ("prova_aluno_id") REFERENCES "prova_aluno" ("id");

ALTER TABLE "resposta_aluno"
    ADD CONSTRAINT "resposta_aluno_questao_id_foreign"
    FOREIGN KEY ("questao_id") REFERENCES "questao" ("id");

ALTER TABLE "resposta_aluno"
    ADD CONSTRAINT "resposta_aluno_alternativa_id_foreign"
    FOREIGN KEY ("alternativa_id") REFERENCES "alternativa" ("id");

ALTER TABLE "correcao"
    ADD CONSTRAINT "correcao_resposta_id_foreign"
    FOREIGN KEY ("resposta_id") REFERENCES "resposta_aluno" ("id");

ALTER TABLE "correcao"
    ADD CONSTRAINT "correcao_professor_id_foreign"
    FOREIGN KEY ("professor_id") REFERENCES "professor" ("id");

ALTER TABLE "relatorio"
    ADD CONSTRAINT "relatorio_prova_id_foreign"
    FOREIGN KEY ("prova_id") REFERENCES "prova" ("id");

ALTER TABLE "relatorio"
    ADD CONSTRAINT "relatorio_coordenador_id_foreign"
    FOREIGN KEY ("coordenador_id") REFERENCES "coordenador" ("id");
