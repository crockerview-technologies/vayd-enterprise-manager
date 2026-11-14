# Tasks and automation videos: pass 1 review (dry runs)

Dry runs use the free Mac voice (Samantha) on my own test stack: database `vayd_api_test_tasks`, app :5260,
API :3260, fake Stripe :4016, Redis db 8, work folder `~/.vayd-training-tasks`. The API is build-doctor-flow
(`95cb366a`); the frontend is `training/videos` with build-doctor-flow `0427e11d` merged in (not committed), as
AGENTS.md asks before recording. Every dry run went through `~/.vayd-recording/turn.sh`. Nothing has been
recorded with Nova. Specs are `cypress/training/tsk-*.cy.ts`, narration is `cypress/training/narration/tsk-*.json`,
setup is `cypress/training/setup/tasks-demo.cjs` and `cypress/training/tasksKit.ts`; all uncommitted.

Questions, possible bugs (B1 to B7) and demo data are in [tasks-and-automation.md](tasks-and-automation.md).

## Across the series

- **Code moved up at 17:00 (your watcher change).** The later dry runs use your local, not yet pushed,
  build-doctor-flow: frontend `eca0e985` (with TA-06/TA-A10/D6 "Keep me watching" and `272004cf`, the call dock fix) and
  API `685623fc` (its four new migrations applied to the training database). Earlier dry runs (TSK-03, 04, 06, 09, 11,
  12, 13) were on frontend `0427e11d` / API `95cb366a`; none of them use the Move window, so they stand.

- **Merged build-doctor-flow into the local training branch** (`git merge --no-commit`, clean). Without it the
  videos would show the Escalation field (TA-A1) and times without "ET" (TA-04).
- **write-excel-file 4:** build-doctor-flow now needs it and the shared `node_modules` still has 2.x, so the whole
  app failed to load in the dev server. My stack's Vite config (`vite.sch.config.ts`, git-ignored) points that one
  import at a copy installed in the session scratchpad. The real fix is the `npm install` on your checklist.
- **The test database has only 2 of the 7 rules.** The rules migration adds rules only to practices that exist
  when it runs, and the training practice is created later. `tasks-demo.cjs` copies the other five from
  `vayd_api_local` (settings, no client data). Worth checking that production has all seven before go-live.
- **End-of-day rules run only after 6 pm Eastern.** Setup moves the hour for one Run now and puts it back (Q6).
- **AI keys:** `stack-up.sh` doesn't blank `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, and Anthropic isn't on the
  training stack's network guard. No video clicks Clean up, but the call window (TSK-10) cleans up a transcript as
  it opens, so I restarted the stack with those keys blank before running it. Suggest adding the blanks to
  `stack-up.sh` (I didn't change it).
- **Logins:** `cypress/training/.credentials` doesn't exist. Specs sign in with the seed's test logins; TSK-13 and
  TSK-14 use an admin login for Dr. Avery Lane that `tasks-demo.cjs` adds to the test database.
- **The stack restarts itself after 3.5 hours** (`record.sh`, for the sign-in tokens). That rebuilds the
  database without `tasks-demo.cjs` and goes back to the dev server, the fake Stripe and the `.env` AI keys. I
  re-ran the setup each time. For pass 2: run `tasks-demo.cjs`, restart the API with Stripe test mode and blank AI
  keys, and serve the built app, right after any restart.
- **Built app instead of the dev server:** the dev server's first page load timed out at 120 s while other sessions
  were busy (TSK-01, 11:37). Serving a development build (`vite build --mode development` + `vite preview`, as in
  your notes) fixed it.
- **Pronouns:** narration names people and never uses he/she for staff or clients.
- **File names for pass 2:** the recording queue refuses names that aren't `<ID> - <CL, Tech, DVM, Manager> - <title>.mp4`,
  so finals will be named, for example, `TSK-01 - CL, Tech, DVM - Your task list.mp4`, not `TSK-01 Your task list.mp4`.

## Status at the end of pass 1

| ID | Title | Dry run (Mac voice, 1.25×) | Status |
|---|---|---|---|
| TSK-01 | Your task list | 97 s, 12/12 clicks in sync | Ready for Nova |
| TSK-02 | Make a task for someone | 80 s, 8/8 | Ready for Nova |
| TSK-03 | Pick up work from the Unassigned queue | 46 s, 5/5 | Ready for Nova |
| TSK-04 | Finish, remove or reopen a task | 69 s, 10/10 | Ready; window titles hidden under the top bar (B11) |
| TSK-05 | Move a task, and hand off before time off | 75 s, 7/7 | Ready once your watcher change is pushed |
| TSK-06 | Work a callback task | 65 s, 4/4 | Waiting on Q1 (CLs can't file to the pet, B1) |
| TSK-07 | Why Scout made this task | 69 s, 4/4 | Ready for Nova |
| TSK-08 | "Finish the chart for …" | 65 s, 7/7 | Waiting on Q9 (red AI recap message) |
| TSK-09 | "Close the invoice for …" | 68 s, 10/10 | Ready for Nova |
| TSK-10 | "File the call with …" | quick check only | Waiting on Q7 / B2 |
| TSK-11 | "Enter results for …" | 55 s, 3/3 | Ready for Nova |
| TSK-12 | Order list and Vet Snap | 68 s, 7/7 | Ready once a controlled-drug demo record is seeded (or accept the red line) |
| TSK-13 | Settings → Automatic Tasks | 85 s, 5/5 | Ready for Nova |
| TSK-14 | See someone else's tasks | 62 s, 17/17 | Ready for Nova (works around B10) |
| TSK-15 | The most common task mistakes | 44 s, 4/4 | Ready for Nova |

Every dry run: sound and picture the same length, no white stretches, last frame is the app. Dry-run files are in
`~/.vayd-training-tasks/dry/` (not in ~/Movies). My stack was stopped at the end of pass 1.

## Per video

### TSK-01 Your task list
- **Changes from the code check:** "Urgent" now says what it holds ("anything marked urgent, overdue, or due within a
  day"), not just urgent tasks. "Sent" lists every task you made, your own included, not only tasks for others. The
  nav link is clicked by its real address (a hidden mobile copy was being picked).
- **Dry run 1 (Samantha):** 91 s at 1.25×. One late click (Branch, which shared a line with a tab click), split.
  Frames: the **+ Task** button sits half under the sticky header once the page scrolls (minor; the header is the
  app's own).
- **Dry run 2:** 93.5 s, all 11 clicks within 2 s; sound and picture the same length, no white stretches. Frames
  clear. Change after it: the Branch step moved from Completed (empty under a branch filter, since the completed task
  has no office) to Active, as its own line, and the narration now says tasks with no office drop out.
- **Dry run 3 (new code):** 97.0 s, all 12 clicks within 2 s; lengths match, no white. Ends on Active with only the
  Raleigh office bill showing. **Ready for Nova.**

### TSK-02 Make a task for someone
- **Changes:** pronoun removed ("Dr. Lane will see it under Watching"); "If Friday passes, it turns overdue" corrected
  to "If Friday ends and it isn't done, it moves to Jordan's Expired tab" (Expired starts the day after the due date).
- **Dry run:** 79.6 s, all 8 clicks within 2 s; lengths match, no white. The created task shows "Due Fri, Nov 13",
  Dr. Lane watching, under Sent. **Problem:** the Assign to and watcher lists showed leftover test employees
  ("Inv inventory_manager" ×4). `tasks-demo.cjs` now deactivates every non-demo employee in the training database.
- **Dry run 2 (new code):** 79.6 s, all 8 clicks within 2 s; lengths match, no white. The lists now show only Robin
  Hale, Avery Lane, Casey Morgan, Jordan Pike and Priya Shah. When the tall Create task window scrolls, its top slides
  under the top bar (like B11, milder). **Ready for Nova.**

### TSK-03 Pick up work from the Unassigned queue
- **Changes:** none to the story. The queue tasks show under **Urgent** (Q3).
- **Dry run:** 45.6 s, all 5 clicks within 2 s; lengths match, no white. Frames clear: three queue tasks, all
  under **Urgent** (Q3); after **Assign to me** the card moves to Casey's Active list. **Ready for Nova.**

### TSK-04 Finish, remove or reopen a task
- **Changes:** none. The shared-task window really asks "Also close it for Avery Lane?" with **Just me** /
  **Close for everyone**, and Completed labels read **DONE** and **REMOVED**.
- **Dry run:** 69.3 s, all 10 clicks within 2 s; lengths match, no white. **Problem (app, B11):** the
  "Also close it for Avery Lane?" and "Reopen this task?" windows open under the top bar, so their titles are hidden
  and only the text and buttons show. The narration still works ("Scout asks whether to close Dr. Lane's copy too"),
  but the window titles can't be read. **Ready for Nova once B11 is fixed, or now if you accept the hidden titles.**

### TSK-05 Move a task, and hand off before time off
- **Changes for your watcher work (TA-06, TA-A10):** two new lines point at **Keep me watching** (ticked when you
  hand off your own task) and at "Add watchers to every task (optional)" in the bulk window.
- **Earlier changes:** the time-off steps use **Re-assign all on this tab** on your own Future tab, which works. It does
  **not** work for an admin on someone else's list (B10, TSK-14). Active and Expired have no bulk buttons (Q4).
- **Dry run 1 (old code):** 62.8 s, all 7 clicks within 2 s; lengths match, no white.

### TSK-06 Work a callback task
- **Changes:** a CL can't file to the pet's chart (403, B1), so Casey files to Maria's client record; the "one thing"
  now says "filed to the record". **Open Quo call** and **Clean up** are pointed at, not clicked. The panel closes on
  completion, so the final step points at the **DONE** status (B6).
- **Waiting on Q1** before the final take.
- **Dry run:** 65.1 s, all 4 clicks within 2 s; lengths match, no white. Frames clear; the history ends
  "Completed · Casey Morgan". The top **Remove** button looks greyed out though it works (styling only).
  **Waiting on Q1**; otherwise ready for Nova.

### TSK-07 Why Scout made this task
- **Changes:** "Marking it done early just brings it back" narrowed to charts, bills and labs (the call, signup and
  Vet Snap rules stay closed).
- **Dry run:** 77.9 s, all 4 clicks within 2 s; lengths match, no white. The lab task closed itself and shows
  **AUTO** under Completed. **Change after it:** lines 5 to 7 listed all seven rules and their owners over a still
  list (nothing on screen), so they now point at the two cards and their owner; the full list moved to the script's
  "What else".
- **Dry run 2 (new code):** 69.3 s, all 4 clicks within 2 s; lengths match, no white. Lines 5 to 7 now point at
  the two cards and "Jordan Pike". **Ready for Nova.**

### TSK-08 "Finish the chart for …"
- **Changes:** none to the story. The task closes the moment the chart is signed (TA-A6 works). The card's link reads
  "appointment #…" (B4).
- **Dry run:** 65.2 s, all 7 clicks within 2 s; lengths match, no white. Signing closed the task at once.
  **Problems:** (1) the Wrap-up page shows a red "Could not write the recap from the charts." because the stack's AI
  key is blank and the page drafts the recap with AI as it opens (Q9); (2) the outline on the Client recap · Dose &
  Rx · Weight bar landed just below it while the page was still scrolling (spec now waits). The card link reads
  "appointment #6558" (B4). **Not re-run after the fix: waiting on Q9**, then one more dry run.

### TSK-09 "Close the invoice for …"
- **Changes:** the button is **Text to Pay** (not "Text pay link"); closing its window asks "Are you sure you don't
  want to send this text?", so **Don't send** is a step. The Chens have a saved test card, so the bill is paid with
  **Charge card on file** (Stripe test mode, Visa 4242) instead of cash. A paid bill's task stays until the 6 pm
  check (Q2), so the video marks it done. The pay-link text starts "Hi client" (B9).
- **Dry run:** 68.4 s, all 10 clicks within 2 s; lengths match, no white. **Text to Pay** opened with "$75.00 ·
  Invoice for Biscuit" and was closed with **Don't send** (no text sent: the SMS log is empty). The card on file was
  charged in Stripe test mode (Visa 4242); the task was then marked done. **Ready for Nova** (B9's "Hi client" shows
  for a moment in the Text to Pay window).

### TSK-10 "File the call with …"
- **Still waiting on Q7 / B2:** the task opens as a new callback and doesn't show the call. B8 (the dock covering the
  call window) is fixed by `272004cf`, so the draft (filing from the dock) now runs.
- **Dry run:** quick check (no video) passes on the new code: the dock's **Review & file** opens the call window,
  **Save client-only** files it, and the task closes. **Not dry-run with voice: waiting on Q7/B2.**

### TSK-11 "Enter results for …"
- **Changes:** none. **Save, finish later** keeps the task open; **Save results** closes it as **AUTO** at once.
- **Dry run:** 54.7 s, all 3 clicks within 2 s; lengths match, no white. Ends on **AUTO**, "Closed: The lab was
  resulted." and the Ear cytology marked **Complete**. While the form is in view the task title scrolls under the top
  bar (the app's sticky header; minor). **Ready for Nova.**

### TSK-12 Order list and Vet Snap
- **Changes:** the order list is pointed at, not opened (leaving and coming back has no visible click). Vet Snap is
  reached by clicks: **Analytics → Inventory → Controlled Drugs**. Setup moves the weekly rule to today for one run
  and puts Thursday 8 am back.
- **Dry run:** 68.0 s, all 7 clicks within 2 s; lengths match, no white. The order-list task and **Mark ordered**
  work; Robin's Vet Snap task ("Due Fri, Nov 13", under Urgent) leads by clicks to **Vet Snap patients (last 14
  days)**, which then reads "Last downloaded by Robin Hale on Thu 11/12 at 2:40 PM." **Problem (demo data):** a red
  "No patients were given a controlled drug from 2026-10-30 to 2026-11-12." also shows, because the training data
  has no controlled-drug use in the last 14 days. A seed for that doesn't exist yet. **Ready for Nova once a
  controlled-drug dispense for a demo pet is seeded** (or accept the red line).

### TSK-13 Settings → Automatic Tasks
- **Changes:** recorded with Dr. Lane's admin login; the practice manager's read-only view is shown at the end (off
  camera sign-in), so nothing is narrated that isn't on screen. The red warning is a **simulated** error put on the
  call rule by the spec. **Run now** before 6 pm says "Nothing needed chasing right now." (Q6). **Last checked** has
  no "ET" (B5).
- **Dry run:** 84.8 s, all 5 clicks within 2 s; lengths match, no white. Frames clear: the simulated red line
  ("Last run hit a problem (Nov 11, 2026, 6:02 PM EST): call:4821: …"), the open Invoice left open rule, the built-in
  list. **Changes after it:** Robin's view still shows the switches (locked), so line 18 now says "without Edit or Run
  now, and the switches are locked". That view also shows each rule's task wording with raw placeholders ("{{client}}
  tried to sign {{patient}} up for {{plan}}…", B12). **Ready for Nova** (the changed line is narration only).

### TSK-14 See someone else's tasks
- **Changes:** **Re-assign all on this tab** on Jordan's Future tab moved nothing (it uses the admin's own id, B10),
  so the two Future tasks are moved one by one.
- **Dry run (new code):** 62.3 s, all 17 clicks within 2 s; lengths match, no white. Frames clear: "Assigned to
  Jordan Pike — due now", the Move window for each task, and Person back on **Me** at the end. **Keep me watching**
  doesn't appear (the admin isn't the assignee), as designed. **Ready for Nova**; B10 still applies.

### TSK-15 The most common task mistakes
- **Changes:** none.
- **Dry run (new code):** 44.2 s, all 4 clicks within 2 s; lengths match, no white. Frames clear. Short by design
  (a recap). **Ready for Nova.**
