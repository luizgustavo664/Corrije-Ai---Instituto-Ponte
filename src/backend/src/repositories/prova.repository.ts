import { pool } from "../database/pool.js";
import { toIsoString } from "../helpers/date.js";
import type { AuthUser } from "../models/auth.model.js";
import type { Prova, ProvaHistorico, ProvaStatus } from "../models/prova.model.js";
import type {
  CreateProvaInput,
  ListProvasQuery,
  UpdateProvaConfiguracoesInput,
  UpdateProvaInput,
} from "../schemas/prova.schema.js";

/** Linha bruta da tabela `prova` com JOINs opcionais para materia e professor. */
type ProvaRow = {
  id: string;
  professor_id: string;
  materia_id: string;
  titulo: string;
  modalidade: string;
  turma: string;
  semestre: string;
  instrucoes: string | null;
  tempo_limite_min: number | null;
  data_inicio: Date | string | null;
  data_fim: Date | string | null;
  embaralhar_questoes: boolean;
  embaralhar_alternativas: boolean;
  status: string;
  url_acesso: string | null;
  qr_code: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
  materia_nome?: string;
  professor_nome?: string;
  submissoes?: string;
  total?: string;
};

/** Converte uma ProvaRow (snake_case) para o modelo Prova (camelCase).
 *  - Datas são convertidas com toIsoString().
 *  - Os objetos aninhados materia/professor são populados condicionalmente
 *    quando a query inclui JOIN com essas tabelas.
 *  - O campo total da window function é ignorado no modelo final. */
const mapProva = (row: ProvaRow): Prova => ({
  id: row.id,
  professorId: row.professor_id,
  materiaId: row.materia_id,
  titulo: row.titulo,
  modalidade: row.modalidade,
  turma: row.turma,
  semestre: row.semestre,
  instrucoes: row.instrucoes,
  tempoLimiteMin: row.tempo_limite_min,
  dataInicio: toIsoString(row.data_inicio),
  dataFim: toIsoString(row.data_fim),
  embaralharQuestoes: row.embaralhar_questoes,
  embaralharAlternativas: row.embaralhar_alternativas,
  status: row.status as ProvaStatus,
  urlAcesso: row.url_acesso,
  qrCode: row.qr_code,
  criadoEm: toIsoString(row.criado_em) ?? "",
  atualizadoEm: toIsoString(row.atualizado_em) ?? "",
  submissoes: row.submissoes ? Number(row.submissoes) : 0,
  materia: row.materia_nome ? { id: row.materia_id, nome: row.materia_nome } : undefined,
  professor: row.professor_nome ? { id: row.professor_id, nome: row.professor_nome } : undefined,
});

/**
 * Repositório de provas com controle de acesso por perfil,
 * validação de vínculo professor-matéria e ciclo de vida
 * (rascunho → publicada → encerrada → antiga).
 *
 * Coordenador tem acesso total; professor vê apenas suas provas
 * ou as de matérias às quais está vinculado.
 */
export class ProvaRepository {
  /**
   * Verifica se um professor existe pelo ID.
   *
   * @param professorId - ID do professor.
   * @returns true se o professor existir.
   */
  async professorExists(professorId: string) {
    const result = await pool.query('SELECT EXISTS (SELECT 1 FROM "professor" WHERE "id" = $1) AS "exists"', [
      professorId,
    ]);
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Verifica se uma matéria existe pelo ID.
   *
   * @param materiaId - ID da matéria.
   * @returns true se a matéria existir.
   */
  async materiaExists(materiaId: string) {
    const result = await pool.query('SELECT EXISTS (SELECT 1 FROM "materia" WHERE "id" = $1) AS "exists"', [
      materiaId,
    ]);
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Verifica se professor e matéria possuem vínculo.
   *
   * @param professorId - ID do professor.
   * @param materiaId - ID da matéria.
   * @returns true se houver vínculo.
   */
  async professorMateriaVinculados(professorId: string, materiaId: string) {
    const result = await pool.query(
      `
        SELECT EXISTS (
          SELECT 1 FROM "materia_professor"
          WHERE "professor_id" = $1 AND "materia_id" = $2
        ) AS "exists"
      `,
      [professorId, materiaId],
    );
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Cria uma nova prova com status "rascunho".
   *
   * @param input - Dados da prova conforme CreateProvaInput, mais professorId do autor.
   * @returns A prova recém-criada.
   */
  async create(input: CreateProvaInput & { professorId: string }) {
    const result = await pool.query<ProvaRow>(
      `
        INSERT INTO "prova" (
          "professor_id", "materia_id", "titulo", "modalidade", "turma", "semestre",
          "instrucoes", "tempo_limite_min", "data_inicio", "data_fim",
          "embaralhar_questoes", "embaralhar_alternativas", "status"
        )
        VALUES ($1, $2, $3, COALESCE($4, 'online'), $5, $6, $7, $8, $9, $10, COALESCE($11, TRUE), COALESCE($12, TRUE), 'rascunho')
        RETURNING *
      `,
      [
        input.professorId,
        input.materiaId,
        input.titulo,
        input.modalidade,
        input.turma,
        input.semestre,
        input.instrucoes ?? null,
        input.tempoLimiteMin ?? null,
        input.dataInicio ?? null,
        input.dataFim ?? null,
        input.embaralharQuestoes ?? null,
        input.embaralharAlternativas ?? null,
      ],
    );

    return mapProva(result.rows[0]);
  }

  /**
   * Lista provas com filtros dinâmicos e paginação.
   *
   * O filtro de acesso para professor usa subconsulta EXISTS que
   * verifica autoria e vínculo via materia_professor.
   * COUNT(*) OVER() retorna o total sem consulta separada.
   *
   * @param query - Filtros opcionais: status, turma, semestre, materiaId, professorId.
   * @param user - Usuário autenticado para filtro de autorização.
   * @returns Lista paginada de provas com total de registros.
   */
  async findMany(query: ListProvasQuery, user: AuthUser) {
    const params: unknown[] = [];
    const where: string[] = [];

    const addParam = (value: unknown) => {
      params.push(value);
      return `$${params.length}`;
    };

    if (user.perfil === "professor") {
      const userParam = addParam(user.id);
      where.push(
        `(p."professor_id" = ${userParam} OR EXISTS (
          SELECT 1 FROM "materia_professor" mp
          WHERE mp."materia_id" = p."materia_id" AND mp."professor_id" = ${userParam}
        ))`,
      );
    }

    if (query.status) where.push(`p."status" = ${addParam(query.status)}`);
    if (query.turma) where.push(`p."turma" = ${addParam(query.turma)}`);
    if (query.semestre) where.push(`p."semestre" = ${addParam(query.semestre)}`);
    if (query.materiaId) where.push(`p."materia_id" = ${addParam(query.materiaId)}`);
    if (query.professorId) where.push(`p."professor_id" = ${addParam(query.professorId)}`);

    const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
    const limitParam = addParam(query.limit);
    const offsetParam = addParam((query.page - 1) * query.limit);

    const result = await pool.query<ProvaRow>(
      `
        SELECT p.*, m."nome" AS "materia_nome", pr."nome" AS "professor_nome",
          COUNT(*) OVER() AS "total",
          COALESCE(pa_count.submissoes, 0) AS "submissoes"
        FROM "prova" p
        JOIN "materia" m ON m."id" = p."materia_id"
        JOIN "professor" pr ON pr."id" = p."professor_id"
        LEFT JOIN (
          SELECT "prova_id", COUNT(*)::int AS "submissoes"
          FROM "prova_aluno"
          WHERE "status" IN ('enviada', 'corrigida')
          GROUP BY "prova_id"
        ) pa_count ON pa_count."prova_id" = p."id"
        ${whereSql}
        ORDER BY p."criado_em" DESC
        LIMIT ${limitParam}
        OFFSET ${offsetParam}
      `,
      params,
    );

    return {
      data: result.rows.map(mapProva),
      total: Number(result.rows[0]?.total ?? 0),
    };
  }

  /**
   * Busca prova por ID com dados da matéria e professor.
   *
   * @param provaId - ID da prova.
   * @returns Prova encontrada ou null.
   */
  async findById(provaId: string) {
    const result = await pool.query<ProvaRow>(
      `
        SELECT p.*, m."nome" AS "materia_nome", pr."nome" AS "professor_nome",
          COALESCE(pa_count.submissoes, 0) AS "submissoes"
        FROM "prova" p
        JOIN "materia" m ON m."id" = p."materia_id"
        JOIN "professor" pr ON pr."id" = p."professor_id"
        LEFT JOIN (
          SELECT "prova_id", COUNT(*)::int AS "submissoes"
          FROM "prova_aluno"
          WHERE "status" IN ('enviada', 'corrigida')
          GROUP BY "prova_id"
        ) pa_count ON pa_count."prova_id" = p."id"
        WHERE p."id" = $1
      `,
      [provaId],
    );

    return result.rows[0] ? mapProva(result.rows[0]) : null;
  }

  /**
   * Verifica se o usuário tem acesso à prova.
   * Coordenador tem acesso total; professor só acessa provas próprias
   * ou de matérias vinculadas.
   *
   * @param provaId - ID da prova.
   * @param user - Usuário autenticado.
   * @returns true se o usuário tem acesso.
   */
  async hasAccess(provaId: string, user: AuthUser) {
    if (user.perfil === "coordenador") return true;

    const result = await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM "prova" p
          WHERE p."id" = $1
            AND (
              p."professor_id" = $2
              OR EXISTS (
                SELECT 1 FROM "materia_professor" mp
                WHERE mp."materia_id" = p."materia_id" AND mp."professor_id" = $2
              )
            )
        ) AS "exists"
      `,
      [provaId, user.id],
    );
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Atualiza dados gerais de uma prova, alterando apenas os campos fornecidos.
   *
   * @param provaId - ID da prova.
   * @param input - Campos para atualização conforme UpdateProvaInput.
   * @returns Prova atualizada ou null se não encontrada.
   */
  async update(provaId: string, input: UpdateProvaInput) {
    const fields: string[] = [];
    const values: unknown[] = [];
    const columns: Record<string, string> = {
      titulo: "titulo",
      modalidade: "modalidade",
      turma: "turma",
      semestre: "semestre",
      instrucoes: "instrucoes",
      tempoLimiteMin: "tempo_limite_min",
      dataInicio: "data_inicio",
      dataFim: "data_fim",
      embaralharQuestoes: "embaralhar_questoes",
      embaralharAlternativas: "embaralhar_alternativas",
    };

    for (const [key, column] of Object.entries(columns)) {
      if (key in input) {
        values.push(input[key as keyof UpdateProvaInput] ?? null);
        fields.push(`"${column}" = $${values.length}`);
      }
    }

    values.push(provaId);
    const result = await pool.query<ProvaRow>(
      `
        UPDATE "prova"
        SET ${fields.join(", ")}
        WHERE "id" = $${values.length}
        RETURNING *
      `,
      values,
    );

    return result.rows[0] ? mapProva(result.rows[0]) : null;
  }

  /**
   * Atualiza configurações específicas da prova (tempo, datas, embaralhamento).
   *
   * @param provaId - ID da prova.
   * @param input - Configurações para atualizar conforme UpdateProvaConfiguracoesInput.
   * @returns Prova atualizada ou null se não encontrada.
   */
  async updateConfiguracoes(provaId: string, input: UpdateProvaConfiguracoesInput) {
    const fields: string[] = [];
    const values: unknown[] = [];
    const columns: Record<string, string> = {
      tempoLimiteMin: "tempo_limite_min",
      dataInicio: "data_inicio",
      dataFim: "data_fim",
      embaralharQuestoes: "embaralhar_questoes",
      embaralharAlternativas: "embaralhar_alternativas",
    };

    for (const [key, column] of Object.entries(columns)) {
      if (key in input) {
        values.push(input[key as keyof UpdateProvaConfiguracoesInput] ?? null);
        fields.push(`"${column}" = $${values.length}`);
      }
    }

    values.push(provaId);
    const result = await pool.query<ProvaRow>(
      `
        UPDATE "prova"
        SET ${fields.join(", ")}
        WHERE "id" = $${values.length}
        RETURNING *
      `,
      values,
    );

    return result.rows[0] ? mapProva(result.rows[0]) : null;
  }

  /**
   * Conta o total de questões vinculadas a uma prova.
   *
   * @param provaId - ID da prova.
   * @returns Número total de questões.
   */
  async countQuestoes(provaId: string) {
    const result = await pool.query<{ total: string }>(
      'SELECT COUNT(*) AS "total" FROM "prova_questao" WHERE "prova_id" = $1',
      [provaId],
    );
    return Number(result.rows[0]?.total ?? 0);
  }

  /**
   * Verifica se a prova contém questões objetivas com configuração inválida.
   *
   * Regras: múltipla escolha (>= 2 alternativas, exatamente 1 correta);
   * verdadeiro/falso (exatamente 2 alternativas, exatamente 1 correta).
   *
   * @param provaId - ID da prova a ser validada.
   * @returns true se houver questão objetiva inválida.
   */
  async hasQuestoesObjetivasInvalidas(provaId: string) {
    const result = await pool.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM "prova_questao" pq
          JOIN "questao" q ON q."id" = pq."questao_id"
          WHERE pq."prova_id" = $1
            AND (
              (
                q."tipo" = 'multipla_escolha'
                AND (
                  (SELECT COUNT(*) FROM "alternativa" a WHERE a."questao_id" = q."id") < 2
                  OR (SELECT COUNT(*) FROM "alternativa" a WHERE a."questao_id" = q."id" AND a."correta" = TRUE) <> 1
                )
              )
              OR
              (
                q."tipo" = 'verdadeiro_falso'
                AND (
                  (SELECT COUNT(*) FROM "alternativa" a WHERE a."questao_id" = q."id") <> 2
                  OR (SELECT COUNT(*) FROM "alternativa" a WHERE a."questao_id" = q."id" AND a."correta" = TRUE) <> 1
                )
              )
            )
        ) AS "exists"
      `,
      [provaId],
    );
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Publica uma prova, definindo status como "publicada" e URL de acesso.
   *
   * @param provaId - ID da prova.
   * @param urlAcesso - URL de acesso para os alunos.
   * @returns Prova atualizada ou null.
   */
  async publish(provaId: string, urlAcesso: string) {
    const result = await pool.query<ProvaRow>(
      `
        UPDATE "prova"
        SET "url_acesso" = $1,
            "qr_code" = $1,
            "status" = 'publicada'
        WHERE "id" = $2
        RETURNING *
      `,
      [urlAcesso, provaId],
    );
    return result.rows[0] ? mapProva(result.rows[0]) : null;
  }

  /**
   * Altera o status de uma prova para "encerrada" ou "antiga".
   *
   * @param provaId - ID da prova.
   * @param status - Novo status: "encerrada" ou "antiga".
   * @returns Prova atualizada ou null.
   */
  async updateStatus(provaId: string, status: "encerrada" | "antiga") {
    const result = await pool.query<ProvaRow>(
      `
        UPDATE "prova"
        SET "status" = $1
        WHERE "id" = $2
        RETURNING *
      `,
      [status, provaId],
    );
    return result.rows[0] ? mapProva(result.rows[0]) : null;
  }

  /**
   * Remove uma prova pelo ID.
   *
   * @param provaId - ID da prova a ser removida.
   */
  async delete(provaId: string) {
    await pool.query('DELETE FROM "prova" WHERE "id" = $1', [provaId]);
  }

  /**
   * Verifica se existem submissions (respostas) registradas para a prova.
   *
   * @param provaId - ID da prova.
   * @returns true se houver submissions.
   */
  async hasSubmissions(provaId: string) {
    const result = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM "prova_aluno" WHERE "prova_id" = $1) AS "exists"',
      [provaId],
    );
    return result.rows[0]?.exists ?? false;
  }

  /**
   * Retorna o histórico de alterações de status de uma prova.
   *
   * @param provaId - ID da prova.
   * @returns Lista de registros de histórico ordenados por data.
   */
  async findStatusHistorico(provaId: string) {
    const result = await pool.query<{
      id: string;
      status_anterior: string | null;
      status_novo: string;
      criado_em: Date | string;
    }>(
      `
        SELECT "id", "status_anterior", "status_novo", "criado_em"
        FROM "prova_status_historico"
        WHERE "prova_id" = $1
        ORDER BY "criado_em" ASC
      `,
      [provaId],
    );

    return result.rows.map((row): ProvaHistorico => ({
      id: row.id,
      statusAnterior: row.status_anterior,
      statusNovo: row.status_novo,
      criadoEm: toIsoString(row.criado_em) ?? "",
    }));
  }
}
