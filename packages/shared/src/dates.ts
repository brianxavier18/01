import { TZDate } from '@date-fns/tz';
import { addDays, format, parse, subMinutes } from 'date-fns';

export const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

/** Instante atual representado no fuso IANA da loja. */
export function nowInTz(timezone: string, now: Date = new Date()): TZDate {
  return new TZDate(now.getTime(), timezone);
}

/** Data local "YYYY-MM-DD" no fuso da loja. */
export function localDate(d: Date, timezone: string): string {
  return format(new TZDate(d.getTime(), timezone), 'yyyy-MM-dd');
}

export function nextLocalDate(date: string): string {
  return format(addDays(parse(date, 'yyyy-MM-dd', new Date(2000, 0, 1)), 1), 'yyyy-MM-dd');
}

/** Instante (UTC) correspondente a `date` + `time` ("HH:mm") no fuso da loja. */
export function zonedInstant(date: string, time: string, timezone: string): Date {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const [hh, mm] = time.split(':').map(Number) as [number, number];
  return new Date(new TZDate(y, m - 1, d, hh, mm, 0, 0, timezone).getTime());
}

const WEEKDAYS = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

/** "TERÇA • 06/10" para a data local "YYYY-MM-DD". */
export function dateLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday} • ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}

/** "terça, 06/10" — usado em mensagens de WhatsApp. */
export function dateLabelLower(date: string): string {
  const [weekday, dm] = dateLabel(date).split(' • ') as [string, string];
  return `${weekday.toLocaleLowerCase('pt-BR')}, ${dm}`;
}

/** "06/10/2026" */
export function dateBR(date: string): string {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

export interface DayMilestones {
  reminder: Date; // D-1 18:00
  renderWindowOpens: Date; // D-1 20:00
  autopilot: Date; // delivery - 60 min
  lock: Date; // delivery - 15 min
  delivery: Date; // delivery_time
  lateAlert: Date; // delivery + 20 min
}

/** Marcos da linha do tempo (seção 6.2) para o dia de oferta `date`, todos como instantes UTC. */
export function dayMilestones(date: string, deliveryTime: string, timezone: string): DayMilestones {
  const delivery = zonedInstant(date, deliveryTime, timezone);
  const prev = format(addDays(parse(date, 'yyyy-MM-dd', new Date(2000, 0, 1)), -1), 'yyyy-MM-dd');
  return {
    reminder: zonedInstant(prev, '18:00', timezone),
    renderWindowOpens: zonedInstant(prev, '20:00', timezone),
    autopilot: subMinutes(delivery, 60),
    lock: subMinutes(delivery, 15),
    delivery,
    lateAlert: new Date(delivery.getTime() + 20 * 60_000),
  };
}
