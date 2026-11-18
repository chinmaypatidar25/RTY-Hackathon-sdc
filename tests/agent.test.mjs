import test from "node:test";
import assert from "node:assert/strict";
import { assess, samples } from "../lib/analyze.js";
import { demoAgent, runAgentTool } from "../lib/agent.js";

test("advertised 8% apartment claim is corrected to 3.75% gross yield",()=>{
 const report=assess(samples[0]);
 assert.equal(report.grossYield,3.75);
 assert.equal(report.gap,4.25);
 assert.ok(Math.abs(report.netYield-2.912280701754386)<0.00001);
 assert.ok(report.risks.some(x=>x.title==="Advertised yield mismatch"));
});
test("incomplete deal yields no false confidence",()=>{
 const report=assess({price:"",monthlyRent:""});
 assert.equal(report.grossYield,null);
 assert.equal(report.netYield,null);
 assert.equal(report.verdict,"Insufficient data");
});
test("warehouse stress test includes downside scenario",()=>{
 const response=runAgentTool("stress_test_cashflow",samples[1]);
 assert.equal(response.cases.length,3);
 assert.ok(response.cases[0].netYieldPercent<response.cases[1].netYieldPercent);
});
test("tools report provenance and do not claim title/RERA verification",()=>{
 const response=runAgentTool("audit_claims_and_documents",samples[0]);
 assert.match(response.provenance,/No RERA/);
 assert.ok(response.neededChecks.length>0);
});
test("deterministic demo invokes all three tools",()=>{
 const response=demoAgent(samples[0],"Should I invest?");
 assert.equal(response.mode,"demo");
 assert.equal(response.steps.length,3);
 assert.match(response.answer,/3\.75%/);
 assert.ok(response.steps.every(s=>s.result));
});
