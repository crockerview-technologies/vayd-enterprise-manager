import { describe, expect, it } from 'vitest';
import { ensureRecapFarewell, insertBeforeFarewell, recapHasFarewell } from './visitRecapSender';

describe('recapHasFarewell (B10: condolence closings)', () => {
  it.each([
    'Take care,',
    'Warmly,',
    'Best wishes',
    'With sympathy,',
    'With deepest sympathy,',
    'With our heartfelt condolences,',
    'In sympathy,',
    'Thinking of you all,',
    'Kind regards,',
    'Thank you,',
  ])('knows "%s" as a closing', (closing) => {
    expect(recapHasFarewell(`<p>We are so sorry about Biscuit.</p><p>${closing}</p>`)).toBe(true);
    expect(recapHasFarewell(`We are so sorry about Biscuit.\n\n${closing}`)).toBe(true);
  });

  it('does not take an ordinary last sentence for a closing', () => {
    expect(recapHasFarewell('Please call us if anything changes.')).toBe(false);
    expect(recapHasFarewell('We wanted to say thank you')).toBe(false);
    expect(recapHasFarewell('She was so loved by all the family.')).toBe(false);
  });

  it('does not add "Take care," under "With sympathy,"', () => {
    const parts = { html: '<p>Hi Ana,</p><p>Luna was loved.</p><p>With sympathy,</p>', text: 'Hi Ana,\n\nLuna was loved.\n\nWith sympathy,' };
    expect(ensureRecapFarewell(parts)).toBe(parts);
  });

  it('puts the store block above "With deepest sympathy,"', () => {
    const closed = { html: '<p>Hi Ana,</p><p>With deepest sympathy,</p>', text: 'Hi Ana,\n\nWith deepest sympathy,' };
    const out = insertBeforeFarewell(closed, { html: '<p>STORE</p>', text: 'STORE' });
    expect(out.html).toBe('<p>Hi Ana,</p><p>STORE</p><p>With deepest sympathy,</p>');
    expect(out.text.endsWith('STORE\n\nWith deepest sympathy,')).toBe(true);
  });
});
