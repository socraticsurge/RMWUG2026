# LaTeX Compilation Specification

## Design objective

Students conduct research and write into a controlled template. They do not design the volume, modify the document preamble or spend workshop time debugging LaTeX packages.

The compilation system must produce both:

- a standalone proof for each accepted note; and
- one master proceedings volume with common front matter, sections and bibliography.

## Submission directory

```text
submissions/
  STUDENTID_STUDYID/
    README.md
    metadata.yaml
    manuscript.tex
    references.bib
    figures/
      STUDENTID_fig01.pdf
    tables/
      STUDENTID_tab01.tex
    data/
      STUDENTID_artifact_register.csv
      STUDENTID_analysis_dataset.csv
      STUDENTID_codebook.md
      STUDENTID_validation_log.csv
      STUDENTID_ai_log.md
```

Private captures must be stored outside the public submission tree.

## File naming

- Use lowercase or the prescribed uppercase ID format consistently.
- Use only letters, numbers, hyphens and underscores.
- Do not use spaces, parentheses or version words such as `final-final`.
- Put the version in metadata or version control, not in every filename.
- Artifact IDs and manuscript study IDs must match the central register.

## Metadata contract

The editorial system should collect at least:

```yaml
study_id: "PV01-S07"
topic_id: "PV01"
section_id: "I"
title: ""
short_title: ""
author_name: ""
student_id: ""
affiliation: ""
orcid: ""
email_private: ""
keywords: []
manuscript_version: "0.9"
dataset_version: "1.0"
codebook_version: "1.0"
word_count: 0
author_approved: false
publication_consent: false
licence_choice: "PENDING_EDITORIAL_DECISION"
```

Email and student ID are editorial metadata and should not appear in the public PDF unless explicitly approved.

## Student manuscript contract

Students submit body content only. The editor owns the class, package, typography, headers, page geometry and bibliography configuration.

Recommended manuscript skeleton:

```latex
\researchnotemetadata
  {STUDY-ID}
  {Full title in sentence case}
  {Author publication name}
  {Approved affiliation}

\begin{abstract}
Question, corpus, method, principal result and boundary in 60--90 words.
\end{abstract}

\section{Introduction}

\section{Method}

\section{Results}

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\linewidth]{figures/STUDENTID_fig01.pdf}
  \caption{A self-contained caption identifying the analysed sample and denominator.}
  \label{fig:STUDYID-main}
\end{figure}

\section{Discussion}

\section{Limitations}

\section*{Declarations}
\aidisclosure{...}
\dataavailability{...}
\conflictstatement{...}
\contributorstatement{...}
\accountabilitystatement{...}

\printresearchnotereferences
```

Exact commands may change when the master template is implemented; the editor’s distributed template is authoritative.

## Prohibited student changes

Students must not:

- add `\documentclass` or `\begin{document}`;
- load packages;
- define global commands or alter counters;
- change margins, fonts, spacing, headers or colors;
- use raw negative spacing to force layout;
- embed scripts, shell escapes or external network dependencies;
- use absolute filesystem paths;
- include unapproved full-page screenshots; or
- paste generated LaTeX without compiling and inspecting it.

## Safe text rules

Escape LaTeX-sensitive characters in ordinary text:

| Character | Use |
|---|---|
| `&` | `\&` |
| `%` | `\%` |
| `$` | `\$` |
| `#` | `\#` |
| `_` | `\_` outside approved identifiers/commands |

Use proper quotation marks through the house template. Do not manually type repeated spaces for alignment.

## Citations and bibliography

- Use editor-approved citation commands and central keys, normally `\parencite{key}` and `\textcite{key}`.
- Do not type a reference manually into the prose and also add it to the bibliography.
- Do not use raw URLs as citation substitutes when a source record exists.
- Preserve DOI as a DOI field where available.
- The editorial merge must deduplicate common sources.
- Unresolved citation keys are build failures.

## Tables

- Use `booktabs`-style horizontal rules through the provided template.
- Do not use vertical rules.
- Put exact values and denominators in the table.
- Keep the principal table to the final text width.
- Do not shrink text below the house minimum to force a wide table.
- If the table cannot fit, simplify fields or move detail to the public dataset.
- Generated table source must map to the locked dataset version.

## Figures

- Prefer vector PDF for charts; use high-resolution PNG when raster output is necessary.
- Design for grayscale and color-vision accessibility.
- Do not rely on color alone; use direct labels or distinguishable patterns.
- Keep text legible at final width.
- Captions state the sample and define abbreviations.
- Decorative AI-generated images are not research figures.
- Image rights and provenance must be recorded.

## Labels and cross-references

Use globally unique labels:

```text
fig:STUDYID-main
tab:STUDYID-main
sec:STUDYID-method
```

Duplicate labels are build failures.

## Compilation stages

1. Validate submission manifest and metadata.
2. Scan for prohibited commands and unsafe paths.
3. Validate bibliography keys and required declarations.
4. Compile standalone note proof.
5. Check overfull/underfull boxes and missing references.
6. Render and visually inspect every proof page.
7. Obtain author corrections and approval.
8. Merge accepted notes into section masters.
9. Compile and inspect the full v0.9 volume.
10. Run editorial and release checks before v1.0.

## Build failures versus editorial warnings

### Build failures

- TeX compilation error
- unresolved reference/citation
- missing figure/table file
- duplicate global label
- prohibited command/package
- missing required metadata/declaration
- file outside the submission tree

### Editorial warnings

- overfull or visibly crowded box
- table/figure unreadable at final size
- excessive quotation
- non-house heading or caption style
- word count outside range
- metadata conflict
- citation exists but lacks verified canonical information

A PDF that compiles is not automatically acceptable.

## Master volume contract

The master controls:

- title and copyright pages;
- table of contents;
- foreword, introduction and common method;
- eight section openings;
- running headers and page numbering;
- contributor and topic index;
- shared bibliography strategy;
- licence, AI-policy and correction pages; and
- version/DOI metadata.

Students may correct their note; they may not alter another note or the master without editorial authority.

## Required visual QA

Inspect every page of:

- each standalone proof;
- each section compilation; and
- the final master.

Check clipped text, orphaned headings, broken URLs, misplaced floats, empty pages, unreadable captions, inconsistent author names and incorrect section order.

## Archival outputs

For each released version preserve:

- master source and exact dependencies;
- compiled PDF;
- bibliography;
- accepted submission packages;
- build log;
- editorial decision log;
- checksum manifest; and
- release metadata.

The public repository may omit private correspondence, personal metadata and restricted evidence captures.


