/// <reference types="cypress" />
/**
 * Training video TSK-07: Why Scout made this task
 * (docs/training/scripts/tasks-and-automation/TSK-07-why-scout-made-this-task.md).
 * TEST stack only. Jordan Pike (tech) charged Juniper's ear cytology yesterday on an open bill. The rules (run in
 * setup) gave Jordan "Close the invoice for Maria Rivera" and "Enter results for Ear cytology on Juniper". Jordan
 * enters the result and the lab task closes itself.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { demo, openBill, resetTasksWorld, runRules, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-07 why Scout made this task', () => {
  it('TSK-07', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    openBill('technician', d.juniper, d.rivera, ['Ear cytology']);
    runRules();
    startOnTasks('technician');

    const card = (t: string) => cy.contains('.pims-task-card', t);
    startClock();
    line('t07-01');
    line('t07-02');
    line('t07-03', () => {
      pointAt(() => card('Close the invoice').find('.pims-task-card__kind'), 1800);
      pointAt(() => card('Enter results').find('.pims-task-card__kind'), 1800);
    });
    line('t07-04', () => pointAt(() => card('Enter results').find('.pims-task-card__linked'), 2500));
    line('t07-05', () => pointAt(() => cy.get('.pims-tasks__cards').last(), 4000));
    line('t07-06', () => pointAt(() => card('Close the invoice').find('.pims-task-card__assignee'), 3000));
    line('t07-07', () => pointAt(() => card('Enter results').find('.pims-task-card__assignee'), 2500));
    line('t07-08', () => {
      tap(() => card('Enter results').find('a.pims-task-card__title'));
      cy.contains('h1', 'Enter results', { timeout: 30000 });
    });
    line('t07-09', () => pointAt(() => cy.get('section[aria-label="Enter lab results"] .pims-fb-task__lead'), 3500));
    line('t07-10', () =>
      typeSlowly(() => cy.get('section[aria-label="Enter lab results"] .soap-rich__editor').first(), 'Moderate yeast, no bacteria seen.')
    );
    line('t07-11', () => tap(() => cy.contains('section[aria-label="Enter lab results"] button', 'Save results')));
    line('t07-12', () => {
      cy.get('.pims-task-detail__status--res-auto, .pims-task-detail__status--res-completed', { timeout: 30000 }).should('exist');
      pointAt(() => cy.get('.pims-task-detail__meta'), 3000);
    });
    line('t07-13', () => tap(() => cy.get('button.pims-task-detail__back')));
    line('t07-14', () => {
      tap(() => cy.contains('button[role="tab"]', 'Completed'));
      pointAt(() => card('Enter results').find('.pims-task-card__pill'), 2500);
    });
    line('t07-15');
    finish();
  });
});
