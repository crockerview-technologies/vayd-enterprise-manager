/// <reference types="cypress" />
/**
 * Training video TSK-05: Move a task, and hand off before time off
 * (docs/training/scripts/tasks-and-automation/TSK-05-move-and-time-off.md).
 * TEST stack only. Jordan Pike (tech) moves one call to Casey Morgan, then re-assigns all three Future tasks to
 * Robin Hale (practice manager) before a week away.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, makeTask, resetTasksWorld, startOnTasks } from './tasksKit';
import { choose, finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-05 move and time off', () => {
  it('TSK-05', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    makeTask('manager', {
      title: 'Call Maria Rivera about Pepper’s weight check',
      assignedToEmployeeId: d.jordan,
      startAt: dayAt(0, 8),
      links: [{ entityType: 'patient', entityId: d.pepper }],
      branchIds: [d.branchId],
    });
    makeTask('doctorA', { title: 'Run Biscuit’s ear cytology recheck', assignedToEmployeeId: d.jordan, startAt: dayAt(5, 9), links: [{ entityType: 'patient', entityId: d.biscuit }] });
    makeTask('manager', { title: 'Restock the Raleigh car kit', assignedToEmployeeId: d.jordan, startAt: dayAt(6, 8), branchIds: [d.branchId] });
    makeTask('doctorA', { title: 'Send Juniper’s urine results to Dr. Lane', assignedToEmployeeId: d.jordan, startAt: dayAt(7, 9), links: [{ entityType: 'patient', entityId: d.juniper }] });
    startOnTasks('technician');

    const card = (t: string) => cy.contains('.pims-task-card', t);
    const modal = () => cy.get('.task-reassign-modal');
    const field = (label: string) => modal().contains('.task-reassign-modal__field', label);
    startClock();
    line('t05-01');
    line('t05-02');
    line('t05-03', () => pointAt(() => card('weight check'), 2500));
    line('t05-04', () => {
      tap(() => card('weight check').contains('button', /^Move$/));
      modal().should('be.visible');
    });
    line('t05-05', () => choose(() => field('Assign to').find('select'), 'Casey Morgan'));
    line('t05-05b', () => pointAt(() => modal().contains('label.task-reassign-modal__check', 'Keep me watching'), 3500));
    line('t05-06', () => {
      pointAt(() => field('Starts'), 1800);
      pointAt(() => field('Due'), 1800);
    });
    line('t05-07', () => pointAt(() => modal().contains('.task-reassign-modal__field', 'Watchers'), 2000));
    line('t05-08', () => typeSlowly(() => field('Note').find('textarea'), 'Maria asked for a CL to call her back. Thanks!'));
    line('t05-09', () => {
      tap(() => modal().find('button.task-reassign-modal__submit'));
      cy.contains('.pims-task-card', 'weight check').should('not.exist');
    });
    line('t05-10', () => pointAt(() => cy.get('.pims-tasks__board'), 2000));
    line('t05-11', () => tap(() => cy.contains('button[role="tab"]', 'Future')));
    line('t05-12', () => pointAt(() => cy.get('.pims-tasks__cards').first(), 3000));
    line('t05-13', () => {
      pointAt(() => card('Restock').find('.pims-task-card__pick input'), 1800);
      pointAt(() => cy.contains('button.pims-tasks__bulk-btn', 'Re-assign selected'), 2000);
    });
    line('t05-14', () => {
      tap(() => cy.contains('button.pims-tasks__bulk-btn', 'Re-assign all on this tab'));
      modal().should('be.visible');
    });
    line('t05-15', () => choose(() => field('Assign to').find('select'), 'Robin Hale'));
    line('t05-15b', () => pointAt(() => modal().contains('.task-reassign-modal__field', 'Add watchers to every task'), 3500));
    line('t05-16', () => tap(() => modal().find('button.task-reassign-modal__submit')));
    line('t05-17', () => {
      cy.contains('.pims-tasks__count', '0 tasks', { timeout: 30000 });
      pointAt(() => cy.get('.pims-tasks__board'), 2000);
    });
    line('t05-18');
    finish();
  });
});
