import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

test("all HTML forms opt out of browser-native validation", async () => {
  const violations = [];
  for (const file of await sourceFiles(path.resolve("src"))) {
    const source = await readFile(file, "utf8");
    if (/<form(?![^>]*\bnoValidate\b)/s.test(source)) {
      violations.push(path.relative(process.cwd(), file));
    }
  }
  assert.deepEqual(violations, []);
});

async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(target)));
    else if (/\.(jsx|tsx)$/.test(entry.name)) files.push(target);
  }
  return files;
}
