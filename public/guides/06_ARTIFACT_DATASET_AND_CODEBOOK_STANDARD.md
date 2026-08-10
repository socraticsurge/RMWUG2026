# Artifact Dataset and Codebook Standard

## Purpose

This standard keeps 80 different studies interoperable without forcing them to ask the same question. Every dataset contains a common evidence and accountability layer plus a small topic-specific analytical layer.

## Default unit of analysis

> One declared organization/source × one eligible artifact.

Do not switch between page, claim, organization, image and sentence as if they were the same unit. If the topic genuinely requires a different unit, the student must define it at Checkpoint 3 and obtain approval.

## Required dataset files

Each student submits:

1. `STUDENTID_artifact_register.csv`
2. `STUDENTID_analysis_dataset.csv`
3. `STUDENTID_codebook.md`
4. `STUDENTID_validation_log.csv`
5. `STUDENTID_ai_log.md`

The artifact register records everything assessed. The analysis dataset contains only included rows, while retaining `NOT_PRESENT`, `UNCLEAR` and `NOT_APPLICABLE` where those are legitimate values.

## Common artifact-register fields

| Field | Type/allowed values | Definition |
|---|---|---|
| `study_id` | Text | Assigned paper ID, such as `PV01-S07`. |
| `artifact_id` | Text | Stable local ID, never recycled. |
| `candidate_order` | Integer | Order in which the candidate was assessed. |
| `organization` | Text | Organization or public source responsible for the artifact. |
| `sector` | Controlled text | Predeclared sector/category. |
| `artifact_type` | Controlled text | Product page, policy, pricing page, job advertisement, campaign image, etc. |
| `title` | Text | Visible artifact/page title. |
| `url` | URL | Exact public URL used. |
| `retrieved_at` | ISO 8601 datetime | Date, time and time-zone offset. |
| `eligibility` | `INCLUDED`, `EXCLUDED`, `INACCESSIBLE`, `DUPLICATE` | Corpus decision. |
| `eligibility_reason` | Controlled text + note | Rule that explains the decision. |
| `evidence_locator` | Text | Heading, paragraph, card, image region or other reproducible location. |
| `capture_file` | Text or blank | Private local capture filename, if permitted. |
| `notes` | Text | Access, change, ambiguity or other provenance note. |

## Common analysis-dataset fields

| Field | Type/allowed values | Definition |
|---|---|---|
| `study_id` | Text | Paper ID. |
| `artifact_id` | Text | Foreign key to artifact register. |
| `primary_code` | Topic-specific controlled value | Main analytical classification. |
| `claim_present` | `YES`, `NO`, `UNCLEAR`, `NOT_APPLICABLE` | Whether the predeclared focal feature appears. |
| `evidence_excerpt` | Text | Short exact excerpt supporting the code. |
| `evidence_locator` | Text | Location in artifact. |
| `ai_proposed_primary_code` | Controlled value | Agent’s original proposal. |
| `ai_proposed_excerpt` | Text | Agent-proposed supporting excerpt. |
| `author_decision` | `ACCEPTED`, `REPAIRED`, `REJECTED`, `ESCALATED` | Human treatment of AI proposal. |
| `accepted_primary_code` | Controlled value | Human-accepted analytical value. |
| `author_note` | Text | Reason for repair, rejection or ambiguity. |
| `reviewer_id` | Text or blank | Independent checker. |
| `review_status` | `AGREE`, `DISAGREE_RESOLVED`, `DISAGREE_OPEN`, `NOT_CHECKED` | Independent review result. |
| `codebook_version` | Text | Version used for final acceptance. |
| `dataset_version` | Text | Frozen data release identifier. |

The agent’s proposal must never overwrite the human-accepted field.

## Missingness vocabulary

- `NOT_PRESENT`: the eligible artifact was available and the focal feature was not found under the protocol.
- `UNCLEAR`: evidence existed but did not support a reliable decision.
- `NOT_APPLICABLE`: the field does not logically apply to that artifact.
- Blank/null: permitted only when the workflow has not yet completed or the field definition explicitly allows it.

Do not replace these categories with zero unless zero is truly a numerical measurement.

## Topic-specific analytical fields

Use five to eight fields beyond the common layer. Each field must materially help answer the question.

A strong topic-specific field is:

- observable in the artifact;
- mutually exclusive where categories are intended to be exclusive;
- defined independently of the hoped-for result;
- small enough for consistent manual review; and
- supported by a stored evidence location.

Avoid fields that ask the coder to diagnose intent, effectiveness, honesty, fairness or compliance without a defensible external standard.

## Codebook entry template

```markdown
### field_name

- Research purpose:
- Data type:
- Allowed values:
- Include when:
- Exclude when:
- NOT_PRESENT means:
- UNCLEAR means:
- NOT_APPLICABLE means:
- Evidence required:
- Positive example:
- Negative example:
- Boundary example:
- Common confusion:
```

## Codebook versioning

Use semantic labels appropriate to the workshop:

- `0.1-pilot`: initial manual pilot;
- `0.2-revised`: repaired after pilot;
- `1.0-locked`: used for the accepted dataset;
- `1.1-correction`: clarification that does not change the construct; or
- `2.0-recode`: material change requiring affected rows to be recoded.

Record the effective date, author and change in a codebook change log.

## Pilot test

Pilot at least three artifacts chosen to expose variation:

1. one likely positive case;
2. one likely negative case; and
3. one ambiguous or boundary case.

For each field ask:

- Could a second student reproduce the decision?
- Does the field require knowledge not present in the artifact?
- Does the evidence excerpt actually entail the code?
- Is the agent using general knowledge to fill a gap?
- Are allowed values exhaustive enough to retain uncertainty?

Do not scale a broken schema across the corpus.

## Validation design

The author validates 100% of retained rows. An independent reviewer checks:

- 100% of rows supporting the main finding;
- 100% of judgment-heavy fields; and
- at least 20% of remaining rows selected systematically.

The validation log records artifact ID, field, agent value, author value, reviewer value, final value, reason and resolver.

## Dataset quality checks

Before locking:

- [ ] Artifact IDs are unique.
- [ ] Every analysis row maps to one included artifact-register row.
- [ ] Candidate, excluded, inaccessible, duplicate and included counts reconcile.
- [ ] Every accepted categorical code is allowed by the locked codebook.
- [ ] Every finding-bearing code has an evidence excerpt and locator.
- [ ] AI proposals and accepted values remain separate.
- [ ] Missingness uses the controlled vocabulary.
- [ ] Percentages use the correct denominator.
- [ ] Derived variables can be reconstructed.
- [ ] The dataset contains no unnecessary personal or confidential information.
- [ ] Dataset version and codebook version are recorded.

## Data release classes

Classify each file before publication:

| Class | Treatment |
|---|---|
| Public metadata and codes | May be considered for release after editorial review. |
| Short evidence excerpts | Release only within copyright and editorial limits. |
| Screenshots or page captures | Private by default; publish only with permission or clear reuse basis. |
| Personal data | Exclude unless specifically approved and lawfully handled. |
| Confidential or account-only data | Prohibited in this workshop. |

The volume may publish an artifact register without redistributing captured copies of the source pages.


