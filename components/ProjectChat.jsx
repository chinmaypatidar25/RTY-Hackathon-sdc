"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, Send } from "lucide-react";

const suggestedQuestions = [
  "What are the biggest risks?",
  "What rent would I need for a 3% return?",
  "What other projects should I compare?"
];

export default function ProjectChat({project}) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const history = useRef(null);

  useEffect(() => {
    if (history.current) history.current.scrollTop = history.current.scrollHeight;
  }, [turns]);

  async function ask(value) {
    const text = value.trim();
    if (busy || text.length < 3) return;
    setBusy(true);
    setError("");
    setQuestion(text);
    try {
      const response = await fetch("/api/research", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:project.name, location:project.locationLabel, question:text}),
        signal:AbortSignal.timeout(15000)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not answer this question.");
      setTurns(previous => [...previous, {question:text, ...result}]);
      setQuestion("");
    } catch (error) {
      setError(error.name === "TimeoutError" ? "The reply took too long. You can send your question again." : error.message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="agent-panel" aria-label="Project chatbot">
    <div className="agent-heading">
      <div className="agent-icon"><Bot size={21}/></div>
      <div><h3>Ask about {project.name}</h3><p>Answers use the project’s case study and link to the relevant sources.</p></div>
    </div>
    <div className="agent-prompts">
      {suggestedQuestions.map(prompt => <button type="button" key={prompt} disabled={busy} onClick={() => ask(prompt)}>{prompt}</button>)}
    </div>
    <div ref={history} className="project-chat-history" role="log" aria-label="Project conversation" tabIndex={0}>
      {turns.map((turn, index) => <div className="project-chat-turn" key={index}>
        <p className="project-chat-question"><strong>You</strong> {turn.question}</p>
        <div className="project-chat-answer">
          <strong>DealLens</strong>
          {turn.answer.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {!!turn.sources.length && <ul aria-label="Answer sources">
            {turn.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}
          </ul>}
        </div>
      </div>)}
    </div>
    <form className="agent-form" onSubmit={event => {event.preventDefault(); ask(question);}}>
      <input aria-label="Question about this project" placeholder="Ask about the location, risks, rent or alternatives" value={question} maxLength={1200} disabled={busy} onChange={event => setQuestion(event.target.value)}/>
      <button type="submit" disabled={busy || question.trim().length < 3}>
        {busy ? <LoaderCircle className="spin" size={17}/> : <Send size={17}/>}
        <span>{busy ? "Checking" : "Send"}</span>
      </button>
    </form>
    {error && <p className="agent-error" role="alert">{error}</p>}
  </section>;
}
