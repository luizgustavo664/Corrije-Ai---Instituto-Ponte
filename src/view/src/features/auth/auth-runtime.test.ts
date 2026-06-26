import { beforeEach, describe, expect, it, vi } from "vitest";

const apiRequest = vi.fn();
const getSupabaseClient = vi.fn();
const getStoredAuthSession = vi.fn();

vi.mock("../../lib/apiClient", () => ({
  apiRequest,
}));

vi.mock("../../lib/supabaseClient", () => ({
  getSupabaseClient,
}));

vi.mock("./auth.storage", () => ({
  getStoredAuthSession,
}));

describe("auth runtime helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    getSupabaseClient.mockReturnValue({
      auth: {
        signInWithOAuth: vi.fn().mockResolvedValue({ data: { url: "https://login.example" }, error: null }),
        exchangeCodeForSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "access-1" } }, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "access-1" } }, error: null }),
        signOut: vi.fn().mockResolvedValue(undefined),
      },
    });
    apiRequest.mockResolvedValue({ id: "u1", perfil: "professor" });
    getStoredAuthSession.mockReturnValue({
      accessToken: "token-1",
      usuario: { perfil: "coordenador" },
    });
  });

  it("dispara e remove listener de sessao expirada", async () => {
    const { listenSessionExpired, notifySessionExpired } = await import("./auth.events");
    const listener = vi.fn();

    const dispose = listenSessionExpired(listener);
    notifySessionExpired();
    expect(listener).toHaveBeenCalledTimes(1);

    dispose();
    notifySessionExpired();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("retorna opcoes autenticadas ou erro quando nao ha sessao", async () => {
    const { getAuthRequestOptions } = await import("./auth.request");

    expect(getAuthRequestOptions()).toEqual({ token: "token-1", role: "coordenador" });

    getStoredAuthSession.mockReturnValue(null);
    expect(() => getAuthRequestOptions()).toThrow(/Sess/);
  });

  it("inicia login Google e valida URL retornada pelo Supabase", async () => {
    const { startGoogleLogin } = await import("./auth.api");

    await expect(startGoogleLogin()).resolves.toEqual({ redirectUrl: "https://login.example" });
    expect(getSupabaseClient().auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
        skipBrowserRedirect: true,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    getSupabaseClient.mockReturnValueOnce({
      auth: {
        signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      },
    });
    await expect(startGoogleLogin()).rejects.toThrow(/URL de login/);

    getSupabaseClient.mockReturnValueOnce({
      auth: {
        signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: new Error("OAuth recusado") }),
      },
    });
    await expect(startGoogleLogin()).rejects.toThrow("OAuth recusado");
  });

  it("usa modo avaliador local sem cliente Supabase", async () => {
    vi.stubEnv("VITE_AUTH_MODE", "test");
    vi.stubEnv("VITE_TEST_PROFESSOR_EMAIL", "professor.avaliador@corrije.ai");
    const { startGoogleLogin, finishGoogleLogin, logout } = await import("./auth.api");

    await expect(startGoogleLogin("professor")).resolves.toEqual({
      redirectUrl: "http://localhost:3000/auth/callback?code=professor.avaliador%40corrije.ai&state=professor",
    });
    expect(getSupabaseClient).not.toHaveBeenCalled();

    apiRequest.mockResolvedValueOnce({
      accessToken: "test-professor:prof-1:professor.avaliador@corrije.ai:Professor Avaliador",
      usuario: { id: "prof-1", perfil: "professor" },
      redirectTo: "/professor",
    });
    window.history.pushState({}, "", "/auth/callback?code=professor.avaliador%40corrije.ai&state=professor");

    await expect(finishGoogleLogin("professor")).resolves.toEqual({
      accessToken: "test-professor:prof-1:professor.avaliador@corrije.ai:Professor Avaliador",
      usuario: { id: "prof-1", perfil: "professor" },
      redirectTo: "/professor",
    });
    expect(apiRequest).toHaveBeenCalledWith(
      "/auth/google/callback?code=professor.avaliador%40corrije.ai&state=professor",
    );

    await logout("test-professor:prof-1:professor.avaliador@corrije.ai:Professor Avaliador");
    expect(apiRequest).toHaveBeenCalledWith("/auth/logout", {
      method: "POST",
      token: "test-professor:prof-1:professor.avaliador@corrije.ai:Professor Avaliador",
    });
    expect(getSupabaseClient).not.toHaveBeenCalled();
  });

  it("finaliza callback Google, busca usuario atual e define redirecionamento", async () => {
    const { finishGoogleLogin, getCurrentUser } = await import("./auth.api");
    apiRequest.mockResolvedValueOnce({ id: "u1", perfil: "coordenador" });
    window.history.pushState({}, "", "/auth/callback?code=oauth-code");

    await expect(finishGoogleLogin("coordenador")).resolves.toEqual({
      accessToken: "access-1",
      usuario: { id: "u1", perfil: "coordenador" },
      redirectTo: "/coordenador",
    });
    expect(getSupabaseClient().auth.exchangeCodeForSession).toHaveBeenCalledWith("oauth-code");

    window.history.pushState({}, "", "/auth/callback");
    getCurrentUser("access-2", null);
    expect(apiRequest).toHaveBeenCalledWith("/auth/me", { token: "access-2", role: undefined });

    getSupabaseClient.mockReturnValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: {}, error: new Error("Sessao invalida") }),
      },
    });
    await expect(finishGoogleLogin()).rejects.toThrow("Sessao invalida");

    getSupabaseClient.mockReturnValueOnce({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      },
    });
    await expect(finishGoogleLogin()).rejects.toThrow(/token de acesso/);

    window.history.pushState({}, "", "/auth/callback?code=bad-code");
    getSupabaseClient.mockReturnValueOnce({
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ data: {}, error: new Error("Code invalido") }),
        getSession: vi.fn(),
      },
    });
    await expect(finishGoogleLogin()).rejects.toThrow("Code invalido");
  });

  it("faz logout local e remoto conforme token recebido", async () => {
    const { logout } = await import("./auth.api");

    await expect(logout()).resolves.toEqual({ message: "Sessão encerrada com sucesso." });
    await logout("access-1");

    expect(getSupabaseClient().auth.signOut).toHaveBeenCalled();
    expect(apiRequest).toHaveBeenCalledWith("/auth/logout", {
      method: "POST",
      token: "access-1",
    });
  });
});
