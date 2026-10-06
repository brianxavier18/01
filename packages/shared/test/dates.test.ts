import { describe, expect, it } from 'vitest';
import {
  dateLabel,
  dateLabelLower,
  dayMilestones,
  localDate,
  nextLocalDate,
  zonedInstant,
} from '../src/dates';

describe('timezones', () => {
  it('09:00 local in three Brazilian zones', () => {
    expect(zonedInstant('2026-10-06', '09:00', 'America/Sao_Paulo').toISOString()).toBe(
      '2026-10-06T12:00:00.000Z',
    );
    expect(zonedInstant('2026-10-06', '09:00', 'America/Manaus').toISOString()).toBe(
      '2026-10-06T13:00:00.000Z',
    );
    expect(zonedInstant('2026-10-06', '09:00', 'America/Rio_Branco').toISOString()).toBe(
      '2026-10-06T14:00:00.000Z',
    );
  });

  it('localDate differs across zones near midnight UTC', () => {
    const instant = new Date('2026-10-07T03:30:00Z');
    expect(localDate(instant, 'America/Sao_Paulo')).toBe('2026-10-07');
    expect(localDate(instant, 'America/Manaus')).toBe('2026-10-06');
    expect(localDate(instant, 'America/Rio_Branco')).toBe('2026-10-06');
  });

  it('milestones', () => {
    const m = dayMilestones('2026-10-06', '09:00', 'America/Manaus');
    expect(m.reminder.toISOString()).toBe('2026-10-05T22:00:00.000Z');
    expect(m.renderWindowOpens.toISOString()).toBe('2026-10-06T00:00:00.000Z');
    expect(m.autopilot.toISOString()).toBe('2026-10-06T12:00:00.000Z');
    expect(m.lock.toISOString()).toBe('2026-10-06T12:45:00.000Z');
    expect(m.delivery.toISOString()).toBe('2026-10-06T13:00:00.000Z');
    expect(m.lateAlert.toISOString()).toBe('2026-10-06T13:20:00.000Z');
  });

  it('next date across month end', () => {
    expect(nextLocalDate('2026-10-31')).toBe('2026-11-01');
  });
});

describe('labels', () => {
  it('formats weekday labels', () => {
    expect(dateLabel('2026-10-06')).toBe('TERÇA • 06/10');
    expect(dateLabel('2026-10-10')).toBe('SÁBADO • 10/10');
    expect(dateLabelLower('2026-10-06')).toBe('terça, 06/10');
  });
});
