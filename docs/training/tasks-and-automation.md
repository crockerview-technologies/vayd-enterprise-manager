# Tasks and automation videos: questions, possible bugs and demo data

Scripts: [scripts/tasks-and-automation/](scripts/tasks-and-automation/README.md). Dry-run notes per video:
[tasks-and-automation-review-pass1.md](tasks-and-automation-review-pass1.md).

Checked on Nov 12, 2026 against build-doctor-flow, merged (uncommitted) into a local `training/tasks-scripts` branch
made from `training/videos`, on the test database `vayd_api_test_tasks`: first frontend `0427e11d` / API `95cb366a`,
then from 17:00 your local, not yet pushed, frontend `578f710a` / API `685623fc` (TA-06/TA-A10 watcher change and the call
dock fix).

## Approval

The owner approved all fifteen videos (TSK-01 to TSK-15) on Nov 12, 2026. Each is **approved**; status after the
dry runs is in the review file.

## Questions for the owner

| # | Question | Recommendation |
|---|---|---|
| Q1 | **Who files a callback to the pet's chart?** Filing a callback to a pet signs a medical note, which since EMR-07 only a vet or licensed tech may do. A client liaison who clicks **Chart & complete** with the pet ticked gets "Request failed with status code 403" (B1). CLs get most callbacks. Should a CL's callback go on the pet's chart, or on the client's record? | Let callback and call notes from any staff go on the pet's chart as a **communication note** (not a signed medical note), the way the client record already takes them. Until then, TSK-06 teaches CLs to file to the client record. |
| Q2 | **Should paying a bill close its "Close the invoice" task straight away?** Today the task stays until the next 6 pm check, so staff see a paid bill's task all day. Charts and calls now close at once (TA-A6). | Yes, close it on payment like charts and calls. Until then TSK-09 says "click Mark done; if you forget, Scout closes it at the next six p.m. check." |
| Q3 | **Should every unassigned task show as Urgent?** The list puts any open, unassigned task in **Urgent**, so the whole Unassigned tab is urgent. | Only urgent-priority or due-soon tasks. TSK-01 and TSK-03 don't claim otherwise; the script says "anything marked urgent, overdue, or due within a day". |
| Q4 | **Bulk re-assign only works on Future.** Before time off, Active and Expired tasks have to be moved one by one. Is that enough? | Add the same two buttons to Active and Expired. TSK-05 teaches Future plus Move. |
| Q5 | **Should practice managers (not admins) be able to open someone else's list?** **Person** shows only for admin logins, so Robin can't cover for a sick tech. | Give practice managers **Person** for their branch. TSK-14 is recorded with an admin login. |
| Q6 | **Run now before 6 pm does nothing for charts, bills, calls and labs.** End-of-day rules run only after their hour, once a day. A manager testing a rule mid-morning sees "Nothing needed chasing right now." | Keep it (it avoids a second batch the same day), but say so on the button: "End-of-day rules wait for their hour". TSK-13 narrates it. |
| Q7 | **TSK-10 (call not filed) can't be recorded as planned:** the task opens like a new callback ("Call the client", **Open Quo call**, an empty transcript box) instead of showing the call that needs filing (B2). Record a version that files the call from the call dock, or wait for the task to show the call? | Wait for the fix; it's the highest-volume automatic task (about 1,150 calls a month). |
| Q9 | **AI on the training stack.** The Wrap-up page drafts the client recap with AI as it opens. With the AI keys blank (your rule for test stacks), TSK-08 shows a red "Could not write the recap from the charts." on camera. Allow the Anthropic key for that one take (only the demo chart text is sent), or record with the red line? | Allow it for TSK-08 only; the recap is then drafted, and **Don't email** still skips sending. |
| Q8 | **Lengths.** TSK-01 runs about 1½ minutes at 1.25×, under the 2-minute target; most of the series is 1 to 2 minutes. Pad with more examples, or keep them short? | Keep them short; each covers one task fully. |

## Possible bugs (not fixed)

| # | What I did | What happened | Expected | Screenshot | In a test plan? |
|---|---|---|---|---|---|
| B1 | As Casey (CL), opened a callback linked to Maple and clicked **Chart & complete** (Maple ticked). | "Request failed with status code 403". The note is created before the signing step fails, so a **draft "Callback — How is Maple's leg?" note is left on Maple's chart** each try. | Either the note files, or the button says a CL can't file to a pet, before anything is written. | — (reproduced 3 times; the stray drafts were in `scout_chart_notes`) | No. Side effect of EMR-07 (signing rules) on `CallbackJotPanel.tsx` `fileNote()` → `POST /scout-chart/notes/:id/finalize`. |
| B2 | Opened "File the call with Maria Rivera" (the Call not filed rule). | The task opens as a callback: "Call the client", **Open Quo call**, an empty transcript box. Nothing links to, or shows, the call that needs filing; the task links only to the client. | The task shows the transcript with **File to chart** / **Don't file**, like the call dock. | `~/.vayd-training-tasks/review/b2-call-task.jpg` | Not as such. tasks-and-automation.md has the rule's backlog fixes (TA-01) and close-on-file (TA-A6), not the screen. |
| B3 | Opened any automatic task. | A grey pill reads **trigger** (the internal source name) next to the kind label. | No pill, or "Automatic". | `b2-call-task.jpg` | No. `PimsTaskDetailView.tsx` shows `task.source` as is. |
| B4 | Opened "Finish the chart for Maple". | **Linked:** shows "appointment #6563" on the card and in Linked records. | "Visit Nov 11" or the visit's reason. | `~/.vayd-training-tasks/review/b4-appointment-link.jpg` | No. |
| B5 | Opened Settings → Automatic Tasks → **Edit**. | **Last checked** uses the computer's own time zone and has no "ET", unlike every other time on the page (D2). | "Last checked Nov 12, 6:00 pm ET." | — | Leftover from TA-04 (D2). |
| B6 | Clicked **Chart & complete** on a callback. | The panel closes as the task completes, so its "Call filed to … and the callback is done." message is never seen. | The confirmation shows. | — | No. Cosmetic. |
| B7 | Robin's **Unassigned** tab once read **Unassigned (1)** with an empty list. | Not repeated: TSK-03's runs loaded the queue each time. | — | `~/.vayd-training-tasks/review/b7-unassigned-count.jpg` | No. Watch for it. |
| B8 (**fixed** by `272004cf`, Nov 12) | As Casey, clicked **Review & file** on the call dock. | The call window opens, but the dock stays on top of it and covers the middle, including **Save to**; clicking a choice there hits the dock. | The dock hides, or sits behind the window, while the window is open. | `~/.vayd-training-tasks/review/b8-dock-covers-call-window.jpg` | No. `MyCallIndicator`/`CallDock` vs `ClientCallPill`'s `pims-chart-pick--call`. |
| B9 | On "Close the invoice for Tom Chen", clicked **Text to Pay**. | The message reads "Hi client, here is a secure link to pay $75.00 for Invoice for Biscuit…", with **Fill names when inserting** ticked. | "Hi Tom, …" | `~/.vayd-training-tasks/review/b9-hi-client.jpg` | No (invoicing plan covers pay links, not this greeting). |
| B11 | Clicked **Mark done** on a shared task; later **Reopen** on a done task. | The "Also close it for …?" and "Reopen this task?" windows open 60 px from the top, under the top bar (their backdrop is z-index 90; the bar sits above it), so the window title is hidden. | The window opens below the top bar, title visible. | `~/.vayd-training-tasks/review/b11-prompts-under-top-bar.jpg` | No. `SharedTaskPrompts.css`. |
| B12 | Opened Settings → Automatic Tasks as Robin (practice manager, read-only). | Under each rule, its task wording shows the raw template: "{{client}} tried to sign {{patient}} up for {{plan}} and it didn't go through…". | Plain wording, or "Client, Pet and Plan are filled in". | `~/.vayd-training-tasks/review/b12-raw-placeholders.jpg` | No. Cosmetic. |
| B10 | As an admin, chose **Person: Jordan Pike**, opened **Future**, clicked **Re-assign all on this tab**, picked Robin Hale, **Save**. | The window closed as if saved; both tasks stayed Jordan's. The window always moves tasks from the signed-in person (`fromEmployeeId: myEmployeeId` in `PimsTasksPage.tsx`), so it found none of the admin's to move. | Jordan's Future tasks go to Robin; or the buttons hide when viewing someone else. | — | No. Matters for sick-day cover (TSK-14). |

## Screens that look half-built or likely to change

- **The call task (TSK-10):** see B2. Don't record it until the task shows the call (B8, the dock covering the call window, is fixed).
- **The Move window (TSK-05):** your TA-06/TA-A10 change (not pushed yet) added **Keep me watching** and bulk watchers; TSK-05 now shows both. Record it only after that change is on build-doctor-flow's origin.
- **Callback filing for CLs (TSK-06):** see B1 and Q1. The recorded version will change once Q1 is answered.
- **The "trigger" pill and "appointment #…" links (B3, B4):** small, but in almost every automatic-task video. Fixing them first avoids re-recording TSK-07 to TSK-11.

## Demo data

| Video | Needs | Seed |
|---|---|---|
| All | The five rules production has but a fresh test database lacks (chart, invoice, order list, call, lab); Medical Director and Lead Client Liaison roles; Jordan Pike as the Raleigh office's Inventory Manager; Dr. Avery Lane as Medical Director and an admin login for Dr. Lane | **New:** `cypress/training/setup/tasks-demo.cjs` (run once after `stack-up.sh`) |
| All | A clean slate: no tasks; no open bills, drafts, pending labs or unfiled calls left by other test runs; only the demo staff holding the manager roles | **New:** `resetTasksWorld()` in `cypress/training/tasksKit.ts` |
| TSK-01 to TSK-06, TSK-14, TSK-15 | Manual tasks for Casey, Jordan and the queues | Made in each spec (`makeTask`) |
| TSK-07, TSK-09, TSK-11, TSK-15 | An open bill charged yesterday (by Casey or Jordan); an Ear cytology charge for the lab task | `openBill()` in each spec, then `runRules()` |
| TSK-08 | Yesterday's visit for Maple with a charted, unsigned SOAP | `draftChart()` in the spec |
| TSK-10 | An unfiled, transcribed Quo call from Casey to Maria yesterday | `unfiledCall()` |
| TSK-12 | 4 × Mometamax otic on the Raleigh office order list (3 hours old); the weekly Vet Snap rule | `orderListItem()`; `runRules()` moves the Vet Snap rule to today for the run and back |
| TSK-12 | A controlled drug given to a demo pet in the last 14 days, so the Vet Snap file isn't empty | **Missing.** Without it the page says "No patients were given a controlled drug…" in red |
| TSK-13 | A sample error on the call rule (simulated) | Set in the spec |

**How the rules run in setup:** end-of-day rules only run after 6 pm Eastern, once a day, so `runRules()` sets their hour to midnight for one **Run now** and puts 6 pm back. The tasks are the same ones the 6 pm check makes.

**Not in the training stack:** texts (no SMS key, so **Text to Pay** is opened, not sent), Quo (**Open Quo call** is pointed at, not clicked), and AI **Clean up** (pointed at, not clicked; the stack doesn't blank the Anthropic key, see the review file).

## Owner answers (Nov 12, 2026)

- **Questions:** Q1 yes (CL callbacks file to the pet's chart as a communication note). Q7 wait for the B2 fix before recording TSK-10. Q9 use the AI key for the TSK-08 take only. Q2, Q3, Q4, Q5, Q6 and Q8: go with the recommendation.
- **Bugs to fix:** B1, B2, B3, B4, B5 (Eastern with "ET"), B6 (show the confirmation after the panel closes), B9, B10, B11, B12 (fill sample names). B7: investigate, fix only if the cause is found. B8 already fixed.
- **Code fixes from the answers:** Q2 (paying a bill closes its task), Q3 (Urgent only for urgent, overdue or due within a day), Q4 (bulk buttons on Active and Expired), Q5 (Person box for practice managers, own branch), Q6 (note by Run now: "End-of-day rules wait for their hour").
