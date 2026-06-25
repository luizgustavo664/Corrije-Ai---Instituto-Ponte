import { pool } from "../database/pool.js";
import type { Turma } from "../models/turma.model.js";
import type { TurmaInput } from "../schemas/turma.schema.js";

type TurmaRow = {
  id: string;
  nome: string;
  descricao: string | null;
  criado_em: Date | string;
  atualizado_em: Date | string;
};

const toIso = (value: Date | string) => (value instanceof Date ? value.toISOString() : new Date(value).toISOString());

const mapTurma = (row: TurmaRow): Turma => ({
  id: row.id,
  nome: row.nome,
  descricao: row.descricao,
  criadoEm: toIso(row.criado_em),
  atualizadoEm: toIso(row.atualizado_em),
});

export class TurmaRepository {
  async findAll() {
    const result = await pool.query<TurmaRow>('SELECT * FROM "turma" ORDER BY "nome" ASC');
    return result.rows.map(mapTurma);
  }

  async findById(id: string) {
    const result = await pool.query<TurmaRow>('SELECT * FROM "turma" WHERE "id" = $1', [id]);
    return result.rows[0] ? mapTurma(result.rows[0]) : null;
  }

  async findByNome(nome: string) {
    const result = await pool.query<TurmaRow>('SELECT * FROM "turma" WHERE lower("nome") = lower($1) LIMIT 1', [nome]);
    return result.rows[0] ? mapTurma(result.rows[0]) : null;
  }

  async create(input: TurmaInput) {
    const result = await pool.query<TurmaRow>(
      `
        INSERT INTO "turma" ("nome", "descricao")
        VALUES ($1, $2)
        RETURNING *
      `,
      [input.nome, input.descricao ?? null],
    );
    return mapTurma(result.rows[0]);
  }

  async update(id: string, input: TurmaInput) {
    const result = await pool.query<TurmaRow>(
      `
        UPDATE "turma"
        SET "nome" = $1,
            "descricao" = $2,
            "atualizado_em" = CURRENT_TIMESTAMP
        WHERE "id" = $3
        RETURNING *
      `,
      [input.nome, input.descricao ?? null, id],
    );
    return result.rows[0] ? mapTurma(result.rows[0]) : null;
  }

  async delete(id: string) {
    const result = await pool.query('DELETE FROM "turma" WHERE "id" = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
