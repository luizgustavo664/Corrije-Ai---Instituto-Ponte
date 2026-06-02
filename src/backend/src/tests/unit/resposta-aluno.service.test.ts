import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RespostaAlunoService } from "../../services/resposta-aluno.service.js";

const now = new Date("2026-06-01T12:00:00Z").getTime();
const validContext = {
  status: "em_andamento",
  provaStatus: "publicada",
  dataInicio: "2026-06-01T11:00:00Z",
  dataFim: "2026-06-01T13:00:00Z",
};

const makeRepo = () => ({
  findProvaAlunoContext: jest.fn<any>().mockResolvedValue(validContext),
  findQuestaoDaProva: jest.fn<any>().mockResolvedValue({ tipo: "multipla_escolha", limiteCaracteres: null }),
  alternativaBelongsToQuestao: jest.fn<any>().mockResolvedValue(true),
  upsert: jest.fn<any>().mockResolvedValue({ id: "resp-1", rascunho: true }),
  findByProvaAluno: jest.fn<any>().mockResolvedValue([{ id: "resp-1" }]),
  markAsSubmitted: jest.fn<any>().mockResolvedValue({ provaAlunoId: "pa-1", questoesEmBranco: [] }),
});

describe("RespostaAlunoService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: RespostaAlunoService;
  let dateSpy: jest.SpiedFunction<typeof Date.now>;

  beforeEach(() => {
    dateSpy = jest.spyOn(Date, "now").mockReturnValue(now);
    repo = makeRepo();
    service = new RespostaAlunoService(repo as any);
  });

  afterEach(() => {
    dateSpy.mockRestore();
  });

  it("deve salvar rascunho objetivo com alternativa válida", async () => {
    const result = await service.salvarRascunho("pa-1", "q-1", { alternativaId: "alt-1", rascunho: true } as any);

    expect(result).toEqual({ id: "resp-1", rascunho: true });
    expect(repo.upsert).toHaveBeenCalledWith("pa-1", "q-1", { alternativaId: "alt-1", rascunho: true });
  });

  it("deve rejeitar prova do aluno inexistente", async () => {
    repo.findProvaAlunoContext.mockResolvedValue(null);

    await expect(service.salvarRascunho("pa-x", "q-1", { alternativaId: "alt-1" } as any)).rejects.toThrow(
      "Prova do aluno não encontrada.",
    );
  });

  it("deve rejeitar prova que não está em andamento", async () => {
    repo.findProvaAlunoContext.mockResolvedValue({ ...validContext, status: "enviada" });

    await expect(service.salvarRascunho("pa-1", "q-1", { alternativaId: "alt-1" } as any)).rejects.toThrow(
      "A prova do aluno não está em andamento.",
    );
  });

  it("deve rejeitar prova indisponível para resposta", async () => {
    repo.findProvaAlunoContext.mockResolvedValue({ ...validContext, provaStatus: "rascunho" });

    await expect(service.salvarRascunho("pa-1", "q-1", { alternativaId: "alt-1" } as any)).rejects.toThrow(
      "Prova indisponível para resposta.",
    );
  });

  it("deve rejeitar prova fora do período", async () => {
    repo.findProvaAlunoContext.mockResolvedValue({ ...validContext, dataFim: "2026-06-01T11:30:00Z" });

    await expect(service.salvarRascunho("pa-1", "q-1", { alternativaId: "alt-1" } as any)).rejects.toThrow(
      "Prova fora do período de resposta.",
    );
  });

  it("deve rejeitar questão ausente na prova do aluno", async () => {
    repo.findQuestaoDaProva.mockResolvedValue(null);

    await expect(service.salvarRascunho("pa-1", "q-x", { alternativaId: "alt-1" } as any)).rejects.toThrow(
      "Questão não encontrada na prova do aluno.",
    );
  });

  it("deve exigir alternativa para questão objetiva", async () => {
    await expect(service.salvarRascunho("pa-1", "q-1", { respostaTexto: "texto" } as any)).rejects.toThrow(
      "Questões objetivas exigem alternativa marcada.",
    );
  });

  it("deve rejeitar alternativa que não pertence à questão", async () => {
    repo.alternativaBelongsToQuestao.mockResolvedValue(false);

    await expect(service.salvarRascunho("pa-1", "q-1", { alternativaId: "alt-x" } as any)).rejects.toThrow(
      "Alternativa informada não pertence à questão.",
    );
  });

  it("deve salvar resposta discursiva válida", async () => {
    repo.findQuestaoDaProva.mockResolvedValue({ tipo: "discursiva", limiteCaracteres: 20 });

    await service.salvarRascunho("pa-1", "q-1", { respostaTexto: "resposta" } as any);

    expect(repo.upsert).toHaveBeenCalled();
  });

  it("deve rejeitar discursiva com alternativa marcada", async () => {
    repo.findQuestaoDaProva.mockResolvedValue({ tipo: "discursiva", limiteCaracteres: 20 });

    await expect(service.salvarRascunho("pa-1", "q-1", { alternativaId: "alt-1", respostaTexto: "texto" } as any)).rejects.toThrow(
      "Questões discursivas não aceitam alternativa marcada.",
    );
  });

  it("deve rejeitar discursiva sem texto", async () => {
    repo.findQuestaoDaProva.mockResolvedValue({ tipo: "discursiva", limiteCaracteres: 20 });

    await expect(service.salvarRascunho("pa-1", "q-1", {} as any)).rejects.toThrow("Questões discursivas exigem resposta textual.");
  });

  it("deve rejeitar discursiva acima do limite de caracteres", async () => {
    repo.findQuestaoDaProva.mockResolvedValue({ tipo: "discursiva", limiteCaracteres: 3 });

    await expect(service.salvarRascunho("pa-1", "q-1", { respostaTexto: "texto" } as any)).rejects.toThrow(
      "A resposta ultrapassa o limite de caracteres da questão.",
    );
  });

  it("deve listar respostas quando prova do aluno existe", async () => {
    await expect(service.listarRespostas("pa-1")).resolves.toEqual([{ id: "resp-1" }]);
  });

  it("deve enviar prova finalizada", async () => {
    await expect(service.enviarFinal("pa-1")).resolves.toEqual({ provaAlunoId: "pa-1", questoesEmBranco: [] });
  });

  it("deve lançar notFound quando envio final não retorna provaAlunoId", async () => {
    repo.markAsSubmitted.mockResolvedValue({ provaAlunoId: null });

    await expect(service.enviarFinal("pa-1")).rejects.toThrow("Prova do aluno não encontrada.");
  });
});
