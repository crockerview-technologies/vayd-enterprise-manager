/// <reference types="cypress" />
/**
 * Training video TSK-06: Work a callback task (docs/training/scripts/tasks-and-automation/TSK-06-callback-task.md).
 * TEST stack only. Casey Morgan (client liaison) works Dr. Avery Lane's callback about Maple. Quo isn't reachable from
 * the test stack, so Open Quo call is pointed at, not clicked, and Clean up (an AI call) is pointed at, not clicked.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, makeTask, resetTasksWorld, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

describe('Training: TSK-06 callback task', () => {
  it('TSK-06', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    makeTask('doctorA', {
      title: 'How is Maple’s leg?',
      kind: 'callback',
      assignedToEmployeeId: d.casey,
      startAt: dayAt(0, 8),
      links: [
        { entityType: 'client', entityId: d.rivera },
        { entityType: 'patient', entityId: d.maple },
      ],
      body: 'Ask if Maple is putting weight on the left hind leg. If not, book a recheck with Dr. Lane this week.',
    });
    startOnTasks('cl');

    const jot = () => cy.get('.pims-callback-jot');
    startClock();
    line('t06-01');
    line('t06-02', () => {
      tap(() => cy.contains('.pims-task-card', 'Maple').find('a.pims-task-card__title'));
      jot().should('be.visible');
    });
    line('t06-03');
    line('t06-04', () => pointAt(() => cy.get('.pims-task-detail__head'), 3500));
    line('t06-05', () => {
      pointAt(() => jot().find('.pims-callback-jot__phone'), 1500);
      pointAt(() => jot().contains('button', 'Open Quo call'), 2500);
    });
    line('t06-06', () =>
      typeSlowly(
        () => jot().find('textarea').first(),
        'Maria says Maple is putting full weight on the leg again and is back to her normal walks. No limp. No recheck needed.'
      )
    );
    line('t06-07', () => pointAt(() => jot().contains('button', 'Clean up'), 2500));
    // Owner, Nov 12 (Q1): a client liaison files a callback to the pet's chart as a communication note (T-B1).
    line('t06-08', () => pointAt(() => jot().contains('.pims-callback-jot__target', 'Maple'), 3000));
    line('t06-09', () => pointAt(() => jot().contains('.pims-callback-jot__field', 'Staff notes'), 2500));
    line('t06-10', () => {
      pointAt(() => jot().contains('.pims-callback-jot__field', 'Re-assign to'), 1800);
      pointAt(() => jot().contains('button', /^Re-assign$/), 1800);
    });
    line('t06-11', () => tap(() => jot().contains('button', 'Chart & complete')));
    line('t06-12', () => {
      cy.get('.pims-task-detail__filed', { timeout: 30000 }).should('contain.text', 'Maple');
      pointAt(() => cy.get('.pims-task-detail__filed'), 3000);
    });
    line('t06-13');
    finish();
  });
});
