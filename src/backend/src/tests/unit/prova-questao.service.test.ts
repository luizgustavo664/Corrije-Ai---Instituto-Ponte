import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthUser } from "../../models/auth.model.js";
import { ProvaQuestaoService } from "../../services/prova-questao.service.js";

const user: AuthUser = { id: "prof-1", nome: "Professor", email: "prof@test.com", perfil: "professor" };
const prova = { id: "prova-1", materia_id: "mat-1", status: "rascunho" };
const questao = { id: "q-1", materia_id: "mat-1", tem_enunciado: true };

const makeRepo = () => ({
  findProva: jest.fn<any>().mockResolvedValue(prova),
  hasAccess: jest.fn<any>().mockResolvedValue(true),
  findQuestao: jest.fn<any>().mockResolvedValue(questao),
  hasOrdem: jest.fn<any>().mockResolvedValue(false),
  hasQuestao: jest.fn<any>().mockResolvedValue(false),
  create: jest.fn<any>().mockResolvedValue({ provaId: "prova-1", questaoId: "q-1" }),
  findByProva: jest.fn<any>().mockResolvedValue([{ questaoId: "q-1" }]),
  delete: jest.fn<any>().mockResolvedValue(undefined),
});

describe("ProvaQuestaoService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: ProvaQuestaoService;

  beforeEach(() => {
    repo = makeRepo();
    service = new ProvaQuestaoService(repo as any);
  });

  it("deve adicionar questão válida à prova em rascunho", async () => {
    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).resolves.toEqual({
      provaId: "prova-1",
      questaoId: "q-1",
    });
  });

  it("deve rejeitar prova inexistente", async () => {
    repo.findProva.mockResolvedValue(null);

    await expect(service.adicionar("prova-x", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow("Prova não encontrada.");
  });

  it("deve rejeitar usuário sem acesso", async () => {
    repo.hasAccess.mockResolvedValue(false);

    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow(
      "Usuário sem permissão para acessar esta prova.",
    );
  });

  it("deve rejeitar prova fora de rascunho", async () => {
    repo.findProva.mockResolvedValue({ ...prova, status: "publicada" });

    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow(
      "Questões só podem ser alteradas em provas com status rascunho.",
    );
  });

  it("deve rejeitar questão inexistente", async () => {
    repo.findQuestao.mockResolvedValue(null);

    await expect(service.adicionar("prova-1", { questaoId: "q-x", ordemOriginal: 1 } as any, user)).rejects.toThrow("Questão não encontrada.");
  });

  it("deve rejeitar questão de outra matéria", async () => {
    repo.findQuestao.mockResolvedValue({ ...questao, materia_id: "mat-2" });

    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow(
      "A questão não pertence à mesma matéria da prova.",
    );
  });

  it("deve rejeitar questão sem enunciado", async () => {
    repo.findQuestao.mockResolvedValue({ ...questao, tem_enunciado: false });

    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow(
      "A questão precisa ter enunciado antes de ser associada à prova.",
    );
  });

  it("deve rejeitar ordem duplicada", async () => {
    repo.hasOrdem.mockResolvedValue(true);

    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow(
      "Já existe questão nessa ordem para a prova.",
    );
  });

  it("deve rejeitar questão já vinculada", async () => {
    repo.hasQuestao.mockResolvedValue(true);

    await expect(service.adicionar("prova-1", { questaoId: "q-1", ordemOriginal: 1 } as any, user)).rejects.toThrow(
      "Questão já vinculada à prova.",
    );
  });

  it("deve listar questões da prova quando tem acesso", async () => {
    await expect(service.listar("prova-1", user)).resolves.toEqual([{ questaoId: "q-1" }]);
  });

  it("deve remover questão vinculada", async () => {
    repo.hasQuestao.mockResolvedValue(true);

    await service.remover("prova-1", "q-1", user);

    expect(repo.delete).toHaveBeenCalledWith("prova-1", "q-1");
  });

  it("deve rejeitar remoção de questão não vinculada", async () => {
    await expect(service.remover("prova-1", "q-x", user)).rejects.toThrow("Questão não está vinculada à prova.");
  });
});
