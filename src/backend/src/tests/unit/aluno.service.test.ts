import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthUser } from "../../models/auth.model.js";
import { AlunoService } from "../../services/aluno.service.js";

const user: AuthUser = { id: "coord-1", nome: "Coord", email: "coord@test.com", perfil: "coordenador" };
const aluno = { id: "aluno-1", nome: "Aluno", email: "aluno@test.com", cpf: "12345678901" };

const makeRepo = () => ({
  findAll: jest.fn<any>().mockResolvedValue({ data: [aluno], total: 1 }),
  findById: jest.fn<any>().mockResolvedValue(aluno),
  findByEmail: jest.fn<any>().mockResolvedValue(null),
  findByCpf: jest.fn<any>().mockResolvedValue(null),
  update: jest.fn<any>().mockResolvedValue({ ...aluno, nome: "Novo" }),
  delete: jest.fn<any>().mockResolvedValue(undefined),
});

describe("AlunoService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: AlunoService;

  beforeEach(() => {
    repo = makeRepo();
    service = new AlunoService(repo as any);
  });

  it("deve listar alunos", async () => {
    await expect(service.listar({ page: 1, limit: 10 }, user)).resolves.toEqual({ data: [aluno], total: 1 });
    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it("deve buscar aluno por id", async () => {
    await expect(service.buscarPorId("aluno-1", user)).resolves.toEqual(aluno);
  });

  it("deve lançar notFound quando aluno não existe", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.buscarPorId("aluno-x", user)).rejects.toThrow("Aluno não encontrado.");
  });

  it("deve atualizar aluno quando email e cpf são únicos", async () => {
    await expect(service.atualizar("aluno-1", { nome: "Novo", email: "novo@test.com", cpf: "12345678901" } as any, user)).resolves.toMatchObject({
      nome: "Novo",
    });
  });

  it("deve rejeitar atualização de aluno inexistente", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.atualizar("aluno-x", { nome: "Novo" } as any, user)).rejects.toThrow("Aluno não encontrado.");
  });

  it("deve rejeitar email usado por outro aluno", async () => {
    repo.findByEmail.mockResolvedValue({ ...aluno, id: "aluno-2" });

    await expect(service.atualizar("aluno-1", { email: "aluno@test.com" } as any, user)).rejects.toThrow(
      "Já existe um aluno com este e-mail.",
    );
  });

  it("deve rejeitar CPF usado por outro aluno", async () => {
    repo.findByCpf.mockResolvedValue({ ...aluno, id: "aluno-2" });

    await expect(service.atualizar("aluno-1", { cpf: "12345678901" } as any, user)).rejects.toThrow("Já existe um aluno com este CPF.");
  });

  it("deve permitir atualizar CPF null sem checar duplicidade", async () => {
    await service.atualizar("aluno-1", { cpf: null } as any, user);

    expect(repo.findByCpf).not.toHaveBeenCalled();
  });

  it("deve lançar notFound quando update retorna null", async () => {
    repo.update.mockResolvedValue(null);

    await expect(service.atualizar("aluno-1", { nome: "Novo" } as any, user)).rejects.toThrow("Aluno não encontrado.");
  });

  it("deve remover aluno existente", async () => {
    await service.remover("aluno-1", user);

    expect(repo.delete).toHaveBeenCalledWith("aluno-1");
  });
});
