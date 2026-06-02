import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { AuthUser } from "../../models/auth.model.js";
import { AnexoExportarService } from "../../services/anexo-exportar.service.js";

const user: AuthUser = { id: "coord-1", nome: "Coord", email: "coord@test.com", perfil: "coordenador" };

const makeRepo = () => ({
  findProvaExists: jest.fn<any>().mockResolvedValue(true),
  findAnexosPorProva: jest.fn<any>().mockResolvedValue([{ id: "anexo-1" }]),
});

describe("AnexoExportarService - unitário", () => {
  let repo: ReturnType<typeof makeRepo>;
  let service: AnexoExportarService;

  beforeEach(() => {
    repo = makeRepo();
    service = new AnexoExportarService(repo as any);
  });

  it("deve exportar anexos quando prova existe", async () => {
    await expect(service.exportar("prova-1", user)).resolves.toEqual([{ id: "anexo-1" }]);
    expect(repo.findAnexosPorProva).toHaveBeenCalledWith("prova-1");
  });

  it("deve lançar notFound quando prova não existe", async () => {
    repo.findProvaExists.mockResolvedValue(false);

    await expect(service.exportar("prova-x", user)).rejects.toThrow("Prova não encontrada.");
  });
});
