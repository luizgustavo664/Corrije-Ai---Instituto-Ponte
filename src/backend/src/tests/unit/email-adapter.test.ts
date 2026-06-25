import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { createEmailAdapter, FakeEmailAdapter, HttpEmailAdapter, ResendEmailAdapter } from "../../services/email-adapter.js";

describe("EmailAdapter - unitario", () => {
  afterEach(() => {
    delete process.env.EMAIL_FAIL_MODE;
    delete process.env.EMAIL_API_KEY;
    delete process.env.EMAIL_FROM;
    delete process.env.EMAIL_PROVIDER;
    delete process.env.EMAIL_WEBHOOK_URL;
    jest.restoreAllMocks();
  });

  describe("FakeEmailAdapter", () => {
    it("deve retornar success true quando EMAIL_FAIL_MODE nao esta definido", async () => {
      delete process.env.EMAIL_FAIL_MODE;
      const adapter = new FakeEmailAdapter();
      const result = await adapter.send("teste@test.com", "Assunto", "Corpo");
      expect(result).toEqual({ success: true });
    });

    it("deve retornar success false quando EMAIL_FAIL_MODE e always", async () => {
      process.env.EMAIL_FAIL_MODE = "always";
      const adapter = new FakeEmailAdapter();
      const result = await adapter.send("teste@test.com", "Assunto", "Corpo");
      expect(result).toEqual({
        success: false,
        error: "Falha simulada no envio de e-mail.",
      });
    });

    it("deve aceitar strings vazias quando EMAIL_FAIL_MODE nao esta definido", async () => {
      const adapter = new FakeEmailAdapter();
      const result = await adapter.send("", "", "");
      expect(result).toEqual({ success: true });
    });
  });

  describe("HttpEmailAdapter", () => {
    it("deve exigir URL configurada", () => {
      expect(() => new HttpEmailAdapter("")).toThrow("EMAIL_WEBHOOK_URL is required");
    });

    it("deve enviar payload para webhook real configurado", async () => {
      const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

      const adapter = new HttpEmailAdapter("https://email.local/send", "secret");

      await expect(adapter.send("a@b.com", "Assunto", "Corpo")).resolves.toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledWith("https://email.local/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer secret",
        },
        body: JSON.stringify({ to: "a@b.com", subject: "Assunto", body: "Corpo" }),
      });
    });

    it("deve retornar erro controlado quando provider rejeita", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 503,
      } as Response);

      const adapter = new HttpEmailAdapter("https://email.local/send");

      await expect(adapter.send("a@b.com", "Assunto", "Corpo")).resolves.toEqual({
        success: false,
        error: "Email provider returned 503.",
      });
    });
  });

  describe("ResendEmailAdapter", () => {
    it("deve exigir API key", () => {
      expect(() => new ResendEmailAdapter("")).toThrow("EMAIL_API_KEY is required");
    });

    it("deve enviar payload no formato da Resend", async () => {
      const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: true,
        status: 200,
      } as Response);

      const adapter = new ResendEmailAdapter("re_secret", "Corrije Ai <noreply@example.com>");

      await expect(adapter.send("a@b.com", "Assunto", "Corpo")).resolves.toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledWith("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer re_secret",
        },
        body: JSON.stringify({
          from: "Corrije Ai <noreply@example.com>",
          to: ["a@b.com"],
          subject: "Assunto",
          text: "Corpo",
        }),
      });
    });

    it("deve retornar mensagem da Resend quando provider rejeita", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: "domain not verified" }),
      } as Response);

      const adapter = new ResendEmailAdapter("re_secret", "Corrije Ai <noreply@example.com>");

      await expect(adapter.send("a@b.com", "Assunto", "Corpo")).resolves.toEqual({
        success: false,
        error: "Resend returned 403: domain not verified",
      });
    });
  });

  describe("createEmailAdapter", () => {
    it("deve usar fake em runtime de teste ou fake explicito", () => {
      expect(createEmailAdapter({ NODE_ENV: "test" } as NodeJS.ProcessEnv)).toBeInstanceOf(FakeEmailAdapter);
      expect(createEmailAdapter({ EMAIL_ADAPTER: "fake" } as NodeJS.ProcessEnv)).toBeInstanceOf(FakeEmailAdapter);
      expect(createEmailAdapter({ EMAIL_FAKE: "true" } as NodeJS.ProcessEnv)).toBeInstanceOf(FakeEmailAdapter);
      expect(createEmailAdapter({ AUTH_MODE: "test" } as NodeJS.ProcessEnv)).toBeInstanceOf(FakeEmailAdapter);
    });

    it("deve usar adapter HTTP quando webhook estiver configurado", () => {
      expect(
        createEmailAdapter({
          EMAIL_WEBHOOK_URL: "https://email.local/send",
          EMAIL_API_KEY: "secret",
        } as NodeJS.ProcessEnv),
      ).toBeInstanceOf(HttpEmailAdapter);
    });

    it("deve usar Resend quando provider for resend", () => {
      expect(
        createEmailAdapter({
          EMAIL_PROVIDER: "resend",
          EMAIL_API_KEY: "re_secret",
          EMAIL_FROM: "Corrije Ai <noreply@example.com>",
        } as NodeJS.ProcessEnv),
      ).toBeInstanceOf(ResendEmailAdapter);
      expect(
        createEmailAdapter({
          EMAIL_ADAPTER: "resend",
          EMAIL_API_KEY: "re_secret",
          EMAIL_FROM: "Corrije Ai <noreply@example.com>",
        } as NodeJS.ProcessEnv),
      ).toBeInstanceOf(ResendEmailAdapter);
    });

    it("deve falhar claramente sem adapter configurado", () => {
      expect(() => createEmailAdapter({} as NodeJS.ProcessEnv)).toThrow(
        "Configure EMAIL_WEBHOOK_URL or set EMAIL_ADAPTER=fake",
      );
    });
  });
});
