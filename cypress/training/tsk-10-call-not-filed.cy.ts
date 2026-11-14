/// <reference types="cypress" />
/**
 * Training video TSK-10: "File the call with …", a call never filed
 * (docs/training/scripts/tasks-and-automation/TSK-10-call-not-filed.md). The task shows the call
 * (T-B2); filing it there also clears the call dock (Nov 14).
 * TEST stack only, with the AI keys blank (the review window cleans up the transcript with AI as it opens).
 * Casey Morgan called Maria Rivera yesterday; the Call not filed rule (run in setup) gave Casey the task.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { demo, resetTasksWorld, runRules, startOnTasks, unfiledCall } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-10 call not filed', () => {
  it('TSK-10', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    unfiledCall(
      d.rivera,
      d.casey,
      'Casey: Hi Maria, this is Casey from Vet At Your Door, checking on Maple. Maria: Maple is putting weight on the leg again and eating well. Casey: Great. Call us if the limp comes back.',
      'Post-visit check on Maple'
    );
    runRules();
    startOnTasks('cl');

    const card = () => cy.contains('.pims-task-card', 'File the call with Maria Rivera');
    const dock = () => cy.get('.call-dock-bunch', { timeout: 30000 });
    const panel = () => cy.get('section[aria-label="Call to file"]', { timeout: 30000 });
    const modal = () => cy.get('.pims-chart-pick--call', { timeout: 30000 });
    const maple = () => modal().contains('.pims-call-file__dest label', 'Maple');
    startClock();
    line('t10-01');
    line('t10-02', () => pointAt(card, 3000));
    line('t10-03');
    line('t10-04', () => pointAt(dock, 3000));
    // T-B2 (Nov 13): the task opens the call itself, with File to chart and Don't file.
    line('t10-05', () => {
      tap(() => card().find('a.pims-task-card__title'));
      panel().find('.pims-call-task__transcript').should('be.visible');
    });
    line('t10-06', () => pointAt(() => panel().find('.pims-call-task__transcript'), 3000));
    line('t10-07', () => pointAt(() => panel().contains('button', /Don.t file/), 2500));
    line('t10-08', () => {
      tap(() => panel().contains('button', 'File to chart'));
      modal().should('be.visible');
    });
    line('t10-09', () =>
      maple()
        .find('input')
        .then(($i) => {
          if ($i.prop('checked')) pointAt(maple, 2500);
          else tap(() => maple().find('input'));
        })
    );
    line('t10-10', () => tap(() => modal().contains('button', /^File to chart$/)));
    line('t10-11', () => {
      cy.get('.pims-task-detail__filed', { timeout: 30000 }).should('contain.text', 'Maple');
      // Filed from the task, the call leaves the dock too (fix Nov 14).
      cy.get('body', { timeout: 10000 }).should(($b) => {
        expect($b.find('.call-dock-bunch:contains("Maria Rivera")').length).to.eq(0);
      });
      pointAt(() => cy.get('.pims-task-detail__filed'), 3000);
    });
    line('t10-12');
    finish();
  });
});
