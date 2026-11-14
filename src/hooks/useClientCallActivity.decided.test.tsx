/**
 * TSK-10 (Nov 14): a call filed or marked Don't file from its task must leave the call dock and
 * the chart pill straight away, not sit there as "Ready to file" until the next refresh.
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ClientCall } from '../api/calls';

const ready = (callId: string): ClientCall =>
  ({
    callId,
    clientId: 7,
    practiceId: 1,
    phase: 'transcript_ready',
    direction: 'incoming',
    counterpartyPhone: '2075551234',
    startedAt: new Date(Date.now() - 600_000).toISOString(),
    answeredAt: new Date(Date.now() - 600_000).toISOString(),
    completedAt: new Date(Date.now() - 300_000).toISOString(),
    durationSeconds: 300,
    hasTranscript: true,
    transcriptText: 'Owner says Maple is vomiting again.',
    triageReason: null,
    triageCategory: null,
    initiatedByEmployeeId: null,
    answeredByEmployeeId: 5,
    filedAt: null,
    dismissedAt: null,
  }) as unknown as ClientCall;

vi.mock('../auth/useAuth', () => ({ useAuth: () => ({ token: null, employeeId: 5 }) }));
vi.mock('../utils/callRealtime', () => ({ subscribePracticeCalls: () => () => undefined }));
vi.mock('../api/calls', async (orig) => ({
  ...(await orig<typeof import('../api/calls')>()),
  listMyCalls: vi.fn(async () => ({ calls: [ready('AC-dock-1'), ready('AC-dock-2')], more: false })),
  listClientCalls: vi.fn(async () => ({ calls: [ready('AC-pill-1')], phoneKeys: [] })),
  claimCallsForClient: vi.fn(async () => undefined),
}));

import { markCallDecided, useClientCallActivity, useMyCallStack } from './useClientCallActivity';

describe('calls decided outside the dock', () => {
  it('the dock drops a call filed from its task, and keeps the others', async () => {
    const { result } = renderHook(() => useMyCallStack());
    await waitFor(() => expect(result.current.calls).toHaveLength(2));

    act(() => markCallDecided('AC-dock-1'));

    expect(result.current.calls.map((c) => c.callId)).toEqual(['AC-dock-2']);
  });

  it('the chart pill stops offering a call filed from its task', async () => {
    const { result } = renderHook(() => useClientCallActivity(7));
    await waitFor(() => expect(result.current.call?.callId).toBe('AC-pill-1'));

    act(() => markCallDecided('AC-pill-1'));

    expect(result.current.call).toBeNull();
  });
});
