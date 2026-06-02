import { businessRule, forbidden } from "../errors/api-error.js";
import type { AuthUser } from "../models/auth.model.js";
import { AuthRepository } from "../repositories/auth.repository.js";

const isTestMode = () =>
  process.env.NODE_ENV === "test" || process.env.AUTH_MODE === "test";

/**
 * Autenticação e gerenciamento de sessão via Google OAuth.
 *
 * O fluxo de produção depende do Supabase Auth (login gerenciado
 * externamente); este serviço apenas valida o token JWT recebido
 * e localiza o usuário nas tabelas locais (professor ou coordenador).
 *
 * Em modo de teste (NODE_ENV=test ou AUTH_MODE=test), o fluxo OAuth
 * completo é simulado: o parâmetro `code` pode conter o email
 * diretamente, e o token de acesso gerado segue o formato
 * `test-{perfil}:{id}:{email}:{nome}`. Isso permite que os testes
 * de integração e o frontend em desenvolvimento autentiquem sem
 * depender do Google.
 *
 * O redirect pós-login difere por perfil:
 * - coordenador → /coordenador
 * - professor → /professor
 */
export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  /**
   * Monta a URL de redirecionamento para o Google OAuth.
   *
   * @returns URL completa de autorização do Google com parâmetros client_id,
   * redirect_uri, response_type e scope configurados.
   */
  getGoogleRedirectUrl() {
    const clientId = process.env.GOOGLE_CLIENT_ID ?? "local-client-id";
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:3333/api/v1/auth/google/callback";
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Processa o callback do Google OAuth.
   *
   * @param code - Código de autorização retornado pelo Google.
   *               Em modo de teste, pode ser diretamente um email.
   * @returns accessToken (token simulado em teste), dados do usuário
   *          e a rota de redirecionamento baseada no perfil.
   * @throws forbidden se o fluxo OAuth for chamado fora do modo de teste
   *                   ou se o email não estiver cadastrado.
   */
  async handleGoogleCallback(code?: string): Promise<{
    accessToken: string;
    usuario: AuthUser;
    redirectTo: string;
  }> {
    if (!code) {
      throw businessRule("Callback OAuth sem code.");
    }

    if (!isTestMode()) {
      throw forbidden(
        "Fluxo OAuth local não disponível em produção. Use o login via Supabase.",
      );
    }

    const email = code.includes("@") ? code : process.env.MOCK_GOOGLE_EMAIL;
    if (!email) {
      throw forbidden("Código OAuth não pode ser validado no ambiente local.");
    }

    const usuario = await this.authRepository.findUserByEmail(email);
    if (!usuario) {
      throw forbidden("E-mail não autorizado.");
    }

    return {
      accessToken: `test-${usuario.perfil}:${usuario.id}:${usuario.email}:${usuario.nome}`,
      usuario,
      redirectTo: usuario.perfil === "coordenador" ? "/coordenador" : "/professor",
    };
  }

  /**
   * Retorna os dados do usuário atualmente autenticado.
   *
   * @param user - Objeto do usuário autenticado extraído do token JWT.
   * @returns O mesmo objeto do usuário, sem modificações.
   */
  getCurrentUser(user: AuthUser) {
    return user;
  }

  /**
   * Invalida a sessão no frontend (sem efeito no backend com JWT stateless).
   *
   * @returns Objeto com mensagem de confirmação de sessão encerrada.
   */
  logout() {
    return {
      message: "Sessão encerrada com sucesso.",
    };
  }
}
