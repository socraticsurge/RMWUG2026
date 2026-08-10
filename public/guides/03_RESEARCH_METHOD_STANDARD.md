# Research Method Standard

## The binding method

Every study uses the same six-stage spine:

> **Claim → Corpus → Capture → Code → Check → Compose**

The method is designed for small, descriptive or comparative studies of public digital artifacts. It is not a shortcut for surveys, interviews, experiments, legal audits or causal research.

## Stage 1 — Claim

### 1.1 Research question

Write one question that identifies:

- the phenomenon to be observed;
- the artifact population;
- the context or sector;
- the comparison, if any; and
- the time boundary.

**Acceptable form**

> How is [observable feature] presented in [defined artifact type] among [defined organizations/category] during [collection period]?

**Weak form**

> Are companies transparent?

The weak form contains an undefined judgment and no observable unit.

### 1.2 Provisional claim and rival

Register both before collection:

- **Provisional claim:** the pattern you currently expect.
- **Plausible rival:** a different result or explanation that would also make sense.

This protects the study from becoming a search for confirming examples. The final result may support neither statement.

### 1.3 Inference ceiling

Complete this sentence:

> This design can describe or compare ______ within ______. It cannot establish ______.

The normal ceiling is a descriptive claim about the sampled artifacts. Causal effects, legal compliance, organizational intent, population prevalence and user behaviour usually exceed it.

### 1.4 Research conversation

Use three to five verified sources to establish:

1. what concept or business problem is being discussed;
2. what prior evidence or framework is relevant;
3. what the sources disagree about, leave unmeasured or treat differently; and
4. how the artifact study adds one bounded observation.

Do not cite an AI response as the authority for a substantive claim. Open and verify the underlying source.

## Stage 2 — Corpus

### 2.1 Define the artifact population

Record:

- organization or source frame;
- artifact type;
- sector/category;
- geographic boundary, if used;
- collection dates;
- inclusion and exclusion rules; and
- expected sample size.

An artifact is eligible only if the rules would have admitted it before the student knew its content.

### 2.2 Choose a defensible sampling rule

Permitted small-study strategies include:

- **complete bounded set:** every eligible artifact in a small declared frame;
- **systematic sample:** every nth eligible result after a declared ordering;
- **stratified sample:** a fixed number from predeclared categories;
- **paired sample:** matched artifact types from the same organizations;
- **time-window sample:** every eligible artifact published in a fixed short period; or
- **purposive comparative sample:** declared contrasting cases chosen for a reason that is reported.

“The first pages I found that supported my claim” is not a sampling rule.

### 2.3 Lock the corpus rule

Before bulk extraction, record:

- the search route or organization list;
- the order in which candidates will be assessed;
- the stopping rule;
- treatment of missing pages, redirects and duplicates; and
- any expected access restriction.

Do not replace an organization because its expected claim is absent. Absence is data. Replace an item only when it violates a predeclared eligibility rule, and record the exclusion.

## Stage 3 — Capture

### 3.1 Preserve provenance

For every included artifact record:

- stable artifact ID;
- exact URL;
- page or item title;
- organization/source;
- artifact type;
- retrieval date and local time;
- inclusion decision and reason;
- evidence location such as section heading or visible block; and
- local evidentiary capture if institutional policy permits it.

Recommended evidentiary captures are a print-to-PDF or screenshot stored privately with a consistent filename. Do not republish a full captured page merely because it was available publicly.

### 3.2 Capture without changing the source

- Do not log in, impersonate a user or create a transaction unless the topic and institution explicitly authorize it.
- Do not bypass robots, paywalls, access controls, CAPTCHAs or geographic restrictions.
- Do not collect private messages, personal account data or unnecessary personal information.
- Do not contact organizations or individuals as part of the workshop.
- Do not let an AI agent submit forms, accept terms, send messages or publish content.

### 3.3 Evidence excerpts

Record only the excerpt needed to justify a code. Preserve exact wording, ellipses and quotation marks. The editorial standard ordinarily limits a published excerpt from one artifact to 25 consecutive words unless permission or another clear reuse basis is documented.

## Stage 4 — Code

### 4.1 Operationalize the question

Every important concept must become an observable field. For each field define:

- field name;
- research purpose;
- allowed values;
- inclusion rule;
- exclusion rule;
- treatment of `NOT_PRESENT`, `UNCLEAR` and `NOT_APPLICABLE`;
- positive, negative and boundary examples; and
- evidence required.

Do not use a morally loaded label such as `DECEPTIVE`, `GREENWASHING`, `BIASED` or `EXPLOITATIVE` unless the study has a valid, editor-approved standard for making that determination. Prefer observable codes.

### 4.2 Pilot manually

Before asking an agent to code the corpus:

1. manually code at least three diverse artifacts;
2. ask whether two people could apply each definition consistently;
3. remove fields that cannot be observed;
4. add boundary examples; and
5. freeze a versioned codebook.

### 4.3 Use AI for proposed extraction

The agent receives:

- the research question;
- codebook version;
- one artifact at a time or an editor-approved batch;
- a strict JSON schema;
- instructions to use `UNCLEAR` rather than infer;
- an evidence excerpt and locator requirement; and
- a prohibition on completing missing facts from general knowledge.

AI output is stored as `ai_proposed_*`. It is not accepted research data until a human verifies it.

## Stage 5 — Check

### 5.1 Human acceptance

The author checks every retained row against the artifact and records one of:

- `ACCEPTED`
- `REPAIRED`
- `REJECTED`
- `ESCALATED`

The author must inspect the source itself, not merely ask a second AI model whether the first model was correct.

### 5.2 Independent check

Another student independently checks:

- all high-consequence or judgment-heavy fields;
- all evidence used in the principal finding; and
- at least 20% of ordinary rows, selected systematically.

Record agreement and disagreement. If more than 20% of the checked decisions disagree materially, pause analysis, clarify the codebook and revisit affected rows. A reliability statistic may be reported when appropriate, but a small decimal cannot repair a vague codebook.

### 5.3 Dataset lock

Before analysis:

- remove or reconcile duplicates;
- ensure included and excluded counts reconcile;
- verify denominators;
- resolve invalid values;
- preserve missing and unclear cases;
- freeze the dataset version; and
- generate a brief change log.

Analysis must not silently change the locked data.

## Stage 6 — Compose

### 6.1 Minimum analysis

Each note should normally contain:

- corpus flow: candidates → assessed → included → analysed;
- frequency or proportion for the principal code;
- one appropriate comparison, if the question requires it;
- one table or figure generated from the accepted dataset;
- at least one artifact-level evidence example;
- one plausible rival or alternative explanation; and
- one limitation connected to interpretation.

Use counts as well as percentages. With small, non-probability samples, avoid false precision and population-generalizing inferential statistics.

### 6.2 Claim ladder

Choose the lowest adequate claim:

1. **Observation:** “Seven of 16 sampled pages stated a dated target.”
2. **Sample comparison:** “Dated targets were more common in the sampled reports than on the sampled homepages.”
3. **Bounded interpretation:** “Within this paired sample, summary pages presented less temporal detail.”
4. **Population claim:** normally unsupported by this workshop design.
5. **Causal or intent claim:** prohibited unless a different approved design justifies it.

### 6.3 Manuscript traceability

Every number, quotation and substantive statement must map to one of:

- an accepted dataset field;
- a verified background source;
- a clearly labeled calculation; or
- an explicitly stated author interpretation.

## Common fallacy stops

| Risk | Stop question |
|---|---|
| Confirmation seeking | Would the corpus rule have found a contradictory artifact? |
| Cherry-picking | Were any eligible cases dropped because they weakened the story? |
| Denominator neglect | Is the count reported together with the number examined? |
| Absence fallacy | Does “not found on this page” get incorrectly rewritten as “does not exist”? |
| Causal leap | Does the verb imply that page content caused an outcome? |
| Intent attribution | Does the note claim to know what an organization meant or wanted? |
| Ecological leap | Are artifact-level patterns being used to characterize individuals? |
| False precision | Are fine decimals masking a very small or judgment-based sample? |
| Automated-authority fallacy | Is an AI label treated as correct because it is structured or confident? |
| Current-page fallacy | Is a dated capture being treated as the organization’s timeless position? |

## Required reproducibility packet

Each submission must include:

- manuscript source;
- final dataset;
- artifact register;
- codebook;
- sampling/search note;
- AI-work log;
- validation log;
- analysis calculations or script, if any;
- references; and
- README identifying versions and files.

Private evidentiary captures may be retained by the institution without public redistribution.

## Method deviations

If the method changes after the corpus lock, record:

- what changed;
- when;
- why;
- what data were already seen;
- who approved it; and
- how interpretation is affected.

Undisclosed flexibility is a larger problem than a transparent, justified correction.


