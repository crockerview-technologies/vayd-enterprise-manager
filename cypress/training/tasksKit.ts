/// <reference types="cypress" />
/**
 * Setup helpers for the Tasks & automation training videos (TSK-xx, docs/training/scripts/tasks-and-automation/).
 * TEST stack only (a vayd_api_test* database). Everything here runs before startClock(), so none of it is filmed.
 *
 * The rules, roles and the owner-admin login come from setup/tasks-demo.cjs, which writes the admin token to
 * tasks-world.json next to the stack's emails.jsonl (outside the repo).
 */
import {
  resetSeededHouseholdsInDb,
  schedulingApi,
  schedulingWorld,
  signInAsScheduling,
  type SchRole,
} from '../support/schedulingWorld';

export const testDb = () => {
  const db = String(Cypress.env('SCH_DB'));
  expect(db, 'CYPRESS_SCH_DB must be a vayd_api_test* database').to.match(/^vayd_api_test[A-Za-z0-9_]*$/);
  return db;
};

/** Runs one SQL statement on the test database and yields stdout. */
export const sql = (q: string) =>
  cy.exec(`psql -qAt -d ${testDb()} -c "${q.replace(/"/g, '\\"')}"`, { env: { PGHOST: 'localhost', PGUSER: 'vayd', PGPASSWORD: 'vayd' } }).its('stdout');

const tasksWorldPath = () => String(Cypress.env('EMAIL_CAPTURE_PATH')).replace(/emails\.jsonl$/, 'tasks-world.json');
const apiBase = () => String(Cypress.env('API_URL')).replace(/\/$/, '');

/** Dr. Avery Lane's admin login (the practice owner in these videos). */
export const adminToken = () => cy.readFile(tasksWorldPath()).then((j: { adminToken: string }) => j.adminToken);

export function adminApi<T = any>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown, failOnStatusCode = true) {
  return adminToken().then((t) =>
    cy.request<T>({ method, url: `${apiBase()}${path}`, headers: { Authorization: `Bearer ${t}` }, body: body as Cypress.RequestBody, failOnStatusCode, timeout: 90000 })
  );
}

/** Signs in as Dr. Avery Lane's admin login and opens `path`. */
export function signInAsAdmin(path: string) {
  adminToken().then((t) => {
    cy.visit('/login');
    cy.window().then((win) => {
      win.localStorage.clear();
      win.localStorage.setItem('accessToken', t);
    });
    cy.visit(path);
  });
}

/** Demo ids: households, pets and staff (names from stack/demo-names.sh). */
export function demo() {
  const w = schedulingWorld();
  return {
    w,
    practiceId: w.practiceId,
    branchId: w.branchId,
    rivera: w.households.A.clientId,
    chen: w.households.B.clientId,
    maple: w.households.A.activePetIds[0],
    juniper: w.households.A.activePetIds[1],
    pepper: w.households.A.inactivePetId,
    biscuit: w.households.B.petId,
    casey: w.employees.cl,
    jordan: w.employees.technician,
    robin: w.employees.manager,
    avery: w.doctors.A,
    priya: w.doctors.B,
  };
}

/** Role ids by slug (Client Liaison, Technician, Practice Manager, Inventory Manager, Medical Director...). */
export const roleId = (slug: string) =>
  sql(`SELECT id FROM employee_role WHERE "pimsType"='SCOUT' AND slug='${slug}' AND "isDeleted"=false ORDER BY id LIMIT 1`).then((s) => Number(String(s).trim()));

/**
 * Clears what an earlier take left: every task (this is the training database only), the demo households'
 * drafts, bills and lab forms, the demo calls and order-list items, and each rule's last run.
 */
export function resetTasksWorld() {
  const d = demo();
  const clients = `${d.rivera},${d.chen}`;
  const pets = `${d.maple},${d.juniper},${d.pepper},${d.biscuit}`;
  resetSeededHouseholdsInDb();
  sql(`DELETE FROM tasks WHERE "practiceId"=${d.practiceId}`);
  sql(`UPDATE soap_encounters SET "isDeleted"=true WHERE "patientId" IN (${pets}) AND "isDeleted"=false`);
  sql(`UPDATE in_house_lab_results SET "isDeleted"=true WHERE "patientId" IN (${pets}) AND "isDeleted"=false`);
  sql(`UPDATE scout_chart_notes SET "isDeleted"=true WHERE "patientId" IN (${pets}) AND status='draft' AND "isDeleted"=false`);
  sql(`UPDATE visit_invoices SET "isDeleted"=true WHERE "clientId" IN (${clients}) AND "isDeleted"=false`);
  sql(`DELETE FROM openphone_call_events WHERE "callId" LIKE 'tasks-train-%'`);
  // The base copy carries open bills, drafts, pending labs and unfiled calls from other test runs (other clients).
  // Close them on this training database only, so the rules chase just the Riveras' and Chens' work.
  sql(`UPDATE visit_invoices SET "isDeleted"=true WHERE "practiceId"=${d.practiceId} AND status='open' AND "isDeleted"=false`);
  sql(`UPDATE soap_encounters SET "isDeleted"=true WHERE "practiceId"=${d.practiceId} AND status='draft' AND "isDeleted"=false`);
  sql(`UPDATE in_house_lab_results SET "isDeleted"=true WHERE "practiceId"=${d.practiceId} AND status='pending' AND "isDeleted"=false`);
  sql(`UPDATE openphone_call_events SET "dismissedAt"=now(), "dismissedReason"='Training reset' WHERE "practiceId"=${d.practiceId} AND "filedAt" IS NULL AND "dismissedAt" IS NULL`);
  sql(`DELETE FROM inventory_stock_requests WHERE "practiceId"=${d.practiceId} AND kind='order'`);
  sql(`UPDATE task_automation_rules SET "lastRunAt"=NULL, "lastError"=NULL, "lastErrorAt"=NULL WHERE "practiceId"=${d.practiceId}`);
  sql(`UPDATE patients SET "isActive"=true WHERE id IN (${pets})`);
  // The seed gives the demo families fake Stripe customer ids; with Stripe's test mode (this stack) Scout must make
  // real test-mode customers, so the ids are cleared.
  sql(`UPDATE clients SET "stripeCustomerId"=NULL WHERE id IN (${clients}) AND "stripeCustomerId" LIKE 'cus_fake_%'`);
  // TSK-09 charges the Chens' saved test card. Off-session charges need the current card-on-file agreement
  // (CARD_ON_FILE_AGREEMENT_VERSION in the API), so the Chens accepted it on this training database.
  sql(`UPDATE clients SET "cardOnFileConsentAgreementVersion"='2026-11-12', "cardOnFileConsentAt"=COALESCE("cardOnFileConsentAt", now()), "cardOnFileConsentSource"=COALESCE("cardOnFileConsentSource", 'manual') WHERE id=${d.chen}`);
  // Other test runs left extra holders of these roles in the base copy ("Cat practice_manager" and others). With two
  // holders a role's task goes to the queue (TA-A3) and the names show as watchers, so only the demo staff keep them.
  sql(`DELETE FROM employee_role_assignments a USING employee_role r WHERE r.id=a."roleId" AND r.slug IN ('practice_manager','inventory_manager','medical_director','lead_client_liaison','client_liaison') AND a."employeeId" NOT IN (${d.casey},${d.jordan},${d.robin},${d.avery},${d.priya})`);
}

const at = (hoursAgo: number) => new Date(Date.now() - hoursAgo * 3600_000).toISOString();
/** Yesterday at `hour` Eastern-ish (the rules look at work left before yesterday's 6 pm check). */
export const yesterdayAt = (hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

/** Today (or `days` from today) at `hour`:`min` local time, as ISO. */
export const dayAt = (days: number, hour: number, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

/** Marks a task done through the API as `as` (it shows under Completed). */
export function completeTask(as: SchRole, id: number) {
  return schedulingApi(as, 'POST', `/tasks/${id}/complete`, {});
}

/** Signs in as a demo login on the Tasks page with the test-stack banner hidden, and waits for the list. */
export function startOnTasks(role: SchRole | 'admin', path = '/schedule/tasks') {
  if (role === 'admin') signInAsAdmin(path);
  else signInAsScheduling(role, path);
  cy.contains('h1', /Tasks|Unassigned|Watching|Sent|Future/, { timeout: 60000 });
  cy.contains('.pims-tasks__count', /\d+ task/, { timeout: 60000 });
  cy.wait(1500, { log: false });
}

/** A manual task made through the API by `as`, the way the + Task form makes it. Yields its id. */
export function makeTask(as: SchRole, body: Record<string, unknown>) {
  return schedulingApi<{ id: number }>(as, 'POST', '/tasks', { source: 'manual', ...body }).then((r) => r.body.id);
}

/**
 * Yesterday's visit for one pet with Dr. Avery Lane, its SOAP left as a draft. Backdated so the
 * Unfinished chart rule sees it at its 6 pm check. Yields { appt, enc }.
 */
export function draftChart(patientId: number, clientId: number, description: string, hour = 10, chart?: Record<string, unknown>) {
  const d = demo();
  const start = yesterdayAt(hour);
  return schedulingApi<{ id: number }>('cl', 'POST', '/appointments', {
    practiceId: d.practiceId,
    primaryProviderId: d.avery,
    branchId: d.branchId,
    clientId,
    patientId,
    appointmentTypeId: d.w.types.medical,
    appointmentStart: start,
    appointmentEnd: new Date(new Date(start).getTime() + 3600_000).toISOString(),
    description,
    bookedViaRouting: true,
  }).then((res) =>
    schedulingApi<{ id: string }>('doctorA', 'POST', '/soap-encounters', {
      practiceId: d.practiceId,
      appointmentId: res.body.id,
      patientId,
      clientId,
      mode: 'comprehensive',
    }).then((enc) =>
      // The visit API files the visit under the doctor's home branch; the demo visit belongs to the Raleigh office.
      (chart
        ? schedulingApi('doctorA', 'PATCH', `/soap-encounters/${enc.body.id}`, { practiceId: d.practiceId, ...chart }).then(() =>
            sql(`UPDATE appointments SET "branchId"=${d.branchId} WHERE id=${res.body.id}`)
          )
        : sql(`UPDATE appointments SET "branchId"=${d.branchId} WHERE id=${res.body.id}`))
        .then(() => sql(`UPDATE soap_encounters SET created='${start}' WHERE id='${enc.body.id}'`))
        .then(() => ({ appt: res.body.id, enc: enc.body.id }))
    )
  );
}

/** The id of a catalog item by name (procedure or inventory item), as `type:id`. */
export const catalogId = (name: string) =>
  sql(
    `SELECT t || ':' || id FROM (SELECT 'procedure' t, id, name FROM procedures WHERE "isDeleted"=false UNION ALL SELECT 'inventory', id, name FROM inventory_items WHERE "isDeleted"=false) x WHERE name='${name}' ORDER BY id LIMIT 1`
  ).then((s) => {
    const [type, id] = String(s).trim().split(':');
    return { type: type as 'procedure' | 'inventory', id: Number(id) };
  });

/**
 * An open bill with the given catalog lines, charged by `as` (the first charge decides who gets the
 * "Close the invoice" task), backdated to yesterday afternoon. Yields the invoice id.
 */
export function openBill(as: SchRole, patientId: number, clientId: number, items: string[], hour = 14) {
  const d = demo();
  let invoiceId = '';
  schedulingApi<{ id: string }>(as, 'POST', '/visit-invoices/counter', { practiceId: d.practiceId, patientId, clientId }).then((res) => {
    invoiceId = res.body.id;
  });
  items.forEach((name) =>
    catalogId(name).then((c) =>
      sql(`SELECT price FROM ${c.type === 'procedure' ? 'procedures' : 'inventory_items'} WHERE id=${c.id}`).then((price) =>
        schedulingApi(as, 'POST', `/visit-invoices/${invoiceId}/lines`, {
          practiceId: d.practiceId,
          patientId,
          description: name,
          qty: 1,
          unitPrice: Number(price),
          catalogItemId: c.id,
          catalogItemType: c.type,
          providerEmployeeId: d.avery,
        })
      )
    )
  );
  return cy.then(() => {
    const t = yesterdayAt(hour);
    sql(`UPDATE visit_invoices SET created='${t}', "inventoryBranchId"=${d.branchId} WHERE id='${invoiceId}'`);
    sql(`UPDATE visit_invoice_lines SET created='${t}' WHERE "invoiceId"='${invoiceId}'`);
    sql(`UPDATE in_house_lab_results SET created='${t}' WHERE "visitInvoiceLineId" IN (SELECT id FROM visit_invoice_lines WHERE "invoiceId"='${invoiceId}')`);
    return cy.wrap(invoiceId);
  });
}

/** A Quo call yesterday afternoon, transcribed and never filed, made by `employeeId`. Yields the call event id. */
export function unfiledCall(clientId: number, employeeId: number, transcript: string, reason: string, hour = 15) {
  const d = demo();
  const t = yesterdayAt(hour);
  return sql(
    `INSERT INTO openphone_call_events ("callId","practiceId","direction","status","durationSeconds","callCreatedAt","answeredAt","completedAt","transcriptText","clientId","counterpartyPhone","triageReason","initiatedByEmployeeId","quoTranscriptStatus",created)
     VALUES ('tasks-train-${Date.now()}',${d.practiceId},'outgoing','completed',184,'${t}','${t}','${t}','${transcript.replace(/'/g, "''")}',${clientId},(SELECT phone1 FROM clients WHERE id=${clientId}),'${reason.replace(/'/g, "''")}',${employeeId},'completed','${t}') RETURNING id`
  ).then((s) => Number(String(s).trim().split('\n')[0]));
}

/** Items on the Raleigh office order list, asked for 3 hours ago (the rule waits 2 hours). */
export function orderListItem(itemName: string, quantity: number, requestedBy: number) {
  const d = demo();
  return sql(
    `INSERT INTO inventory_stock_requests ("practiceId",kind,status,"branchId","branchLocationId","inventoryItemId",quantity,"requestedByEmployeeId",created)
     SELECT ${d.practiceId},'order','open',${d.branchId},(SELECT id FROM inventory_branch_location WHERE "branchId"=${d.branchId} ORDER BY (code='MAIN') DESC, id LIMIT 1),i.id,${quantity},${requestedBy},'${at(3)}' FROM inventory_items i WHERE i.name='${itemName}' AND i."isDeleted"=false ORDER BY i.id LIMIT 1`
  );
}

/** Settings → Automatic Tasks → Run now, through the API as the admin. Yields how many tasks it made. */
export function runRules() {
  const d = demo();
  // End-of-day rules only run after their hour (6 pm ET), once a day. Setup can't wait for 6 pm, so it moves the
  // hour to midnight for this one run and puts 6 pm back; the tasks are the ones the 6 pm check would make.
  // The weekly Vet Snap rule (Thursday 8 am in production) is moved to today the same way, then put back.
  sql(`UPDATE task_automation_rules SET "endOfDayHour"=0 WHERE "practiceId"=${d.practiceId} AND "timingMode"='end_of_day'`);
  sql(
    `UPDATE task_automation_rules SET "endOfDayHour"=0, "weeklyDay"=EXTRACT(DOW FROM now() AT TIME ZONE 'America/New_York')::int WHERE "practiceId"=${d.practiceId} AND "timingMode"='weekly'`
  );
  return adminApi<{ created: number }>('POST', `/practice/${d.practiceId}/task-automation-rules/run`, {}).then((r) =>
    sql(`UPDATE task_automation_rules SET "endOfDayHour"=18 WHERE "practiceId"=${d.practiceId} AND "timingMode"='end_of_day'`)
      .then(() => sql(`UPDATE task_automation_rules SET "endOfDayHour"=8, "weeklyDay"=4 WHERE "practiceId"=${d.practiceId} AND "timingMode"='weekly'`))
      .then(() => r.body.created)
  );
}

/**
 * TSK-09 charges the Chens' saved card. A fresh stack seed has none, so this gives them Stripe's test Visa 4242 on a
 * Stripe TEST-mode customer (setup/stripe-test-card.sh refuses anything but an sk_test_ key). Needs the stack in
 * Stripe test mode (TRAINING_STRIPE=test).
 */
export function ensureChenTestCard() {
  const d = demo();
  sql(`SELECT COALESCE("stripeCustomerId",'') || ' ' || COALESCE("savedPaymentMethodId",'') FROM clients WHERE id=${d.chen}`).then((row) => {
    const [cus = '', pm = ''] = String(row).trim().split(' ');
    if (cus.startsWith('cus_') && !cus.startsWith('cus_fake') && pm.startsWith('pm_')) return;
    cy.exec(`bash cypress/training/setup/stripe-test-card.sh "${Cypress.env('SCH_API_DIR')}" tom.chen.training@example.com "Tom Chen"`).then((r) => {
      const [newCus, newPm] = r.stdout.trim().split(' ');
      expect(newPm, 'Stripe test card').to.match(/^pm_/);
      sql(`UPDATE clients SET "stripeCustomerId"='${newCus}', "savedPaymentMethodId"='${newPm}' WHERE id=${d.chen}`);
    });
  });
}
