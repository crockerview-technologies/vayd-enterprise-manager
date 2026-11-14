/// <reference types="cypress" />
/**
 * Training video TSK-04: Finish, remove or reopen a task
 * (docs/training/scripts/tasks-and-automation/TSK-04-finish-remove-reopen.md).
 * TEST stack only. Jordan Pike (tech): marks one task done, removes a duplicate, closes a task shared with
 * Dr. Avery Lane for everyone, then reopens the first one from Completed.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, makeTask, resetTasksWorld, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-04 finish, remove or reopen', () => {
  it('TSK-04', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    makeTask('manager', { title: 'Restock the car’s ear cleaner', assignedToEmployeeId: d.jordan, startAt: dayAt(0, 8), branchIds: [d.branchId] });
    makeTask('cl', { title: 'Order ear cleaner for the car', assignedToEmployeeId: d.jordan, startAt: dayAt(0, 9), branchIds: [d.branchId] });
    makeTask('doctorA', {
      title: 'Book Juniper’s recheck once the urine results are back',
      assignedToEmployeeIds: [d.jordan, d.avery],
      startAt: dayAt(0, 7),
      links: [{ entityType: 'patient', entityId: d.juniper }],
    });
    startOnTasks('technician');

    const card = (t: string) => cy.contains('.pims-task-card', t);
    startClock();
    line('t04-01');
    line('t04-02');
    line('t04-03', () => pointAt(() => card('Restock the car'), 2500));
    line('t04-04', () => {
      tap(() => card('Restock the car').contains('button', 'Mark done'));
      cy.contains('.pims-task-card', 'Restock the car').should('not.exist');
    });
    line('t04-05', () => pointAt(() => card('Order ear cleaner'), 2500));
    line('t04-06', () => tap(() => card('Order ear cleaner').find('button.pims-task-card__btn--remove')));
    line('t04-07', () => pointAt(() => cy.get('.task-remove-modal__quick'), 3000));
    line('t04-08', () => tap(() => cy.contains('.task-remove-modal__chip', 'Duplicate of another task')));
    line('t04-09', () => {
      tap(() => cy.contains('button', /^Remove task$/));
      cy.contains('.pims-task-card', 'Order ear cleaner').should('not.exist');
    });
    line('t04-10', () => pointAt(() => card('Book Juniper').find('.pims-task-card__kind--shared'), 2500));
    line('t04-11', () => tap(() => card('Book Juniper').contains('button', 'Mark done')));
    line('t04-12', () => pointAt(() => cy.get('.shared-task-prompt'), 3500));
    line('t04-13', () => {
      tap(() => cy.contains('.shared-task-prompt button', 'Close for everyone'));
      cy.contains('.pims-task-card', 'Book Juniper').should('not.exist');
    });
    line('t04-14', () => {
      tap(() => cy.contains('button[role="tab"]', 'Completed'));
      card('Restock the car').should('be.visible');
    });
    line('t04-15', () => {
      pointAt(() => card('Restock the car').find('.pims-task-card__pill'), 1800);
      pointAt(() => card('Order ear cleaner').find('.pims-task-card__pill'), 1800);
    });
    line('t04-16', () => {
      tap(() => card('Restock the car').find('a.pims-task-card__title'));
      cy.contains('h1', 'Restock the car', { timeout: 30000 });
    });
    line('t04-17', () => tap(() => cy.contains('.pims-task-detail__actions button', 'Reopen')));
    line('t04-18', () => pointAt(() => cy.contains('.shared-task-prompt', 'Reopen this task?'), 2500));
    line('t04-19', () => {
      tap(() => cy.contains('.shared-task-prompt button', /^Reopen$/));
      cy.get('.pims-task-detail__status--res-completed').should('not.exist');
    });
    line('t04-20');
    finish();
  });
});
