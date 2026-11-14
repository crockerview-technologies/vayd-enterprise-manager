# TSK-08. "Finish the chart for …": the unsigned-chart task

- **Audience:** doctors (techs for context).
- **Length:** 2 minutes.
- **Watch first:** TSK-07; EMR V6 (wrap-up and signing).
- **Signed in as:** Dr. Avery Lane (licensed veterinarian).
- **The one thing to remember:** open the SOAP from the task and sign it. The task closes the moment the chart is signed.

## Why (opening)

"A visit isn't finished until its chart is signed. If a SOAP is still a draft at six p.m., Scout gives the doctor on the visit a task. It's our only warning about an unsigned chart."

## Steps

| Step | Screen | Action | Narration | Demo data needed |
|---|---|---|---|---|
| 1 | Tasks | — | (why, above) | Yesterday 10 am: Maple's visit with Dr. Lane at the Raleigh office ("Limping on the left hind leg"), SOAP charted with a confirmed weight but not signed. The Unfinished chart rule made the task |
| 2 | Active | Point at "Finish the chart for Maple" (**SOAP**) | "Here it is on Dr. Lane's list: Finish the chart for Maple, from yesterday's visit." | — |
| 3 | Active | — | "The one thing to remember: open the SOAP from the task and sign it. The task closes the moment the chart is signed." | — |
| 4 | Active | Click the title | "Open the task." | — |
| 5 | Task | Point at "This SOAP has been open since Wed, Nov 11 and is still a draft…" | "It says how long the SOAP has been open." | — |
| 6 | Task | Point at "Mark complete only if you already signed it. If the SOAP is still a draft, a new task comes back after a day." | "Don't use Mark complete to make it go away. If the chart is still a draft, the task comes back." | — |
| 7 | Task | Click **Open SOAP** | "Click Open SOAP." | — |
| 8 | SOAP | Point at the history | "Maple's chart from yesterday. Check it's complete." | — |
| 9 | SOAP | Click **Wrap up visit** | "Click Wrap up visit." | — |
| 10 | Wrap-up | Point at **Client recap · Dose & Rx · Weight** | "Signing needs three things: the client recap decided, doses and prescriptions done, and a weight." | — |
| 11 | Wrap-up | Click **Don't email** | "Maria already heard the plan by phone, so click Don't email." | — |
| 12 | Wrap-up | Type the reason: "Dr. Lane went over the plan with Maria by phone" | "Say why." | — |
| 13 | Wrap-up | Click **Record: no recap** | "Record it." | — |
| 14 | Wrap-up | Click **Sign & lock SOAP** | "Click Sign and lock SOAP. Only a licensed veterinarian can sign." | — |
| 15 | Top bar | Click **Tasks** | "Now back to Tasks." | — |
| 16 | Tasks | Point at the list | "The task is gone. Signing the chart closed it." | — |
| 17 | Tasks | — | (closing, below) | — |

## What else you can do here

- **Move** the task to the doctor who should sign, if it isn't you (TSK-05).
- **Write addendum** on a signed chart (EMR V6).

## What other roles see

- The task goes to the doctor on the visit. With no doctor, it waits on the Medical Director queue.
- The rule never looks at charts from before the go-live date (`TASK_AUTOMATION_START_DATE`, TA-03) and has no 30-day limit (D4).
- Techs can open the SOAP from the task but can't sign it.

## Closing

"The most common mistakes: clicking Mark complete on a chart that isn't signed, and leaving a chart for a colleague without moving the task to them. Remember: open the SOAP from the task and sign it."
