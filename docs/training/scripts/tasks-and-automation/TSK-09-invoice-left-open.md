# TSK-09. "Close the invoice for …": a bill left open

- **Audience:** CLs and techs.
- **Length:** 2 minutes.
- **Watch first:** TSK-07; INV-10 (open balances).
- **Signed in as:** Casey Morgan (client liaison).
- **The one thing to remember:** use the task's own buttons, so every reach-out is logged on the task.

## Why (opening)

"A bill left open is money we haven't collected, and a family who may be surprised later. If a bill is still open at six p.m., whoever put the first charge on it gets a task."

## Steps

| Step | Screen | Action | Narration | Demo data needed |
|---|---|---|---|---|
| 1 | Tasks | — | (why, above) | Biscuit's Office exam on a bill from yesterday 2 pm, charged by Casey, unpaid. The Invoice left open rule made "Close the invoice for Tom Chen" |
| 2 | Active | Point at the card | "Casey charged Biscuit's exam yesterday, and the bill is still open." | — |
| 3 | Active | — | "The one thing to remember: use the task's own buttons, so every reach-out is logged on the task." | — |
| 4 | Active | Click the title | "Open the task." | — |
| 5 | Task | Point at **Open invoice · Text to Pay · Text owner · Email owner · Mark complete** | "Open invoice, Text to Pay, Text owner and Email owner are all right here." | — |
| 6 | Task | Click **Text to Pay**, point at the window | "Text to Pay writes a text with a pay link for exactly what's owed." | Not sent: the test stack has no SMS key |
| 7 | Text pay link | Close the window | "When you send it, it's logged on the task. Close it for now." | — |
| 8 | Notes | Type in **Add a note**: "Called, left a voicemail about the open balance." | "Called and got voicemail? Write it down." | — |
| 9 | Notes | Tick **File this note to Tom Chen's record** | "Tick this to file the note on Tom's client record too." | — |
| 10 | Notes | Click **Save** | "Save." | — |
| 11 | Notes | Point at the note log | "Every reach-out stacks up here, so the next person knows what's been tried." | — |
| 12 | Task | Click **Open invoice** | "Tom calls back and asks us to use the card on file. Click Open invoice." | — |
| 13 | Invoice | Click **Charge card on file** | "Charge card on file." | Stripe test mode, the Chens' saved test Visa 4242 with the current card-on-file agreement |
| 14 | Top bar | Click **Tasks** | "The bill is paid. Now back to Tasks." | — |
| 15 | Active | Point at the list | "The task is already gone. Paying the bill closes it, so there's nothing to mark done." | Q2 (Nov 12): payment closes the task |
| 16 | Tasks | — | (closing, below) | — |

## What else you can do here

- **Email owner** opens an email with "Following up on your services with Vet At Your Door" and can save a copy to the client's communications.
- **Leave a chart note, reassign, or remove** (below the notes) files a note to the client and hands the task on.

## What other roles see

- The task goes to whoever put the first charge on the bill; if that can't be found, it waits on the Practice Manager queue, and the practice manager watches every one.
- Old eVet invoices never make this task (they aren't Scout bills).

## Closing

"The most common mistakes: texting or calling from your own phone, so nothing is logged, and marking the task done before the bill is paid, which brings it back. Remember: use the task's own buttons, so every reach-out is logged on the task."
