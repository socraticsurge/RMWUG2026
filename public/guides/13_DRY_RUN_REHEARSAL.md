# RMWUG 2026 dry-run rehearsal

This rehearsal uses six disposable roster identities while preserving the 80-student production setup. The private control workbook is authoritative; the public app contains no roster or access codes.

## Mock cohort

| Student ID | Roster email | Pod |
|---|---|---|
| S001 | student1@mailinator.com | P01 |
| S002 | student2@mailinator.com | P01 |
| S003 | student3@mailinator.com | P01 |
| S004 | student4@mailinator.com | P02 |
| S005 | student5@mailinator.com | P02 |
| S006 | student6@mailinator.com | P02 |

Use the protected `Dry Run Access Cards` tab to obtain each student’s code. Never paste a code into chat, email, the public repository or a shared screen.

## Important identity constraint

A Mailinator inbox is not automatically a Google Account. The assignment lookup needs only the Student ID and access code, so all six roster aliases work there. The onboarding and final-submission Forms require a signed-in Google Account; use one authorised test account for the form journey, or separately register the disposable address as a Google Account before expecting Google sign-in to work. Do not weaken the production Forms merely to accommodate disposable inboxes.

## Role switching

Keep the facilitator Sheet in the signed-in main window. Open the public app in a private/incognito window when acting as a student. This prevents the facilitator identity from making the student journey look easier than it will be in the laboratory.

For one complete rehearsal, act as S001. Use S004 to confirm that a second pod sees only its own members. Use S002 for code-rotation recovery.

## Facilitator pass

The setup sequence is:

1. Confirm `Operating mode = DRY RUN` and `Dry Run assignment state = LOCKED` in `Settings`.
2. Confirm six rows in `Dry Run Roster`, split P01/P02 as three and three.
3. Review `Dry Run Assignments`: six unique topic IDs, one locked assignment per student, one editorial section per pod.
4. Privately issue only the S001 card for the first student pass. Keep the other five cards in the facilitator Sheet.
5. Record actual evidence and PASS/FAIL/BLOCKED in the protected `Dry Run` checklist.

## Student pass: S001

1. Open the public app and choose **My study**.
2. Enter `S001` and the S001 code from its private card.
3. Confirm the researcher name, topic, research question and P01 peer list. No email or access code should remain visible.
4. Mark C1 ready, reload or move between views, then use **Forget this assignment**. Readiness is only a device aid; forgetting must clear the loaded assignment.
5. Load S001 again and open the onboarding Form. Submit at most one response, clearly marked `DRY RUN` wherever free text is available.
6. Submit one milestone checkpoint and verify that it reaches the private response tab.

## Boundary and recovery tests

- Enter S001 with one deliberately wrong code. Expect a generic denial with no clue about whether the ID or code was wrong. Do not repeat this eight times; the cooldown is itself a later test.
- Load S004 with its own card. Expect only P02 members, never P01 or email addresses.
- Rotate S002 from the owner-only control panel. The old code must fail and the new card must succeed.
- Reopen the draw using the exact confirmation `UNLOCK`. A valid student lookup must pause. Re-lock and rebuild cards before continuing.
- Submit one final-paper test from an authorised Google Account, then use the Form’s edit path. Do not create six final responses just to mimic six identities.

## What counts as a pass

The dry run passes only when:

- the public site exposes no facilitator controls, roster, emails or full assignment register;
- a valid card returns exactly one locked assignment and that pod’s names;
- an invalid or stale card returns a generic denial;
- unlocked assignments cannot be retrieved;
- milestone and final-submission evidence reaches the private workbook/Drive path; and
- the facilitator can see where a student is stuck without editing the student’s research for them.

## End of rehearsal

Do not delete rehearsal evidence impulsively. First reconcile the `Dry Run` checklist, Form response rows and audit log. When ready for the real roster:

1. set `Operating mode` to `LIVE`;
2. wait ten seconds;
3. confirm the production `Assignment state` is `NOT STARTED`;
4. replace production placeholders with the approved roster; and
5. validate before generating any real access codes.

The protected `Dry Run …` tabs may remain as an audit record. They are ignored while operating mode is `LIVE`.
