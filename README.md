# RMWUG 2026

The public workshop operating system for **Research Methods by Vinay Chaganti**, at **St Mary's, Hyderabad**.

The workshop is designed to produce 80 individually authored, artifact-based Commerce research papers. Students share one methodological spine and work in adjustable peer-review pods, while each student receives a unique study from an eight-section topic bank.

## What the app does

- gives each student their locked study question, pod and seven research checkpoints after a personal access-code lookup;
- provides stage-specific AI-agent work orders and safety instructions;
- keeps roster import, pod changes, assignment and access-card actions in the private facilitator Sheet;
- supports a seeded, reproducible one-click draw with explicit draft and locked states;
- guarantees unique topics and keeps each pod within one editorial section;
- links students to private Google Forms for details, milestones and final submission; and
- publishes the complete method, workbook and editorial standards as Markdown.

## Privacy boundary

This repository and GitHub Pages site are public. **Do not commit the real student roster, email addresses, access codes, milestone responses, datasets or manuscripts.** Google Forms, Sheets, Apps Script and Drive are the private record/control layer.

The public app contains no facilitator screen or roster. A successful Apps Script lookup returns only one locked assignment and that student's pod-member names. Access codes, the whole register and email addresses remain in the protected Sheet. Student readiness marks are ephemeral device aids; the Google milestone Form is authoritative.

## Run locally

Requires Node.js 22.13 or later.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run build:pages
npm test
```

`npm run build:pages` writes the GitHub Pages artifact to `.next-pages/`. A push to `main` triggers `.github/workflows/deploy-pages.yml`.

## Private facilitator journey

Use the owner-only Sheet and its `RMWUG Control` menu:

1. replace the placeholder roster;
2. set pods and validate;
3. generate missing access codes;
4. run the reproducible draft draw;
5. review and lock assignments once; and
6. privately issue one access card per student.

Pod size five is preferred; two to ten is supported. The roster must contain no more than 80 students.

## Repository map

- `app/page.tsx` — public student interface and one-student lookup client
- `app/data/topics.ts` — public 80-topic volume map
- `app/data/agentInstructions.ts` — copyable agent protocol
- `facilitator-apps-script/` — auditable source for the private Sheet-bound control plane and lookup service
- `public/guides/` — complete Markdown method and publishing kit
- `public/og.png` — social preview card
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment

## Method version

The embedded agent protocol is `RMWUG-AI-1.0`. Any material change to the corpus, codebook, dataset or manuscript must preserve an explicit version history and human approval.

Educational materials are copyright Vinay Chaganti unless a file states otherwise. No additional licence is granted by publication of this repository.
