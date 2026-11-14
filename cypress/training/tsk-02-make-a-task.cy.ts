/// <reference types="cypress" />
/**
 * Training video TSK-02: Make a task for someone (docs/training/scripts/tasks-and-automation/TSK-02-make-a-task.md).
 * TEST stack only. Casey Morgan (client liaison) makes a task for Jordan Pike (tech) with Dr. Avery Lane watching.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, resetTasksWorld, startOnTasks } from './tasksKit';
import { choose, finish, line, loadNarration, pointAt, startClock, tap, typeSlowly } from './trainingKit';

/** The next Friday at noon as a datetime-local value (yyyy-MM-ddTHH:mm). */
function nextFridayNoon(): string {
  const d = new Date();
  d.setDate(d.getDate() + (((5 - d.getDay() + 7) % 7) || 7));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T12:00`;
}

describe('Training: TSK-02 make a task', () => {
  it('TSK-02', () => {
    demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    void dayAt;
    startOnTasks('cl');

    const modal = () => cy.get('.pims-tasks__modal--create');
    const field = (label: string) => modal().contains('.pims-tasks__modal-field', label);
    startClock();
    line('t02-01');
    line('t02-02');
    line('t02-03', () => {
      tap(() => cy.get('button.pims-tasks__add'));
      modal().should('be.visible');
    });
    line('t02-04');
    line('t02-05', () => {
      pointAt(() => modal().contains('.pims-tasks__type-pick', 'To-do'), 2000);
      pointAt(() => modal().contains('.pims-tasks__type-pick', 'Callback'), 2000);
    });
    line('t02-06', () => typeSlowly(() => field('Task').find('input'), 'Run Juniper’s urine sample'));
    line('t02-07', () => choose(() => field('Assign to').find('select'), 'Jordan Pike'));
    line('t02-08', () => pointAt(() => field('Queue').find('select'), 2500));
    line('t02-09', () => tap(() => modal().contains('label.pims-tasks__check', 'Avery Lane').find('input')));
    line('t02-10', () => pointAt(() => modal().contains('.pims-tasks__due-start-option', 'Today'), 2000));
    line('t02-11', () => typeSlowly(() => modal().find('.pims-tasks__modal-row2 input[type="datetime-local"]').eq(1), nextFridayNoon()));
    line('t02-12', () => pointAt(() => field('Priority').find('select'), 2500));
    line('t02-13', () => typeSlowly(() => modal().find('.pims-tasks__link-search input[type="search"]'), 'Juniper'));
    line('t02-14', () => tap(() => modal().contains('.pims-tasks__link-dropdown [role="option"]', 'Juniper')));
    line('t02-15', () =>
      typeSlowly(() => field('Notes').find('textarea'), 'Maria drops it off Friday morning. Run a urinalysis and tell Dr. Lane the results.')
    );
    line('t02-16', () => tap(() => modal().find('.pims-tasks__checks').last().contains('label.pims-tasks__check', 'Raleigh office').find('input')));
    line('t02-17', () => {
      tap(() => modal().contains('button.pims-tasks__modal-submit', 'Create task'));
      cy.contains('h1', 'Run Juniper', { timeout: 30000 });
    });
    line('t02-18', () => {
      pointAt(() => cy.get('.pims-task-detail__watching'), 2000);
      pointAt(() => cy.get('.pims-task-detail__schedule'), 2000);
    });
    line('t02-19', () => tap(() => cy.get('button.pims-task-detail__back')));
    line('t02-20', () => {
      tap(() => cy.contains('button[role="tab"]', 'Sent'));
      cy.contains('.pims-task-card', 'Run Juniper', { timeout: 30000 });
      pointAt(() => cy.contains('.pims-task-card', 'Run Juniper'), 2500);
    });
    line('t02-21');
    finish();
  });
});
