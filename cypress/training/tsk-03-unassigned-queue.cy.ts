/// <reference types="cypress" />
/**
 * Training video TSK-03: Pick up work from the Unassigned queue
 * (docs/training/scripts/tasks-and-automation/TSK-03-unassigned-queue.md).
 * TEST stack only. Casey Morgan (client liaison). Setup puts three tasks on the Client Liaison queue (two at the
 * Raleigh office, one with no office) and one on the Technician queue, which Casey doesn't see.
 */
import '../support/e2e';
import { hideNonProdBanner } from './srRecord';
import { dayAt, demo, makeTask, resetTasksWorld, roleId, startOnTasks } from './tasksKit';
import { choose, finish, line, loadNarration, pointAt, startClock, tap } from './trainingKit';

describe('Training: TSK-03 unassigned queue', () => {
  it('TSK-03', () => {
    const d = demo();
    loadNarration();
    hideNonProdBanner();
    resetTasksWorld();
    roleId('client_liaison').then((cl) => {
      makeTask('manager', {
        title: 'Call back a new family asking about cat visits',
        queueRoleId: cl,
        startAt: dayAt(0, 8),
        branchIds: [d.branchId],
        body: 'Sam Patel, 919-555-0188. Two cats, wants to know if we see cats at home.',
      });
      makeTask('manager', {
        title: 'Mail the Chens a copy of Biscuit’s records',
        queueRoleId: cl,
        startAt: dayAt(0, 8),
        branchIds: [d.branchId],
        links: [{ entityType: 'client', entityId: d.chen }],
      });
      makeTask('manager', { title: 'Confirm next week’s visits with the Riveras', queueRoleId: cl, startAt: dayAt(0, 8), links: [{ entityType: 'client', entityId: d.rivera }] });
    });
    roleId('technician').then((tech) =>
      makeTask('manager', { title: 'Restock the car kit', queueRoleId: tech, startAt: dayAt(0, 8), branchIds: [d.branchId] })
    );
    startOnTasks('cl');

    const tab = (name: string) => cy.contains('button[role="tab"]', name);
    const card = () => cy.contains('.pims-task-card', 'cat visits');
    startClock();
    line('t03-01');
    line('t03-02', () => {
      tap(() => tab('Unassigned'));
      card().should('exist');
    });
    line('t03-03');
    line('t03-04', () => pointAt(() => card().find('.pims-task-card__assignee'), 2500));
    line('t03-05', () => choose(() => cy.get('select[aria-label="Show a queue"]'), 'Client Liaison queue'));
    line('t03-06', () => choose(() => cy.get('select[aria-label="Filter by branch"]'), 'Raleigh office'));
    line('t03-07', () => pointAt(() => card(), 3000));
    line('t03-08', () => tap(() => card().contains('button', 'Assign to me')));
    line('t03-09', () => {
      cy.contains('.pims-task-card', 'cat visits').should('not.exist');
      pointAt(() => cy.get('.pims-tasks__board'), 2000);
    });
    line('t03-10', () => {
      tap(() => tab('Active'));
      card().should('exist');
    });
    line('t03-11', () => pointAt(() => card().find('.pims-task-card__assignee'), 2000));
    line('t03-12');
    finish();
  });
});
