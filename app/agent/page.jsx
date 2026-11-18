"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {Bot,Building2,ArrowLeft,ArrowRight,ShieldCheck,Landmark,ChartColumnIncreasing,FileSearch,LoaderCircle,AlertTriangle,CheckCircle2,Sparkles} from "lucide-react";
import {samples,assess,INR,pct} from "../../lib/analyze";
import AgentPanel from "../../components/AgentPanel";

const empty={name:"",location:"",assetType:"Residential apartment",price:"",monthlyRent:"",area:"",advertisedYield:"",closingCosts:"",annualExpenses:"",vacancyRate:5,rera:"",titleVerified:false,approvalsVerified:false};
const numericFields=[
 ["price","Asking price (₹)"],["monthlyRent","Monthly rent (₹)"],
 ["area","Area (sq ft)"],["advertisedYield","Claimed annual yield (%)"],
 ["closingCosts","Closing costs (₹)"],["annualExpenses","Annual expenses (₹)"],
 ["vacancyRate","Vacancy assumption (%)"]
];
export default function ResearchAgentPage(){
 const [property,setProperty]=useState({...samples[0]});
 const [listing,setListing]=useState("");
 const [extracting,setExtracting]=useState(false);
 const [notice,setNotice]=useState("");
 const [status,setStatus]=useState(null);
 const [revision,setRevision]=useState(0);
 const snapshot=useMemo(()=>assess(property),[property]);
 useEffect(()=>{fetch("/api/agent/status",{cache:"no-store"}).then(x=>x.json()).then(setStatus).catch(()=>setStatus({mode:"unknown",message:"AI configuration status unavailable."}));},[]);
 const update=(key,value)=>{setProperty(old=>({...old,[key]:value}));setRevision(v=>v+1)};
 const selectSample=(i)=>{setProperty({...samples[i]});setListing("");setNotice("Illustrative example loaded. Ask the agent a question.");setRevision(v=>v+1)};
 async function extract(){
  if(!listing.trim()){setNotice("Paste a listing first.");return}
  setExtracting(true);setNotice("");
  try{
   const response=await fetch("/api/extract",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:listing})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Listing extraction failed");
   setProperty(old=>({...old,...data.deal}));
   setRevision(v=>v+1);
   setNotice(data.mode==="ai"?"AI extraction finished. Check every extracted field before asking the agent.":"Basic text extraction finished. Review the fields; this is not AI reasoning.");
  }catch(error){setNotice(error.message)}
  finally{setExtracting(false)}
 }
 const ready=snapshot.price>0&&snapshot.rent>0;
 return <div className="agent-page-root">
  <header className="agent-page-header">
   <Link className="agent-home-link" href="/"><Building2 size={22}/> <b>deallens<span>AI</span></b></Link>
   <Link className="agent-back" href="/"><ArrowLeft size={16}/> Deal analyzer</Link>
  </header>
  <main className="agent-page-main">
   <div className="agent-page-intro">
    <div className="agent-kicker"><Sparkles size={16}/> YOUR RESEARCH WORKSPACE</div>
    <h1>Meet your real-estate <span>research agent.</span></h1>
    <p>Select an example property, change the assumptions, and ask an investment question. View exactly what the agent calculated and which checks remain unverified.</p>
    <div className="agent-runtime" role="status">
     {status===null?<><LoaderCircle size={16} className="spin"/> Checking AI configuration…</>:
      status.mode==="ai-configured"?<><CheckCircle2 size={17}/> OpenAI API key configured — model-powered research enabled (subject to API availability).</>:
      <><AlertTriangle size={17}/> <strong>Demo mode:</strong> No OpenAI API key. Calculations and fixed research summaries work, but this is not a live AI model.</>}
    </div>
   </div>
   <div className="agent-workspace-grid">
    <section className="agent-property-panel">
     <div className="agent-section-title"><Landmark size={19}/><div><h2>Property to investigate</h2><p>These inputs determine what the agent can conclude.</p></div></div>
     <div className="agent-example-buttons">
       <button type="button" onClick={()=>selectSample(0)}><Building2 size={16}/> Bhopal apartment</button>
       <button type="button" onClick={()=>selectSample(1)}><Building2 size={16}/> Mandideep warehouse</button>
       <button type="button" onClick={()=>{setProperty({...empty});setListing("");setRevision(v=>v+1);setNotice("Blank property loaded.")}}><FileSearch size={16}/> Start blank</button>
     </div>
     <label className="agent-standalone-label">Listing text (optional)
      <textarea value={listing} rows={3} onChange={e=>setListing(e.target.value)} placeholder="Example: Bhopal apartment, price ₹80 lakh, rent ₹25,000 per month, claimed 8% yield..."/>
     </label>
     <button className="agent-extract-btn" type="button" onClick={extract} disabled={extracting}>{extracting?<LoaderCircle size={15} className="spin"/>:<Sparkles size={15}/>} Extract property details</button>
     <div className="agent-standalone-fields">
      <label className="agent-standalone-label full">Property name<input value={property.name||""} onChange={e=>update("name",e.target.value)} placeholder="Property name"/></label>
      <label className="agent-standalone-label full">Location<input value={property.location||""} onChange={e=>update("location",e.target.value)} placeholder="City, area"/></label>
      {numericFields.map(([field,label])=><label className="agent-standalone-label" key={field}>{label}<input type="number" min="0" value={property[field]??""} onChange={e=>update(field,e.target.value)} /></label>)}
     </div>
     {notice&&<p className="agent-standalone-notice">{notice}</p>}
     <div className="agent-snapshot">
       <div className="agent-snapshot-heading"><ChartColumnIncreasing size={16}/> Snapshot (calculated, not market-verified)</div>
       <div className="agent-snapshot-metrics">
        <div><span>Asking price</span><strong>{snapshot.price?INR(snapshot.price):"Missing"}</strong></div>
        <div><span>Gross annual yield</span><strong>{ready?pct(snapshot.grossYield):"Not available"}</strong></div>
        <div><span>Net annual yield</span><strong>{ready?pct(snapshot.netYield):"Not available"}</strong></div>
        <div><span>Risk flags</span><strong>{snapshot.risks.length}</strong></div>
       </div>
     </div>
    </section>
    <div className="agent-primary-column">
     <div className="agent-main-banner"><Bot size={23}/><div><strong>Your agent is ready to analyze the selected deal</strong><span>Ask a question below. Its calculations are based on the property shown at left.</span></div><ArrowRight size={18}/></div>
     <AgentPanel key={revision} deal={property}/>
     <div className="agent-page-footnote"><ShieldCheck size={16}/> Independent legal title, RERA, approvals and comparable transactions still require verification. This is research, not personalized financial advice.</div>
    </div>
   </div>
  </main>
 </div>;
}
