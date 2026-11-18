import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

test("offline emergency demo is standalone with valid JavaScript", () => {
  const html=readFileSync(new URL("../demo/DealLens-Offline.html",import.meta.url),"utf8");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /Bhopal apartment/);
  assert.match(html, /run the assistant/i);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+href="https?:/);
  const match=html.match(/<script>([\s\S]*?)<\/script>/i);
  assert.ok(match,"Inline backup script is present.");
  assert.doesNotThrow(()=>new vm.Script(match[1]));
});
