import { apiRequest } from "../../lib/apiClient";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { AuthRole, AuthUser, GoogleCallbackResult } from "./auth.types";

type GoogleStartResult = {
  redirectUrl: string;
};

const isEvaluatorMode = () => import.meta.env.VITE_AUTH_MODE === "test";

const getEvaluatorEmail = (role: AuthRole) => {
  const email = role === "coordenador"
    ? import.meta.env.VITE_TEST_COORDENADOR_EMAIL
    : import.meta.env.VITE_TEST_PROFESSOR_EMAIL;

  if (!email) {
    throw new Error(`E-mail de avaliador não configurado para o perfil ${role}.`);
  }

  return email;
};

export async function startGoogleLogin(role: AuthRole = "professor") {
  if (isEvaluatorMode()) {
    const params = new URLSearchParams({
      code: getEvaluatorEmail(role),
      state: role,
    });

    return {
      redirectUrl: `${window.location.origin}/auth/callback?${params.toString()}`,
    } satisfies GoogleStartResult;
  }

  const supabase = getSupabaseClient();
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error("Supabase não retornou a URL de login do Google.");
  }

  return {
    redirectUrl: data.url,
  } satisfies GoogleStartResult;
}

export async function finishGoogleLogin(role?: AuthRole) {
  if (isEvaluatorMode()) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = role ?? (params.get("state") as AuthRole | null) ?? undefined;

    if (!code) {
      throw new Error("Callback local sem e-mail de avaliador.");
    }

    const query = new URLSearchParams({ code });
    if (state) query.set("state", state);

    return apiRequest<GoogleCallbackResult>(`/auth/google/callback?${query.toString()}`);
  }

  const supabase = getSupabaseClient();
  const code = new URLSearchParams(window.location.search).get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  const accessToken = data.session?.access_token;
  if (!accessToken) {
    throw new Error("Supabase não retornou um token de acesso.");
  }

  const usuario = await getCurrentUser(accessToken, role);

  return {
    accessToken,
    usuario,
    redirectTo: usuario.perfil === "coordenador" ? "/coordenador" : "/professor",
  } satisfies GoogleCallbackResult;
}

export function getCurrentUser(accessToken: string, role?: AuthRole | null) {
  return apiRequest<AuthUser>("/auth/me", {
    token: accessToken,
    role: role ?? undefined,
  });
}

export async function logout(accessToken?: string) {
  if (!isEvaluatorMode()) {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  }

  if (!accessToken) {
    return { message: "Sessão encerrada com sucesso." };
  }

  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    token: accessToken,
  });
}
