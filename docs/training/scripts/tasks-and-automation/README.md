# Tasks and automation training videos

Scripts for the Scout go-live series on tasks and automatic tasks. Each video is 2 to 3 minutes and covers one
task. Record them with `cypress/training/README.md`. Questions, possible bugs and demo data are in
[../../tasks-and-automation.md](../../tasks-and-automation.md); the dry-run review is in
[../../review-pass1.md](../../review-pass1.md).

**Demo world:**
- **Households:** the Riveras (Maria; Maple, Juniper and Pepper) and the Chens (Tom; Biscuit).
- **Staff:**
  - Dr. Avery Lane, veterinarian and Medical Director, and the practice owner (admin login) in TSK-13 and TSK-14;
  - Dr. Priya Shah, veterinarian;
  - Jordan Pike, technician and the Raleigh office's Inventory Manager;
  - Casey Morgan, client liaison;
  - Robin Hale, practice manager.
- **Office:** Raleigh office.
- **Setup:** `cypress/training/setup/tasks-demo.cjs` adds the five automation rules production has (the test
  database only gets two), the Medical Director role and the admin login. `cypress/training/tasksKit.ts` builds each
  video's tasks and the work the rules chase (a draft chart, an open bill, an unfiled call, a lab with no results,
  an order-list item), then runs the rules.

These build on recorded videos: EMR V6 (wrap-up and callbacks), LV-01 (in-house labs), INV-10 (open balances),
MEM-21 (membership staff tasks), OSV-12 (store billing tasks).

| ID | Title | Audience | Priority |
|---|---|---|---|
| [TSK-01](TSK-01-your-task-list.md) | Your task list: tabs, badges, Urgent and Normal | CL, Tech, DVM | Must |
| [TSK-02](TSK-02-make-a-task.md) | Make a task for someone | CL, Tech, DVM | Must |
| [TSK-03](TSK-03-unassigned-queue.md) | Pick up work from the Unassigned queue | CL, Tech | Must |
| [TSK-04](TSK-04-finish-remove-reopen.md) | Finish, remove or reopen a task | CL, Tech, DVM | Must |
| [TSK-05](TSK-05-move-and-time-off.md) | Move a task, and hand off before time off | CL, Tech, DVM | Must |
| [TSK-06](TSK-06-callback-task.md) | Work a callback task | CL, Tech, DVM | Must |
| [TSK-07](TSK-07-why-scout-made-this-task.md) | Why Scout made this task | CL, Tech, DVM | Must |
| [TSK-08](TSK-08-unfinished-chart.md) | "Finish the chart for …": the unsigned-chart task | DVM, Tech | Must |
| [TSK-09](TSK-09-invoice-left-open.md) | "Close the invoice for …": a bill left open | CL, Tech | Must |
| [TSK-10](TSK-10-call-not-filed.md) | "File the call with …": a call never filed | CL, Tech, DVM | Must |
| [TSK-11](TSK-11-lab-not-resulted.md) | "Enter results for …": an in-house lab with no results | Tech, DVM | Must |
| [TSK-12](TSK-12-order-list-and-vet-snap.md) | The order-list task and the weekly Vet Snap task | Inventory managers, practice manager | Nice |
| [TSK-13](TSK-13-automatic-tasks-settings.md) | Settings → Automatic Tasks: read the rules, spot a problem | Manager | Must |
| [TSK-14](TSK-14-someone-elses-tasks.md) | See someone else's tasks, and move them when they're out | Manager (admin login) | Nice |
| [TSK-15](TSK-15-common-task-mistakes.md) | The most common task mistakes | CL, Tech, DVM | Nice |

File names follow the recording queue's rule: `<ID> - <CL, Tech, DVM, Manager> - <title>.mp4`.
