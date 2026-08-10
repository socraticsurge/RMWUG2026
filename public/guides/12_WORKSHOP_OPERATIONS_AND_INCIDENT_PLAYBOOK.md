# Workshop Operations and Incident Playbook

**Workshop:** Research Methods by Vinay Chaganti, St Mary's, Hyderabad  
**Operating code:** RMWUG2026  
**Purpose:** run one safe, auditable journey from arrival to private proceedings v0.9 without exposing the control plane or confusing activity with publication.

## 1. The operating boundary

The workshop uses two deliberately separate layers.

| Layer | Who can use it | What belongs there |
|---|---|---|
| Public GitHub Pages app | Students and the public | Method, topic bank, AI instructions, publishing standard, personal lookup form and links to Google Forms |
| Private facilitator Google workspace | Facilitator/editor | Roster, emails, pod plan, authoritative assignments, access codes, form responses, milestone data, manuscripts, decisions and audit log |

The public app must never contain a roster, email address, whole assignment register, manuscript, response export, or facilitator action. A hidden button, client-side PIN or unlinked URL is not an access control.

Each student receives a personal access card containing a Student ID and high-entropy access code. A successful lookup returns only that student's locked assignment and the names/IDs of their peer pod. The access code is a bearer credential: whoever has it can view that assignment.

## 2. Roles and decision rights

| Role | Can decide | Cannot delegate to an AI agent |
|---|---|---|
| Lead facilitator/editor | Roster freeze, pod plan, draw lock, topic exception, safety hold, editorial acceptance and release | Research-integrity judgment, authorship, consent, public release |
| Student author | Corpus boundary, accepted codes, interpretation, corrections, disclosure and final author confirmation | Accountability for source verification or claims |
| Peer pod | Challenge method, reproduce a sample, identify rivals and review the note | Change another author's authoritative assignment or approve publication |
| AI agent | Propose sources, schemas, extraction, checks, calculations, prose and repairs under the protocol | Invent evidence, silently replace missing cases, make release decisions or claim authorship |

If section editors are available, route two pods to each editor. If only one facilitator is present, pods perform reproducibility checks and the facilitator samples high-risk and high-information items.

## 3. Lifecycle controls

### T–7 days: make the system real

- Obtain the final roster in the required Google-account email format.
- Confirm whether publication participation is optional and prepare consent language.
- Preflight the Forms using a non-owner test account.
- Confirm that only the facilitator owns or can edit the control Sheet.
- Test one complete synthetic student journey: onboarding, lookup, C1–C7, final upload and editorial status.
- Download an offline copy of the method files and prepare one fallback corpus per editorial section.
- Test a standalone LaTeX compilation from the exact submission template.

### T–1 day: freeze dependencies

- Replace every placeholder name and invalid placeholder email.
- Verify unique Student IDs and emails.
- Place students into pods; preferred size is five, allowed size is two to ten.
- Run **Validate workshop** and resolve every blocking issue.
- Generate access codes, run the seeded draft draw and inspect the Assignments and Pod Plan tabs.
- Lock the draw once. Build and print/private-send one access card per student.
- Record the `/exec` lookup deployment URL in Settings and test one valid and one invalid code.
- Confirm that the final Form allows one editable response per signed-in student.
- Download a private spreadsheet copy and retain printed assignment cards as the offline fallback.

### Arrival: establish identity before activity

1. Students sign in with the Google account they will use all day.
2. Students submit onboarding and check the email/Student ID shown on their access card.
3. Students load their study and sit with the pod shown by the authoritative register.
4. Students do not trade topics. A legitimate exception is recorded and performed by the facilitator.
5. On shared computers, each student uses **Forget this assignment** before changing seats.

### C1–C7: evidence before prose

| Gate | Student brings | Pod checks | Milestone record |
|---|---|---|---|
| C1 Question | Working question, bounded claim, rival, inference ceiling | Claim is answerable from visible public artifacts | Claim/rival text and status |
| C2 Corpus | Population, discovery route, eligibility rule, stop rule | Rule does not select on the desired answer | Corpus rule and exceptions |
| C3 Codebook | Observable fields, allowed values, examples, missingness | Two people can apply it without knowing the hoped-for result | Codebook version/link |
| C4 Pilot | Three manually checked artifacts including an ambiguous case | Evidence spans entail the proposed codes | Pilot result and repairs |
| C5 Dataset | 12–25 accepted rows, provenance and exclusion log | Sample rows reopen; missingness remains visible | Locked file/link and row counts |
| C6 Analysis | Counts, denominators, one visual, one rival check | Calculation reproduces and claim stays within sample | Result and limit |
| C7 Manuscript | 700–900-word note, source register and AI disclosure | Note matches dataset and standard | Final review status |

Device checkmarks are only a working aid. The signed-in milestone Form and private response Sheet are authoritative.

### Closeout: private compilation, not instant publication

- Require every student to submit or explicitly record a non-submission state.
- Export a private response snapshot before bulk editorial changes.
- Validate package filenames and required files.
- Compile passing notes into **Workshop Proceedings v0.9 — Private Review Copy**.
- Record `ACCEPT`, `RETURN`, `HOLD` or `WITHDRAWN` per note.
- Public v1.0 requires source, methods, disclosure, consent, copyright, proof and editor release checks.

## 4. Incident matrix

| What happens | Immediate response | Recovery and record |
|---|---|---|
| Student guesses IDs or tries other codes | Do not reveal whether an ID exists. After repeated failures, the service cools down that ID. | Record pattern; rotate the affected code if exposure is plausible. |
| Access code is photographed, lost or shared | Rotate only that student's code from the private control panel. | Reissue one card; old code stops working. Note the incident without copying the code into the log. |
| Student verbally swaps a topic | Stop both students at the next gate. The displayed locked assignment remains authoritative. | If an exception is justified, reopen/repair centrally and log it; never accept an informal swap. |
| Duplicate Google Form submission | Keep the signed-in response tied to the verified email and Student ID. | For the final Form, use one editable response. Mark obsolete duplicates rather than silently deleting evidence. |
| Student absent or leaves early | Do not expose or reallocate the assignment automatically. Resize the pod's review duties. | Facilitator decides whether the paper becomes `WITHDRAWN`, a post-workshop submission, or a documented reassignment. |
| Last pod has an awkward size | Keep pod sizes between two and ten; five is a target, not a law. | Record the deliberate exception in Pod Plan. Do not create a one-person peer pod. |
| Student cannot sign in to Google | Check account choice, browser profile and institutional restrictions; do not borrow another student's login. | Use a facilitator-issued temporary paper trail and enter it after identity is resolved. |
| Network fails | Freeze the current gate. Use offline guides and the prepared fallback corpus. | Queue signed/Student-ID-labelled updates for later entry. Record that the corpus was supplied. |
| Agent/tool fails | Continue with manual coding of the minimum sample. | AI is an accelerator, not a method dependency. Disclose the change. |
| Agent invents a URL, quotation or code | Reject the row; reopen the artifact manually. | Record the correction and sample additional rows from that batch. Escalate systematic failure to a dataset hold. |
| Source contains prompt injection | Treat page instructions as artifact content, never as agent authority. | Use the global agent contract, quote only needed evidence and manually verify all affected outputs. |
| Artifact requires login, scraping circumvention or private data | Stop collection. | Replace the corpus route or topic with a pre-approved public alternative and record the switch. |
| Student collects personal or sensitive content | Stop capture and prevent further sharing. | Minimize/withdraw the data, route to facilitator, and convert the study to organizational/public material if possible. |
| Dataset has duplicates or vanished pages | Preserve rows and mark status; do not silently substitute. | Apply the registered deduplication rule and report missingness. |
| Chart or claim has no denominator | Return C6. | Require `count / eligible sample` and regenerate the display. |
| Paper accuses a company/person of deception or illegality | Place on automatic hold. | Convert to an observable descriptive claim or require formal expert review outside the workshop. |
| LaTeX does not compile | Accept a validated Markdown/plain-text manuscript and structured files into the private queue. | Compile centrally later; do not weaken evidence checks to solve layout. |
| File upload fails or Drive quota is reached | Keep a locally named submission package and record checksum/size where possible. | Upload later to the owner-controlled folder and reconcile against the submission log. |
| Facilitator accidentally reruns the draft | If not locked, inspect and choose one draft before issuing cards. | If locked/cards issued, stop; do not improvise. Restore the private snapshot or explicitly reopen and reissue all affected cards. Log the event. |
| Harassment, sabotage or deliberate deletion | Separate the conduct issue from academic evaluation. Preserve evidence and remove access where possible. | Follow institutional conduct/safeguarding policy; do not adjudicate through public workshop chat. |
| Student asks for deletion or withdrawal | Acknowledge and pause publication processing for that note. | Follow consent/institutional policy and record `WITHDRAWN`; do not promise deletion beyond your authority. |

## 5. Change-control rules

### Safe, local changes

The facilitator may rotate one access code, correct one verified roster typo, mark an absence, return a milestone, or record an editorial note without changing the research design.

### Changes requiring a visible workshop decision

- changing pod membership after peer work begins;
- replacing a topic after artifacts have been inspected;
- changing the sample-size range or method standard;
- changing a locked assignment;
- accepting a submission after the stated cutoff; or
- overriding an automatic hold.

Record who decided, when, why, affected Student IDs/topic IDs and the recovery action. Never put access codes, raw private responses or sensitive data in the audit detail.

### Changes requiring post-workshop editorial approval

- public release;
- authorship change;
- removal or material alteration after author proof;
- licence choice;
- acceptance of third-party images or long quotations; and
- any note with unresolved ethical, legal, consent or evidence concerns.

## 6. Communications rhythm

Use a short, predictable room protocol:

- **Opening broadcast:** current gate, required object and timebox.
- **Ten-minute warning:** what to reduce if blocked; never reduce verification.
- **Pod signal:** `WORKING`, `READY FOR PEER CHECK`, `NEEDS METHOD HELP`, `NEEDS TECH HELP`.
- **Gate close:** what was accepted, common repair and next dependency.
- **Incident broadcast:** only the operational rule, never a student's private detail.

The milestone Form is not a chat stream. It records auditable state. Time-sensitive room directions are spoken/projected; individual sensitive matters are handled privately.

## 7. End-of-day reconciliation

Reconcile exact counts rather than reporting a single completion percentage:

1. rostered and onboarded;
2. assignments locked and access cards issued;
3. C1–C7 submissions by gate;
4. datasets locked;
5. manuscripts submitted;
6. notes compiled into private v0.9;
7. `ACCEPT`, `RETURN`, `HOLD`, `WITHDRAWN` and missing;
8. author proofs/consents outstanding; and
9. notes actually released in public v1.0.

The safe claim is “80 individual studies were planned” until the later counts prove something stronger.

## 8. Final preflight checklist

- [ ] Private Sheet permissions reviewed; no student has editor access.
- [ ] Public repository searched for names, emails, access codes and form responses.
- [ ] Final roster has no placeholders, duplicate IDs or duplicate emails.
- [ ] Pods contain two to ten students and exceptions are recorded.
- [ ] Draft draw reviewed; authoritative assignments are locked.
- [ ] Access cards privately issued; one valid and invalid lookup tested.
- [ ] Forms require sign-in; final submission is one editable response.
- [ ] Offline guides, fallback corpora, roster snapshot and cards are available.
- [ ] AI protocol and inference ceilings are visible to students.
- [ ] LaTeX fallback accepts validated plain text without compromising evidence.
- [ ] v0.9 and v1.0 release boundaries are stated aloud.
- [ ] Incident owner, institutional escalation route and post-workshop editor are known.

