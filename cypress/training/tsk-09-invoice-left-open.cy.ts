/// <reference types="cypress" />
/**
 * Training video TSK-09: "Close the invoice for …", a bill left open
 * (docs/training/scripts/tasks-and-automation/TSK-09-invoice-left-open.md).
 * TEST stack only (texts are not sent: the stack has no SMS key, so Text to Pay is opened and closed). Casey Morgan
 * charged Biscuit's Office exam yesterday; the Invoice left open rule gave Casey the task. Casey logs a voicemail,
 * charges the Chens' saved test card, and the task closes itself (T-Q2).
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { demo, ensureChenTestCard, openBill, resetTasksWorld, runRules, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-09 invoice left open', () => {
  it('TSK-09', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    ensureChenTestCard();
    openBill('cl', d.biscuit, d.chen, ['Office exam']);
    runRules();
    startOnTasks('cl');

    const card = () => cy.contains('.pims-task-card', 'Close the invoice for Tom Chen');
    const panel = () => cy.get('section[aria-label="Invoice"]');
    startClock();
    line('t09-01');
    line('t09-02', () => pointAt(card, 3000));
    line('t09-03');
    line('t09-04', () => {
      tap(() => card().find('a.pims-task-card__title'));
      panel().should('exist');
    });
    line('t09-05', () => pointAt(() => panel().find('.pims-fb-task__actions'), 3500));
    line('t09-06', () => {
      tap(() => panel().contains('button', 'Text to Pay'));
      cy.contains('[role="dialog"]', 'Text pay link', { timeout: 30000 }).should('be.visible');
      pointAt(() => cy.contains('[role="dialog"]', 'Text pay link'), 2500);
    });
    line('t09-07', () => tap(() => cy.contains('[role="dialog"]', 'Text pay link').find('button[aria-label="Close"]').first()));
    line('t09-07b', () => {
      tap(() => cy.contains('[role="dialog"] button', "Don't send"));
      cy.contains('[role="dialog"]', 'Text pay link').should('not.exist');
    });
    line('t09-08', () => typeSlowly(() => panel().find('.pims-fb-task__note-field textarea'), 'Called, left a voicemail about the open balance.'));
    line('t09-09', () => tap(() => panel().find('.pims-fb-task__chart input[type="checkbox"]')));
    line('t09-10', () => tap(() => panel().contains('.pims-fb-task__notes button', /^Save$/)));
    line('t09-11', () => {
      panel().find('.pims-fb-task__log').should('contain.text', 'voicemail');
      pointAt(() => panel().find('.pims-fb-task__log'), 3000);
    });
    line('t09-12', () => {
      tap(() => panel().contains('a', 'Open invoice'));
      cy.contains('button', 'Charge card on file', { timeout: 60000 });
    });
    // Stripe test mode with test card 4242 (the Chens' saved test card).
    line('t09-13', () => tap(() => cy.contains('button', 'Charge card on file')));
    line('t09-14', () => {
      cy.contains('Charged the card on file.', { timeout: 30000 });
      tap(() => cy.get('a.schedule-app__tab[href="/schedule/tasks"]').filter(':visible').first());
      cy.get('.pims-tasks__board').should('be.visible');
    });
    // T-Q2 (owner, Nov 12): paying the bill closes its task straight away.
    line('t09-15', () => {
      cy.contains('.pims-task-card', 'Close the invoice for Tom Chen').should('not.exist');
      pointAt(() => cy.get('.pims-tasks__board'), 2500);
    });
    line('t09-16');
    finish();
  });
});
