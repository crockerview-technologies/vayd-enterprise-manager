import { describe, expect, it } from 'vitest';
import { visitDateWithWindow } from './visitPopoverWindow';

describe('visitDateWithWindow', () => {
  it('puts the date before the card window', () => {
    expect(
      visitDateWithWindow('2026-11-16T15:00:00Z', 'America/New_York', '9:00 AM – 11:00 AM')
    ).toBe('Mon Nov 16 · 9:00 AM – 11:00 AM');
  });

  it('is null without a window line', () => {
    expect(visitDateWithWindow('2026-11-16T15:00:00Z', 'America/New_York', null)).toBeNull();
    expect(visitDateWithWindow(null, 'America/New_York', '9:00 AM – 11:00 AM')).toBeNull();
  });
});
