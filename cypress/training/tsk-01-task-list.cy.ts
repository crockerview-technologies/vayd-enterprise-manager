/// <reference types="cypress" />
/**
 * Training video TSK-01: Your task list (docs/training/scripts/tasks-and-automation/TSK-01-your-task-list.md).
 * TEST stack only. Casey Morgan (client liaison). Setup gives Casey one overdue, two due-now (one urgent, one made
 * by the Invoice left open rule), one future, one watched, one sent and one completed task, plus one on the
 * client liaison queue.
 */
import '../support/e2e';
import { signInAsScheduling } from '../support/schedulingWorld';
import { hideNonProdBanner } from './srRecord';
import { completeTask, dayAt, demo, makeTask, openBill, resetTasksWorld, roleId, runRules } from './tasksKit';
import { choose, finish, line, loadNarration, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-01 your task list', () => {
  it('TSK-01', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    openBill('cl', d.biscuit, d.chen, ['Office exam']);
    runRules();
    const chen = { entityType: 'client', entityId: d.chen };
    makeTask('cl', {
      title: "Call Tom Chen about Biscuit's ear recheck",
      assignedToEmployeeId: d.casey,
      startAt: dayAt(-2, 9),
      dueAt: dayAt(-1, 17),
      links: [chen, { entityType: 'patient', entityId: d.biscuit }],
      body: 'He asked us to call back once the drops were finished.',
    });
    makeTask('technician', {
      title: "Send Maria Rivera Maple's vaccine records",
      assignedToEmployeeId: d.casey,
      startAt: dayAt(0, 8),
      dueAt: dayAt(0, 17),
      priority: 1,
      links: [{ entityType: 'patient', entityId: d.maple }],
      body: 'The boarding kennel needs them before Saturday. Email them to Maria.',
      watcherEmployeeIds: [d.jordan],
    });
    makeTask('cl', {
      title: "Remind the Riveras about Juniper's dental",
      assignedToEmployeeId: d.casey,
      startAt: dayAt(3, 9),
      links: [{ entityType: 'patient', entityId: d.juniper }],
    });
    makeTask('cl', {
      title: "Pick up Pepper's food order at the Raleigh office",
      assignedToEmployeeId: d.jordan,
      startAt: dayAt(0, 8),
      watcherEmployeeIds: [d.casey],
      branchIds: [d.branchId],
    });
    roleId('client_liaison').then((cl) =>
      makeTask('manager', {
        title: 'Call back a new family asking about cat visits',
        queueRoleId: cl,
        startAt: dayAt(0, 8),
        branchIds: [d.branchId],
      })
    );
    makeTask('cl', { title: 'Update the Chens’ mailing address', assignedToEmployeeId: d.casey, startAt: dayAt(-1, 9), links: [chen] }).then((id) =>
      completeTask('cl', id)
    );

    signInAsScheduling('cl', '/schedule');
    cy.get('a.schedule-app__tab[href="/schedule/tasks"] .navbar-schedule-tab-badge--watching', { timeout: 60000 }).should('be.visible');
    cy.wait(2000);

    const tab = (name: string) => cy.contains('button[role="tab"]', name);
    const card = (title: string) => cy.contains('.pims-task-card', title);
    startClock();
    line('t01-01');
    const navTasks = () => cy.get('a.schedule-app__tab[href="/schedule/tasks"]').filter(':visible').first();
    line('t01-02', () => pointAt(() => navTasks().find('.navbar-schedule-tab-badge').not('.navbar-schedule-tab-badge--watching'), 3000));
    line('t01-03', () => pointAt(() => navTasks().find('.navbar-schedule-tab-badge--watching'), 2500));
    line('t01-04', () => {
      tap(navTasks);
      cy.contains('.pims-tasks__count', /\d+ task/, { timeout: 30000 });
    });
    line('t01-05');
    line('t01-06', () => pointAt(() => cy.get('.pims-tasks__tabs'), 3500));
    line('t01-07', () => tap(() => tab('Expired')));
    line('t01-08', () => pointAt(() => card('ear recheck').find('.pims-task-card__due').last(), 2500));
    line('t01-09', () => tap(() => tab('Active')));
    line('t01-10', () => pointAt(() => cy.contains('.pims-tasks__section', 'Urgent'), 2500));
    line('t01-11', () => pointAt(() => card('Close the invoice for Tom Chen'), 4000));
    line('t01-12', () => {
      pointAt(() => card('Close the invoice for Tom Chen').find('.pims-task-card__due').first(), 1800);
      pointAt(() => card('Close the invoice for Tom Chen').find('.pims-task-card__linked'), 2500);
    });
    line('t01-13', () => pointAt(() => card('Close the invoice for Tom Chen').find('.pims-task-card__actions'), 3500));
    line('t01-14', () => {
      tap(() => card('vaccine records').find('a.pims-task-card__title'));
      cy.get('.pims-task-detail__head', { timeout: 30000 }).should('be.visible');
    });
    line('t01-15', () => {
      pointAt(() => cy.get('.pims-task-detail__watching'), 2000);
      pointAt(() => cy.contains('h2, h3', 'History'), 2500);
    });
    line('t01-16', () => tap(() => cy.get('button.pims-task-detail__back')));
    line('t01-17', () => tap(() => tab('Future')));
    line('t01-18', () => tap(() => tab('Unassigned')));
    line('t01-19', () => tap(() => tab('Watching')));
    line('t01-20', () => tap(() => tab('Sent')));
    line('t01-21', () => tap(() => tab('Completed')));
    line('t01-21b', () => tap(() => tab('Active')));
    line('t01-22', () => choose(() => cy.get('select[aria-label="Filter by branch"]'), 'Raleigh office'));
    line('t01-23');
    finish();
  });
});
