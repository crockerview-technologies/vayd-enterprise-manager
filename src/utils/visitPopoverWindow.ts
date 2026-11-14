import { DateTime } from 'luxon';

/**
 * Pop-up date line using the calendar card's effective window, e.g. "Mon Nov 16 · 9:00 AM – 11:00 AM",
 * so the pop-up and the card show the same times (owner, Nov 13, 2026). Null when either is missing.
 */
export function visitDateWithWindow(
  appointmentStartIso: string | null | undefined,
  practiceTz: string,
  windowLine: string | null | undefined
): string | null {
  const line = windowLine?.trim();
  if (!appointmentStartIso || !line) return null;
  let start = DateTime.fromISO(appointmentStartIso, { zone: 'utc' }).setZone(practiceTz);
  if (!start.isValid) start = DateTime.fromISO(appointmentStartIso, { setZone: true }).setZone(practiceTz);
  if (!start.isValid) return null;
  return `${start.toFormat('ccc LLL d')} · ${line}`;
}
