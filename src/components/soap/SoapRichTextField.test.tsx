import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import SoapRichTextField from './SoapRichTextField';

describe('SoapRichTextField (B11: edited recap keeps its paragraphs)', () => {
  it('keeps <p> paragraphs after an edit instead of flattening them to single line breaks', () => {
    const onChange = vi.fn();
    const letter = '<p>Dear Tom,</p><p>We are so sorry for the loss of Biscuit.</p><p>With sympathy,</p>';
    render(<SoapRichTextField value={letter} onChange={onChange} onBlur={() => {}} />);
    const box = screen.getByRole('textbox');
    box.querySelectorAll('p')[1].append(' He was loved.');
    fireEvent.input(box);
    const saved = onChange.mock.calls.at(-1)?.[0] as string;
    expect(saved).toBe(
      '<p>Dear Tom,</p><p>We are so sorry for the loss of Biscuit. He was loved.</p><p>With sympathy,</p>'
    );
  });

  it('still stores plain text when there is no formatting', () => {
    const onChange = vi.fn();
    render(<SoapRichTextField value={'Line one\nLine two'} onChange={onChange} onBlur={() => {}} />);
    fireEvent.input(screen.getByRole('textbox'));
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('Line one\nLine two');
  });
});
