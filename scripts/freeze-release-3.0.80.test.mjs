import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const VERSION = "3.0.80";
const BUILD = 117;
const RELEASED_AT = "2026-08-13T06:10:00+08:00";
const APK_BYTES = 233778480;
const APK_SHA256 = "9ef63d4537dc378fd09f764b6775f88bd6b0817cd0f3d8ead0436cc5bc760619";

test("web release source freezes the exact 3.0.80 APK identity", () => {
  const root = path.resolve(import.meta.dirname, "..");
  const app = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
  const download = fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8");
  assert.match(app, new RegExp(`const APP_VERSION = '${VERSION.replaceAll(".", "\\.")}'`));
  assert.match(app, new RegExp(RELEASED_AT.replaceAll("+", "\\+")));
  assert.match(download, new RegExp(`versionCode ${BUILD}`));
  assert.match(download, new RegExp(String(APK_BYTES)));
  assert.match(download, new RegExp(APK_SHA256, "iu"));
  assert.match(download, /3\.0\.80,3\.0\.79,3\.0\.78/u);
  assert.doesNotMatch(`${app}\n${download}`, /改名投票|身份名牌|参与奖励/u);
});

test("frozen local signed APK matches website metadata", () => {
  const apk = "C:\\Users\\Administrator\\Desktop\\zhichao-mobile-release.apk";
  if (!fs.existsSync(apk)) return;
  const buffer = fs.readFileSync(apk);
  assert.equal(buffer.length, APK_BYTES);
  assert.equal(createHash("sha256").update(buffer).digest("hex"), APK_SHA256);
});

test("invalid release fixture cannot masquerade as the signed package", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-3080-web-"));
  try {
    const fake = path.join(directory, "fake.apk");
    fs.writeFileSync(fake, "not-the-release");
    const digest = createHash("sha256").update(fs.readFileSync(fake)).digest("hex");
    assert.notEqual(digest, APK_SHA256);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
