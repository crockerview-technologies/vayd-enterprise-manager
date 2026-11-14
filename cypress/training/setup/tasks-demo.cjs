/**
 * Tasks & automation training demo setup (docs/training/scripts/tasks-and-automation/). TEST stack only.
 *   NODE_PATH=$API_DIR/node_modules node cypress/training/setup/tasks-demo.cjs <vayd_api_test* db> <world.json> <out tasks-world.json>
 *
 * Safe to run again. It:
 * - adds the Medical Director and Lead Client Liaison roles if the test database lacks them (the seed migration
 *   only adds roles and rules to practices that exist when it runs, and the training practice is made later);
 * - adds the five automation rules production has (chart, invoice, order list, call, lab), with the same settings
 *   and wording as vayd_api_local (rules are practice settings, not client data);
 * - makes Jordan Pike the Raleigh office's Inventory Manager and Dr. Avery Lane the Medical Director;
 * - adds an admin login for Dr. Avery Lane (the practice owner in these videos) and writes its 4-hour token to the
 *   out file, which must stay outside the repo (it is a sign-in token).
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { sign } = require('jsonwebtoken');
require('dotenv').config({ path: path.join(process.env.API_DIR || '', '.env'), quiet: true });

const [, , database, worldFile, outFile] = process.argv;
if (!/^vayd_api_test[A-Za-z0-9_]*$/.test(database || '')) {
  console.error(`Refusing: ${database} is not a vayd_api_test* database`);
  process.exit(2);
}
if (!outFile || path.resolve(outFile).startsWith(path.resolve(__dirname, '../../..'))) {
  console.error('Refusing: write the token file outside the repo (e.g. $TRAINING_WORK/stack/tasks-world.json)');
  process.exit(2);
}
const w = JSON.parse(fs.readFileSync(worldFile, 'utf8'));
const pool = new Pool({ host: 'localhost', port: 5432, user: 'vayd', password: 'vayd', database });
const q = async (sql, p) => (await pool.query(sql, p)).rows;

const RULES = [
  {
    trigger: 'soap_unfinished', name: 'Unfinished chart', queue: 'medical_director', watcher: 'medical_director', recreate: true,
    title: 'Finish the chart for {{patient}}',
    body: 'This SOAP has been open since {{opened}} and is still a draft. Finish and sign it, or hand it to someone who can.',
  },
  {
    trigger: 'invoice_open', name: 'Invoice left open', queue: 'practice_manager', watcher: 'practice_manager', recreate: true,
    title: 'Close the invoice for {{client}}',
    body: 'This bill was still open at the end of the day. Take payment, finalize it, or void it.',
  },
  {
    trigger: 'order_list_item', name: 'Order list item waiting', timing: 'age', threshold: 120, assignee: 'role', role: 'inventory_manager',
    queue: 'inventory_manager', watcher: 'practice_manager', recreate: true, title: '{{headline}}', body: '{{items}}',
  },
  {
    trigger: 'call_unfiled', name: 'Call not filed to the chart', queue: 'practice_manager', watcher: 'practice_manager', recreate: false,
    title: 'File the call with {{client}}',
    body: 'Quo transcribed this call and it was never filed to a chart or waved off. File it or remove it.',
  },
  {
    trigger: 'lab_result_missing', name: 'In-house lab not resulted', queue: 'practice_manager', watcher: null, recreate: true,
    title: 'Enter results for {{lab}} on {{patient}}', body: null,
  },
];

const roleId = async (slug) => (await q(`SELECT id FROM employee_role WHERE "pimsType"='SCOUT' AND slug=$1 AND "isDeleted"=false ORDER BY id LIMIT 1`, [slug]))[0]?.id ?? null;

(async () => {
  for (const [slug, name] of [['medical_director', 'Medical Director'], ['lead_client_liaison', 'Lead Client Liaison']]) {
    if (!(await roleId(slug))) {
      // roleValue is unique per pimsType; this copy has other roles on production's numbers, so take the next free one.
      await q(`INSERT INTO employee_role (name, slug, "roleValue", "pimsType", "isBranchSpecific", "isActive", "isDeleted")
               SELECT $1,$2,COALESCE(MAX("roleValue"),0)+1,'SCOUT',false,true,false FROM employee_role WHERE "pimsType"='SCOUT'`, [name, slug]);
      console.log(`added role ${name}`);
    }
  }
  for (const r of RULES) {
    const exists = await q(`SELECT id FROM task_automation_rules WHERE "practiceId"=$1 AND trigger=$2`, [w.practiceId, r.trigger]);
    if (exists.length) continue;
    const queue = await roleId(r.queue);
    const watcher = r.watcher ? await roleId(r.watcher) : null;
    const assigneeRole = r.role ? await roleId(r.role) : null;
    await q(
      `INSERT INTO task_automation_rules ("practiceId", trigger, name, "isEnabled", "timingMode", "thresholdMinutes", "endOfDayHour",
         "assigneeMode", "assigneeRoleId", "queueRoleId", "watcherRoleIds", "watcherEmployeeIds", "titleTemplate", "bodyTemplate",
         "recreateIfIncomplete", "weeklyDay")
       VALUES ($1,$2,$3,true,$4,$5,18,$6,$7,$8,$9::jsonb,'[]'::jsonb,$10,$11,$12,4)`,
      [w.practiceId, r.trigger, r.name, r.timing || 'end_of_day', r.threshold || 1440, r.assignee || 'owner', assigneeRole, queue,
        JSON.stringify(watcher ? [watcher] : []), r.title, r.body, r.recreate],
    );
    console.log(`added rule ${r.name}`);
  }
  // Production lists the rules chart, invoice, order list, call, lab, signup, Vet Snap (ids 1-7). Match it, so
  // Settings shows them in the same order, while no automatic task points at a rule id yet.
  const order = ['soap_unfinished', 'invoice_open', 'order_list_item', 'call_unfiled', 'lab_result_missing', 'membership_signup_failed', 'vetsnap_weekly_upload'];
  const ids = await q(`SELECT id, trigger FROM task_automation_rules WHERE "practiceId"=$1 ORDER BY id`, [w.practiceId]);
  const used = await q(`SELECT 1 FROM tasks WHERE "idempotencyKey" LIKE 'rule:%' LIMIT 1`);
  if (!used.length && ids.some((r, i) => r.trigger !== order[i] || r.id !== i + 1) && ids.length === order.length) {
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      await c.query(`UPDATE task_automation_rules SET id = id + 1000`);
      for (const [i, t] of order.entries()) await c.query(`UPDATE task_automation_rules SET id=$1 WHERE trigger=$2`, [i + 1, t]);
      await c.query(`SELECT setval(pg_get_serial_sequence('task_automation_rules','id'), 7)`);
      await c.query('COMMIT');
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
    console.log('rules renumbered to production order');
  }
  const assign = async (employeeId, slug, branchId) => {
    const id = await roleId(slug);
    const has = await q(`SELECT 1 FROM employee_role_assignments WHERE "employeeId"=$1 AND "roleId"=$2 AND "branchId" IS NOT DISTINCT FROM $3`, [employeeId, id, branchId]);
    if (!has.length) await q(`INSERT INTO employee_role_assignments ("employeeId","roleId","branchId") VALUES ($1,$2,$3)`, [employeeId, id, branchId]);
  };
  // Other test runs left active employees in the base copy ("Inv inventory_manager" and the like). They fill the
  // Assign to and watcher lists on camera, so on this training database only the five demo staff stay active.
  const demoStaff = [w.employees.cl, w.employees.technician, w.employees.manager, w.doctors.A, w.doctors.B];
  const off = await q(
    `UPDATE employees SET "isActive"=false WHERE "practiceId"=$1 AND "isActive"=true AND NOT (id = ANY($2::int[])) RETURNING id`,
    [w.practiceId, demoStaff],
  );
  if (off.length) console.log(`deactivated ${off.length} leftover test employees`);
  await assign(w.employees.technician, 'inventory_manager', w.branchId);
  await assign(w.doctors.A, 'medical_director', null);

  const email = `${w.tag}+owner-admin@vayd.test`;
  let [admin] = await q(`SELECT id FROM users WHERE email=$1`, [email]);
  if (!admin) {
    [admin] = await q(
      `INSERT INTO users (email,password,role,"practiceId",employee_id,"isActive","allowEmail","allowText")
       VALUES ($1,'x-not-a-real-hash','admin',$2,$3,true,false,false) RETURNING id`,
      [email, w.practiceId, w.doctors.A],
    );
  }
  const secret = (process.env.JWT_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const token = sign(
    { sub: admin.id, email, employeeId: w.doctors.A, doctorId: null, clientId: null, role: 'admin',
      practiceKey: process.env.DEFAULT_PRACTICE_KEY || 'vayd', practiceId: w.practiceId, accountId: null },
    secret,
    { expiresIn: '4h' },
  );
  fs.writeFileSync(outFile, JSON.stringify({ adminToken: token, adminUserId: admin.id }), { mode: 0o600 });
  console.log(`admin login for Avery Lane: user ${admin.id}; token written to ${outFile}`);
  await pool.end();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
