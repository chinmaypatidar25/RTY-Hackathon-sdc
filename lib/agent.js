import { assess, INR, pct } from "./analyze.js";

// Only supplied facts are used. No tool performs external legal or market verification.
export const tools = [
  { name: "underwrite_property", label: "Property underwriting", description: "Calculate acquisition cost, gross/net rental yield, net income, and asking price per square foot." },
  { name: "stress_test_cashflow", label: "Cash flow stress test", description: "Compare conservative, base, and upside annual net rental cash-flow scenarios." },
  { name: "audit_claims_and_documents", label: "Claims and document audit", description: "Compare advertised yield against calculated yield, identify risk flags and missing verification documents." }
];

export function runAgentTool(name, deal) {
  const r = assess(deal);
  const financialsAvailable = r.price > 0 && r.rent > 0;
  switch (name) {
    case "underwrite_property":
      return {
        provenance: "User-supplied property details. Not independently verified.",
        acquisitionCostINR: r.price ? r.totalCost : null,
        askingPriceINR: r.price || null,
        monthlyRentINR: r.rent || null,
        annualGrossRentINR: r.rent ? r.annualGross : null,
        annualNetRentINR: financialsAvailable ? r.annualNet : null,
        grossRentalYieldPercent: financialsAvailable ? r.grossYield : null,
        netRentalYieldPercent: financialsAvailable ? r.netYield : null,
        askingPricePerSqFtINR: r.pricePerSqft,
        formulas: {
          grossYield: "(12 * monthlyRent / askingPrice) * 100",
          netYield: "((12 * monthlyRent * (1-vacancyPct/100) - annualExpenses) / (askingPrice + closingCosts)) * 100"
        },
        exclusions: "Income tax, interest, EMI, appreciation and any costs not provided."
      };
    case "stress_test_cashflow":
      return {
        provenance: "Illustrative scenarios, not independent market forecasts.",
        assumptions: {
          conservative: "15% lower rent; vacancy +8 percentage points; annual expenses +15%.",
          base: "The entered rent, vacancy and annual expenses.",
          upside: "10% higher rent; vacancy -3 percentage points, minimum zero; expenses unchanged."
        },
        cases: r.scenarios.map(s => ({name:s.name,annualNetIncomeINR:financialsAvailable?s.annualNet:null,netYieldPercent:financialsAvailable?s.yield:null}))
      };
    case "audit_claims_and_documents":
      return {
        provenance: "No RERA, land-record, zoning or ownership database has been queried.",
        advertisedYieldPercent: r.advertised,
        calculatedGrossYieldPercent: financialsAvailable ? r.grossYield : null,
        yieldGapPercentagePoints: r.gap,
        riskFlags: r.risks,
        neededChecks: r.missing,
        caution: "A user-entered RERA number or checked box is a claim, not independently verified evidence."
      };
    default:
      throw new Error("Unrecognized tool.");
  }
}

export function demoAgent(deal, question) {
  const r = assess(deal);
  const ready = r.price > 0 && r.rent > 0;
  const steps = tools.map(t=>({tool:t.name,label:t.label,result:runAgentTool(t.name,deal)}));
  const parts = [
    "PRELIMINARY ASSESSMENT: " + r.verdict + ". This is research, not a personalized buy/sell recommendation.",
    ready
      ? "Asking price: " + INR(r.price) + ". Monthly rent: " + INR(r.rent) +
        ". Calculated gross rental yield: " + pct(r.grossYield) +
        ". Estimated net rental yield: " + pct(r.netYield) + " after the entered costs and vacancy."
      : "Rental returns cannot be calculated reliably without both the asking price and monthly rent.",
    r.gap !== null
      ? "CLAIM CHECK: Advertised yield is " + pct(r.advertised) + ", while the figures support " +
        pct(r.grossYield) + " gross yield. Difference: " + r.gap.toFixed(2) + " percentage points."
      : "CLAIM CHECK: An advertised return could not be compared using the available data.",
    ready
      ? "SCENARIOS: Conservative net yield " + pct(r.scenarios[0].yield) + ", base " +
        pct(r.scenarios[1].yield) + ", upside " + pct(r.scenarios[2].yield) +
        ". These are hypothetical sensitivity tests, not predictions."
      : "SCENARIOS: Complete the missing financial details to calculate sensitivity scenarios.",
    "RISK FLAGS: " + (r.risks.length ? r.risks.slice(0,4).map(x=>x.title).join("; ") : "No automatic flags from these inputs."),
    "NEXT ACTION: Obtain independent comparable transactions, title and encumbrance records, actual rental/lease evidence, applicable planning approvals, and RERA records where applicable before committing funds."
  ];
  return {
    mode:"demo",
    question,
    answer:parts.join("\n\n"),
    steps,
    disclosure:"Demo mode: deterministic financial and document-gap tools. No AI model or external real-estate registry was used."
  };
}
