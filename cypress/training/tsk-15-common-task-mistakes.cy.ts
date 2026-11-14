/// <reference types="cypress" />
/**
 * Training video TSK-15: The most common task mistakes
 * (docs/training/scripts/tasks-and-automation/TSK-15-common-task-mistakes.md).
 * TEST stack only. Casey Morgan (client liaison): one overdue task, Scout's "Close the invoice for Tom Chen", one queue
 * task and one Future task. Nothing is changed; each mistake is shown where it happens.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, makeTask, openBill, resetTasksWorld, roleId, runRules, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-15 common task mistakes', () => {
  it('TSK-15', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    openBill('cl', d.biscuit, d.chen, ['Office exam']);
    runRules();
    makeTask('cl', {
      title: "Call Tom Chen about Biscuit's ear recheck",
      assignedToEmployeeId: d.casey,
      startAt: dayAt(-2, 9),
      dueAt: dayAt(-1, 17),
      links: [{ entityType: 'client', entityId: d.chen }],
    });
    makeTask('manager', { title: 'Update the Riveras’ emergency contact', assignedToEmployeeId: d.casey, startAt: dayAt(0, 8) });
    makeTask('cl', { title: "Remind the Riveras about Juniper's dental", assignedToEmployeeId: d.casey, startAt: dayAt(4, 9) });
    roleId('client_liaison').then((cl) =>
      makeTask('manager', { title: 'Call back a new family asking about cat visits', queueRoleId: cl, startAt: dayAt(0, 8), branchIds: [d.branchId] })
    );
    startOnTasks('cl');

    const tab = (n: string) => cy.contains('button[role="tab"]', n);
    const card = (t: string) => cy.contains('.pims-task-card', t);
    startClock();
    line('t15-01');
    line('t15-02');
    line('t15-03', () => tap(() => tab('Expired')));
    line('t15-04', () => {
      tap(() => tab('Active'));
      pointAt(() => card('Close the invoice for Tom Chen').contains('button', 'Mark done'), 2500);
    });
    line('t15-05', () => {
      pointAt(() => card('emergency contact').find('button.pims-task-card__btn--remove'), 1800);
      pointAt(() => card('emergency contact').contains('button', /^Move$/), 1800);
    });
    line('t15-06', () => {
      tap(() => tab('Unassigned'));
      pointAt(() => card('cat visits').contains('button', 'Assign to me'), 2500);
    });
    line('t15-07', () => {
      tap(() => tab('Future'));
      pointAt(() => cy.contains('button.pims-tasks__bulk-btn', 'Re-assign all on this tab'), 2500);
    });
    line('t15-08', () => pointAt(() => cy.get('button.pims-tasks__add'), 2500));
    line('t15-09');
    finish();
  });
});
