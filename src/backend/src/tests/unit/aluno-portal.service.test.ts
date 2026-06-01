import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { AlunoPortalService } from "../../services/aluno-portal.service.js";

const prova = {
  id: "prova-1",
  titulo: "Prova",
  instrucoes: "Leia",
  tempoLimiteMin: 60,
  dataInicio: "2026-06-01T11:00:00Z",
  dataFim: "2026-06-01T13:00:00Z",
  status: "publicada",
};

const makeRepo = () => ({
  findPublicByUrl: jest.fn<any>().mockResolvedValue(prova),
  iniciarProva: jest.fn<any>().mockResolvedValue({ finalizada: false, provaAluno: { id: "pa-1", status: "em_andamento" } }),
  findQuestoesPublicas: jest.fn<any>().mockResolvedValue([{ id: "q-1" }]),
});

describe("AlunoPortalService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: AlunoPortalService;
  let dateSpy: jest.SpiedFunction<typeof Date.now>;

  beforeEach(() => {
    dateSpy = jest.spyOn(Date, "now").mockReturnValue(new Date("2026-06-01T12:00:00Z").getTime());
    repo = makeRepo();
    service = new AlunoPortalService(repo as any);
  });

  afterEach(() => {
    dateSpy.mockRestore();
  });

  it("CT05 - RN05 - deve obter dados públicos de prova disponível dentro do período", async () => {
    await expect(service.obterProvaPublica("url-1")).resolves.toEqual({
      titulo: "Prova",
      instrucoes: "Leia",
      tempoLimiteMin: 60,
      dataInicio: prova.dataInicio,
      dataFim: prova.dataFim,
      disponivel: true,
    });
  });

  it("deve rejeitar link inexistente", async () => {
    repo.findPublicByUrl.mockResolvedValue(null);

    await expect(service.obterProvaPublica("url-x")).rejects.toThrow("Link de prova não encontrado.");
  });

  it("deve rejeitar prova não publicada", async () => {
    repo.findPublicByUrl.mockResolvedValue({ ...prova, status: "rascunho" });

    await expect(service.obterProvaPublica("url-1")).rejects.toThrow("Prova ainda não disponível ou encerrada.");
  });

  it("deve rejeitar prova fora da janela", async () => {
    repo.findPublicByUrl.mockResolvedValue({ ...prova, dataInicio: "2026-06-01T13:30:00Z" });

    await expect(service.obterProvaPublica("url-1")).rejects.toThrow("Prova ainda não disponível ou encerrada.");
  });

  it("deve iniciar prova e retornar questões públicas", async () => {
    const result = await service.iniciarProva("url-1", { nome: "Aluno", email: "aluno@test.com" } as any);

    expect(result).toEqual({ provaAlunoId: "pa-1", status: "em_andamento", questoes: [{ id: "q-1" }] });
    expect(repo.iniciarProva).toHaveBeenCalledWith("prova-1", { nome: "Aluno", email: "aluno@test.com" });
  });

  it("deve rejeitar aluno com submissão final existente", async () => {
    repo.iniciarProva.mockResolvedValue({ finalizada: true, provaAluno: { id: "pa-1", status: "enviada" } });

    await expect(service.iniciarProva("url-1", { nome: "Aluno", email: "aluno@test.com" } as any)).rejects.toThrow(
      "Já existe submissão final para esta prova e aluno.",
    );
  });
});
