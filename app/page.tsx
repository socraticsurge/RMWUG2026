"use client";

import { FormEvent, useMemo, useState } from "react";
import { agentContract, agentStages, workOrder } from "./data/agentInstructions";
import { sectionColours, topics, topicSections } from "./data/topics";

type View = "overview" | "study" | "topics" | "agents" | "publishing";

type Assignment = {
  studentId: string;
  name: string;
  pod: string;
  section: string;
  topicId: string;
  question: string;
  peers: { id: string; name: string }[];
  forms: FormLinks;
};

type LookupResponse = {
  ok: boolean;
  code: string;
  message: string;
  assignment?: Assignment;
};

type FormLinks = {
  onboarding: string;
  milestone: string;
  submission: string;
};

const views: { id: View; label: string }[] = [
  { id: "overview", label: "Workshop" },
  { id: "study", label: "My study" },
  { id: "topics", label: "Topic bank" },
  { id: "agents", label: "Agent guide" },
  { id: "publishing", label: "Publishing" },
];

const gates = [
  ["C1", "Question locked", "Claim, rival and inference ceiling"],
  ["C2", "Corpus locked", "Population, route, eligibility and stop rule"],
  ["C3", "Codebook locked", "Observable fields, examples and missingness"],
  ["C4", "Pilot passed", "Three artifacts coded and manually checked"],
  ["C5", "Dataset locked", "12–25 accepted rows with provenance"],
  ["C6", "Analysis locked", "Counts, denominators and one visual"],
  ["C7", "Manuscript ready", "Research note, audit and disclosure"],
] as const;

const defaultForms: FormLinks = {
  onboarding: "https://docs.google.com/forms/d/e/1FAIpQLSfVQnFXxxVW3zh3fd3VoE0Eiol3ilRih0T0ghlAQfm7naE73A/viewform?usp=publish-editor",
  milestone: "https://docs.google.com/forms/d/e/1FAIpQLSfT77e8yiRnqJvlsCHBY1EwraWo848TP7aGDk9rJFL6ga_EHg/viewform",
  submission: "https://docs.google.com/forms/d/e/1FAIpQLSf4s5QnAU_x-yiwuY0lTenzY8gml570-_CHz_cDDjlB_1c3eQ/viewform",
};

// Set to the deployed Apps Script /exec URL. It contains no secret; access
// codes are high-entropy bearer credentials stored only in the private Sheet.
const lookupService = "https://script.google.com/macros/s/AKfycbwcd_gv73gwxIZ8AaRbFybUxs3pxSaOFiJCqXGzHvuG_I2adD_-mQYVze-9ase83uZV/exec";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="copy-button"
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function ExternalAction({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) return <span className="button disabled">Link being prepared</span>;
  return (
    <a className="button" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function GuideLink({ file, children }: { file: string; children: React.ReactNode }) {
  return (
    <a className="guide-link" href={`./guides/${file}`} target="_blank" rel="noreferrer">
      <span>MD</span>{children} ↗
    </a>
  );
}

function jsonpLookup(endpoint: string, studentId: string, token: string): Promise<LookupResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = `__rmwug_lookup_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const callbackWindow = window as unknown as Record<string, unknown>;
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => cleanup(new Error("The assignment service did not respond in time.")), 15000);

    function cleanup(error?: Error, result?: LookupResponse) {
      window.clearTimeout(timeout);
      script.remove();
      delete callbackWindow[callbackName];
      if (error) reject(error);
      else if (result) resolve(result);
    }

    callbackWindow[callbackName] = (result: LookupResponse) => cleanup(undefined, result);
    const url = new URL(endpoint);
    url.searchParams.set("id", studentId);
    url.searchParams.set("token", token);
    url.searchParams.set("callback", callbackName);
    script.src = url.toString();
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.onerror = () => cleanup(new Error("The assignment service could not be reached."));
    document.body.appendChild(script);
  });
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [studentId, setStudentId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "error">("idle");
  const [lookupMessage, setLookupMessage] = useState("");
  const [topicFilter, setTopicFilter] = useState("ALL");
  const [readyGates, setReadyGates] = useState<string[]>([]);

  const filteredTopics = useMemo(
    () => topics.filter((topic) => topicFilter === "ALL" || topic.id.startsWith(topicFilter)),
    [topicFilter],
  );
  const forms = assignment?.forms ?? defaultForms;

  async function findAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedId = studentId.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const normalizedCode = accessCode.trim().toUpperCase();
    setAssignment(null);
    setReadyGates([]);
    if (!lookupService) {
      setLookupState("error");
      setLookupMessage("The private assignment register is being prepared. Your facilitator will announce when lookup opens.");
      return;
    }
    if (!normalizedId || !normalizedCode) {
      setLookupState("error");
      setLookupMessage("Enter both the Student ID and access code printed on your personal card.");
      return;
    }
    setLookupState("loading");
    setLookupMessage("Checking the locked workshop register…");
    try {
      const result = await jsonpLookup(lookupService, normalizedId, normalizedCode);
      if (!result.ok || !result.assignment) {
        setLookupState("error");
        setLookupMessage(result.message);
        return;
      }
      setAssignment(result.assignment);
      setAccessCode("");
      setLookupState("idle");
      setLookupMessage(result.message);
    } catch (error) {
      setLookupState("error");
      setLookupMessage(error instanceof Error ? error.message : "The assignment service could not be reached.");
    }
  }

  function forgetAssignment() {
    setAssignment(null);
    setStudentId("");
    setAccessCode("");
    setReadyGates([]);
    setLookupMessage("This device no longer displays the previous assignment.");
    setLookupState("idle");
  }

  function toggleReady(gate: string) {
    setReadyGates((current) => current.includes(gate) ? current.filter((value) => value !== gate) : [...current, gate]);
  }

  return (
    <main>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setView("overview")}>
          <span className="brand-mark">RM</span>
          <span>
            <strong>Research Methods</strong>
            <small>St Mary&apos;s · Hyderabad · 2026</small>
          </span>
        </button>
        <nav aria-label="Workshop sections">
          {views.map((item) => (
            <button type="button" key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <ExternalAction href={forms.milestone}>Check in</ExternalAction>
      </header>

      <aside className="dry-run-banner" aria-label="Dry-run operating mode">
        <div><strong>Dry run</strong><span>6 mock students · 2 pods · isolated control data</span></div>
        <p>Use a private window when changing roles. Label every Google Form response <b>DRY RUN</b>.</p>
        <div className="dry-run-actions">
          <button type="button" onClick={() => setView("study")}>Act as a student</button>
          <GuideLink file="13_DRY_RUN_REHEARSAL.md">Rehearsal script</GuideLink>
        </div>
      </aside>

      {view === "overview" && (
        <section className="view overview-view">
          <div className="hero">
            <div className="hero-copy">
              <p className="eyebrow">Research Methods by Vinay Chaganti</p>
              <h1>One workshop.<br />Eighty defensible studies.</h1>
              <p className="hero-intro">
                Every student will make a bounded claim, construct a public internet-artifact dataset with an AI agent,
                verify it as a researcher, and contribute an individually authored paper to one coherent edited volume.
              </p>
              <div className="hero-actions">
                <button className="button primary" type="button" onClick={() => setView("study")}>Open my study</button>
                <GuideLink file="12_WORKSHOP_OPERATIONS_AND_INCIDENT_PLAYBOOK.md">Workshop journey</GuideLink>
              </div>
            </div>
            <div className="hero-diagram" aria-label="Workshop operating model">
              <div className="orbit orbit-one"><span>80</span><small>authors</small></div>
              <div className="orbit orbit-two"><span>16</span><small>peer pods</small></div>
              <div className="orbit orbit-three"><span>8</span><small>sections</small></div>
              <div className="orbit-core"><span>1</span><small>shared method</small></div>
            </div>
          </div>

          <div className="principle-strip">
            <p><span>01</span><strong>Research is conversation.</strong> Your paper must locate the claim it joins, revises or complicates.</p>
            <p><span>02</span><strong>AI accelerates operations.</strong> Humans retain scope, evidence, judgment and release.</p>
            <p><span>03</span><strong>A dataset is an argument.</strong> Inclusion rules and missingness matter before the chart does.</p>
          </div>

          <div className="resource-rail" aria-label="Workshop method files">
            <GuideLink file="03_RESEARCH_METHOD_STANDARD.md">Method standard</GuideLink>
            <GuideLink file="04_STUDENT_RESEARCH_WORKBOOK.md">Student workbook</GuideLink>
            <GuideLink file="05_AI_AGENT_RESEARCH_PROTOCOL.md">AI agent protocol</GuideLink>
            <GuideLink file="07_MANUSCRIPT_AND_PUBLISHING_STANDARD.md">Publishing standard</GuideLink>
          </div>

          <div className="section-heading">
            <div><p className="eyebrow">The workshop spine</p><h2>Seven gates prevent one impressive-looking mistake.</h2></div>
            <p>Advance only after the evidence at the current gate is inspectable by your pod.</p>
          </div>
          <div className="gate-grid">
            {gates.map(([id, title, description], index) => (
              <article className="gate-card" key={id}>
                <div className="gate-top"><span>{id}</span><small>0{index + 1}</small></div>
                <h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "study" && (
        <section className="view">
          <div className="section-heading study-heading">
            <div><p className="eyebrow">Student workbench</p><h1>Load one assignment. Keep your evidence visible.</h1></div>
            {assignment && <button className="text-link" type="button" onClick={forgetAssignment}>Forget this assignment</button>}
          </div>

          {!assignment && (
            <div className="lookup-layout">
              <form className="lookup-card" onSubmit={findAssignment}>
                <p className="eyebrow">Personal access</p>
                <h2>Use the card issued to you</h2>
                <p>The Student ID and access code are checked against the facilitator&apos;s locked register. They are not stored by this page.</p>
                <label>Student ID<input value={studentId} onChange={(event) => setStudentId(event.target.value.toUpperCase())} autoComplete="username" placeholder="S001" /></label>
                <label>Access code<input value={accessCode} onChange={(event) => setAccessCode(event.target.value.toUpperCase())} autoComplete="one-time-code" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" /></label>
                <button className="button primary" type="submit" disabled={lookupState === "loading"}>{lookupState === "loading" ? "Checking…" : "Load my study"}</button>
                {lookupMessage && <div className={`notice ${lookupState === "error" ? "warning" : "status"}`} role="status">{lookupMessage}</div>}
              </form>
              <aside className="access-rules">
                <p className="eyebrow">Workshop safety</p>
                <h2>One card. One author. One assignment.</h2>
                <ol>
                  <li>Do not share or photograph another student&apos;s access code.</li>
                  <li>The assignment shown here—not a screenshot or verbal swap—is authoritative.</li>
                  <li>If a code is lost or exposed, ask the facilitator to rotate only that code.</li>
                  <li>On a shared computer, use “Forget this assignment” before leaving.</li>
                </ol>
                <ExternalAction href={defaultForms.onboarding}>Confirm my details</ExternalAction>
              </aside>
            </div>
          )}

          {assignment && (
            <>
              <div className="study-summary">
                <article className="identity-card">
                  <p className="eyebrow">Researcher</p><h2>{assignment.name}</h2>
                  <dl>
                    <div><dt>Student ID</dt><dd>{assignment.studentId}</dd></div>
                    <div><dt>Peer pod</dt><dd>{assignment.pod}</dd></div>
                    <div><dt>Assignment</dt><dd>{assignment.topicId}</dd></div>
                  </dl>
                  <p className="privacy-note">Authoritative register loaded · access code cleared from this page</p>
                  <ExternalAction href={forms.onboarding}>Confirm my details</ExternalAction>
                </article>
                <article className={`topic-assignment ${sectionColours[assignment.topicId.slice(0, 2)] ?? "muted"}`}>
                  <p className="eyebrow">{assignment.section}</p><h2>{assignment.question}</h2>
                  <div className="topic-boundary"><span>{assignment.topicId}</span><p>Default sample: 12–25 public artifacts. Describe what is visible; do not infer intent, effect, legality or population-wide prevalence.</p></div>
                </article>
              </div>

              <div className="pod-card">
                <div><p className="eyebrow">Peer review group</p><h2>{assignment.pod} · your methodological critics</h2></div>
                <div className="peer-list">{assignment.peers.map((peer) => <span key={peer.id}><strong>{peer.id}</strong>{peer.name}</span>)}</div>
              </div>

              <div className="section-heading compact">
                <div><p className="eyebrow">Your checkpoints</p><h2>Bring an auditable object to every pod review.</h2></div>
                <ExternalAction href={forms.milestone}>Submit a milestone</ExternalAction>
              </div>
              <div className="checkpoint-list">
                {gates.map(([id, title, description]) => {
                  const isReady = readyGates.includes(id);
                  return (
                    <article key={id} className={isReady ? "checkpoint ready" : "checkpoint"}>
                      <div className="checkpoint-code">{id}</div><div><h3>{title}</h3><p>{description}</p></div>
                      <button type="button" onClick={() => toggleReady(id)}>{isReady ? "Ready ✓" : "Mark ready"}</button>
                    </article>
                  );
                })}
              </div>
              <p className="local-note">Readiness marks disappear when this assignment is forgotten. The Google milestone form is the authoritative workshop record.</p>
            </>
          )}
        </section>
      )}

      {view === "topics" && (
        <section className="view">
          <div className="section-heading">
            <div><p className="eyebrow">Edited-volume architecture</p><h1>Eight conversations. Ten studies in each.</h1></div>
            <p>The bank is public so students can see the volume&apos;s conversation. Only the locked private register assigns authorship.</p>
          </div>
          <div className="filter-row" role="group" aria-label="Filter topic sections">
            <button className={topicFilter === "ALL" ? "active" : ""} onClick={() => setTopicFilter("ALL")}>All 80</button>
            {topicSections.map((section) => (
              <button key={section.code} className={topicFilter === section.code ? "active" : ""} onClick={() => setTopicFilter(section.code)}>{section.code} · {section.short}</button>
            ))}
          </div>
          <div className="topic-grid">
            {filteredTopics.map((topic) => (
              <article key={topic.id} className={`topic-card ${sectionColours[topic.id.slice(0, 2)]}`}>
                <div><span>{topic.id}</span><small>{topic.sectionShort}</small></div><h3>{topic.question}</h3>
                <p>Public artifacts · structured coding · descriptive inference</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "agents" && (
        <section className="view">
          <div className="section-heading">
            <div><p className="eyebrow">Protocol RMWUG-AI-1.0</p><h1>Give your agent a job. Never give it your authority.</h1></div>
            <div className="heading-aside"><p>Copy the global contract and a completed work order before using the stage prompt.</p><GuideLink file="05_AI_AGENT_RESEARCH_PROTOCOL.md">Full protocol</GuideLink></div>
          </div>
          <div className="agent-foundation">
            <article><div className="card-title"><span>01</span><h2>Global contract</h2><CopyButton text={agentContract} /></div><pre>{agentContract}</pre></article>
            <article><div className="card-title"><span>02</span><h2>Work order</h2><CopyButton text={workOrder} /></div><pre>{workOrder}</pre></article>
          </div>
          <div className="agent-stage-list">
            {agentStages.map((stage) => (
              <details key={stage.id}><summary><span>{stage.gate}</span><div><h3>{stage.title}</h3><p>{stage.purpose}</p></div><b>＋</b></summary>
                <div className="prompt-body"><pre>{stage.prompt}</pre><CopyButton text={`${agentContract}\n\n${workOrder}\n\n${stage.prompt}`} label="Copy complete prompt" /></div>
              </details>
            ))}
          </div>
        </section>
      )}

      {view === "publishing" && (
        <section className="view">
          <div className="section-heading">
            <div><p className="eyebrow">Volume standard v1.0</p><h1>A short paper is still a publication claim.</h1></div>
            <div className="heading-actions"><ExternalAction href={forms.submission}>Submit final manuscript</ExternalAction><GuideLink file="07_MANUSCRIPT_AND_PUBLISHING_STANDARD.md">Full standard</GuideLink></div>
          </div>
          <div className="publication-grid">
            <article className="manuscript-card">
              <span className="folio">700–900 words</span><h2>Required manuscript</h2>
              <ol>
                <li><strong>Title and byline</strong><span>Study ID, author, programme and pod</span></li>
                <li><strong>Abstract</strong><span>Question, sample, method, main result and limit</span></li>
                <li><strong>Conversation and claim</strong><span>What larger dialogue does this paper join?</span></li>
                <li><strong>Method</strong><span>Corpus rule, codebook, AI role and human verification</span></li>
                <li><strong>Results</strong><span>Counts, explicit denominators, one table or figure</span></li>
                <li><strong>Discussion</strong><span>Interpretation, rival explanation and inference ceiling</span></li>
                <li><strong>References and disclosure</strong><span>Verified sources, artifact register and AI-use statement</span></li>
              </ol>
            </article>
            <div className="standard-stack">
              <article><span>01</span><h3>Evidence standard</h3><p>Every included artifact has an ID, URL, retrieval date, eligibility decision and traceable evidence span.</p></article>
              <article><span>02</span><h3>Dataset standard</h3><p>Submit the locked structured file, codebook version, exclusion log and reproducible calculations.</p></article>
              <article><span>03</span><h3>AI disclosure</h3><p>Name the tasks delegated, agent/tool used, verification performed, material repairs and accountable human author.</p></article>
              <article><span>04</span><h3>Release standard</h3><p>Version 0.9 is private editorial review. Version 1.0 may enter the volume only after author and editor approval.</p></article>
            </div>
          </div>
          <div className="latex-block">
            <div><p className="eyebrow">Compilation contract</p><h2>LaTeX-ready, not LaTeX-dependent.</h2></div>
            <p>Use the supplied heading order, plain tables, stable filenames, one bibliography file and no manual visual spacing. Figures must be legible in grayscale and carry an informative caption and source note.</p>
            <div className="file-spec"><code>paper.tex</code><code>references.bib</code><code>dataset.csv</code><code>artifact-register.csv</code><code>figure-01.png</code></div>
          </div>
        </section>
      )}

      <footer>
        <p><strong>RMWUG 2026</strong> · Research Methods by Vinay Chaganti · St Mary&apos;s, Hyderabad</p>
        <p>Public guidance layer · Roster, assignments and submissions remain in the private facilitator workspace</p>
      </footer>
    </main>
  );
}
