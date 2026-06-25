import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
const databaseHost = databaseUrl ? new URL(databaseUrl).hostname : "localhost";
const isLocalDatabase = databaseHost === "localhost" || databaseHost === "127.0.0.1";

const numberFromEnvironment = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};

export const pool = new Pool({
  connectionString: databaseUrl,
  max: numberFromEnvironment("DB_POOL_MAX", 10),
  connectionTimeoutMillis: numberFromEnvironment("DB_CONNECTION_TIMEOUT_MS", 8_000),
  idleTimeoutMillis: numberFromEnvironment("DB_IDLE_TIMEOUT_MS", 30_000),
  statement_timeout: numberFromEnvironment("DB_STATEMENT_TIMEOUT_MS", 15_000),
  application_name: process.env.DB_APPLICATION_NAME ?? "instituto-ponte-api",
  ssl: isLocalDatabase ? false : {
    rejectUnauthorized: false
  }
});
