/// <reference types="cypress" />
/**
 * Training video TSK-11: "Enter results for …", an in-house lab with no results
 * (docs/training/scripts/tasks-and-automation/TSK-11-lab-not-resulted.md).
 * TEST stack only. Jordan Pike (tech) charged Juniper's Ear cytology on yesterday's bill; the In-house lab not
 * resulted rule gave Jordan the task, with Dr. Avery Lane watching. Save, finish later keeps it; Save results closes it.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { demo, openBill, resetTasksWorld, runRules, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-11 lab not resulted', () => {
  it('TSK-11', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    openBill('technician', d.juniper, d.rivera, ['Ear cytology']);
    runRules();
    startOnTasks('technician');

    const card = () => cy.contains('.pims-task-card', 'Enter results for Ear cytology on Juniper');
    const panel = () => cy.get('section[aria-label="Enter lab results"]');
    const editor = () => panel().find('.soap-rich__editor').first();
    startClock();
    line('t11-01');
    line('t11-02', () => pointAt(card, 3000));
    line('t11-03');
    line('t11-04', () => {
      tap(() => card().find('a.pims-task-card__title'));
      panel().should('exist');
    });
    line('t11-05', () => pointAt(() => cy.get('.pims-task-detail__watching'), 2500));
    line('t11-06', () => pointAt(() => panel(), 2500));
    line('t11-07', () => typeSlowly(editor, 'Moderate yeast'));
    line('t11-08', () => tap(() => panel().contains('button', 'Save, finish later')));
    line('t11-09', () => pointAt(() => cy.get('.pims-task-detail__meta'), 2500));
    line('t11-10', () => typeSlowly(editor, ', no bacteria seen. Left ear only.'));
    line('t11-11', () => tap(() => panel().contains('button', 'Save results')));
    line('t11-12', () => {
      cy.get('.pims-task-detail__status--res-auto', { timeout: 30000 }).should('exist');
      pointAt(() => cy.get('.pims-task-detail__meta'), 3000);
    });
    line('t11-13');
    finish();
  });
});
