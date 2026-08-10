"use client";

import { useEffect, useMemo, useState } from "react";
import { agentContract, agentStages, workOrder } from "./data/agentInstructions";
import { sectionColours, topics, topicSections } from "./data/topics";

type View = "overview" | "study" | "topics" | "agents" | "facilitator" | "publishing";

type Student = {
  id: string;
  name: string;
  email: string;
  pod: string;
  topicId?: string;
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
  { id: "facilitator", label: "Facilitator" },
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

function makePlaceholderRoster(count = 80, podSize = 5): Student[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `S${String(index + 1).padStart(3, "0")}`,
    name: `Student ${String(index + 1).padStart(3, "0")}`,
    email: `student${String(index + 1).padStart(3, "0")}@placeholder.invalid`,
    pod: `P${String(Math.floor(index / podSize) + 1).padStart(2, "0")}`,
  }));
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string) {
  let value = hashSeed(seed) || 1;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function csvCell(value: string | number | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function packPods(
  podGroups: { id: string; students: Student[] }[],
  sectionCodes: string[],
  random: () => number,
) {
  const randomized = shuffle(
    podGroups.map((pod) => ({ ...pod, tie: random() })),
    random,
  ).sort((a, b) => b.students.length - a.students.length || a.tie - b.tie);
  const bins = shuffle(sectionCodes, random).map((code) => ({
    code,
    remaining: 10,
    pods: [] as typeof randomized,
  }));

  function place(index: number): boolean {
    if (index === randomized.length) return true;
    const pod = randomized[index];
    const candidates = bins
      .filter((bin) => bin.remaining >= pod.students.length)
      .sort((a, b) => a.remaining - b.remaining);
    const tried = new Set<number>();
    for (const bin of candidates) {
      if (tried.has(bin.remaining)) continue;
      tried.add(bin.remaining);
      bin.pods.push(pod);
      bin.remaining -= pod.students.length;
      if (place(index + 1)) return true;
      bin.remaining += pod.students.length;
      bin.pods.pop();
    }
    return false;
  }

  return place(0) ? bins : null;
}

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

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [roster, setRoster] = useState<Student[]>(() => makePlaceholderRoster());
  const [forms, setForms] = useState<FormLinks>(defaultForms);
  const [selectedId, setSelectedId] = useState("S001");
  const [seed, setSeed] = useState("RMWUG2026-01");
  const [podTarget, setPodTarget] = useState(5);
  const [podPlan, setPodPlan] = useState(Array(16).fill("5").join(", "));
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [topicFilter, setTopicFilter] = useState("ALL");
  const [studentSearch, setStudentSearch] = useState("");
  const [readyGates, setReadyGates] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const savedRoster = window.localStorage.getItem("rmwug-roster");
        const savedForms = window.localStorage.getItem("rmwug-forms");
        const savedGates = window.localStorage.getItem("rmwug-ready-gates");
        if (savedRoster) setRoster(JSON.parse(savedRoster));
        if (savedForms) {
          const parsedForms = JSON.parse(savedForms) as Partial<FormLinks>;
          setForms({
            onboarding: parsedForms.onboarding || defaultForms.onboarding,
            milestone: parsedForms.milestone || defaultForms.milestone,
            submission: parsedForms.submission || defaultForms.submission,
          });
        }
        if (savedGates) setReadyGates(JSON.parse(savedGates));
      } catch {
        // A corrupt local prototype cache should never block the workshop UI.
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("rmwug-roster", JSON.stringify(roster));
  }, [roster]);

  useEffect(() => {
    window.localStorage.setItem("rmwug-forms", JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    window.localStorage.setItem("rmwug-ready-gates", JSON.stringify(readyGates));
  }, [readyGates]);

  const topicById = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), []);
  const selectedStudent = roster.find((student) => student.id === selectedId) ?? roster[0];
  const selectedTopic = selectedStudent?.topicId ? topicById.get(selectedStudent.topicId) : undefined;
  const podGroups = useMemo(() => {
    const groups = new Map<string, Student[]>();
    roster.forEach((student) => {
      groups.set(student.pod, [...(groups.get(student.pod) ?? []), student]);
    });
    return [...groups.entries()]
      .map(([id, students]) => ({ id, students }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [roster]);
  const assignedCount = roster.filter((student) => student.topicId).length;
  const filteredTopics = topics.filter((topic) => topicFilter === "ALL" || topic.id.startsWith(topicFilter));
  const filteredRoster = roster.filter((student) => {
    const needle = studentSearch.toLowerCase();
    return !needle || `${student.id} ${student.name} ${student.email} ${student.pod}`.toLowerCase().includes(needle);
  });

  function resetRoster() {
    const next = makePlaceholderRoster(80, 5);
    setRoster(next);
    setPodTarget(5);
    setPodPlan(Array(16).fill("5").join(", "));
    setAssignmentMessage("Placeholder roster restored. No topics are assigned.");
  }

  function rebalancePods() {
    const size = Math.max(2, Math.min(10, podTarget));
    setRoster((current) =>
      current.map((student, index) => ({
        ...student,
        pod: `P${String(Math.floor(index / size) + 1).padStart(2, "0")}`,
        topicId: undefined,
      })),
    );
    const sizes: number[] = [];
    let remaining = roster.length;
    while (remaining > 0) {
      sizes.push(Math.min(size, remaining));
      remaining -= size;
    }
    setPodPlan(sizes.join(", "));
    setAssignmentMessage(`Rebalanced into ${sizes.length} pods. Review the last pod before assigning.`);
  }

  function applyPodPlan() {
    const sizes = podPlan
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value));
    const total = sizes.reduce((sum, size) => sum + size, 0);
    if (!sizes.length || sizes.some((size) => !Number.isInteger(size) || size < 2 || size > 10)) {
      setAssignmentMessage("Each pod size must be a whole number from 2 to 10.");
      return;
    }
    if (total !== roster.length) {
      setAssignmentMessage(`That plan accounts for ${total} students; the roster contains ${roster.length}.`);
      return;
    }
    let cursor = 0;
    setRoster((current) => {
      const next = [...current];
      sizes.forEach((size, podIndex) => {
        for (let offset = 0; offset < size; offset += 1) {
          next[cursor] = {
            ...next[cursor],
            pod: `P${String(podIndex + 1).padStart(2, "0")}`,
            topicId: undefined,
          };
          cursor += 1;
        }
      });
      return next;
    });
    setAssignmentMessage(`Applied ${sizes.length} custom pods. Topics were cleared for a fresh draw.`);
  }

  function assignTopics() {
    if (roster.length > topics.length) {
      setAssignmentMessage("The roster exceeds the 80 unique topics currently available.");
      return;
    }
    if (podGroups.some((pod) => pod.students.length > 10)) {
      setAssignmentMessage("A pod cannot exceed 10 students because each section contains 10 unique studies.");
      return;
    }
    const random = seededRandom(seed.trim() || "RMWUG2026");
    const bins = packPods(
      podGroups,
      topicSections.map((section) => section.code),
      random,
    );
    if (!bins) {
      setAssignmentMessage(
        "These pod sizes cannot be fitted into eight ten-topic sections. Adjust the pod plan, then run the draw again.",
      );
      return;
    }

    const assignments = new Map<string, string>();
    bins.forEach((bin) => {
      const sectionTopics = shuffle(
        topics.filter((topic) => topic.id.startsWith(bin.code)),
        random,
      );
      const students = shuffle(bin.pods.flatMap((pod) => pod.students), random);
      students.forEach((student, index) => assignments.set(student.id, sectionTopics[index].id));
    });
    setRoster((current) =>
      current.map((student) => ({ ...student, topicId: assignments.get(student.id) })),
    );
    setAssignmentMessage(
      `Assigned ${assignments.size} unique studies with seed “${seed.trim() || "RMWUG2026"}”. Save the CSV before changing the draw.`,
    );
  }

  function exportAssignments() {
    const header = ["student_id", "name", "email", "pod", "section", "topic_id", "research_question"];
    const rows = roster.map((student) => {
      const topic = student.topicId ? topicById.get(student.topicId) : undefined;
      return [student.id, student.name, student.email, student.pod, topic?.section, topic?.id, topic?.question];
    });
    downloadText(
      `RMWUG2026-assignments-${seed.replaceAll(/[^a-zA-Z0-9_-]/g, "-")}.csv`,
      [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n"),
      "text/csv",
    );
  }

  async function importRoster(file: File) {
    const rows = parseCsv(await file.text());
    if (rows.length < 2) {
      setAssignmentMessage("The CSV has no roster rows.");
      return;
    }
    const header = rows[0].map((cell) => cell.toLowerCase().replaceAll(" ", "_"));
    const idIndex = header.indexOf("student_id");
    const nameIndex = header.indexOf("name");
    const emailIndex = header.indexOf("email");
    if (nameIndex < 0 || emailIndex < 0) {
      setAssignmentMessage("Use CSV columns: student_id, name, email. student_id may be blank.");
      return;
    }
    const next = rows
      .slice(1)
      .filter((row) => row[nameIndex] || row[emailIndex])
      .map((row, index) => ({
        id: row[idIndex] || `S${String(index + 1).padStart(3, "0")}`,
        name: row[nameIndex],
        email: row[emailIndex],
        pod: `P${String(Math.floor(index / 5) + 1).padStart(2, "0")}`,
      }));
    if (!next.length || next.length > 80) {
      setAssignmentMessage("The roster must contain between 1 and 80 students.");
      return;
    }
    setRoster(next);
    setSelectedId(next[0].id);
    setPodPlan(
      Array.from({ length: Math.ceil(next.length / 5) }, (_, index) =>
        String(Math.min(5, next.length - index * 5)),
      ).join(", "),
    );
    setAssignmentMessage(`Imported ${next.length} students. Review pod sizes before assigning topics.`);
  }

  function clearAssignments() {
    setRoster((current) => current.map((student) => ({ ...student, topicId: undefined })));
    setAssignmentMessage("Assignments cleared. The roster and pod plan are unchanged.");
  }

  function toggleReady(gate: string) {
    if (!selectedStudent) return;
    setReadyGates((current) => {
      const studentGates = current[selectedStudent.id] ?? [];
      const next = studentGates.includes(gate)
        ? studentGates.filter((value) => value !== gate)
        : [...studentGates, gate];
      return { ...current, [selectedStudent.id]: next };
    });
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
            <button
              type="button"
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <ExternalAction href={forms.milestone}>Check in</ExternalAction>
      </header>

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
                <button className="text-link" type="button" onClick={() => setView("facilitator")}>Facilitator control room →</button>
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
            <div>
              <p className="eyebrow">The workshop spine</p>
              <h2>Seven gates prevent one impressive-looking mistake.</h2>
            </div>
            <p>Advance only after the evidence at the current gate is inspectable by your pod.</p>
          </div>
          <div className="gate-grid">
            {gates.map(([id, title, description], index) => (
              <article className="gate-card" key={id}>
                <div className="gate-top"><span>{id}</span><small>0{index + 1}</small></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === "study" && (
        <section className="view">
          <div className="section-heading study-heading">
            <div>
              <p className="eyebrow">Student workbench</p>
              <h1>Find your assignment. Keep your evidence visible.</h1>
            </div>
            <label className="student-picker">
              Student ID
              <input
                value={selectedId}
                list="student-ids"
                onChange={(event) => setSelectedId(event.target.value.toUpperCase())}
                placeholder="S001"
              />
              <datalist id="student-ids">
                {roster.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
              </datalist>
            </label>
          </div>

          {!selectedStudent ? (
            <div className="notice warning">No student matches that ID. Check the roster or ask the facilitator.</div>
          ) : (
            <>
              <div className="study-summary">
                <article className="identity-card">
                  <p className="eyebrow">Researcher</p>
                  <h2>{selectedStudent.name}</h2>
                  <dl>
                    <div><dt>Student ID</dt><dd>{selectedStudent.id}</dd></div>
                    <div><dt>Peer pod</dt><dd>{selectedStudent.pod}</dd></div>
                    <div><dt>Assignment</dt><dd>{selectedStudent.topicId ?? "Pending draw"}</dd></div>
                  </dl>
                  <ExternalAction href={forms.onboarding}>Confirm my details</ExternalAction>
                </article>
                <article className={`topic-assignment ${selectedTopic ? sectionColours[selectedTopic.id.slice(0, 2)] : "muted"}`}>
                  <p className="eyebrow">{selectedTopic?.section ?? "Topic assignment pending"}</p>
                  <h2>{selectedTopic?.question ?? "The facilitator will run the topic draw after the pod plan is final."}</h2>
                  {selectedTopic && (
                    <div className="topic-boundary">
                      <span>{selectedTopic.id}</span>
                      <p>Default sample: 12–25 public artifacts. Describe what is visible; do not infer intent, effect, legality or population-wide prevalence.</p>
                    </div>
                  )}
                </article>
              </div>

              <div className="section-heading compact">
                <div><p className="eyebrow">Your checkpoints</p><h2>Bring an auditable object to every pod review.</h2></div>
                <ExternalAction href={forms.milestone}>Submit a milestone</ExternalAction>
              </div>
              <div className="checkpoint-list">
                {gates.map(([id, title, description]) => {
                  const isReady = (readyGates[selectedStudent.id] ?? []).includes(id);
                  return (
                    <article key={id} className={isReady ? "checkpoint ready" : "checkpoint"}>
                      <div className="checkpoint-code">{id}</div>
                      <div><h3>{title}</h3><p>{description}</p></div>
                      <button type="button" onClick={() => toggleReady(id)}>{isReady ? "Ready ✓" : "Mark ready"}</button>
                    </article>
                  );
                })}
              </div>
              <p className="local-note">Readiness marks are a private device aid. The Google milestone form is the authoritative workshop record.</p>
            </>
          )}
        </section>
      )}

      {view === "topics" && (
        <section className="view">
          <div className="section-heading">
            <div><p className="eyebrow">Edited-volume architecture</p><h1>Eight conversations. Ten studies in each.</h1></div>
            <p>Every question is a starting boundary—not a conclusion waiting to be confirmed.</p>
          </div>
          <div className="filter-row" role="group" aria-label="Filter topic sections">
            <button className={topicFilter === "ALL" ? "active" : ""} onClick={() => setTopicFilter("ALL")}>All 80</button>
            {topicSections.map((section) => (
              <button key={section.code} className={topicFilter === section.code ? "active" : ""} onClick={() => setTopicFilter(section.code)}>
                {section.code} · {section.short}
              </button>
            ))}
          </div>
          <div className="topic-grid">
            {filteredTopics.map((topic) => (
              <article key={topic.id} className={`topic-card ${sectionColours[topic.id.slice(0, 2)]}`}>
                <div><span>{topic.id}</span><small>{topic.sectionShort}</small></div>
                <h3>{topic.question}</h3>
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
              <details key={stage.id}>
                <summary><span>{stage.gate}</span><div><h3>{stage.title}</h3><p>{stage.purpose}</p></div><b>＋</b></summary>
                <div className="prompt-body"><pre>{stage.prompt}</pre><CopyButton text={`${agentContract}\n\n${workOrder}\n\n${stage.prompt}`} label="Copy complete prompt" /></div>
              </details>
            ))}
          </div>
        </section>
      )}

      {view === "facilitator" && (
        <section className="view facilitator-view">
          <div className="section-heading">
            <div><p className="eyebrow">Facilitator control room</p><h1>Shape the pods. Then run one reproducible draw.</h1></div>
            <div className="metric-pair"><span><strong>{roster.length}</strong> students</span><span><strong>{podGroups.length}</strong> pods</span><span><strong>{assignedCount}</strong> assigned</span></div>
          </div>

          <div className="notice"><strong>Prototype roster:</strong> placeholder names and invalid email addresses are deliberate. Import the final roster before the workshop. Browser storage is not the official record.</div>

          <div className="control-grid">
            <article className="control-card">
              <p className="step-label">Step 1 · Roster</p>
              <h2>Import the students</h2>
              <p>CSV headers: <code>student_id,name,email</code>. Maximum 80.</p>
              <div className="button-row">
                <label className="button file-button">Import CSV<input type="file" accept=".csv,text/csv" onChange={(event) => event.target.files?.[0] && importRoster(event.target.files[0])} /></label>
                <button className="text-link" type="button" onClick={resetRoster}>Restore placeholders</button>
              </div>
            </article>
            <article className="control-card">
              <p className="step-label">Step 2 · Pods</p>
              <h2>Choose the peer-review groups</h2>
              <div className="inline-control"><label>Target size<input type="number" min="2" max="10" value={podTarget} onChange={(event) => setPodTarget(Number(event.target.value))} /></label><button className="button" type="button" onClick={rebalancePods}>Rebalance</button></div>
              <label>Exact pod sizes<input value={podPlan} onChange={(event) => setPodPlan(event.target.value)} /></label>
              <button className="text-link" type="button" onClick={applyPodPlan}>Apply exact plan →</button>
            </article>
            <article className="control-card accent-control">
              <p className="step-label">Step 3 · Assignment</p>
              <h2>Run the topic draw</h2>
              <label>Assignment seed<input value={seed} onChange={(event) => setSeed(event.target.value)} /></label>
              <div className="button-row"><button className="button primary" type="button" onClick={assignTopics}>Assign all topics</button><button className="text-link" type="button" onClick={clearAssignments}>Clear</button></div>
            </article>
          </div>
          {assignmentMessage && <div className="notice status" role="status">{assignmentMessage}</div>}

          <div className="pod-strip">
            {podGroups.map((pod) => {
              const section = pod.students[0]?.topicId?.slice(0, 2);
              return <div key={pod.id}><strong>{pod.id}</strong><span>{pod.students.length} students</span><small>{section ? topicSections.find((item) => item.code === section)?.short : "Not assigned"}</small></div>;
            })}
          </div>

          <div className="roster-panel">
            <div className="roster-toolbar"><div><p className="eyebrow">Working roster</p><h2>Student-level assignment register</h2></div><div><input aria-label="Search roster" placeholder="Search roster" value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} /><button className="button" type="button" onClick={exportAssignments}>Export CSV</button></div></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Email</th><th>Pod</th><th>Study</th><th>Question</th></tr></thead>
                <tbody>
                  {filteredRoster.map((student) => {
                    const topic = student.topicId ? topicById.get(student.topicId) : undefined;
                    return (
                      <tr key={student.id}>
                        <td><strong>{student.name}</strong><small>{student.id}</small></td>
                        <td>{student.email}</td>
                        <td><select value={student.pod} onChange={(event) => setRoster((current) => current.map((item) => item.id === student.id ? { ...item, pod: event.target.value, topicId: undefined } : item))}>{Array.from({ length: 24 }, (_, index) => <option key={index} value={`P${String(index + 1).padStart(2, "0")}`}>P{String(index + 1).padStart(2, "0")}</option>)}</select></td>
                        <td><span className={`topic-code ${topic ? sectionColours[topic.id.slice(0, 2)] : "muted"}`}>{topic?.id ?? "—"}</span></td>
                        <td>{topic?.question ?? "Awaiting assignment"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="forms-panel">
            <div><p className="eyebrow">Private Google layer</p><h2>Submission links</h2><p>These URLs are kept in this browser for setup. Student responses belong in the facilitator-owned Google Sheet—not in GitHub.</p></div>
            <div className="form-fields">
              {(Object.keys(forms) as (keyof FormLinks)[]).map((key) => (
                <label key={key}>{key === "onboarding" ? "Student details form" : key === "milestone" ? "Milestone check-in form" : "Final manuscript form"}<input type="url" placeholder="https://forms.gle/…" value={forms[key]} onChange={(event) => setForms((current) => ({ ...current, [key]: event.target.value }))} /></label>
              ))}
              <button className="button" type="button" onClick={() => downloadText("RMWUG2026-form-links.json", JSON.stringify(forms, null, 2), "application/json")}>Export link configuration</button>
            </div>
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
              <span className="folio">700–900 words</span>
              <h2>Required manuscript</h2>
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
        <p>Public guidance layer · Student submissions remain in private Google Workspace files</p>
      </footer>
    </main>
  );
}
