import { ro } from './ro.mjs';

const groupThousands = (digits, separator) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

function splitAmount(amount, cents) {
  const [whole, fraction] = amount.toFixed(cents ? 2 : 0).split('.');
  return { whole, fraction };
}

const english = {
  lang: 'en',
  t: text => text,
  weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  calendarHeader: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nights: n => `${n} night${n === 1 ? '' : 's'}`,
  euro(amount, cents = false) {
    const { whole, fraction } = splitAmount(amount, cents);
    return '€' + groupThousands(whole, ',') + (fraction ? '.' + fraction : '');
  },
  rand: amount => 'R' + groupThousands(String(Math.round(amount / 10) * 10), ','),
  rateNote: rate => `~ is an estimate. R${rate.toFixed(2)} = €1.`,
};

function translateStrictly(text) {
  if (!(text in ro)) throw new Error(`Missing Romanian translation for: ${text}`);
  return ro[text];
}

function romanianNights(n) {
  if (n === 1) return '1 noapte';
  const lastTwo = n % 100;
  return lastTwo >= 1 && lastTwo <= 19 ? `${n} nopți` : `${n} de nopți`;
}

const romanian = {
  lang: 'ro',
  t: translateStrictly,
  weekdays: ['dum.', 'lun.', 'mar.', 'mie.', 'joi', 'vin.', 'sâm.'],
  calendarHeader: ['LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SÂM', 'DUM'],
  months: ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.'],
  nights: romanianNights,
  euro(amount, cents = false) {
    const { whole, fraction } = splitAmount(amount, cents);
    return groupThousands(whole, '.') + (fraction ? ',' + fraction : '') + ' €';
  },
  rand: amount => 'R' + groupThousands(String(Math.round(amount / 10) * 10), '.'),
  rateNote: rate => `~ înseamnă o estimare. 1 € = R${rate.toFixed(2).replace('.', ',')}.`,
};

export const locales = { en: english, ro: romanian };
