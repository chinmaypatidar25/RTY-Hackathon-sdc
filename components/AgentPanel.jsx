"use client";
import { useState } from "react";
import { Bot, Send, Sparkles, Wrench, ChevronDown, ShieldCheck, AlertCircle, LoaderCircle } from "lucide-react";

const prompts=[
 "Is the advertised rental yield misleading?",
 "What are the biggest investment risks?",
 "Stress-test this property's rental income"
];

export default function AgentPanel({deal}){
 const [question,setQuestion]=useState(prompts[0]);
 const [result,setResult]=useState(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");

 async function ask(value){
  const q=(value||question).trim();
  if(q.length<3)return;
  setQuestion(q);
  setBusy(true);
  setError("");
  setResult(null);
  try{
   const response=await fetch("/api/agent",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({question:q,deal})
   });
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Unable to run the agent.");
   setResult(data);
  }catch(err){
   setError(err.message||"Something went wrong. Please try again.");
  }finally{
   setBusy(false);
  }
 }

 return <section className="agent-panel" aria-label="DealLens research agent">
  <div className="agent-heading">
   <div className="agent-icon"><Bot size={21}/></div>
   <div>
    <div className="agent-eyebrow">DEALLENS RESEARCH AGENT</div>
    <h3>Ask your investment analyst</h3>
    <p>Three auditable tools. Transparent calculations. No invented sources.</p>
   </div>
   <span className="agent-badge">AGENT</span>
  </div>
  <div className="agent-prompts">
   {prompts.map((p,i)=><button key={i} type="button" disabled={busy} onClick={()=>ask(p)}>{p}</button>)}
  </div>
  <form className="agent-form" onSubmit={e=>{e.preventDefault();ask()}}>
   <input aria-label="Ask the investment research agent" value={question} maxLength={1200}
     onChange={e=>setQuestion(e.target.value)} placeholder="Ask about the return, risk, or documents…"/>
   <button type="submit" disabled={busy||question.trim().length<3}>
    {busy?<LoaderCircle className="spin" size={17}/>:<Send size={17}/>}
    <span>{busy?"Analyzing":"Run agent"}</span>
   </button>
  </form>
  {error&&<div className="agent-error"><AlertCircle size={16}/>{error}</div>}
  {busy&&<div className="agent-thinking"><LoaderCircle className="spin" size={16}/> Checking the investment inputs and running tools…</div>}
  {result&&<div className="agent-output">
   <div className="agent-result-meta">
    <span><ShieldCheck size={15}/>{result.mode==="ai"?"AI agent + calculation tools":"Transparent demo + calculation tools"}</span>
    <span>{result.steps?.length||0} tool executions</span>
   </div>
   <div className="agent-answer">
    {String(result.answer||"").split(/\n\s*\n/).filter(Boolean).map((text,i)=><p key={i}>{text}</p>)}
   </div>
   {result.steps?.length>0&&<div className="agent-trace">
    <div className="agent-trace-title"><Wrench size={15}/> What the agent checked</div>
    {result.steps.map((step,i)=><details className="agent-step" key={i}>
     <summary><span className="agent-step-num">{String(i+1).padStart(2,"0")}</span>{step.label||step.tool}<ChevronDown size={15}/></summary>
     <pre>{JSON.stringify(step.result,null,2)}</pre>
    </details>)}
   </div>}
   {result.warning&&<p className="agent-warning">{result.warning}</p>}
   <div className="agent-disclosure"><Sparkles size={14}/>{result.disclosure}</div>
  </div>}
  {!result&&!busy&&!error&&<p className="agent-hint">Try the apartment sample: advertised 8% yield versus just 3.75% gross yield calculated from the supplied rent and asking price.</p>}
 </section>;
}
