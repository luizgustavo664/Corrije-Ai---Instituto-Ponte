import { describe, expect, it, jest } from "@jest/globals";
import { HealthService } from "../../services/health.service.js";

describe("HealthService - unitário", () => {
  it("deve retornar status básico da aplicação", () => {
    const service = new HealthService({ ping: jest.fn<any>() } as any);

    expect(service.check()).toEqual({ status: "ok", service: "corrije-ai-api" });
  });

  it("deve retornar database ok após ping", async () => {
    const databaseRepository = { ping: jest.fn<any>().mockResolvedValue(undefined) };
    const service = new HealthService(databaseRepository as any);

    await expect(service.database()).resolves.toEqual({ database: "ok" });
    expect(databaseRepository.ping).toHaveBeenCalledTimes(1);
  });

  it("deve propagar erro do ping do banco", async () => {
    const databaseRepository = { ping: jest.fn<any>().mockRejectedValue(new Error("db down")) };
    const service = new HealthService(databaseRepository as any);

    await expect(service.database()).rejects.toThrow("db down");
  });
});
