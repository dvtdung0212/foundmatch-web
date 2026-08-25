import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

import { createNextConfig } from "../next.config.mjs";
import {
  assertWebDevelopmentPortAvailable,
  resolveDevelopmentEndpoints,
  waitForDevelopmentDependency,
} from "./dev-preflight.mjs";

test("runs web development independently without deleting its cache", () => {
  const packageManifest = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.equal(
    packageManifest.scripts.dev,
    "node scripts/dev-preflight.mjs && next dev --turbo --port 3000",
  );
  assert.equal(packageManifest.scripts.predev, undefined);
  assert.match(packageManifest.scripts.clean, /\.next-dev/);
});

test("uses the native development watcher without a Webpack polling override", () => {
  assert.equal(createNextConfig(PHASE_DEVELOPMENT_SERVER, {}).webpack, undefined);
});

test("separates development and production Next.js output", () => {
  assert.equal(
    createNextConfig(PHASE_DEVELOPMENT_SERVER, {}).distDir,
    ".next-dev",
  );
  assert.equal(createNextConfig("phase-production-build", {}).distDir, ".next");
});

test("uses process environment before local development defaults", () => {
  assert.deepEqual(
    resolveDevelopmentEndpoints({
      NEXT_PUBLIC_API_URL: "http://localhost:3991/",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:55421/",
    }),
    {
      backendReadinessUrl: "http://localhost:3991/api/v1/health/ready",
      supabaseAuthHealthUrl: "http://127.0.0.1:55421/auth/v1/health",
    },
  );
});

test("reports a bounded dependency failure without leaking response content", async () => {
  await assert.rejects(
    waitForDevelopmentDependency({
      fetchDependency: async () => ({ ok: false, status: 503 }),
      label: "Backend",
      timeoutMs: 50,
      url: "http://localhost:3001/api/v1/health/ready",
    }),
    /Backend is unavailable.*HTTP 503/,
  );
});

test("rejects a duplicate web development process on the canonical port", async () => {
  await assert.rejects(
    assertWebDevelopmentPortAvailable({
      checkPort: async () => false,
      port: 3000,
    }),
    /Web port 3000 is already in use/,
  );
});
