import test from "node:test";
import assert from "node:assert/strict";
import { allowedMutationOrigin, selectedId } from "../src/security.ts";

test("mutações exigem Origin exato, inclusive login e logout", () => {
  assert.equal(allowedMutationOrigin("POST", undefined, "http://localhost:3000"), false);
  assert.equal(allowedMutationOrigin("POST", "https://evil.test", "http://localhost:3000"), false);
  assert.equal(allowedMutationOrigin("POST", "http://localhost:3000", "http://localhost:3000"), true);
  assert.equal(allowedMutationOrigin("GET", undefined, "http://localhost:3000"), true);
});
test("seletores rejeitam arrays, vazio e conteúdo não permitido", () => {
  assert.equal(selectedId(["tenant-a", "tenant-b"]), undefined);
  assert.equal(selectedId(""), undefined);
  assert.equal(selectedId("' OR 1=1"), undefined);
  assert.equal(selectedId("demo-aurora"), "demo-aurora");
});
