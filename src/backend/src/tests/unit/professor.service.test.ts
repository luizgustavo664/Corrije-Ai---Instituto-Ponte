import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthUser } from "../../models/auth.model.js";
import { ProfessorService } from "../../services/professor.service.js";

const user: AuthUser = { id: "coord-1", nome: "Coord", email: "coord@test.com", perfil: "coordenador" };
const professor = { id: "prof-1", nome: "Professor", email: "prof@test.com", coordenadorId: "coord-1" };

const makeRepo = () => ({
  coordenadorExists: jest.fn<any>().mockResolvedValue(true),
  findByEmail: jest.fn<any>().mockResolvedValue(null),
  create: jest.fn<any>().mockResolvedValue(professor),
  findAll: jest.fn<any>().mockResolvedValue({ data: [professor], total: 1 }),
  findById: jest.fn<any>().mockResolvedValue(professor),
  update: jest.fn<any>().mockResolvedValue({ ...professor, nome: "Novo" }),
  delete: jest.fn<any>().mockResolvedValue(undefined),
  materiaExists: jest.fn<any>().mockResolvedValue(true),
  vinculoExists: jest.fn<any>().mockResolvedValue(false),
  criarVinculo: jest.fn<any>().mockResolvedValue({ professorId: "prof-1", materiaId: "mat-1" }),
  removerVinculo: jest.fn<any>().mockResolvedValue(true),
});

describe("ProfessorService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: ProfessorService;

  beforeEach(() => {
    repo = makeRepo();
    service = new ProfessorService(repo as any);
  });

  it("deve criar professor quando coordenador existe e email é único", async () => {
    await expect(service.criar({ nome: "Professor", email: "prof@test.com", coordenadorId: "coord-1" } as any, user)).resolves.toEqual(professor);
  });

  it("deve rejeitar criação com coordenador inexistente", async () => {
    repo.coordenadorExists.mockResolvedValue(false);

    await expect(service.criar({ email: "prof@test.com", coordenadorId: "coord-x" } as any, user)).rejects.toThrow(
      "O coordenador informado não existe.",
    );
  });

  it("deve rejeitar criação com email duplicado", async () => {
    repo.findByEmail.mockResolvedValue(professor);

    await expect(service.criar({ email: "prof@test.com", coordenadorId: "coord-1" } as any, user)).rejects.toThrow(
      "Já existe um professor com este e-mail.",
    );
  });

  it("deve listar professores paginados", async () => {
    await expect(service.listar({ page: 2, limit: 5 }, user)).resolves.toEqual({ data: [professor], total: 1 });
    expect(repo.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
  });

  it("deve buscar professor por id", async () => {
    await expect(service.buscarPorId("prof-1", user)).resolves.toEqual(professor);
  });

  it("deve lançar notFound ao buscar professor inexistente", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.buscarPorId("prof-x", user)).rejects.toThrow("Professor não encontrado.");
  });

  it("deve atualizar professor sem duplicidade", async () => {
    await expect(service.atualizar("prof-1", { nome: "Novo", email: "prof@test.com" } as any, user)).resolves.toMatchObject({ nome: "Novo" });
  });

  it("deve rejeitar atualização de professor inexistente", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.atualizar("prof-x", { nome: "Novo" } as any, user)).rejects.toThrow("Professor não encontrado.");
  });

  it("deve rejeitar atualização com email de outro professor", async () => {
    repo.findByEmail.mockResolvedValue({ ...professor, id: "prof-2" });

    await expect(service.atualizar("prof-1", { email: "prof@test.com" } as any, user)).rejects.toThrow(
      "Já existe um professor com este e-mail.",
    );
  });

  it("deve rejeitar atualização com coordenador inexistente", async () => {
    repo.coordenadorExists.mockResolvedValue(false);

    await expect(service.atualizar("prof-1", { coordenadorId: "coord-x" } as any, user)).rejects.toThrow(
      "O coordenador informado não existe.",
    );
  });

  it("deve lançar notFound quando update retorna null", async () => {
    repo.update.mockResolvedValue(null);

    await expect(service.atualizar("prof-1", { nome: "Novo" } as any, user)).rejects.toThrow("Professor não encontrado.");
  });

  it("deve remover professor existente", async () => {
    await service.remover("prof-1", user);

    expect(repo.delete).toHaveBeenCalledWith("prof-1");
  });

  it("deve criar vínculo professor-matéria", async () => {
    await expect(service.criarVinculo("prof-1", "mat-1", user)).resolves.toEqual({ professorId: "prof-1", materiaId: "mat-1" });
  });

  it("deve rejeitar vínculo com matéria inexistente", async () => {
    repo.materiaExists.mockResolvedValue(false);

    await expect(service.criarVinculo("prof-1", "mat-x", user)).rejects.toThrow("Matéria não encontrada.");
  });

  it("deve rejeitar vínculo duplicado", async () => {
    repo.vinculoExists.mockResolvedValue(true);

    await expect(service.criarVinculo("prof-1", "mat-1", user)).rejects.toThrow("Vínculo já existe.");
  });

  it("deve remover vínculo existente", async () => {
    await service.removerVinculo("prof-1", "mat-1", user);

    expect(repo.removerVinculo).toHaveBeenCalledWith("prof-1", "mat-1");
  });

  it("deve lançar notFound ao remover vínculo inexistente", async () => {
    repo.removerVinculo.mockResolvedValue(false);

    await expect(service.removerVinculo("prof-1", "mat-x", user)).rejects.toThrow("Vínculo não encontrado.");
  });
});
