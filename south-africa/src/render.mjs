import { icons } from './icons.mjs';
import { locales } from './locale.mjs';
import { tickets, legs, randPerEuro, budget, leave, publicHolidays, tripStart, tripEnd, todos } from './trip.mjs';
import {
  provinces, neighbours, provinceShades, easternCapeDetail, addoParkDetail, addoPark,
  place, drives, flights, markers, insetBounds, insetMarkers, insetDots,
} from './geo.mjs';

const AIR = '#1f2a24';

// Set per render; every helper below reads the active language from here.
let l = locales.en;
const t = text => l.t(text);

const pad = n => String(n).padStart(2, '0');
const iso = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const isWeekend = date => date.getDay() === 0 || date.getDay() === 6;
const isPublicHoliday = date => publicHolidays.includes(iso(date));
const within = (ranges, date) => ranges.some(([from, to]) => iso(date) >= from && iso(date) <= to);

function dayStatus(date) {
  if (iso(date) < tripStart || iso(date) > tripEnd) return '';
  if (isPublicHoliday(date)) return 'holiday';
  if (isWeekend(date)) return '';
  return within(leave, date) ? 'off' : 'work';
}

function svgIcon(name, className, title = '') {
  const label = title ? `<title>${title}</title>` : '';
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${label}${icons[name]}</svg>`;
}

const dayName = d => l.weekdays[new Date(2026, 11, d).getDay()];
const nights = leg => leg.to - leg.from;
const legNumber = leg => legs.indexOf(leg) + 1;
const legById = id => legs.find(leg => leg.id === id);
const when = leg => `${dayName(leg.from)} ${leg.from} – ${dayName(leg.to)} ${leg.to} ${l.months[11]} · ${l.nights(nights(leg))}`;

/* ---------- overview cards ---------- */

function renderLegs() {
  return legs.map(leg => `
  <a class="leg" href="#stop-${leg.id}" data-leg="${leg.id}">
    <div class="art" style="background-image:url('${leg.art}')"></div>
    <div class="side">
      <div class="badge" style="background:${leg.color}">${legNumber(leg)}</div>
    </div>
    <div class="body">
      <h3>${leg.name}</h3>
      <div class="when">${when(leg)}</div>
    </div>
  </a>`).join('');
}

/* ---------- stop sections ---------- */

const undecided = () => `<div class="empty">${svgIcon('undecided', '')}${t('To be decided')}</div>`;
const statusTitle = { booked: 'Booked', todo: 'To book' };
const statusBadge = status => statusTitle[status] ? `<span class="status is-${status}">${t(statusTitle[status])}</span>` : '';

function listItem(item) {
  if (typeof item === 'string') return `<li>${t(item)}</li>`;
  if (item.warning) return `<li class="warning">${t(item.text)}</li>`;
  const detail = item.detail ? `<div class="detail">${t(item.detail)}</div>` : '';
  return `<li>${t(item.text)}${statusBadge(item.status)}${detail}</li>`;
}

const list = items => `<ul>${items.map(listItem).join('')}</ul>`;

function stayBlock(stays) {
  const showDates = stays.length > 1;
  return stays.map(stay => `
    <div class="stay">
      <div class="name">${t(stay.name)}${statusBadge(stay.status)}</div>
      ${showDates ? `<div class="dates">${t(stay.dates)}</div>` : ''}
      ${stay.details.length ? list(stay.details) : ''}
    </div>`).join('');
}

function planBlock(plans) {
  if (!plans) return undecided();
  if (!plans.length) return `<div class="empty">${svgIcon('sofa', '')}${t('Nothing planned')}</div>`;
  return list(plans);
}

function block(title, content, kind) {
  return content ? `<div class="block ${kind}"><h4>${t(title)}</h4>${content}</div>` : '';
}

function ticket({ art, route, flights: legsFlown, month, day }) {
  const rows = legsFlown.map(flight => {
    const nextDay = flight.nextDay ? ' <small>+1</small>' : '';
    return `<div><b>${flight.number}</b><span>${t(flight.date)}</span><span>${flight.times}${nextDay}</span></div>`;
  }).join('');
  return `
  <div class="stop-ticket">
    <div class="ticket">
      <div class="main">
        <div class="flight-art" style="background-image:url('images/${art}.jpg')" aria-hidden="true"></div>
        <img class="airline" src="images/swiss.svg" alt="SWISS">
        <div class="route">${route.join(' <span>→</span> ')}</div>
        <div class="legs-list">${rows}</div>
      </div>
      <div class="stub"><span class="label" style="color:var(--sand)">${t(month)}</span><b>${day}</b></div>
    </div>
  </div>`;
}

function renderStops() {
  const stops = legs.map(leg => `
  <article class="stop" id="stop-${leg.id}">
    <div class="stop-art" style="background-image:url('${leg.art}')"></div>
    <div class="stop-head">
      <div class="badge" style="background:${leg.color}">${legNumber(leg)}</div>
      <div>
        <h3>${leg.name}</h3>
        <div class="when">${when(leg)}</div>
      </div>
    </div>
    <div class="blocks">
      <div class="column">
        ${block('Getting there', leg.getting.length && list(leg.getting), 'getting')}
        ${block('Plans', planBlock(leg.plans), 'plans')}
        ${block('To decide', leg.decide?.length && list(leg.decide), 'decide')}
      </div>
      <div class="column">
        ${block('Where we stay', leg.stay ? stayBlock(leg.stay) : undecided(), 'stay')}
        ${block('Notes', leg.notes.length && list(leg.notes), 'notes')}
      </div>
    </div>
  </article>`).join('');
  return ticket(tickets.outbound) + stops + ticket(tickets.return);
}

/* ---------- to do ---------- */

function renderTodos() {
  return todos.map(({ group, items }) => {
    const leg = legById(group);
    const dot = leg ? `<i style="background:${leg.color}"></i>` : '<i></i>';
    const rows = items.map(item => {
      const assignee = item.who ? `<span class="who">@${item.who}</span>` : '';
      const note = item.note ? t(item.note) : '';
      return `<li${item.done ? ' class="done"' : ''}><span class="what">${t(item.what)}</span><span class="when">${t(item.when)}</span><span class="note">${note}</span><span class="assignee">${assignee}</span></li>`;
    }).join('\n      ');
    return `
    <h3 class="todo-group">${dot}${leg?.name ?? t(group)}</h3>
    <ul class="todo">
      ${rows}
    </ul>`;
  }).join('');
}

/* ---------- budget ---------- */

const toEuro = (amount, currency) => currency === 'EUR' ? amount : amount / randPerEuro;
const euro = (amount, cents) => l.euro(amount, cents);
const rand = amount => l.rand(amount);

function budgetRow(line) {
  const amount = toEuro(line.actual ?? line.estimate, line.currency);
  const paid = line.paidBy ? `<span class="chip paid">${svgIcon('paid', '', t('Paid'))}${line.paidBy}</span>` : '';
  return `<li class="${line.actual ? 'actual' : 'estimate'}">
    <div><div class="what">${t(line.item)}</div>${line.detail ? `<div class="detail">${t(line.detail)}</div>` : ''}</div>
    <div class="payer">${paid}</div>
    <div class="amount"><b>${line.actual ? euro(amount, true) : '~' + euro(amount)}</b><small>${rand(amount * randPerEuro)}</small></div>
  </li>`;
}

function renderBudget() {
  const total = budget.reduce((sum, line) => sum + toEuro(line.actual ?? line.estimate, line.currency), 0);
  const paidLines = budget.filter(line => line.actual && line.paidBy);
  const paidTotal = paidLines.reduce((sum, line) => sum + toEuro(line.actual, line.currency), 0);
  const summary = `
  <div><span class="label">${t('Total')}</span><b>${euro(total)}</b><small>${rand(total * randPerEuro)}</small></div>
  <div><span class="label">${t('Each')}</span><b>${euro(total / 2)}</b><small>${rand(total / 2 * randPerEuro)}</small></div>
  <div><span class="label">${t('Paid')}</span><b>${euro(paidTotal, true)}</b><small>${rand(paidTotal * randPerEuro)}</small></div>`;
  const rows = budget.map(budgetRow).join('') +
    `<li class="rate"><div class="detail">${l.rateNote(randPerEuro)}</div></li>`;
  return { summary, rows };
}

/* ---------- calendar ---------- */

function describeDay(date) {
  const inDec = date.getMonth() === 11;
  const d = date.getDate();
  if (!inDec || d < 4 || d > 28) return { off: true };
  if (d === 4) return { bg: AIR, icon: 'takeoff', note: 'AMS 20:00' };
  if (d === 27) return { bg: `linear-gradient(135deg, ${legs.at(-1).color} 50%, ${AIR} 50%)`, icon: 'takeoff', note: 'Joburg 20:40', leg: 'xmas' };
  if (d === 28) return { bg: AIR, icon: 'landing', note: 'AMS 09:00' };

  const index = legs.findIndex(leg => d >= leg.from && d < leg.to);
  const leg = legs[index];
  if (d !== leg.from) return { bg: leg.color, note: leg.name, leg: leg.id };

  const previous = legs[index - 1]?.color ?? AIR;
  const moveIcons = { fly: 'plane', land: 'landing', drive: 'car' };
  return { bg: `linear-gradient(135deg, ${previous} 50%, ${leg.color} 50%)`, icon: moveIcons[leg.move], note: leg.name, leg: leg.id };
}

function christmasScene() {
  return '<div class="scene" aria-hidden="true"></div>';
}

function renderCalendar() {
  const header = l.calendarHeader.map(d => `<div class="dow">${d}</div>`).join('');
  const cells = [];
  for (let i = 0; i < 35; i++) {
    const date = new Date(2026, 10, 30 + i);
    const info = describeDay(date);
    const isChristmas = date.getMonth() === 11 && date.getDate() === 25;
    const isNewYear = date.getMonth() === 0 && date.getDate() === 1;
    const month = date.getMonth() === 11 ? '' : `<small>${l.months[date.getMonth()]}</small>`;
    const classes = ['day', info.off && 'off', isChristmas && 'christmas', isNewYear && 'new-year'].filter(Boolean).join(' ');
    const style = info.bg ? ` style="background:${info.bg}"` : '';
    const dataLeg = info.leg ? ` data-leg="${info.leg}"` : '';
    const note = info.note ? `<div class="note">${info.icon ? svgIcon(info.icon, 'mini') : ''}<span>${isChristmas ? t('Christmas!') : info.note}</span></div>` : '';
    const working = dayStatus(date) === 'work' ? svgIcon('working', 'day-icon', t('Working')) : '';
    cells.push(`<div class="${classes}"${style}${dataLeg}>${isChristmas ? christmasScene() : ''}${isNewYear ? '<div class="scene" aria-hidden="true"></div>' : ''}<div class="num">${date.getDate()}${month}</div>${note}${working}</div>`);
  }
  return header + cells.join('\n');
}

/* ---------- map ---------- */

const project = ([lat, lon]) => [(lon - 16) * 43.75 + 30, (-21.2 - lat) * 50];
const line = points => 'M' + points.map(p => project(p).map(v => v.toFixed(1)).join(',')).join(' L');
const shape = rings => rings.map(ring => line(ring) + 'Z').join(' ');
const legColor = id => legById(id).color;

function arc(a, b, bend) {
  const [x1, y1] = project(a);
  const [x2, y2] = project(b);
  const cx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const cy = (y1 + y2) / 2 + (x2 - x1) * bend;
  return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
}

function marker({ place: id, dx, dy, anchor, text }, k) {
  const [x, y] = project(place[id]);
  const stops = legs.filter(leg => leg.place === id);
  const radius = 13 * k;
  const step = radius * 1.45;
  const firstX = x - (stops.length - 1) * step / 2;
  const badges = stops.map((leg, i) => `<g data-leg="${leg.id}">
    <circle cx="${firstX + i * step}" cy="${y}" r="${radius}" fill="${leg.color}" stroke="#1f2a24" stroke-width="${2.5 * k}"/>
    <text x="${firstX + i * step}" y="${y + 5 * k}" font-family="Fraunces, serif" font-weight="900" font-size="${15 * k}" fill="#f3e9d6" text-anchor="middle">${legNumber(leg)}</text>
  </g>`).reverse().join('');
  const label = text ? `<text data-leg="${stops.map(leg => leg.id).join(' ')}" x="${x + dx * k}" y="${y + dy * k}" font-size="${13 * Math.min(k, 1.6)}" font-weight="700" fill="#1f2a24" text-anchor="${anchor}">${text}</text>` : '';
  return `<g>${badges}${label}</g>`;
}

function oceanLabels(k) {
  if (k === 1) {
    return `<text x="40" y="700" font-family="Fraunces, serif" font-style="italic" font-size="22" fill="#2f7f8a">${t('Atlantic')}</text>
  <text x="795" y="530" font-family="Fraunces, serif" font-style="italic" font-size="22" fill="#2f7f8a" text-anchor="end">${t('Indian Ocean')}</text>`;
  }
  return `<text transform="translate(52 610) rotate(-90)" font-family="Fraunces, serif" font-style="italic" font-size="${22 * k}" fill="#2f7f8a">${t('Atlantic')}</text>
  <text x="790" y="625" font-family="Fraunces, serif" font-style="italic" font-size="${22 * k}" fill="#2f7f8a" text-anchor="end">${t('Indian Ocean')}</text>`;
}

function insetBox() {
  const [x1, y1] = project([insetBounds.north, insetBounds.west]);
  const [x2, y2] = project([insetBounds.south, insetBounds.east]);
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

function insetOutline(k) {
  const box = insetBox();
  return `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="${3 * k}" fill="none" stroke="#1f2a24" stroke-width="${1.5 * k}" stroke-dasharray="${4 * k} ${3 * k}"/>`;
}

function laneOffset(points, distance) {
  const xy = points.map(project);
  const shifted = xy.map(([x, y], i) => {
    const [px, py] = xy[Math.max(i - 1, 0)];
    const [nx, ny] = xy[Math.min(i + 1, xy.length - 1)];
    const length = Math.hypot(nx - px, ny - py) || 1;
    return [x + (ny - py) / length * distance, y - (nx - px) / length * distance];
  });
  return 'M' + shifted.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L');
}

function dot({ place: id, dx, dy, anchor, text }, k) {
  const [x, y] = project(place[id]);
  return `<circle cx="${x}" cy="${y}" r="${4.5 * k}" fill="#f3e9d6" stroke="#1f2a24" stroke-width="${2 * k}"/>
    <text x="${x + dx * k}" y="${y + dy * k}" font-size="${12 * k}" font-weight="700" fill="#1f2a24" text-anchor="${anchor}" stroke="#f3e9d6" stroke-width="${4 * k}" stroke-linejoin="round" paint-order="stroke">${t(text)}</text>`;
}

function mapSvg(variant, k) {
  return `
<svg class="map-${variant}" aria-hidden="true" viewBox="0 0 800 720" xmlns="http://www.w3.org/2000/svg" style="font-family: var(--body-font)">
  <defs>
    <pattern id="hatch-${variant}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill="#c4512a" opacity=".18"/>
      <line x1="0" y1="0" x2="0" y2="6" stroke="#c4512a" stroke-width="2"/>
    </pattern>
    <pattern id="waves-${variant}" width="24" height="10" patternUnits="userSpaceOnUse">
      <path d="M0 5 Q6 1 12 5 T24 5" fill="none" stroke="#2f7f8a" stroke-opacity=".18" stroke-width="1.2"/>
    </pattern>
  </defs>
  <rect width="800" height="720" fill="url(#waves-${variant})"/>
  ${Object.values(provinces).map(rings => `<path d="${shape(rings)}" fill="#1f2a24" stroke="#1f2a24" stroke-width="${5 * k}" stroke-linejoin="round"/>`).join('')}
  ${neighbours.map(rings => `<path d="${shape(rings)}" fill="#f3e9d6"/>`).join('')}
  ${Object.entries(provinces).map(([name, rings]) => `<path d="${shape(rings)}" fill="${provinceShades[name]}" stroke="#1f2a24" stroke-opacity=".3" stroke-width="1" stroke-linejoin="round"/>`).join('')}
  ${neighbours.map(rings => `<path d="${shape(rings)}" fill="none" stroke="#1f2a24" stroke-width="1.2" stroke-dasharray="4 3"/>`).join('')}
  <path d="${line(addoPark)}Z" fill="url(#hatch-${variant})" stroke="#c4512a" stroke-width="1.5"/>

  ${oceanLabels(k)}

  ${drives.map(r => `
    <path d="${line(r.path)}" fill="none" stroke="#1f2a24" stroke-width="${7 * k}" stroke-linecap="round" stroke-linejoin="round" data-leg="${r.leg}"/>
    <path d="${line(r.path)}" fill="none" stroke="${legColor(r.leg)}" stroke-width="${4 * k}" stroke-linecap="round" stroke-linejoin="round" data-leg="${r.leg}"/>`).join('')}
  ${flights.map(f => `<path class="flight" d="${arc(f.from, f.to, f.bend)}" stroke-width="${2 * k}" stroke-dasharray="${3 * k} ${7 * k}" style="--dash-cycle:${-20 * k}" data-leg="${f.leg}"/>`).join('')}

  ${insetOutline(k)}
  ${markers.map(m => marker(m, k)).join('')}
</svg>`;
}

function insetSvg(variant, k) {
  const box = insetBox();
  const insetDrives = drives.filter(r => ['addo', 'cr', 'xmas'].includes(r.leg));
  return `
<svg class="inset-${variant}" aria-hidden="true" viewBox="${box.x} ${box.y} ${box.width} ${box.height}" xmlns="http://www.w3.org/2000/svg" style="font-family: var(--body-font)">
  <defs>
    <pattern id="inset-hatch-${variant}" width="${6 * k}" height="${6 * k}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="${6 * k}" height="${6 * k}" fill="#c4512a" opacity=".18"/>
      <line x1="0" y1="0" x2="0" y2="${6 * k}" stroke="#c4512a" stroke-width="${2 * k}"/>
    </pattern>
    <pattern id="inset-waves-${variant}" width="${24 * k}" height="${10 * k}" patternUnits="userSpaceOnUse">
      <path d="M0 ${5 * k} Q${6 * k} ${k} ${12 * k} ${5 * k} T${24 * k} ${5 * k}" fill="none" stroke="#2f7f8a" stroke-opacity=".18" stroke-width="${1.2 * k}"/>
    </pattern>
  </defs>
  <rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="url(#inset-waves-${variant})"/>
  <path d="${line(easternCapeDetail)}Z" fill="${provinceShades['Eastern Cape']}" stroke="#1f2a24" stroke-width="${2.5 * k}" stroke-linejoin="round"/>
  <path d="${shape(addoParkDetail)}" fill="url(#inset-hatch-${variant})" stroke="#c4512a" stroke-width="${1.5 * k}"/>
  ${insetDrives.map(r => `<path d="${laneOffset(r.path, 2.2 * k)}" fill="none" stroke="#1f2a24" stroke-width="${6 * k}" stroke-linecap="round" stroke-linejoin="round" data-leg="${r.leg}"/>`).join('')}
  ${insetDrives.map(r => `<path d="${laneOffset(r.path, 2.2 * k)}" fill="none" stroke="${legColor(r.leg)}" stroke-width="${3.2 * k}" stroke-linecap="round" stroke-linejoin="round" data-leg="${r.leg}"/>`).join('')}
  ${insetDots.map(d => dot(d, k)).join('')}
  ${insetMarkers.map(m => marker(m, k)).join('')}
</svg>`;
}

// The inset scales with its box, so k is tuned to the box width it gets in each layout.
function renderInset() {
  const { width } = insetBox();
  const desktopWidth = 245;
  const stackedWidth = 360;
  return `<div class="inset">${insetSvg('side', 0.8 * width / desktopWidth)}${insetSvg('stacked', 0.8 * width / stackedWidth)}</div>`;
}

function renderMap() {
  return mapSvg('desktop', 1) + mapSvg('mobile', 1.8);
}

export function renderPage(template, lang) {
  l = locales[lang];
  const { summary, rows } = renderBudget();
  const slots = {
    lang: l.lang,
    map: renderMap(),
    inset: renderInset(),
    legs: renderLegs(),
    calendar: renderCalendar(),
    stops: renderStops(),
    todos: renderTodos(),
    budgetSummary: summary,
    budget: rows,
  };
  return template
    .replace(/\[\[(.+?)\]\]/g, (match, text) => t(text))
    .replace(/\{\{(\w+)\}\}/g, (match, name) => {
      if (!(name in slots)) throw new Error(`Unknown template slot: ${name}`);
      return slots[name];
    });
}
