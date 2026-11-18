import test from "node:test";
import assert from "node:assert/strict";
import {assess} from "../lib/analyze.js";
import {financing} from "../lib/investor-tools.js";
const snapshot = assess({price:1000000,monthlyRent:12000,annualExpenses:24000});
test("debt metrics handle cash, interest-free loans and missing inputs",()=>{
  assert.equal(financing(snapshot,"","",""),null);
  assert.equal(financing(snapshot,120000,"",10),null);
  assert.equal(financing(snapshot,2000000,9,10),null);
  const result = financing(snapshot,120000,0,10);
  assert.equal(result.emi,1000);
  assert.equal(result.annualCash,108000);
  assert.equal(result.dscr,10);
  assert.equal(financing(snapshot,0,"","").dscr,null);
  assert.ok(Math.abs(financing(snapshot,1000000,9,20).emi-8997.26)<0.01);
});
