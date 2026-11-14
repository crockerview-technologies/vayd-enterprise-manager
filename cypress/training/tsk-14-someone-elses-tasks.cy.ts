/// <reference types="cypress" />
/**
 * Training video TSK-14: See someone else's tasks, and move them when they're out
 * (docs/training/scripts/tasks-and-automation/TSK-14-someone-elses-tasks.md).
 * TEST stack only. Dr. Avery Lane's admin login opens Jordan Pike's list and hands everything out: the overdue call
 * to Casey Morgan, today's task and the Future tasks to Robin Hale.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, makeTask, resetTasksWorld, startOnTasks } from './tasksKit';
import { choose, finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-14 someone else’s tasks', () => {
  it('TSK-14', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    makeTask('doctorA', {
      title: 'Call the Chens with Biscuit’s ear cytology results',
      assignedToEmployeeId: d.jordan,
      startAt: dayAt(-2, 9),
      dueAt: dayAt(-1, 17),
      links: [{ entityType: 'patient', entityId: d.biscuit }],
    });
    makeTask('manager', { title: 'Restock the Raleigh car kit', assignedToEmployeeId: d.jordan, startAt: dayAt(0, 8), branchIds: [d.branchId] });
    makeTask('doctorA', { title: 'Run Juniper’s urinalysis', assignedToEmployeeId: d.jordan, startAt: dayAt(2, 9), links: [{ entityType: 'patient', entityId: d.juniper }] });
    makeTask('manager', { title: 'Count the Raleigh office controlled drugs', assignedToEmployeeId: d.jordan, startAt: dayAt(3, 8), branchIds: [d.branchId] });
    startOnTasks('admin');

    const tab = (n: string) => cy.contains('button[role="tab"]', n);
    const modal = () => cy.get('.task-reassign-modal');
    const assignTo = () => modal().contains('.task-reassign-modal__field', 'Assign to').find('select');
    startClock();
    line('t14-01');
    line('t14-02');
    line('t14-03', () => {
      choose(() => cy.get('select[aria-label="View tasks for"]'), 'Jordan Pike');
      cy.contains('.pims-tasks__subtitle', 'Jordan Pike', { timeout: 30000 });
    });
    line('t14-04', () => pointAt(() => cy.get('.pims-tasks__subtitle'), 2500));
    line('t14-05', () => tap(() => tab('Expired')));
    line('t14-06', () => tap(() => cy.contains('.pims-task-card', 'Call the Chens').contains('button', /^Move$/)));
    line('t14-07', () => choose(assignTo, 'Casey Morgan'));
    line('t14-08', () => typeSlowly(() => modal().contains('.task-reassign-modal__field', 'Note').find('textarea'), 'Jordan is out today. Results are on the chart.'));
    line('t14-09', () => {
      tap(() => modal().find('button.task-reassign-modal__submit'));
      cy.contains('.pims-task-card', 'Call the Chens').should('not.exist');
    });
    line('t14-10', () => tap(() => tab('Active')));
    line('t14-11', () => tap(() => cy.contains('.pims-task-card', 'Restock').contains('button', /^Move$/)));
    line('t14-12', () => choose(assignTo, 'Robin Hale'));
    line('t14-13', () => {
      tap(() => modal().find('button.task-reassign-modal__submit'));
      cy.contains('.pims-task-card', 'Restock').should('not.exist');
    });
    line('t14-14', () => tap(() => tab('Future')));
    // T-B10 (Nov 13): Re-assign all on this tab moves the person picked in Person (Jordan), not the admin.
    line('t14-15', () => {
      tap(() => cy.contains('button.pims-tasks__bulk-btn', 'Re-assign all on this tab'));
      modal().should('be.visible');
    });
    line('t14-16', () => choose(assignTo, 'Robin Hale'));
    line('t14-17', () => {
      tap(() => modal().find('button.task-reassign-modal__submit'));
      cy.contains('.pims-tasks__count', '0 tasks', { timeout: 30000 });
    });
    line('t14-18', () => choose(() => cy.get('select[aria-label="View tasks for"]'), 'Me'));
    line('t14-19');
    finish();
  });
});
