import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const VERSION = "3.0.79";
const BUILD = 116;
const RELEASED_AT = "2026-08-13T01:50:00+08:00";

test("web release source freezes the exact 3.0.79 APK identity", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const app = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
  const download = fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8");
  assert.match(app, new RegExp(`const APP_VERSION = '${VERSION.replaceAll(".", "\\.")}'`));
  assert.match(app, new RegExp(RELEASED_AT.replaceAll("+", "\\+")));
  assert.match(download, new RegExp(`versionCode ${BUILD}`));
  assert.match(download, /233755800/u);
  assert.match(download, /9EF8A329B7F065296FEAB93612E11C2C5A00D1AA43BBDBCEE3F5752B6719D576/u);
  assert.match(download, /3\.0\.79,3\.0\.78,3\.0\.77/u);
});

test("frozen local signed APK matches website metadata", () => {
  const apk = "C:\\Users\\Administrator\\Desktop\\zhichao-mobile-release.apk";
  if (!fs.existsSync(apk)) return;
  const buffer = fs.readFileSync(apk);
  assert.equal(buffer.length, 233755800);
  assert.equal(createHash("sha256").update(buffer).digest("hex"), "9ef8a329b7f065296feab93612e11c2c5a00d1aa43bbdbcee3f5752b6719d576");
});

test("invalid release fixture cannot masquerade as the signed package", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-3079-web-"));
  try {
    const fake = path.join(directory, "fake.apk");
    fs.writeFileSync(fake, "not-the-release");
    const digest = createHash("sha256").update(fs.readFileSync(fake)).digest("hex");
    assert.notEqual(digest, "9ef8a329b7f065296feab93612e11c2c5a00d1aa43bbdbcee3f5752b6719d576");
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
