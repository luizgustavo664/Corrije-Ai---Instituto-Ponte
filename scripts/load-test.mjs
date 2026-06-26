import http from "node:http";
import https from "node:https";

const baseUrl = process.env.LOAD_TEST_BASE_URL ?? process.env.VITE_API_BASE_URL ?? "http://127.0.0.1:3333/api/v1";
const normalizedBaseUrl = baseUrl.endsWith("/api/v1")
  ? baseUrl.replace(/\/api\/v1$/, "")
  : baseUrl.replace(/\/$/, "");
const url = new URL("/api/v1/health", `${normalizedBaseUrl}/`);
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY ?? 10);
const requests = Number(process.env.LOAD_TEST_REQUESTS ?? 50);

const requestHealth = (targetUrl) => new Promise((resolve) => {
  const client = targetUrl.protocol === "https:" ? https : http;
  const request = client.request(targetUrl, { method: "GET", timeout: 5_000 }, (response) => {
    response.on("end", () => {
      resolve(response.statusCode >= 200 && response.statusCode < 300);
    });
    response.resume();
  });

  request.on("timeout", () => {
    request.destroy();
    resolve(false);
  });
  request.on("error", () => resolve(false));
  request.end();
});

const startedAt = performance.now();
let failures = 0;

await Promise.all(Array.from({ length: requests }, async (_, index) => {
  await new Promise((resolve) => setTimeout(resolve, (index % concurrency) * 5));
  const passed = await requestHealth(url);
  if (!passed) {
    failures += 1;
  }
}));

const elapsedMs = Math.round(performance.now() - startedAt);
const failureRate = failures / requests;

console.log(JSON.stringify({
  url: url.toString(),
  requests,
  concurrency,
  failures,
  failureRate,
  elapsedMs,
}, null, 2));

if (failureRate > 0.01) {
  process.exitCode = 1;
}
