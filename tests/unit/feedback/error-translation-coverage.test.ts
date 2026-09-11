import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { translateWebError } from "@/features/feedback";

describe("Web backend error translation coverage", () => {
  it("has a Vietnamese exact or family translation for every backend domain code", async () => {
    const backendSource = path.resolve("../foundmatch-platform/backend/src");
    await expect(access(backendSource)).resolves.toBeUndefined();
    const codes = await collectBackendErrorCodes(backendSource);
    const missing = codes.filter((code) => !translateWebError(code, "vi"));

    expect(missing).toEqual([]);
  }, 15_000);
});

async function collectBackendErrorCodes(directory: string): Promise<string[]> {
  const codes = new Set<string>();
  for (const file of await sourceFiles(directory)) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(
      /\bcode:\s*["']([A-Z][A-Z0-9_]+)["']/g,
    )) {
      if (match[1]) codes.add(match[1]);
    }
  }
  return [...codes].sort();
}

async function sourceFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(target)));
    else if (entry.name.endsWith(".ts")) files.push(target);
  }
  return files;
}
