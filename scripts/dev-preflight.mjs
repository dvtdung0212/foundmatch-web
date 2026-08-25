import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_API_URL = "http://localhost:3001";
const DEFAULT_SUPABASE_URL = "http://127.0.0.1:55421";
const URL_VARIABLES = new Set([
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
]);

function parseLocalUrlEnvironment(contents) {
  const values = {};

  for (const line of contents.split(/\r?\n/)) {
    const match = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match || !URL_VARIABLES.has(match[1])) continue;

    const rawValue = match[2];
    values[match[1]] = rawValue.replace(/^(?:"(.*)"|'(.*)')$/, "$1$2");
  }

  return values;
}

export function loadDevelopmentEnvironment(
  directory = process.cwd(),
  environment = process.env,
) {
  const fromFiles = {};
  const environmentFiles = [
    ".env",
    ".env.development",
    ".env.local",
    ".env.development.local",
  ];

  for (const fileName of environmentFiles) {
    const filePath = resolve(directory, fileName);
    if (!existsSync(filePath)) continue;
    Object.assign(
      fromFiles,
      parseLocalUrlEnvironment(readFileSync(filePath, "utf8")),
    );
  }

  return { ...fromFiles, ...environment };
}

function endpoint(baseUrl, pathname, variableName) {
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`${variableName} must be a valid absolute URL.`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${variableName} must use http or https.`);
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error(
      `${variableName} must not contain credentials, query parameters or fragments.`,
    );
  }

  return new URL(
    pathname,
    `${parsed.toString().replace(/\/$/, "")}/`,
  ).toString();
}

export function resolveDevelopmentEndpoints(environment = process.env) {
  return {
    backendReadinessUrl: endpoint(
      environment.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
      "api/v1/health/ready",
      "NEXT_PUBLIC_API_URL",
    ),
    supabaseAuthHealthUrl: endpoint(
      environment.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL,
      "auth/v1/health",
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
  };
}

function checkPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE" || error.code === "EACCES") {
        resolve(false);
        return;
      }
      reject(error);
    });
    server.listen({ port }, () => {
      server.close((error) => (error ? reject(error) : resolve(true)));
    });
  });
}

export async function assertWebDevelopmentPortAvailable({
  checkPort = checkPortAvailable,
  port = 3000,
} = {}) {
  if (await checkPort(port)) return;
  throw new Error(
    `Web port ${port} is already in use. Stop the existing web development process before starting another one.`,
  );
}

export async function waitForDevelopmentDependency({
  fetchDependency = fetch,
  label,
  timeoutMs = 3_000,
  url,
}) {
  let failure = "request failed";
  try {
    const response = await fetchDependency(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (response.ok) return;
    failure = `HTTP ${response.status}`;
  } catch (error) {
    failure = error instanceof Error ? error.message : failure;
  }

  throw new Error(`${label} is unavailable at ${url} (${failure}).`);
}

export async function runDevelopmentPreflight() {
  await assertWebDevelopmentPortAvailable();
  const endpoints = resolveDevelopmentEndpoints(loadDevelopmentEnvironment());

  await Promise.all([
    waitForDevelopmentDependency({
      label: "Backend",
      url: endpoints.backendReadinessUrl,
    }),
    waitForDevelopmentDependency({
      label: "Supabase Auth",
      url: endpoints.supabaseAuthHealthUrl,
    }),
  ]);

  console.log("[WEB] Platform dependencies are healthy. Starting Next.js...");
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  runDevelopmentPreflight().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[WEB] ${message}`);
    if (!message.startsWith("Web port ")) {
      console.error(
        "[WEB] Start FoundMatch Platform with `pnpm dev` before starting the web app.",
      );
    }
    process.exitCode = 1;
  });
}
