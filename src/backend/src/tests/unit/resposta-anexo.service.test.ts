import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RespostaAnexoService } from "../../services/resposta-anexo.service.js";

const now = new Date("2026-06-01T12:00:00Z").getTime();
const validContext = {
  provaId: "prova-1",
  provaAlunoId: "pa-1",
  provaAlunoStatus: "em_andamento",
  provaStatus: "publicada",
  dataInicio: "2026-06-01T11:00:00Z",
  dataFim: "2026-06-01T13:00:00Z",
  permiteAnexo: true,
};

const makeFile = (overrides: Record<string, unknown> = {}) => ({
  filename: "resolução final.pdf",
  mimeType: "application/pdf",
  content: Buffer.from("arquivo"),
  ...overrides,
});

const makeRepo = () => ({
  findRespostaContext: jest.fn<any>().mockResolvedValue(validContext),
  create: jest.fn<any>().mockResolvedValue({ id: "anexo-1" }),
});

const makeLogRepo = () => ({
  create: jest.fn<any>().mockResolvedValue({ id: "log-1" }),
});

describe("RespostaAnexoService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let logRepo: ReturnType<typeof makeLogRepo>;
  let service: RespostaAnexoService;
  let dateSpy: jest.SpiedFunction<typeof Date.now>;

  beforeEach(() => {
    dateSpy = jest.spyOn(Date, "now").mockReturnValue(now);
    repo = makeRepo();
    logRepo = makeLogRepo();
    service = new RespostaAnexoService(repo as any, logRepo as any);
  });

  afterEach(() => {
    dateSpy.mockRestore();
  });

  it("CT04 - RN04 - deve salvar anexo válido com nome sanitizado", async () => {
    const result = await service.salvarAnexo("resp-1", makeFile() as any);

    expect(result).toEqual({ id: "anexo-1" });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({
      respostaId: "resp-1",
      nomeArquivo: "resolu__o_final.pdf",
      mimeType: "application/pdf",
      tamanhoBytes: 7,
    }));
  });

  it("deve registrar log e propagar notFound quando resposta não existe", async () => {
    repo.findRespostaContext.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    await expect(service.salvarAnexo("resp-x", makeFile() as any)).rejects.toThrow("Resposta não encontrada.");
    expect(logRepo.create).toHaveBeenCalledWith(expect.objectContaining({
      atorTipo: "aluno",
      acao: "upload_falhou",
      detalhes: { motivo: "Resposta não encontrada.", respostaId: "resp-x" },
    }));
  });

  it("deve rejeitar prova do aluno fora de andamento", async () => {
    repo.findRespostaContext.mockResolvedValue({ ...validContext, provaAlunoStatus: "enviada" });

    await expect(service.salvarAnexo("resp-1", makeFile() as any)).rejects.toThrow("A prova do aluno não está em andamento.");
  });

  it("deve rejeitar prova indisponível", async () => {
    repo.findRespostaContext.mockResolvedValue({ ...validContext, provaStatus: "rascunho" });

    await expect(service.salvarAnexo("resp-1", makeFile() as any)).rejects.toThrow("Prova indisponível para upload de anexo.");
  });

  it("deve rejeitar prova fora do período", async () => {
    repo.findRespostaContext.mockResolvedValue({ ...validContext, dataFim: "2026-06-01T11:30:00Z" });

    await expect(service.salvarAnexo("resp-1", makeFile() as any)).rejects.toThrow("Prova fora do período de resposta.");
  });

  it("deve rejeitar questão que não permite anexo", async () => {
    repo.findRespostaContext.mockResolvedValue({ ...validContext, permiteAnexo: false });

    await expect(service.salvarAnexo("resp-1", makeFile() as any)).rejects.toThrow("A questão respondida não permite anexo.");
  });

  it("deve rejeitar tipo MIME inválido", async () => {
    await expect(service.salvarAnexo("resp-1", makeFile({ mimeType: "text/plain" }) as any)).rejects.toThrow("Tipo de arquivo inválido.");
  });

  it("deve rejeitar arquivo vazio", async () => {
    await expect(service.salvarAnexo("resp-1", makeFile({ content: Buffer.alloc(0) }) as any)).rejects.toThrow("Arquivo deve ter até 5MB.");
  });

  it("deve ignorar falha ao registrar log", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    repo.findRespostaContext.mockResolvedValue({ ...validContext, permiteAnexo: false });
    logRepo.create.mockRejectedValue(new Error("sem log"));

    await expect(service.salvarAnexo("resp-1", makeFile() as any)).rejects.toThrow("A questão respondida não permite anexo.");
    consoleSpy.mockRestore();
  });
});
