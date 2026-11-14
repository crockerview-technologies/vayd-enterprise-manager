/// <reference types="cypress" />
/**
 * Training video TSK-12: The order-list task and the weekly Vet Snap task
 * (docs/training/scripts/tasks-and-automation/TSK-12-order-list-and-vet-snap.md).
 * TEST stack only. Jordan Pike (tech and the Raleigh office's Inventory Manager) gets the order-list task for
 * 4 × Mometamax otic; then Robin Hale (practice manager) gets the Vet Snap task and downloads the file.
 */
import '../support/e2e';
import { signInAsScheduling } from '../support/schedulingWorld';
import { hideNonProdBanner } from './srRecord';
import { demo, orderListItem, resetTasksWorld, runRules, startOnTasks } from './tasksKit';
import { finish, line, loadNarration, offCamera, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-12 order list and Vet Snap', () => {
  it('TSK-12', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    orderListItem('Mometamax otic 15 g', 4, d.casey);
    runRules();
    startOnTasks('technician');

    const order = () => cy.contains('.pims-task-card', 'Order List');
    const vetsnap = () => cy.contains('.pims-task-card', 'Vet Snap');
    startClock();
    line('t12-01');
    line('t12-02');
    line('t12-03', () => pointAt(order, 3000));
    line('t12-04', () => {
      tap(() => order().find('a.pims-task-card__title'));
      cy.get('section[aria-label="Order list"]', { timeout: 30000 }).should('exist');
    });
    line('t12-05', () => pointAt(() => cy.get('.pims-order-list-task__items'), 2500));
    line('t12-06', () => pointAt(() => cy.contains('section[aria-label="Order list"] a', 'Open Raleigh office order list'), 3000));
    line('t12-07', () => tap(() => cy.contains('section[aria-label="Order list"] button', 'Mark ordered')));
    offCamera(() => {
      signInAsScheduling('manager', '/schedule/tasks');
      vetsnap().should('exist');
      cy.wait(1500);
    });
    line('t12-10', () => pointAt(vetsnap, 3000));
    line('t12-11', () => {
      tap(() => vetsnap().find('a.pims-task-card__title'));
      cy.contains('h1', 'Vet Snap', { timeout: 30000 });
    });
    line('t12-12', () => pointAt(() => cy.contains('.pims-task-detail p, .pims-task-detail dd, .pims-task-detail div', /Controlled Drugs/).last(), 4000));
    const navItem = (label: string | RegExp) => cy.get('a, button').filter(':visible').filter((_, el) => (typeof label === 'string' ? (el as HTMLElement).innerText.trim() === label : label.test((el as HTMLElement).innerText.trim()))).first();
    line('t12-13', () => {
      tap(() => navItem('Analytics'));
      cy.contains('h1, h2', 'Analytics & Reports', { timeout: 60000 });
    });
    line('t12-13b', () => tap(() => navItem('Inventory')));
    line('t12-13c', () => {
      tap(() => navItem('Controlled Drugs'));
      cy.contains('button', 'Vet Snap patients (last 14 days)', { timeout: 60000 });
    });
    line('t12-14', () => tap(() => cy.contains('button', 'Vet Snap patients (last 14 days)')));
    line('t12-15', () => pointAt(() => cy.contains(/Last downloaded by/), 3000));
    line('t12-16');
    finish();
  });
});
