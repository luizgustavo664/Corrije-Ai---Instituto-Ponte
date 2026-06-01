import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthUser } from "../../models/auth.model.js";
import { AnalyticsService } from "../../services/analytics.service.js";

const user: AuthUser = { id: "prof-1", nome: "Professor", email: "prof@test.com", perfil: "professor" };

const makeRepo = () => ({
  findProvaExists: jest.fn<any>().mockResolvedValue(true),
  hasAccessToProva: jest.fn<any>().mockResolvedValue(true),
  obterAnalytics: jest.fn<any>().mockResolvedValue({
    totalAlunos: "10",
    acessos: "8",
    inicios: "7",
    envios: "6",
    totalRespostas: "30",
    totalAnexos: "2",
    pendenciasCorrecao: "1",
  }),
});

describe("AnalyticsService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: AnalyticsService;

  beforeEach(() => {
    repo = makeRepo();
    service = new AnalyticsService(repo as any);
  });

  it("deve retornar analytics convertendo números", async () => {
    await expect(service.obterPorProva("prova-1", user)).resolves.toEqual({
      provaId: "prova-1",
      totalAlunos: 10,
      acessos: 8,
      inicios: 7,
      envios: 6,
      totalRespostas: 30,
      totalAnexos: 2,
      pendenciasCorrecao: 1,
    });
  });

  it("deve lançar notFound quando prova não existe", async () => {
    repo.findProvaExists.mockResolvedValue(false);

    await expect(service.obterPorProva("prova-x", user)).rejects.toThrow("Prova não encontrada.");
  });

  it("deve lançar forbidden quando usuário sem acesso", async () => {
    repo.hasAccessToProva.mockResolvedValue(false);

    await expect(service.obterPorProva("prova-1", user)).rejects.toThrow("Usuário sem permissão para acessar analytics desta prova.");
  });
});
