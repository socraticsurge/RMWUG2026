# RMWUG 2026

The public workshop operating system for **Research Methods by Vinay Chaganti**, at **St Mary's, Hyderabad**.

The workshop is designed to produce 80 individually authored, artifact-based Commerce research papers. Students share one methodological spine and work in adjustable peer-review pods, while each student receives a unique study from an eight-section topic bank.

## What the app does

- gives students their study question, pod and seven research checkpoints;
- provides stage-specific AI-agent work orders and safety instructions;
- lets the facilitator import a roster and adjust pod sizes;
- performs a seeded, reproducible one-click topic assignment;
- guarantees unique topics and keeps each pod within one editorial section;
- exports the assignment register as CSV;
- links students to private Google Forms for details, milestones and final submission; and
- publishes the complete method, workbook and editorial standards as Markdown.

## Privacy boundary

This repository and GitHub Pages site are public. **Do not commit the real student roster, email addresses, milestone responses, datasets or manuscripts.** The included roster uses deliberately invalid placeholder addresses. Google Forms, Sheets and Drive are the private record layer.

Browser storage is used only for facilitator setup convenience and students' local readiness marks; it is not an authoritative workshop record.

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

## Roster format

Import a UTF-8 CSV with these headers:

```csv
student_id,name,email
S001,Student Name,student@example.edu
```

The roster must contain no more than 80 students. Topic assignment happens only after the facilitator has reviewed the pod plan.

## Repository map

- `app/page.tsx` — student and facilitator interface
- `app/data/topics.ts` — 80-topic bank used by the assignment engine
- `app/data/agentInstructions.ts` — copyable agent protocol
- `public/guides/` — complete Markdown method and publishing kit
- `public/og.png` — social preview card
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment

## Method version

The embedded agent protocol is `RMWUG-AI-1.0`. Any material change to the corpus, codebook, dataset or manuscript must preserve an explicit version history and human approval.

Educational materials are copyright Vinay Chaganti unless a file states otherwise. No additional licence is granted by publication of this repository.
