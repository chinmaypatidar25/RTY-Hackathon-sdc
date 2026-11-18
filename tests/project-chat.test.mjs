import test from "node:test";
import assert from "node:assert/strict";
import { answerProjectQuestion } from "../lib/project-chat.js";
import { researchProject } from "../lib/project-research.js";

const godrej = researchProject("Godrej Aristocrat", "Gurugram");

test("project chat gives different, sourced answers for rent and project risks", () => {
  const rent = answerProjectQuestion(godrej, "What rent would I need for a 4% return?");
  const risk = answerProjectQuestion(godrej, "What are the biggest investment risks?");
  assert.match(rent.answer, /2,04,333/);
  assert.match(rent.answer, /no verified rent/);
  assert.equal(rent.sources[0].url, godrej.developerPage);
  assert.match(risk.answer, /Delivery and cash flow/);
  assert.doesNotMatch(risk.answer, /2,04,333/);
  assert.ok(risk.sources.some(source => source.url === godrej.record));
});

test("project chat reports gaps and links to alternative projects", () => {
  assert.match(answerProjectQuestion(godrej, "How far is it from Cyber Hub?").answer, /don’t have measured travel times/);
  const alternatives = answerProjectQuestion(godrej, "Which alternatives should I compare?");
  assert.match(alternatives.answer, /DLF Privana South/);
  assert.equal(alternatives.sources.length, 2);
  assert.equal(answerProjectQuestion(godrej, "What is the tower’s exact paint colour?").sources.length, 0);
});
