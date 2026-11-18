"use client";
import {useState, useEffect} from "react";
import {landUses, evidence, financing} from "../lib/investor-tools.js";
import {INR, pct} from "../lib/analyze.js";

export function SiteReview({report}) {
  const [use, setUse] = useState("Housing");
  const [marks, setMarks] = useState({});
  const [storageNotice, setStorageNotice] = useState("");
  const key = "deallens:review:" + report.registration;
  useEffect(() => {
    try { setMarks(JSON.parse(localStorage.getItem(key)) || {}); }
    catch { setStorageNotice("Browser storage is unavailable. Changes last for this session."); }
  }, [key]);
  function update(label, value) {
    const next = {...marks, [label]:value};
    setMarks(next);
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { setStorageNotice("Changes last for this session."); }
  }
  return <details className="research-calculator"><summary>Site and document review</summary>
    <div className="agent-property-panel research-report">
      <p>Track documents for {report.name} in this browser. Your status records what you have collected.</p>
      {Object.entries(evidence).map(([label, help]) => <label key={label} className="agent-standalone-label">{label}
        <select value={marks[label] || "To request"} onChange={e => update(label,e.target.value)}>
          <option>To request</option><option>Requested</option><option>Received</option><option>Needs follow-up</option>
        </select><small>{help}</small></label>)}
      {storageNotice && <p>{storageNotice}</p>}
      <label className="agent-standalone-label">Screen a development idea
        <select value={use} onChange={e => setUse(e.target.value)}>{Object.keys(landUses).map(name => <option key={name}>{name}</option>)}</select>
        <small>Use this for a prospective land parcel. The selected apartment project has its own approved use.</small>
      </label><p aria-live="polite">{landUses[use]}</p>
      <a href="https://singlero.tcpharyana.gov.in/serviceDashboard" target="_blank" rel="noreferrer">Haryana planning services ↗</a>
    </div></details>;
}

export function LoanScenario({snapshot}) {
  const [amount,setAmount] = useState("");
  const [rate,setRate] = useState("");
  const [years,setYears] = useState("");
  const result = financing(snapshot,amount,rate,years);
  const incomeKnown = snapshot.rent > 0;
  return <details className="research-calculator"><summary>Calculate loan payments and cash flow</summary>
    <div className="agent-property-panel research-report">
      {[[amount,setAmount,"Loan amount (₹)","Enter what you would borrow, or 0 for a cash purchase."],
        [rate,setRate,"Annual interest (%)","Use the fixed annual rate in your scenario."],
        [years,setYears,"Loan term (years)","Enter how long you plan to repay the loan."]].map(([value,setter,label,help]) =>
        <label key={label} className="agent-standalone-label">{label}<input type="number" step="any" min="0" value={value} onChange={e=>setter(e.target.value)}/><small>{help}</small></label>)}
      {result ? <div aria-live="polite"><p>Monthly loan payment (EMI) <strong>{INR(result.emi)}</strong></p>
        <p>Cash needed upfront including entered purchase fees <strong>{INR(result.equity)}</strong></p>
        {incomeKnown ? <><p>Yearly cash left after expenses and loan payments <strong>{INR(result.annualCash)}</strong></p>
          <p>Yearly return on your own cash <strong>{pct(result.cashReturn)}</strong></p>
          <p>Operating income divided by annual loan payments <strong>{result.dscr === null ? "No debt payments" : result.dscr.toFixed(2)+"×"}</strong></p></> : <p>Enter expected rent to see rental cash flow.</p>}</div>
        : <p>Enter a purchase price above and a loan amount within that price. For a loan, also enter its rate and term.</p>}
      <small>Assumes monthly repayments on a fully drawn fixed-rate loan. Cash flow uses a full rental year and excludes income tax.</small>
    </div></details>;
}
