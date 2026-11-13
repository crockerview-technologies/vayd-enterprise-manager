# INV-18. Appointment deposits: ask by text or email, then use it at checkout

- **Audience:** CLs, plus anyone who books or confirms visits (video name: CL, Tech, DVM, Manager). Every role except the observer can ask for a deposit and send its link (`paylink.send`). Taking it in person needs the usual payment permission.
- **Length:** 2 to 3 minutes.
- **Watch first:** INV-13 (account credit), EMR V15 (pay links).
- **The one thing to remember:** a deposit is held on the account for its visit, so use Account credit at that visit's checkout, or on the cancel fee if the client doesn't come.

## Why (opening)

"Some clients need to pay a deposit before we hold a visit for them. Here's how to ask for one by text or email, and how it's used at the visit."

## Steps

| Step | Screen | Action | Narration | Demo data needed |
|---|---|---|---|---|
| 1 | Tom Chen, client page | — | "Some clients need to pay a deposit before we hold a visit for them. Here's how to ask for one by text or email, and how it's used at the visit." | Signed in as Casey Morgan (CL). Tom Chen marked "Deposit required" with the note "Two unpaid visits" (INV-19). Biscuit's wellness visit on the next weekday, 10 am, with an Office exam ($75) and a DHPP vaccine ($32) charted |
| 1b | Client page | Point at the red **Deposit required** box: "Collect a deposit before each visit… Two unpaid visits — Robin H." | "Clients who need one are marked Deposit required on their client page, with the reason. Managers, billing and lead client liaisons mark them. The Deposit required video shows how." | CLs see the box but can't mark or clear it (INV-19 shows **+ Mark deposit required**) |
| 1a | Schedule | Point at the red **Dep** tag on Biscuit's visit (title "Deposit required: not asked for yet") | "A red Dep tag on a visit means the client needs a deposit, and nobody has asked for it yet." | — |
| 2 | Schedule | Hover Biscuit's visit | "When you open the visit of a client who needs a deposit," | — |
| 3 | Visit pop-up | Point at **Client alerts**: "DEPOSIT REQUIRED (Two unpaid visits): collect a deposit for this visit (right-click the appointment → Client → Appointment Deposit)." | "the client alerts say Deposit required, right at the top, and how to collect it." | — |
| 4 | Schedule | (the one thing to remember) | "A deposit is real money. It's held on the account for this visit, then used at checkout." | — |
| 5 | Schedule | Right-click the visit | "Right-click the visit." | — |
| 6 | Menu | Hover **Client** | "Then Client." | — |
| 7 | Menu | Click **Appointment Deposit** | "And Appointment Deposit." | — |
| 8 | **Appointment deposit** window | Point at **Deposit amount ($)**, 100 | "It starts at a hundred dollars. Change it if the visit needs more." | — |
| 9 | Appointment deposit | Point at "The deposit is kept on the client's account for this visit. At checkout, Account credit uses it first…" | "The window reminds you how the deposit is used." | — |
| 10 | Appointment deposit | Click **Text pay link** | "Click Text pay link. It sends a secure link for just the deposit." | Tom Chen gets texts |
| 11 | **Text deposit pay link** window | Point at the message: "Hi Tom, here is a secure link to pay your $100.00 deposit (Deposit for Biscuit's visit on <date>): <link>…" | "You can change the wording before you send it." | — |
| 12 | Text window | Click **Send message** (never **Send to actual client**) | "Click Send message." | Test stack: the text is captured, not sent |
| 13 | Appointment deposit | Point at "Asked for, not paid yet. Asked for $100.00, paid $0.00, $100.00 still to collect." | "Scout shows the deposit is asked for, and what's still to collect." | — |
| 14 | Appointment deposit | Point at **Email pay link** | "Email pay link does the same by email." | — |
| 15 | Appointment deposit | Point at **Take payment now** | "If they're on the phone with a card, or paying cash, use Take payment now." | — |
| 15a | Schedule | Close the window; point at the **Dep** tag, now amber ("Deposit asked for ($100.00), not paid yet") | "Close the window. The tag is amber now: asked for, not paid yet." | — |
| 16 | Schedule | Point at the **Dep** tag, now green ("Deposit paid ($100.00)") | "When Tom pays the link, the tag turns green." | Off camera: Tom's $100 card payment on the deposit bill (the client paying the link isn't filmed) |
| 16a | Tom Chen, Billing tab | Point at the ledger row: **Deposit** tag, "For Biscuit · <date>…", Status Paid, $100.00 "Deposit asked", Paid $100.00, Due "$100.00 Credit on account" | "On his Billing tab, the deposit is its own row: what he paid, and the hundred dollars on his account as credit." | — |
| 16b | Billing tab | Click the row; the bill opens as "Appointment deposit" | "Open it. The note says how it's used." | — |
| 17 | Deposit bill | Point at "Appointment deposit: $100.00 asked for, $100.00 paid. What is paid is held as credit for that visit…" | "Until the visit, it's held for Biscuit's visit. Pay links for other bills, the online store and account credit on other bills leave it alone." | — |
| 18 | Biscuit's checkout | Click **Account credit** | "At checkout, click Account credit." | Bill total $107.00 |
| 19 | Account credit box | Point at "Account credit: $100.00 available" and "Includes the deposit for Biscuit's visit on <date> ($100.00), used first." | "Scout includes Biscuit's deposit and uses it first." | — |
| 20 | Account credit box | Click **Apply credit** | "Click Apply credit." | — |
| 21 | Checkout | Point at "Used $100.00 of account credit." | "The deposit came off the bill. Take the rest as usual." | — |
| 22 | Voice-over | — | "If the client cancels, the deposit becomes ordinary account credit. Add the cancel fee to a bill and pay it with Account credit." | — |
| 23 | Voice-over | — | "If they don't show, do the same, and tick the visit's deposit in the Account credit box to use it on the fee." | — |
| 24 | Closing | — | "The most common mistake is charging the card at checkout and forgetting the deposit. Remember: a deposit is held for its visit, so use Account credit at checkout, or on the cancel fee." | — |

## What else you can do here

- **Change the amount:** type a new amount and click **Save amount**, or just send the link. You can't go below what's already been paid.
- **Partly paid:** the link asks only for what's still owed. For example, after $40 cash, it asks for $60.
- **Take payment now** opens the deposit bill on the Billing tab for card, cash or check.
- A deposit can't be paid with account credit: it has to be new money.
- **Held for the visit (owner, Nov 12, option 3):** until the visit's bill is paid or the visit is cancelled, only that visit's bill uses the deposit. On another bill (a no-show fee), tick "Not included: the deposit for … held for that visit" in the Account credit box; Scout asks "Use a deposit for another visit?" first.

## What other roles see

- **Ask for a deposit and send its link:** every role except the observer.
- **Take payment now:** anyone who can take a payment.
- **Text pay link** is greyed out for a client who doesn't get texts ("This client does not get texts.").
- **Marking a client "Deposit required"** is for managers, billing and lead CLs (INV-19).

## Closing

"The most common mistake is charging the card at checkout and forgetting the deposit. Remember: a deposit is held for its visit, so use Account credit at checkout, or on the cancel fee."

## Notes (Nov 12, 2026): Pass 1 dry run

Dry run clean (Mac voice); spec and narration written; questions and fixes are in `docs/training/review-pass1.md` (Batch D). Final take waits on the owner's answers and on build-doctor-flow (with the deposit-hold change) being merged into this branch. Record INV-19 before INV-18 (INV-18's setup marks Tom Chen itself, so either order works on a fresh seed).

## Notes (Nov 13, 2026): schedule tag and ledger row
- Re-scripted after PAY-A18 (the **Dep** tag on the schedule: red needed, amber asked, green paid) and PAY-A19 (the deposit bill shows as a Deposit row with its visit, what was asked and paid, and the credit left, instead of a $0 "Direct invoice" with Due ($100.00)).

## Notes (Nov 13, 2026, later): opens on the client page
- Owner asked to show where a client is marked. INV-18 now opens on Tom's client page and points at the **Deposit required** box (line 1b), then goes to the schedule. Marking itself stays in INV-19 (managers, billing and lead CLs only).
- Re-recorded after the deposit window's buttons moved inside the window under a divider (web `5d80a4e2`).
