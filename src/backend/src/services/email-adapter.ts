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
    return { success: true };
  }
}
