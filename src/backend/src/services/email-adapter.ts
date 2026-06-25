/** Contrato para envio de emails. Pode ser substituído por um adaptador real (ex.: Resend, SendGrid). */
export interface EmailAdapter {
  send(para: string, assunto: string, corpo: string): Promise<{ success: boolean; error?: string }>;
}

/**
 * Implementação falsa que nunca envia email de verdade.
 *
 * Útil em desenvolvimento/teste. Em modo de teste, é possível
 * simular falha configurando EMAIL_FAIL_MODE=always.
 */
export class FakeEmailAdapter implements EmailAdapter {
  async send(para: string, assunto: string, corpo: string) {
    if (process.env.EMAIL_FAIL_MODE === "always") {
      return { success: false, error: "Falha simulada no envio de e-mail." };
    }
    if (process.env.NODE_ENV !== "test" && process.env.AUTH_MODE !== "test") {
      return {
        success: false,
        error: "Envio real de email nao configurado. Configure EMAIL_WEBHOOK_URL para entregar mensagens aos alunos.",
      };
    }
    return { success: true };
  }
}

export class HttpEmailAdapter implements EmailAdapter {
  constructor(
    private readonly url = process.env.EMAIL_WEBHOOK_URL,
    private readonly apiKey = process.env.EMAIL_API_KEY,
  ) {
    if (!url) {
      throw new Error("EMAIL_WEBHOOK_URL is required for real email delivery.");
    }
  }

  async send(para: string, assunto: string, corpo: string) {
    const response = await fetch(this.url!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({ to: para, subject: assunto, body: corpo }),
    });

    if (!response.ok) {
      return { success: false, error: `Email provider returned ${response.status}.` };
    }

    return { success: true };
  }
}

export const createEmailAdapter = (environment = process.env): EmailAdapter => {
  const explicitFake = environment.EMAIL_ADAPTER === "fake" || environment.EMAIL_FAKE === "true";
  const testRuntime = environment.NODE_ENV === "test" || environment.AUTH_MODE === "test";

  if (explicitFake || testRuntime) {
    return new FakeEmailAdapter();
  }

  if (environment.EMAIL_WEBHOOK_URL) {
    return new HttpEmailAdapter(environment.EMAIL_WEBHOOK_URL, environment.EMAIL_API_KEY);
  }

  throw new Error("Configure EMAIL_WEBHOOK_URL or set EMAIL_ADAPTER=fake for non-production test/dev runs.");
};
