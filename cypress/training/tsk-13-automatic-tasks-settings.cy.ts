/// <reference types="cypress" />
/**
 * Training video TSK-13: Settings → Automatic Tasks (docs/training/scripts/tasks-and-automation/TSK-13-automatic-tasks-settings.md).
 * TEST stack only. Dr. Avery Lane's admin login. Setup puts a sample "last run" error on the call rule so the red
 * warning can be shown (simulated: no real run failed), and nothing on the page is changed.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { demo, resetTasksWorld, signInAsAdmin, sql } from './tasksKit';
import { signInAsScheduling } from '../support/schedulingWorld';
import { finish, line, loadNarration, offCamera, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-13 automatic tasks settings', () => {
  it('TSK-13', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    sql(
      `UPDATE task_automation_rules SET "lastError"='call:4821: the person who made the call is no longer active', "lastErrorAt"=date_trunc('day', now() - interval '1 day') + interval '18 hours 2 minutes' WHERE "practiceId"=${d.practiceId} AND trigger='call_unfiled'`
    );
    signInAsAdmin('/schedule/settings');
    cy.get('button.settings-tab-menu__trigger', { timeout: 60000 }).should('exist');
    cy.wait(1500);

    const rule = (name: string) => cy.contains('section.auto-tasks__rule', name);
    startClock();
    line('t13-01');
    line('t13-02', () => tap(() => cy.get('button.settings-tab-menu__trigger').filter((_, el) => (el as HTMLElement).innerText.trim() === 'Practice').first()));
    line('t13-03', () => {
      tap(() => cy.get('[role="menuitem"]').filter((_, el) => (el as HTMLElement).innerText.trim() === 'Automatic Tasks').first());
      cy.get('section.auto-tasks__rule', { timeout: 30000 }).should('have.length.at.least', 7);
    });
    line('t13-04');
    line('t13-05', () => pointAt(() => rule('Invoice left open').find('.auto-tasks__summary'), 4000));
    line('t13-06', () => pointAt(() => rule('Unfinished chart').find('.auto-tasks__summary'), 3000));
    line('t13-07', () => pointAt(() => rule('Call not filed').find('.auto-tasks__warning'), 4000));
    line('t13-08', () => {
      tap(() => rule('Invoice left open').find('button.auto-tasks__expand'));
      rule('Invoice left open').find('.auto-tasks__body').should('exist');
    });
    line('t13-09', () => pointAt(() => rule('Invoice left open').contains('.auto-tasks__field', 'When it fires'), 2500));
    line('t13-10', () => {
      pointAt(() => rule('Invoice left open').contains('.auto-tasks__field', 'Who gets the task'), 1800);
      pointAt(() => rule('Invoice left open').contains('.auto-tasks__field', 'Queue it sits on'), 1800);
    });
    line('t13-11', () => pointAt(() => rule('Invoice left open').contains('label, .auto-tasks__check', 'Re-do if the work is still not done'), 2500));
    line('t13-12', () => {
      pointAt(() => rule('Invoice left open').contains('.auto-tasks__field', 'Task title'), 1600);
      pointAt(() => rule('Invoice left open').contains('.auto-tasks__field', 'Task notes'), 1600);
    });
    line('t13-13', () => tap(() => rule('Invoice left open').find('button.auto-tasks__expand')));
    // The result message shows for 4 s only, so it is pointed at in the same line as the click.
    line('t13-14', () => {
      tap(() => cy.get('button.auto-tasks__run'));
      pointAt(() => cy.contains('.settings-success-message', /Nothing needed chasing right now\.|Created \d+ tasks?\./), 2500);
    });
    line('t13-15', () => pointAt(() => cy.get('.auto-tasks__toolbar-note'), 3000));
    line('t13-16', () => pointAt(() => rule('Unfinished chart').find('.auto-tasks__toggle'), 2500));
    line('t13-17', () => pointAt(() => cy.get('section.auto-tasks__builtin'), 3500));
    offCamera(() => {
      signInAsScheduling('manager', '/schedule/settings?tab=automatic-tasks');
      cy.get('section.auto-tasks__rule', { timeout: 60000 }).should('have.length.at.least', 7);
      cy.wait(1000);
    });
    line('t13-18', () => pointAt(() => rule('Invoice left open').find('header.auto-tasks__head'), 3500));
    line('t13-19');
    finish();
  });
});
