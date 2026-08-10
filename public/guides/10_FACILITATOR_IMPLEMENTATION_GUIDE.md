# Facilitator Implementation Guide

## Delivery judgment

Eighty distinct studies can reach a compiled v0.9 in one laboratory day only if the research terrain and production system are prepared in advance. Topic discovery, corpus preflight, agent setup and LaTeX design cannot all be improvised during the workshop.

The facilitator’s job is to protect dependencies: question before corpus, corpus before extraction, codebook before scale, validation before analysis and evidence before prose.

## Recommended staffing

| Role | Recommended | Minimum responsibility |
|---|---:|---|
| Lead facilitator/editor | 1 | Method, escalation, volume release |
| Section editors | 8 | Ten topics/notes each |
| Technical/data support | 1–2 | Agent access, files, compilation, recovery |
| Students | About 80 | Individual notes in 16 pods of five |

If eight section editors are unavailable, use four editors covering two sections each and reduce live review ambition. One facilitator alone cannot meaningfully gate 80 studies seven times; use trained peer checks and targeted sampling, while retaining editorial review after the workshop.

## Preparation timeline

### Two weeks before

- Approve volume scope and working title.
- Confirm institutional research, AI, privacy and publication requirements.
- Decide whether student publication is optional and prepare consent language.
- Choose the intended repository/publication route without publishing anything yet.
- Freeze the eight sections and shortlist topics.
- Appoint section editors.
- Build and test the LaTeX master with one synthetic note.

### One week before

- Preflight every topic against the Topic Bank test.
- Record at least five accessible candidate artifacts per topic as feasibility evidence; do not preselect the final corpus for the student unless the workshop design requires it.
- Allocate topics and backups.
- Prepare student folders, IDs and filename conventions.
- Confirm access to approved AI agents and spreadsheet/text tools.
- Train section editors on the method, automatic holds and repair language.

### One day before

- Recheck topic links and agent access.
- Place local copies of all templates where students can reach them.
- Prepopulate the central dashboard.
- Test internet, file permissions and compilation.
- Prepare an offline fallback corpus for at least one topic in each section.
- Freeze template and prompt versions.

## Topic allocation

Allocate topics before the workshop when possible. The central register should contain:

| Field | Purpose |
|---|---|
| Student ID/name | Ownership |
| Section and topic ID | Volume placement |
| Working question | Duplication control |
| Artifact type and intended frame | Feasibility |
| Backup topic | Fast recovery |
| Section editor | Routing |
| Topic status | Proposed / approved / replaced / withdrawn |
| Reason for change | Audit trail |

Students may refine a topic but should not enter an unrestricted topic marketplace during the workshop.

## Suggested 7.5-hour run of show

| Time | Activity | Gate/output |
|---|---|---|
| 00:00–00:25 | Volume briefing, artifact method and publication boundary | Common purpose understood |
| 00:25–01:00 | Sources, claim, rival and question | Checkpoints 1–2 |
| 01:00–01:35 | Corpus rule and safety review | Checkpoint 3 |
| 01:35–02:20 | Manual codebook pilot and repair | Checkpoint 4 manual pilot |
| 02:20–03:05 | Agent extraction pilot, protocol repair and scale start | Checkpoint 4 pass |
| 03:05–03:25 | Break while section editors sample work | Risk queue updated |
| 03:25–04:15 | Complete extraction and human acceptance | Dataset progress |
| 04:15–04:45 | Independent validation and dataset lock | Checkpoint 5 |
| 04:45–05:25 | Analysis, result and evidence display | Checkpoint 6 |
| 05:25–06:25 | Evidence-first drafting in template | Draft note |
| 06:25–06:55 | Pod peer review and repair | Checkpoint 7 review |
| 06:55–07:25 | Submission validation and standalone compilation | v0.9 candidates |
| 07:25–07:30 | Close: author duties and post-workshop proof process | Release boundary repeated |

For a six-hour version, provide pre-approved questions and organization frames, reduce sample targets to 12–15 and move proof correction outside the room. Do not remove validation.

## Room organization

- Seat pods of five together.
- Assign two pods to each section editor where possible.
- Give every student one individual folder and study ID.
- Use a visible queue: **blocked method**, **blocked data**, **blocked compilation**, **ready for sample**.
- Do not let students wait for individual facilitator attention when a pod can reproduce a calculation or check an artifact.
- Sample one strong and one repairable output after each major gate.

## Central dashboard

Track:

- C1 conversation/source pass;
- C2 question/claim pass;
- C3 corpus lock;
- C4 codebook/pilot lock;
- C5 included row count and validation status;
- C6 result/figure pass;
- C7 manuscript/review status;
- automatic hold flags;
- LaTeX compilation status;
- author proof/consent status; and
- final volume decision.

Use states such as `NOT_STARTED`, `WORKING`, `PASS`, `CONDITIONAL`, `RETURN`, `HOLD` rather than a misleading single completion percentage.

## Facilitator sampling strategy

Because 80 full live audits are impossible, inspect high-information items:

1. every question and corpus rule;
2. one positive, one negative and one ambiguous pilot per study through peer/section review;
3. every principal result and denominator;
4. every automatic-hold flag;
5. all notes making sensitive or accusatory claims; and
6. a systematic sample of ordinary datasets and manuscripts.

Full editorial review still occurs before v1.0.

## Intervention prompts

### When a claim is too large

> Which exact row and field would prove that verb? What smaller verb does the artifact actually support?

### When a student cannot find supporting artifacts

> Does your sampling rule require support, or does the absence answer part of the question?

### When the codebook is vague

> Show two pages where reasonable coders would disagree. What definition resolves the disagreement without knowing the desired result?

### When the agent looks authoritative

> Open the artifact. Which exact words entail this code, and which part came from the agent rather than the source?

### When the paper outruns the dataset

> State the result as count, denominator and sample. What did the interpretation add that was not observed?

### When time is running out

> Reduce fields, comparison or word count—not evidence checking.

## High-risk topic routing

Immediately escalate studies involving:

- medical or wellness efficacy;
- consumer financial advice or credit eligibility conclusions;
- allegations of illegality, deception, discrimination or exploitation;
- inferred protected identities;
- personal reviews, comments or social profiles;
- children or other vulnerable populations;
- account-only, leaked, private or confidential content;
- platform circumvention or automated bulk collection; or
- copyrighted screenshots intended for publication.

The safest repair is often to convert a judgment into an observable description.

## Technical failure contingencies

### Internet instability

Use the prepared offline corpus with preserved source metadata. Record that the corpus was supplied, not independently discovered.

### Agent outage

Manually code the minimum sample. The method does not require AI; it requires transparent structured extraction and verification.

### Agent output will not parse

Return to one artifact, one prompt and the strict schema. Do not manually paste mixed prose into accepted data without recording the repair.

### LaTeX failure

Accept validated Markdown/plain-text manuscript and structured metadata into the editorial queue. Do not sacrifice research quality to solve layout. Compile centrally after the workshop.

### Topic failure

Use the pre-approved backup topic. Record the switch before the replacement corpus is inspected.

## Same-day editorial production

During the final drafting period, the editorial/technical team should:

- validate incoming manifests;
- compile standalone proofs;
- return only blocking errors;
- assemble accepted notes by section;
- leave missing-note placeholders transparent;
- produce v0.9 with a visible “private review copy” status; and
- preserve build and decision logs.

Do not publish v0.9 to a public repository merely because it compiles.

## Post-workshop route to v1.0

1. Complete research-integrity review.
2. Return actionable queries to authors.
3. Verify revisions and generate proofs.
4. Obtain affirmative author approval and publication consent.
5. Clear quotations, images, third-party material and dataset release fields.
6. Complete section introductions and volume synthesis.
7. Finalize licence and repository metadata.
8. Compile and visually inspect the full volume.
9. Authorize release through the designated editor.
10. Record the DOI/version only after publication actually succeeds.

## Success metrics

Report separately:

- topics allocated;
- questions/corpora approved;
- datasets locked;
- manuscripts submitted;
- v0.9 notes compiled;
- v1.0 notes accepted;
- notes withheld with reasons;
- unresolved editorial work; and
- public release status.

Do not report “80 papers published” when 80 topics were merely assigned or compiled into a private draft.


