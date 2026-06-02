import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import type { AuthUser } from "../../models/auth.model.js";
import { QuestaoService } from "../../services/questao.service.js";

const professor: AuthUser = { id: "prof-1", nome: "Professor", email: "prof@test.com", perfil: "professor" };
const coordenador: AuthUser = { id: "coord-1", nome: "Coord", email: "coord@test.com", perfil: "coordenador" };

const makeRepo = () => ({
  materiaExists: jest.fn<any>().mockResolvedValue(true),
  temaBelongsToMateria: jest.fn<any>().mockResolvedValue(true),
  professorMateriaVinculados: jest.fn<any>().mockResolvedValue(true),
  create: jest.fn<any>().mockResolvedValue({ id: "q-1", materiaId: "mat-1" }),
  findMany: jest.fn<any>().mockResolvedValue({ data: [], total: 0 }),
  findById: jest.fn<any>().mockResolvedValue({ id: "q-1", materiaId: "mat-1" }),
  update: jest.fn<any>().mockResolvedValue({ id: "q-1", tipo: "discursiva" }),
  deleteOrDeactivate: jest.fn<any>().mockResolvedValue(undefined),
});

const multiplaEscolha = {
  materiaId: "mat-1",
  tipo: "multipla_escolha",
  enunciado: { texto: "Quanto e 2+2?" },
  alternativas: [
    { texto: "4", correta: true, ordemOriginal: 1 },
    { texto: "5", correta: false, ordemOriginal: 2 },
  ],
};

describe("QuestaoService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: QuestaoService;

  beforeEach(() => {
    repo = makeRepo();
    service = new QuestaoService(repo as any);
  });

  it("CT03 - RN03 - deve criar questão de múltipla escolha válida", async () => {
    const result = await service.criar(multiplaEscolha as any, professor);

    expect(result).toEqual({ id: "q-1", materiaId: "mat-1" });
    expect(repo.create).toHaveBeenCalledWith(multiplaEscolha);
  });

  it("deve criar questão discursiva sem alternativas e sem exigir vínculo para coordenador", async () => {
    const input = { materiaId: "mat-1", tipo: "discursiva", enunciado: { texto: "Explique" }, alternativas: [] };

    await service.criar(input as any, coordenador);

    expect(repo.professorMateriaVinculados).not.toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalledWith(input);
  });

  it("deve rejeitar ordens duplicadas de alternativas", async () => {
    await expect(
      service.criar({
        ...multiplaEscolha,
        alternativas: [
          { texto: "A", correta: true, ordemOriginal: 1 },
          { texto: "B", correta: false, ordemOriginal: 1 },
        ],
      } as any, professor),
    ).rejects.toThrow("Ordem de alternativa duplicada.");
  });

  it("deve rejeitar discursiva com alternativas", async () => {
    await expect(
      service.criar({ materiaId: "mat-1", tipo: "discursiva", alternativas: [{ texto: "A", correta: false, ordemOriginal: 1 }] } as any, professor),
    ).rejects.toThrow("Questões discursivas não devem ter alternativas.");
  });

  it("deve rejeitar múltipla escolha sem exatamente uma correta", async () => {
    await expect(
      service.criar({ ...multiplaEscolha, alternativas: [{ texto: "A", correta: false, ordemOriginal: 1 }] } as any, professor),
    ).rejects.toThrow("Questões de múltipla escolha precisam ter pelo menos duas alternativas e exatamente uma correta.");
  });

  it("deve rejeitar verdadeiro/falso com quantidade inválida de alternativas", async () => {
    await expect(
      service.criar({ ...multiplaEscolha, tipo: "verdadeiro_falso", alternativas: [{ texto: "V", correta: true, ordemOriginal: 1 }] } as any, professor),
    ).rejects.toThrow("Questões de verdadeiro/falso precisam ter exatamente duas alternativas e uma correta.");
  });

  it("deve rejeitar limites em questão objetiva", async () => {
    await expect(
      service.criar({ ...multiplaEscolha, limiteCaracteres: 100 } as any, professor),
    ).rejects.toThrow("Limites e anexos só são válidos para questões discursivas.");
  });

  it("deve rejeitar matéria inexistente", async () => {
    repo.materiaExists.mockResolvedValue(false);

    await expect(service.criar(multiplaEscolha as any, professor)).rejects.toThrow("Matéria informada não existe.");
  });

  it("deve rejeitar tema fora da matéria", async () => {
    repo.temaBelongsToMateria.mockResolvedValue(false);

    await expect(service.criar({ ...multiplaEscolha, temaId: "tema-1" } as any, professor)).rejects.toThrow(
      "Tema informado não pertence à matéria da questão.",
    );
  });

  it("deve rejeitar professor sem vínculo com a matéria", async () => {
    repo.professorMateriaVinculados.mockResolvedValue(false);

    await expect(service.criar(multiplaEscolha as any, professor)).rejects.toThrow(
      "Professor não está vinculado à matéria informada.",
    );
  });

  it("deve listar delegando ao repository", async () => {
    await expect(service.listar({ page: 1, limit: 10 } as any, professor)).resolves.toEqual({ data: [], total: 0 });
    expect(repo.findMany).toHaveBeenCalledWith({ page: 1, limit: 10 }, professor);
  });

  it("deve buscar por id quando existe e professor tem vínculo", async () => {
    await expect(service.buscarPorId("q-1", professor)).resolves.toMatchObject({ id: "q-1" });
  });

  it("deve lançar notFound quando questão não existe", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.buscarPorId("q-x", professor)).rejects.toThrow("Questão não encontrada.");
  });

  it("deve lançar forbidden quando professor não acessa a questão", async () => {
    repo.professorMateriaVinculados.mockResolvedValue(false);

    await expect(service.buscarPorId("q-1", professor)).rejects.toThrow("Professor não está vinculado à matéria da questão.");
  });

  it("deve atualizar questão existente", async () => {
    await expect(service.atualizar("q-1", { materiaId: "mat-1", tipo: "discursiva", alternativas: [] } as any, professor)).resolves.toEqual({
      id: "q-1",
      tipo: "discursiva",
    });
  });

  it("deve lançar notFound quando update retorna null", async () => {
    repo.update.mockResolvedValue(null);

    await expect(service.atualizar("q-1", { materiaId: "mat-1", tipo: "discursiva", alternativas: [] } as any, professor)).rejects.toThrow(
      "Questão não encontrada.",
    );
  });

  it("deve remover questão após validar acesso", async () => {
    await service.remover("q-1", professor);

    expect(repo.deleteOrDeactivate).toHaveBeenCalledWith("q-1");
  });
});
