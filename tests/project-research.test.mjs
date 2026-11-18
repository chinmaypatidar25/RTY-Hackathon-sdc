import test from "node:test";
import assert from "node:assert/strict";
import { researchProject } from "../lib/project-research.js";

test("project and sector return a sourced case study without a quote", () => {
  const report = researchProject("  godrej aristocrat ", "Sector 49, Gurgaon");
  assert.equal(report.registration, "GGM/767/499/2023/111");
  assert.equal(report.alternatives.length, 2);
  assert.match(report.facts, /31 December 2030/);
  assert.ok(report.sources.every(source => new URL(source.url).protocol === "https:"));
  assert.ok(report.risks.length > 0);
});

test("a different sector, city, phase or uncovered project does not return a report", () => {
  assert.equal(researchProject("Godrej Aristocrat", "Sector 50, Gurugram"), null);
  assert.equal(researchProject("Godrej Aristocrat", "Sector 49, Chandigarh"), null);
  assert.equal(researchProject("Sobha Crescent Phase 2", "Sector 63A, Gurugram"), null);
  assert.equal(researchProject("Unknown project", "Gurugram"), null);
});

test("an alternative can be opened with the report's exact project and location", () => {
  const report = researchProject("Aristocrat", "Gurugram");
  for (const alternative of report.alternatives) {
    assert.equal(researchProject(alternative.name, alternative.location)?.name, alternative.name);
  }
});
