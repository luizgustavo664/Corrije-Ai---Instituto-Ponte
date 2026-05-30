import { pool } from "../database/pool.js";
import type { AuthRole, AuthUser } from "../models/auth.model.js";

/** Linha bruta da tabela `professor`/`coordenador`. Campos em snake_case mapeados do PostgreSQL. */
type UserRow = {
  id: string;
  nome: string;
  email: string;
  perfil: AuthRole;
};

/**
 * Repositório de autenticação de usuários (professores e coordenadores).
 *
 * A busca percorre primeiro a tabela `professor` e depois `coordenador`
 * via UNION ALL. O perfil é fixado como literal no SELECT de cada tabela.
 */
export class AuthRepository {
  /**
   * Localiza o primeiro usuário (professor ou coordenador) com o email informado.
   *
   * @param email - Email do usuário para busca (case-sensitive).
   * @returns Dados do usuário com perfil, ou null se não encontrado.
   */
  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const result = await pool.query<UserRow>(
      `
        SELECT "id", "nome", "email", 'professor'::text AS "perfil"
        FROM "professor"
        WHERE "email" = $1
        UNION ALL
        SELECT "id", "nome", "email", 'coordenador'::text AS "perfil"
        FROM "coordenador"
        WHERE "email" = $1
        LIMIT 1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }
}
