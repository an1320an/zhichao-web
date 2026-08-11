import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const fallbackPath = path.resolve(
  import.meta.dirname,
  "../public/.well-known/zhichao-maintenance.json",
);

test("website ships a safe inactive maintenance fallback", () => {
  const raw = fs.readFileSync(fallbackPath, "utf8");
  assert.ok(raw.endsWith("\n"));
  const status = JSON.parse(raw);
  assert.deepEqual(Object.keys(status), [
    "active",
    "reason",
    "message",
    "startedAt",
    "expectedEndAt",
    "updatedAt",
    "incidentId",
    "compensationCoins",
  ]);
  assert.deepEqual(status, {
    active: false,
    reason: null,
    message: "",
    startedAt: null,
    expectedEndAt: null,
    updatedAt: "2026-08-11T15:00:00.000Z",
    incidentId: null,
    compensationCoins: 0,
  });
  assert.equal(/[<>]|https?:\/\//iu.test(raw), false);
});
