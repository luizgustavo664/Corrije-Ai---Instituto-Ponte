-- Migration inicial alinhada ao WAD, regras de negocio e casos de uso (UC01 a UC16)
-- Supabase/PostgreSQL com RLS, enums, normalizacao, validacoes de publicacao,
-- fluxo do aluno sem senha por link unico, anexos, autosave, correcao, resultados,
-- envio de e-mail, exportacao e analytics.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- =========================================================
-- Tipos ENUM
-- =========================================================

DO $$
BEGIN
    CREATE TYPE "prova_status" AS ENUM ('rascunho', 'publicada', 'encerrada', 'antiga');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "prova_aluno_status" AS ENUM ('nao_iniciada', 'em_andamento', 'enviada', 'corrigida');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "questao_tipo" AS ENUM ('multipla_escolha', 'verdadeiro_falso', 'discursiva');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "correcao_tipo" AS ENUM ('manual', 'automatica');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "relatorio_tipo" AS ENUM ('desempenho_geral', 'por_aluno', 'por_questao', 'por_materia');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE TYPE "email_status" AS ENUM ('pendente', 'enviado', 'erro');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =========================================================
-- Funcoes utilitarias
-- =========================================================

CREATE OR REPLACE FUNCTION "set_atualizado_em"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."atualizado_em" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- Tabelas base
-- =========================================================

CREATE TABLE "coordenador" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "auth_user_id" UUID NULL UNIQUE REFERENCES auth.users ("id") ON DELETE SET NULL,
    "nome" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coordenador_nome_check"
        CHECK (char_length(btrim("nome")) > 0),
    CONSTRAINT "coordenador_email_unique"
        UNIQUE ("email")
);

CREATE TABLE "professor" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "auth_user_id" UUID NULL UNIQUE REFERENCES auth.users ("id") ON DELETE SET NULL,
    "coordenador_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professor_nome_check"
        CHECK (char_length(btrim("nome")) > 0),
    CONSTRAINT "professor_email_unique"
        UNIQUE ("email"),
    CONSTRAINT "professor_coordenador_id_foreign"
        FOREIGN KEY ("coordenador_id")
        REFERENCES "coordenador" ("id")
        ON DELETE RESTRICT
);

CREATE INDEX "professor_coordenador_id_index"
    ON "professor" ("coordenador_id");

CREATE TABLE "materia" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "codigo" TEXT NULL,
    "descricao" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "materia_nome_check"
        CHECK (char_length(btrim("nome")) > 0),
    CONSTRAINT "materia_codigo_check"
        CHECK ("codigo" IS NULL OR char_length(btrim("codigo")) > 0),
    CONSTRAINT "materia_nome_unique"
        UNIQUE ("nome"),
    CONSTRAINT "materia_codigo_unique"
        UNIQUE ("codigo")
);

CREATE TABLE "materia_professor" (
    "materia_id" UUID NOT NULL,
    "professor_id" UUID NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("materia_id", "professor_id"),

    CONSTRAINT "materia_professor_materia_id_foreign"
        FOREIGN KEY ("materia_id")
        REFERENCES "materia" ("id")
        ON DELETE CASCADE,

    CONSTRAINT "materia_professor_professor_id_foreign"
        FOREIGN KEY ("professor_id")
        REFERENCES "professor" ("id")
        ON DELETE CASCADE
);

CREATE INDEX "materia_professor_professor_id_index"
    ON "materia_professor" ("professor_id");

CREATE TABLE "aluno" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "auth_user_id" UUID NULL UNIQUE REFERENCES auth.users ("id") ON DELETE SET NULL,
    "nome" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "cpf" TEXT NULL,
    "aceitou_termos_em" TIMESTAMPTZ NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aluno_nome_check"
        CHECK (char_length(btrim("nome")) > 0),
    CONSTRAINT "aluno_email_unique"
        UNIQUE ("email"),
    CONSTRAINT "aluno_cpf_unique"
        UNIQUE ("cpf"),
    CONSTRAINT "aluno_cpf_formato_check"
        CHECK ("cpf" IS NULL OR "cpf" ~ '^[0-9]{11}$')
);

CREATE TABLE "tema" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "materia_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tema_nome_check"
        CHECK (char_length(btrim("nome")) > 0),
    CONSTRAINT "tema_materia_nome_unique"
        UNIQUE ("materia_id", "nome"),
    CONSTRAINT "tema_materia_id_foreign"
        FOREIGN KEY ("materia_id")
        REFERENCES "materia" ("id")
        ON DELETE CASCADE
);

CREATE INDEX "tema_materia_id_index"
    ON "tema" ("materia_id");

-- =========================================================
-- Banco de questoes normalizado
-- =========================================================

CREATE TABLE "questao" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "materia_id" UUID NOT NULL,
    "tema_id" UUID NULL,
    "tipo" "questao_tipo" NOT NULL,
    "limite_caracteres" INTEGER NULL,
    "limite_palavras" INTEGER NULL,
    "permite_anexo" BOOLEAN NOT NULL DEFAULT FALSE,
    "pontuacao_padrao" NUMERIC(5, 2) NOT NULL DEFAULT 1,
    "ativa" BOOLEAN NOT NULL DEFAULT TRUE,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questao_pontuacao_padrao_check"
        CHECK ("pontuacao_padrao" > 0),
    CONSTRAINT "questao_limite_caracteres_check"
        CHECK ("limite_caracteres" IS NULL OR "limite_caracteres" > 0),
    CONSTRAINT "questao_limite_palavras_check"
        CHECK ("limite_palavras" IS NULL OR "limite_palavras" > 0),
    CONSTRAINT "questao_discursiva_limites_check"
        CHECK (
            "tipo" = 'discursiva'
            OR ("limite_caracteres" IS NULL AND "limite_palavras" IS NULL AND "permite_anexo" = FALSE)
        ),
    CONSTRAINT "questao_materia_id_foreign"
        FOREIGN KEY ("materia_id")
        REFERENCES "materia" ("id")
        ON DELETE RESTRICT,
    CONSTRAINT "questao_tema_id_foreign"
        FOREIGN KEY ("tema_id")
        REFERENCES "tema" ("id")
        ON DELETE SET NULL
);

CREATE INDEX "questao_materia_id_index"
    ON "questao" ("materia_id");

CREATE INDEX "questao_tema_id_index"
    ON "questao" ("tema_id");

CREATE INDEX "questao_tipo_index"
    ON "questao" ("tipo");

CREATE TABLE "enunciado" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "questao_id" UUID NOT NULL,
    "conteudo_latex" TEXT NOT NULL,
    "url_imagem" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enunciado_conteudo_latex_check"
        CHECK (char_length(btrim("conteudo_latex")) > 0),
    CONSTRAINT "enunciado_questao_id_unique"
        UNIQUE ("questao_id"),
    CONSTRAINT "enunciado_questao_id_foreign"
        FOREIGN KEY ("questao_id")
        REFERENCES "questao" ("id")
        ON DELETE CASCADE
);

-- (file continues from earlier migration content)
