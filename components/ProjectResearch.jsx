"use client";

import { useState } from "react";
import { Building2, FileSearch, LoaderCircle, ShieldCheck } from "lucide-react";
import { INR } from "../lib/analyze.js";
import ProjectChat from "./ProjectChat";
import {SiteReview} from "./InvestorTools";

function ResearchReport({report, onCompare}) {
  return <article className="agent-property-panel research-report" aria-label="Project case study" aria-live="polite">
    <header>
      <p className="research-meta">Source review · {report.evidenceDate}</p>
      <h2>{report.name}</h2>
      <p>{report.locationLabel} · {report.developer}</p>
    </header>
    <section className="research-thesis">
      <h3>Should it make your shortlist?</h3>
      <p>{report.thesis}</p>
      <p><strong>If you need rent soon,</strong> start with a completed unit that has an occupancy certificate for its tower and recent lease evidence. <strong>If you can wait,</strong> compare the payment schedule, a delivery-delay scenario and realistic resale options.</p>
    </section>
    <section>
      <h3>Project record and location</h3>
      <p><strong>RERA registration {report.registration}</strong></p>
      <p>{report.facts}</p>
      <p>{report.location}</p>
    </section>
    <div className="research-columns">
      <section>
        <h3>Pros</h3>
        <ul>{report.strengths.map(strength => <li key={strength}>{strength}</li>)}</ul>
      </section>
      <section>
        <h3>Cons and investment risks</h3>
        <ul>{report.risks.map(([title, detail]) => <li key={title}><strong>{title}.</strong> {detail}</li>)}</ul>
      </section>
    </div>
    {report.advertisedStartingPrice && <section>
      <h3>What rent would the price need?</h3>
      <p>The developer advertises a starting price of about <strong>₹{(report.advertisedStartingPrice / 10000000).toFixed(2)} crore</strong>. Use the written quote for your unit before doing the final maths.</p>
      <p>At that price, an illustrative <strong>3% yearly rental return before costs</strong> would require roughly <strong>{INR(report.advertisedStartingPrice * 0.03 / 12)} per month</strong> in rent. This calculation is a hurdle to compare against nearby signed leases. It excludes fees, repairs and time without a tenant.</p>
    </section>}
    <section>
      <h3>Other options to compare</h3>
      <p>These are Gurugram projects you can research here. Check carpet area, completion stage, all-in cost and commute before treating a unit as a price comparable.</p>
      <div className="research-options">
        {report.alternatives.map(option => <div key={option.name}>
          <button type="button" onClick={() => onCompare(option.name, option.location)}>{option.name}</button>
          <span>{option.location}</span>
          <a href={option.record} target="_blank" rel="noreferrer">RERA record ↗</a>
        </div>)}
      </div>
    </section>
    <section>
      <h3>What you need before deciding</h3>
      <p>Get the written unit quote, carpet area, instalment dates, expected possession and any extra fees. Find lease or resale evidence for similar units. Use the return calculator below once you have a quote and a rent estimate.</p>
      <p className="research-meta">This case study has no verified transaction prices, achievable rents, current travel times or unit-specific title review.</p>
    </section>
    <section>
      <h3><ShieldCheck size={17}/> Sources</h3>
      <ul>{report.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul>
    </section>
  </article>;
}

export default function ProjectResearch() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function runResearch(projectName, projectLocation) {
    setName(projectName);
    setLocation(projectLocation);
    setBusy(true);
    setError("");
    setReport(null);
    try {
      const response = await fetch("/api/research", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:projectName, location:projectLocation})
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load the project report.");
      setReport(result);
    } catch (error) {
      setError(error.message || "Could not load the project report.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="research-workspace" aria-label="Gurugram project research">
    <form className="agent-property-panel research-form" onSubmit={event => {
      event.preventDefault();
      runResearch(name, location);
    }}>
      <div className="agent-section-title"><FileSearch size={22}/><div><h2>Research a Gurugram project</h2><p>Start with the project name and sector or city.</p></div></div>
      <fieldset disabled={busy}>
        <label className="agent-standalone-label">Project name
          <input required minLength={2} maxLength={120} value={name} onChange={event => setName(event.target.value)} placeholder="Godrej Aristocrat"/>
          <small>Use the name on the brochure or listing. Include the phase if you know it.</small>
        </label>
        <label className="agent-standalone-label">Location
          <input required minLength={2} maxLength={120} value={location} onChange={event => setLocation(event.target.value)} placeholder="Sector 49, Gurugram"/>
          <small>Gurgaon and Gurugram both work. Include the sector to confirm the match.</small>
        </label>
      </fieldset>
      <div className="research-actions">
        <button className="agent-extract-btn research-submit" type="submit" disabled={busy}>{busy ? <LoaderCircle size={16} className="spin"/> : <FileSearch size={16}/>} {busy ? "Loading case study" : "Research project"}</button>
        <div className="agent-example-buttons">
          <button type="button" disabled={busy} onClick={() => runResearch("Godrej Aristocrat", "Sector 49, Gurugram")}><Building2 size={16}/> Try Godrej Aristocrat</button>
        </div>
      </div>
      <p className="research-meta">Current coverage includes Godrej Aristocrat, Sobha Crescent Phase 1 and DLF Privana South. Reports use reviewed public records.</p>
      {error && <p className="agent-error" role="alert">{error}</p>}
    </form>
    {report && <>
      <ProjectChat key={report.name} project={report}/>
      <ResearchReport report={report} onCompare={runResearch}/>
      <SiteReview key={report.registration} report={report}/>
    </>}
  </section>;
}
