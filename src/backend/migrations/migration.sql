
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";


CREATE OR REPLACE FUNCTION "set_atualizado_em"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."atualizado_em" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "email_usuario_autenticado"()
RETURNS CITEXT AS $$
BEGIN
    RETURN NULLIF(auth.jwt() ->> 'email', '')::CITEXT;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION "eh_coordenador_autenticado"()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "coordenador" c
        WHERE c."email" = "email_usuario_autenticado"()
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION "eh_professor_autenticado"()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM "professor" p
        WHERE p."email" = "email_usuario_autenticado"()
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =========================================================
-- Tabelas base
-- =========================================================

CREATE TABLE "coordenador" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    "nome" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "cpf_hash" TEXT NULL,
    "cpf_mascarado" TEXT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aluno_nome_check"
        CHECK (char_length(btrim("nome")) > 0),
    CONSTRAINT "aluno_email_unique"
        UNIQUE ("email"),
    CONSTRAINT "aluno_cpf_hash_unique"
        UNIQUE ("cpf_hash"),
    CONSTRAINT "aluno_cpf_hash_formato_check"
        CHECK ("cpf_hash" IS NULL OR "cpf_hash" ~ '^[a-f0-9]{64}$'),
    CONSTRAINT "aluno_cpf_mascarado_formato_check"
        CHECK ("cpf_mascarado" IS NULL OR "cpf_mascarado" ~ '^\*{3}\.\*{3}\.\*{3}-[0-9]{2}$')
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
-- Banco de questoes
-- =========================================================

CREATE TABLE "questao" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "materia_id" UUID NOT NULL,
    "tema_id" UUID NULL,
    "tipo" TEXT NOT NULL,
    "pontuacao_padrao" NUMERIC(5, 2) NOT NULL DEFAULT 1,
    "ativa" BOOLEAN NOT NULL DEFAULT TRUE,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questao_tipo_check"
        CHECK ("tipo" IN ('objetiva', 'discursiva')),
    CONSTRAINT "questao_pontuacao_padrao_check"
        CHECK ("pontuacao_padrao" > 0),
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
    CONSTRAINT "enunciado_url_imagem_check"
        CHECK ("url_imagem" IS NULL OR "url_imagem" ~* '^https?://.+'),
    CONSTRAINT "enunciado_questao_id_unique"
        UNIQUE ("questao_id"),
    CONSTRAINT "enunciado_questao_id_foreign"
        FOREIGN KEY ("questao_id")
        REFERENCES "questao" ("id")
        ON DELETE CASCADE
);

CREATE TABLE "alternativa" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "questao_id" UUID NOT NULL,
    "ordem_original" INTEGER NOT NULL,
    "conteudo_latex" TEXT NOT NULL,
    "url_imagem" TEXT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT FALSE,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alternativa_ordem_original_check"
        CHECK ("ordem_original" > 0),
    CONSTRAINT "alternativa_conteudo_latex_check"
        CHECK (char_length(btrim("conteudo_latex")) > 0),
    CONSTRAINT "alternativa_url_imagem_check"
        CHECK ("url_imagem" IS NULL OR "url_imagem" ~* '^https?://.+'),
    CONSTRAINT "alternativa_questao_id_ordem_original_unique"
        UNIQUE ("questao_id", "ordem_original"),
    CONSTRAINT "alternativa_questao_id_foreign"
        FOREIGN KEY ("questao_id")
        REFERENCES "questao" ("id")
        ON DELETE CASCADE
);

CREATE INDEX "alternativa_questao_id_index"
    ON "alternativa" ("questao_id");

-- Garante no maximo uma alternativa correta por questao.
-- A existencia de uma correta e validada quando a prova e publicada.
CREATE UNIQUE INDEX "alternativa_uma_correta_por_questao_index"
    ON "alternativa" ("questao_id")
    WHERE "correta" = TRUE;

-- =========================================================
-- Provas e aplicacoes
-- =========================================================

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

    CONSTRAINT "prova_titulo_check"
        CHECK (char_length(btrim("titulo")) > 0),
    CONSTRAINT "prova_status_check"
        CHECK ("status" IN ('rascunho', 'publicada', 'encerrada', 'antiga')),
    CONSTRAINT "prova_tempo_limite_check"
        CHECK ("tempo_limite_min" IS NULL OR "tempo_limite_min" > 0),
    CONSTRAINT "prova_url_acesso_check"
        CHECK ("url_acesso" IS NULL OR "url_acesso" ~* '^https?://.+'),
    CONSTRAINT "prova_qr_code_check"
        CHECK ("qr_code" IS NULL OR "qr_code" ~* '^(https?://.+|data:image/(png|jpeg|svg\+xml);base64,.+)'),
    CONSTRAINT "prova_datas_check"
        CHECK (
            "data_inicio" IS NULL
            OR "data_fim" IS NULL
            OR "data_fim" > "data_inicio"
        ),
    CONSTRAINT "prova_url_acesso_unique"
        UNIQUE ("url_acesso"),
    CONSTRAINT "prova_professor_id_foreign"
        FOREIGN KEY ("professor_id")
        REFERENCES "professor" ("id")
        ON DELETE RESTRICT,
    CONSTRAINT "prova_materia_id_foreign"
        FOREIGN KEY ("materia_id")
        REFERENCES "materia" ("id")
        ON DELETE RESTRICT
);

CREATE INDEX "prova_professor_id_index"
    ON "prova" ("professor_id");

CREATE INDEX "prova_materia_id_index"
    ON "prova" ("materia_id");

CREATE INDEX "prova_status_index"
    ON "prova" ("status");

CREATE TABLE "prova_questao" (
    "prova_id" UUID NOT NULL,
    "questao_id" UUID NOT NULL,
    "ordem_original" INTEGER NOT NULL,
    "pontuacao_max" NUMERIC(5, 2) NOT NULL DEFAULT 1,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("prova_id", "questao_id"),

    CONSTRAINT "prova_questao_ordem_original_check"
        CHECK ("ordem_original" > 0),
    CONSTRAINT "prova_questao_pontuacao_max_check"
        CHECK ("pontuacao_max" > 0),
    CONSTRAINT "prova_questao_prova_ordem_unique"
        UNIQUE ("prova_id", "ordem_original"),
    CONSTRAINT "prova_questao_prova_id_foreign"
        FOREIGN KEY ("prova_id")
        REFERENCES "prova" ("id")
        ON DELETE CASCADE,
    CONSTRAINT "prova_questao_questao_id_foreign"
        FOREIGN KEY ("questao_id")
        REFERENCES "questao" ("id")
        ON DELETE RESTRICT
);

CREATE INDEX "prova_questao_questao_id_index"
    ON "prova_questao" ("questao_id");

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
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prova_aluno_status_check"
        CHECK ("status" IN ('nao_iniciada', 'em_andamento', 'enviada', 'corrigida')),
    CONSTRAINT "prova_aluno_datas_check"
        CHECK (
            "inicio_em" IS NULL
            OR "enviada_em" IS NULL
            OR "enviada_em" >= "inicio_em"
        ),
    CONSTRAINT "prova_aluno_ordem_questoes_check"
        CHECK (jsonb_typeof("ordem_questoes") = 'array'),
    CONSTRAINT "prova_aluno_ordem_alternativas_check"
        CHECK (jsonb_typeof("ordem_alternativas") = 'array'),
    CONSTRAINT "prova_aluno_prova_id_aluno_id_unique"
        UNIQUE ("prova_id", "aluno_id"),
    CONSTRAINT "prova_aluno_prova_id_foreign"
        FOREIGN KEY ("prova_id")
        REFERENCES "prova" ("id")
        ON DELETE CASCADE,
    CONSTRAINT "prova_aluno_aluno_id_foreign"
        FOREIGN KEY ("aluno_id")
        REFERENCES "aluno" ("id")
        ON DELETE CASCADE
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
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resposta_aluno_conteudo_check"
        CHECK (
            "alternativa_id" IS NOT NULL
            OR ("resposta_texto" IS NOT NULL AND char_length(btrim("resposta_texto")) > 0)
            OR ("url_imagem" IS NOT NULL AND char_length(btrim("url_imagem")) > 0)
        ),
    CONSTRAINT "resposta_aluno_url_imagem_check"
        CHECK ("url_imagem" IS NULL OR "url_imagem" ~* '^https?://.+'),
    CONSTRAINT "resposta_aluno_prova_aluno_id_questao_id_unique"
        UNIQUE ("prova_aluno_id", "questao_id"),
    CONSTRAINT "resposta_aluno_prova_aluno_id_foreign"
        FOREIGN KEY ("prova_aluno_id")
        REFERENCES "prova_aluno" ("id")
        ON DELETE CASCADE,
    CONSTRAINT "resposta_aluno_questao_id_foreign"
        FOREIGN KEY ("questao_id")
        REFERENCES "questao" ("id")
        ON DELETE RESTRICT,
    CONSTRAINT "resposta_aluno_alternativa_id_foreign"
        FOREIGN KEY ("alternativa_id")
        REFERENCES "alternativa" ("id")
        ON DELETE RESTRICT
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
    "tipo" TEXT NOT NULL DEFAULT 'manual',
    "corrigida_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "correcao_nota_check"
        CHECK ("nota" >= 0),
    CONSTRAINT "correcao_tipo_check"
        CHECK ("tipo" IN ('manual', 'automatica')),
    CONSTRAINT "correcao_resposta_id_unique"
        UNIQUE ("resposta_id"),
    CONSTRAINT "correcao_resposta_id_foreign"
        FOREIGN KEY ("resposta_id")
        REFERENCES "resposta_aluno" ("id")
        ON DELETE CASCADE,
    CONSTRAINT "correcao_professor_id_foreign"
        FOREIGN KEY ("professor_id")
        REFERENCES "professor" ("id")
        ON DELETE RESTRICT
);

CREATE INDEX "correcao_professor_id_index"
    ON "correcao" ("professor_id");

CREATE TABLE "feedback" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "correcao_id" UUID NOT NULL,
    "professor_id" UUID NOT NULL,
    "mensagem" TEXT NOT NULL,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_mensagem_check"
        CHECK (char_length(btrim("mensagem")) > 0),
    CONSTRAINT "feedback_correcao_id_foreign"
        FOREIGN KEY ("correcao_id")
        REFERENCES "correcao" ("id")
        ON DELETE CASCADE,
    CONSTRAINT "feedback_professor_id_foreign"
        FOREIGN KEY ("professor_id")
        REFERENCES "professor" ("id")
        ON DELETE RESTRICT
);

CREATE INDEX "feedback_correcao_id_index"
    ON "feedback" ("correcao_id");

CREATE INDEX "feedback_professor_id_index"
    ON "feedback" ("professor_id");


CREATE TABLE "relatorio" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "prova_id" UUID NOT NULL,
    "coordenador_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "url_arquivo" TEXT NULL,
    "gerado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatorio_tipo_check"
        CHECK ("tipo" IN ('desempenho_geral', 'por_aluno', 'por_questao', 'por_materia')),
    CONSTRAINT "relatorio_url_arquivo_check"
        CHECK ("url_arquivo" IS NULL OR "url_arquivo" ~* '^https?://.+'),
    CONSTRAINT "relatorio_prova_id_foreign"
        FOREIGN KEY ("prova_id")
        REFERENCES "prova" ("id")
        ON DELETE CASCADE,
    CONSTRAINT "relatorio_coordenador_id_foreign"
        FOREIGN KEY ("coordenador_id")
        REFERENCES "coordenador" ("id")
        ON DELETE RESTRICT
);

CREATE INDEX "relatorio_prova_id_index"
    ON "relatorio" ("prova_id");

CREATE INDEX "relatorio_coordenador_id_index"
    ON "relatorio" ("coordenador_id");

CREATE INDEX "relatorio_tipo_index"
    ON "relatorio" ("tipo");


CREATE OR REPLACE FUNCTION "validar_questao_tema_materia"()
RETURNS TRIGGER AS $$
DECLARE
    v_materia_tema UUID;
BEGIN
    IF NEW."tema_id" IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT "materia_id"
    INTO v_materia_tema
    FROM "tema"
    WHERE "id" = NEW."tema_id";

    IF v_materia_tema IS NULL THEN
        RAISE EXCEPTION 'Tema % nao encontrado.', NEW."tema_id";
    END IF;

    IF v_materia_tema <> NEW."materia_id" THEN
        RAISE EXCEPTION 'O tema informado nao pertence a mesma materia da questao.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_questao_tema_materia_trigger"
BEFORE INSERT OR UPDATE OF "materia_id", "tema_id" ON "questao"
FOR EACH ROW
EXECUTE FUNCTION "validar_questao_tema_materia"();

CREATE OR REPLACE FUNCTION "validar_prova_questao"()
RETURNS TRIGGER AS $$
DECLARE
    v_materia_prova UUID;
    v_materia_questao UUID;
BEGIN
    SELECT "materia_id"
    INTO v_materia_prova
    FROM "prova"
    WHERE "id" = NEW."prova_id";

    SELECT "materia_id"
    INTO v_materia_questao
    FROM "questao"
    WHERE "id" = NEW."questao_id";

    IF v_materia_prova IS NULL OR v_materia_questao IS NULL THEN
        RAISE EXCEPTION 'Prova ou questao inexistente.';
    END IF;

    IF v_materia_prova <> v_materia_questao THEN
        RAISE EXCEPTION 'A questao nao pertence a mesma materia da prova.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_prova_questao_trigger"
BEFORE INSERT OR UPDATE OF "prova_id", "questao_id" ON "prova_questao"
FOR EACH ROW
EXECUTE FUNCTION "validar_prova_questao"();

CREATE OR REPLACE FUNCTION "validar_resposta_aluno"()
RETURNS TRIGGER AS $$
DECLARE
    v_prova_id UUID;
    v_status_prova_aluno TEXT;
    v_tipo_questao TEXT;
    v_questao_da_alternativa UUID;
BEGIN
    SELECT "prova_id", "status"
    INTO v_prova_id, v_status_prova_aluno
    FROM "prova_aluno"
    WHERE "id" = NEW."prova_aluno_id";

    SELECT "tipo"
    INTO v_tipo_questao
    FROM "questao"
    WHERE "id" = NEW."questao_id";

    IF v_prova_id IS NULL OR v_tipo_questao IS NULL THEN
        RAISE EXCEPTION 'Prova do aluno ou questao inexistente.';
    END IF;

    IF v_status_prova_aluno NOT IN ('nao_iniciada', 'em_andamento') THEN
        RAISE EXCEPTION 'Nao e possivel alterar respostas de uma prova ja enviada ou corrigida.';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM "prova_questao"
        WHERE "prova_id" = v_prova_id
          AND "questao_id" = NEW."questao_id"
    ) THEN
        RAISE EXCEPTION 'A questao informada nao pertence a prova do aluno.';
    END IF;

    IF NEW."alternativa_id" IS NOT NULL THEN
        SELECT "questao_id"
        INTO v_questao_da_alternativa
        FROM "alternativa"
        WHERE "id" = NEW."alternativa_id";

        IF v_questao_da_alternativa IS NULL OR v_questao_da_alternativa <> NEW."questao_id" THEN
            RAISE EXCEPTION 'A alternativa informada nao pertence a questao respondida.';
        END IF;
    END IF;

    IF v_tipo_questao = 'objetiva' AND NEW."alternativa_id" IS NULL THEN
        RAISE EXCEPTION 'Questoes objetivas precisam de alternativa marcada.';
    END IF;

    IF v_tipo_questao = 'discursiva' AND NEW."alternativa_id" IS NOT NULL THEN
        RAISE EXCEPTION 'Questoes discursivas nao devem ter alternativa marcada.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_resposta_aluno_trigger"
BEFORE INSERT OR UPDATE OF "prova_aluno_id", "questao_id", "alternativa_id", "resposta_texto", "url_imagem" ON "resposta_aluno"
FOR EACH ROW
EXECUTE FUNCTION "validar_resposta_aluno"();

CREATE OR REPLACE FUNCTION "validar_correcao_nota"()
RETURNS TRIGGER AS $$
DECLARE
    v_pontuacao_max NUMERIC(5, 2);
BEGIN
    SELECT pq."pontuacao_max"
    INTO v_pontuacao_max
    FROM "resposta_aluno" ra
    JOIN "prova_aluno" pa
        ON pa."id" = ra."prova_aluno_id"
    JOIN "prova_questao" pq
        ON pq."prova_id" = pa."prova_id"
       AND pq."questao_id" = ra."questao_id"
    WHERE ra."id" = NEW."resposta_id";

    IF v_pontuacao_max IS NULL THEN
        RAISE EXCEPTION 'Nao foi possivel encontrar a pontuacao maxima da resposta.';
    END IF;

    IF NEW."nota" > v_pontuacao_max THEN
        RAISE EXCEPTION 'A nota nao pode ser maior que a pontuacao maxima da questao na prova.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_correcao_nota_trigger"
BEFORE INSERT OR UPDATE OF "resposta_id", "nota" ON "correcao"
FOR EACH ROW
EXECUTE FUNCTION "validar_correcao_nota"();

CREATE OR REPLACE FUNCTION "validar_prova_publicada"()
RETURNS TRIGGER AS $$
DECLARE
    v_quantidade_questoes INTEGER;
    v_questoes_inativas INTEGER;
    v_objetivas_invalidas INTEGER;
BEGIN
    IF NEW."status" <> 'publicada' THEN
        RETURN NEW;
    END IF;

    SELECT COUNT(*)
    INTO v_quantidade_questoes
    FROM "prova_questao"
    WHERE "prova_id" = NEW."id";

    IF v_quantidade_questoes = 0 THEN
        RAISE EXCEPTION 'Nao e possivel publicar uma prova sem questoes.';
    END IF;

    SELECT COUNT(*)
    INTO v_questoes_inativas
    FROM "prova_questao" pq
    JOIN "questao" q
        ON q."id" = pq."questao_id"
    WHERE pq."prova_id" = NEW."id"
      AND q."ativa" = FALSE;

    IF v_questoes_inativas > 0 THEN
        RAISE EXCEPTION 'Nao e possivel publicar uma prova com questoes inativas.';
    END IF;

    SELECT COUNT(*)
    INTO v_objetivas_invalidas
    FROM "prova_questao" pq
    JOIN "questao" q
        ON q."id" = pq."questao_id"
    WHERE pq."prova_id" = NEW."id"
      AND q."tipo" = 'objetiva'
      AND (
          SELECT COUNT(*)
          FROM "alternativa" a
          WHERE a."questao_id" = q."id"
            AND a."correta" = TRUE
      ) <> 1;

    IF v_objetivas_invalidas > 0 THEN
        RAISE EXCEPTION 'Todas as questoes objetivas da prova precisam ter exatamente uma alternativa correta.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_prova_publicada_trigger"
BEFORE UPDATE OF "status" ON "prova"
FOR EACH ROW
EXECUTE FUNCTION "validar_prova_publicada"();


CREATE OR REPLACE FUNCTION "validar_prova_questao_pontuacao_update"()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "correcao" c
        JOIN "resposta_aluno" ra
            ON ra."id" = c."resposta_id"
        JOIN "prova_aluno" pa
            ON pa."id" = ra."prova_aluno_id"
        WHERE pa."prova_id" = NEW."prova_id"
          AND ra."questao_id" = NEW."questao_id"
          AND c."nota" > NEW."pontuacao_max"
    ) THEN
        RAISE EXCEPTION 'A pontuacao maxima nao pode ser menor que notas ja lancadas.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_prova_questao_pontuacao_update_trigger"
BEFORE UPDATE OF "pontuacao_max" ON "prova_questao"
FOR EACH ROW
EXECUTE FUNCTION "validar_prova_questao_pontuacao_update"();

CREATE OR REPLACE FUNCTION "validar_feedback_professor"()
RETURNS TRIGGER AS $$
DECLARE
    v_professor_correcao UUID;
    v_professor_materia INTEGER;
BEGIN
    SELECT c."professor_id"
    INTO v_professor_correcao
    FROM "correcao" c
    WHERE c."id" = NEW."correcao_id";

    IF v_professor_correcao IS NULL THEN
        RAISE EXCEPTION 'Correcao inexistente para o feedback.';
    END IF;

    IF NEW."professor_id" = v_professor_correcao THEN
        RETURN NEW;
    END IF;

    SELECT COUNT(*)
    INTO v_professor_materia
    FROM "correcao" c
    JOIN "resposta_aluno" ra
        ON ra."id" = c."resposta_id"
    JOIN "questao" q
        ON q."id" = ra."questao_id"
    JOIN "materia_professor" mp
        ON mp."materia_id" = q."materia_id"
       AND mp."professor_id" = NEW."professor_id"
    WHERE c."id" = NEW."correcao_id";

    IF v_professor_materia = 0 THEN
        RAISE EXCEPTION 'O professor do feedback precisa ter vinculo com a materia da questao ou ser o professor da correcao.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "validar_feedback_professor_trigger"
BEFORE INSERT OR UPDATE OF "correcao_id", "professor_id" ON "feedback"
FOR EACH ROW
EXECUTE FUNCTION "validar_feedback_professor"();

CREATE TRIGGER "set_coordenador_atualizado_em"
BEFORE UPDATE ON "coordenador"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_professor_atualizado_em"
BEFORE UPDATE ON "professor"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_materia_atualizado_em"
BEFORE UPDATE ON "materia"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_aluno_atualizado_em"
BEFORE UPDATE ON "aluno"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_tema_atualizado_em"
BEFORE UPDATE ON "tema"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_questao_atualizado_em"
BEFORE UPDATE ON "questao"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_enunciado_atualizado_em"
BEFORE UPDATE ON "enunciado"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_alternativa_atualizado_em"
BEFORE UPDATE ON "alternativa"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_prova_atualizado_em"
BEFORE UPDATE ON "prova"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_prova_aluno_atualizado_em"
BEFORE UPDATE ON "prova_aluno"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_resposta_aluno_atualizado_em"
BEFORE UPDATE ON "resposta_aluno"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_correcao_atualizado_em"
BEFORE UPDATE ON "correcao"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

CREATE TRIGGER "set_feedback_atualizado_em"
BEFORE UPDATE ON "feedback"
FOR EACH ROW
EXECUTE FUNCTION "set_atualizado_em"();

ALTER TABLE "coordenador" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "professor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "materia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "materia_professor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "aluno" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tema" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "questao" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enunciado" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "alternativa" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prova" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prova_questao" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "prova_aluno" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resposta_aluno" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "correcao" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "relatorio" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coordenador_select_proprio_ou_coordenador" ON "coordenador"
FOR SELECT TO authenticated
USING ("email" = "email_usuario_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "professor_select_autenticado" ON "professor"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "materia_select_interno" ON "materia"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "materia_professor_select_interno" ON "materia_professor"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "aluno_select_interno" ON "aluno"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "tema_select_interno" ON "tema"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "questao_select_interno" ON "questao"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "enunciado_select_interno" ON "enunciado"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "alternativa_select_interno" ON "alternativa"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "prova_select_interno" ON "prova"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "prova_questao_select_interno" ON "prova_questao"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "prova_aluno_select_interno" ON "prova_aluno"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "resposta_aluno_select_interno" ON "resposta_aluno"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "correcao_select_interno" ON "correcao"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "feedback_select_interno" ON "feedback"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());

CREATE POLICY "relatorio_select_interno" ON "relatorio"
FOR SELECT TO authenticated
USING ("eh_professor_autenticado"() OR "eh_coordenador_autenticado"());
