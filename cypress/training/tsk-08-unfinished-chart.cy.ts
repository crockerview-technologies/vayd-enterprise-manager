/// <reference types="cypress" />
/**
 * Training video TSK-08: "Finish the chart for …", the unsigned-chart task
 * (docs/training/scripts/tasks-and-automation/TSK-08-unfinished-chart.md).
 * TEST stack only. Dr. Avery Lane (licensed vet, doctor login). Yesterday's visit for Maple, charted but not signed;
 * the Unfinished chart rule (run in setup) gave Dr. Lane the task. Signing on the Wrap-up page closes it at once.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { demo, draftChart, resetTasksWorld, runRules, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-08 unfinished chart', () => {
  it('TSK-08', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    draftChart(d.maple, d.rivera, 'Limping on the left hind leg', 10, {
      subjective: { history: 'Limping on the left hind leg since a run at the park two days ago. Eating and drinking normally.' },
      objectiveVitals: { tempF: '101.4', weight: '48.0', weightUnit: 'lb', weightConfirmed: true },
      objectiveNotes: 'Mild pain on flexion of the left stifle. No drawer. Rest of exam normal.',
      assessmentReasoning: 'Left stifle soft-tissue strain.',
      planNotes: 'Rest and short leash walks for 7 days. Call if not improving; recheck if still limping in a week.',
    });
    runRules();
    startOnTasks('doctorA');

    const card = () => cy.contains('.pims-task-card', 'Finish the chart for Maple');
    startClock();
    line('t08-01');
    line('t08-02', () => pointAt(card, 3000));
    line('t08-03');
    line('t08-04', () => {
      tap(() => card().find('a.pims-task-card__title'));
      cy.contains('h1', 'Finish the chart for Maple', { timeout: 30000 });
    });
    line('t08-05', () => pointAt(() => cy.contains('.pims-task-detail p, .pims-task-detail dd, .pims-task-detail div', /has been open since/).last(), 3000));
    line('t08-06', () => pointAt(() => cy.get('section[aria-label="Finish SOAP"] .pims-fb-task__hint'), 3500));
    line('t08-07', () => {
      tap(() => cy.contains('section[aria-label="Finish SOAP"] a', 'Open SOAP'));
      cy.contains('button', 'Wrap up visit', { timeout: 60000 });
    });
    line('t08-08', () => pointAt(() => cy.contains('Limping on the left hind leg').first(), 3000));
    line('t08-09', () => {
      tap(() => cy.contains('button', 'Wrap up visit'));
      cy.contains('Client recap', { timeout: 60000 }).should('be.visible');
    });
    line('t08-10', () => {
      // The page is still scrolling to the footer; let it settle so the outline lands on the gate.
      cy.get('.soap-wrapup-gate').scrollIntoView();
      cy.wait(600);
      pointAt(() => cy.get('.soap-wrapup-gate'), 4000);
    });
    line('t08-11', () => tap(() => cy.contains('button', "Don't email")));
    line('t08-12', () => typeSlowly(() => cy.get('input[placeholder^="e.g. client asked"]'), 'Dr. Lane went over the plan with Maria by phone'));
    line('t08-13', () => {
      tap(() => cy.contains('button', 'Record: no recap'));
      cy.contains('No recap sent', { timeout: 30000 }).should('be.visible');
    });
    line('t08-14', () => {
      tap(() => cy.get('.soap-wrapup-footer button.primary'));
      cy.get('.soap-wrapup-chart-locked', { timeout: 60000 }).should('exist');
    });
    line('t08-15', () => {
      tap(() => cy.get('a.schedule-app__tab[href="/schedule/tasks"]').filter(':visible').first());
      cy.contains('.pims-tasks__count', /\d+ task/, { timeout: 30000 });
    });
    line('t08-16', () => {
      cy.contains('.pims-task-card', 'Finish the chart for Maple').should('not.exist');
      pointAt(() => cy.get('.pims-tasks__board'), 2500);
    });
    line('t08-17');
    finish();
  });
});
