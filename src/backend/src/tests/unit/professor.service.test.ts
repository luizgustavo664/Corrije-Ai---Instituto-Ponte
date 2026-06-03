import { describe, expect, it, jest } from "@jest/globals";
import type { AuthUser } from "../../middlewares/auth.js";
import { ProfessorService } from "../../services/professor.service.js";

const user: AuthUser = { id: "coord-1", nome: "Coord", email: "coord@test.com", perfil: "coordenador" };
const professor = { id: "prof-1", nome: "Professor", email: "p@test.com", coordenadorId: "coord-1" };

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
  it("deve criar professor quando coordenador existe e email é único", async () => {
    const service = new ProfessorService(makeRepo() as any);

    await expect(service.criar({ nome: "Professor", email: "p@test.com", coordenadorId: "coord-1" } as any, user)).resolves.toEqual(professor);
  });

  it("deve lançar businessRule quando coordenador não existe", async () => {
    const repo = makeRepo();
    repo.coordenadorExists.mockResolvedValue(false);
    const service = new ProfessorService(repo as any);

    await expect(service.criar({ coordenadorId: "x" } as any, user)).rejects.toThrow("O coordenador informado não existe.");
  });

  it("deve lançar conflict quando email já existe", async () => {
    const repo = makeRepo();
    repo.findByEmail.mockResolvedValue(professor);
    const service = new ProfessorService(repo as any);

    await expect(service.criar({ email: "p@test.com", coordenadorId: "coord-1" } as any, user)).rejects.toThrow("Já existe um professor com este e-mail.");
  });

  it("deve listar, buscar, atualizar e remover professor", async () => {
    const repo = makeRepo();
    const service = new ProfessorService(repo as any);

    await expect(service.listar({ page: 1, limit: 10 }, user)).resolves.toEqual({ data: [professor], total: 1 });
    await expect(service.buscarPorId("prof-1", user)).resolves.toEqual(professor);
    await expect(service.atualizar("prof-1", { nome: "Novo" } as any, user)).resolves.toMatchObject({ nome: "Novo" });
    await service.remover("prof-1", user);
    expect(repo.delete).toHaveBeenCalledWith("prof-1");
  });

  it("deve lançar notFound ao buscar professor inexistente", async () => {
    const repo = makeRepo();
    repo.findById.mockResolvedValue(null);
    const service = new ProfessorService(repo as any);

    await expect(service.buscarPorId("x", user)).rejects.toThrow("Professor não encontrado.");
  });

  it("deve lançar conflict ao atualizar para email de outro professor", async () => {
    const repo = makeRepo();
    repo.findByEmail.mockResolvedValue({ id: "outro" });
    const service = new ProfessorService(repo as any);

    await expect(service.atualizar("prof-1", { email: "x@test.com" } as any, user)).rejects.toThrow("Já existe um professor com este e-mail.");
  });

  it("deve criar e remover vínculo professor-matéria", async () => {
    const repo = makeRepo();
    const service = new ProfessorService(repo as any);

    await expect(service.criarVinculo("prof-1", "mat-1", user)).resolves.toEqual({ professorId: "prof-1", materiaId: "mat-1" });
    await service.removerVinculo("prof-1", "mat-1", user);
    expect(repo.removerVinculo).toHaveBeenCalledWith("prof-1", "mat-1");
  });

  it("deve bloquear vínculo duplicado", async () => {
    const repo = makeRepo();
    repo.vinculoExists.mockResolvedValue(true);
    const service = new ProfessorService(repo as any);

    await expect(service.criarVinculo("prof-1", "mat-1", user)).rejects.toThrow("Vínculo já existe.");
  });
});
