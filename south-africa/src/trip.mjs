export const tickets = {
  outbound: {
    art: 'flight-out',
    route: ['AMS', 'ZRH', 'JNB'],
    flights: [
      { number: 'LX735', date: 'Fri 4 Dec', times: '20:00 → 21:30' },
      { number: 'LX282', date: 'Fri 4 Dec', times: '22:30 → 10:00', nextDay: true },
    ],
    month: 'Dec',
    day: '04',
  },
  return: {
    art: 'flight-back',
    route: ['JNB', 'ZRH', 'AMS'],
    flights: [
      { number: 'LX283', date: 'Sun 27 Dec', times: '20:40 → 06:10', nextDay: true },
      { number: 'LX724', date: 'Mon 28 Dec', times: '07:15 → 09:00' },
    ],
    month: 'Dec',
    day: '27',
  },
};

export const legs = [
  {
    id: 'arrive', place: 'jnb', name: 'Joburg', color: '#6b3f5e', art: 'joburg',
    from: 5, to: 6, move: 'land',
    getting: ['Land at OR Tambo Sat 10:00'],
    stay: [{ name: 'With family', dates: 'Sat 5 Dec · 1 night', status: 'family', details: [] }],
    plans: [],
    notes: ['Sun morning: fly on to Cape Town'],
  },
  {
    id: 'cpt', place: 'cpt', name: 'Cape Town', color: '#2f7f8a', art: 'cape-town',
    from: 6, to: 12, move: 'fly',
    getting: ['Land Sunday morning'],
    stay: null,
    plans: [{ text: 'Fri evening: dinner at <a href="https://babylonstoren.com/babel" target="_blank" rel="noopener">Babel at Babylonstoren</a>', status: 'todo', detail: 'Farm restaurant in the Winelands, ~1h each way. Go a bit earlier if we can: the garden closes at 18:00.' }, 'Table Mountain cableway'],
    notes: ['Working Mon 7 – Fri 11'],
  },
  {
    id: 'gr', place: 'gr', name: 'Garden Route', color: '#3f6b4a', art: 'garden-route',
    from: 12, to: 13, move: 'drive',
    getting: ['~490 km / 5½h drive from Cape Town'],
    stay: [{ name: 'Knysna', dates: 'Sat 12 Dec · 1 night', status: 'todo', details: ['Or Plettenberg Bay, 30 min further'] }],
    plans: ['Sun: stop at Storms River Mouth on the way to Addo'],
    notes: ['Aim to be at Addo by ~16:00'],
  },
  {
    id: 'addo', place: 'addo', name: 'Addo', color: '#c4512a', art: 'addo',
    from: 13, to: 16, move: 'drive',
    getting: ['~310 km / 4h drive from Knysna'],
    stay: [
      { name: 'Main Camp', dates: 'Sun 13 Dec · 1 night', status: 'booked', details: ['SANParks RR776219', 'Check-in 14:00 · check-out 10:00', 'Gate closes 19:00'] },
      { name: 'Nyathi', dates: 'Mon 14 – Wed 16 Dec · 2 nights', status: 'booked', details: [{ text: 'No phone signal or Wi-Fi', warning: true }, 'SANParks RR776219', 'Check-in 14:00 · check-out 10:00', 'Gate open 06:00–18:00', 'Self-catering'] },
    ],
    plans: [{ text: 'Guided game drive, Sun evening or Mon morning', status: 'todo', detail: 'Three options: sunrise (05:30), sunset (17:30) or night (19:30), ~2 hours each. Book ahead and check in 30 min before. Night: best for lions, hyenas, jackals. Sunrise: animals most active.' }, 'Self-drives through the park'],
    notes: ['Buy food and supplies before Addo: Nyathi is self-catering'],
  },
  {
    id: 'cr', place: 'cr', name: 'Cannon Rocks', color: '#d98e1f', art: 'cannon-rocks',
    from: 16, to: 19, move: 'drive',
    getting: ['~125 km / 2h drive from Nyathi (Addo)'],
    stay: [{ name: 'Cannon Rocks or Kenton-on-Sea', dates: 'Wed 16 – Sat 19 Dec · 3 nights', status: 'todo', details: ['Self-catering'] }],
    plans: ['Beach days'],
    notes: ['Small shops only: Kenton-on-Sea is 15 min away'],
  },
  {
    id: 'xmas', place: 'jnb', name: 'Joburg', color: '#6b3f5e', art: 'christmas',
    from: 19, to: 27, move: 'fly',
    getting: ['~135 km / 1½h drive from Cannon Rocks to Gqeberha airport', 'Drop the rental car at Gqeberha', { text: 'Fly Gqeberha → Joburg · ~1h45', status: 'todo' }],
    stay: [{ name: 'Airbnb in Boksburg', dates: 'Sat 19 – Sun 27 Dec · 8 nights', status: 'todo', details: [] }],
    plans: ['Christmas with family, Fri 25 Dec'],
    decide: ['Rent a car?'],
    notes: ['We both work Mon 21 – Tue 22'],
  },
];

export const randPerEuro = 18.5;

export const budget = [
  { item: 'Flights Amsterdam ⇄ Joburg', detail: 'Return via Zurich, 2 people', estimate: 2000, actual: 1927.74, currency: 'EUR', paidBy: 'Jason' },
  { item: 'Flight Joburg → Cape Town', detail: 'Sun 6 Dec, 2 people', estimate: 4000 },
  { item: 'Cape Town stay', detail: '6 nights', estimate: 15000 },
  { item: 'Babylonstoren dinner', detail: 'Babel set menu, wine and tip, plus transport both ways', estimate: 4800 },
  { item: 'Cape Town car rental', detail: '7 days, including one-way fee', estimate: 7000 },
  { item: 'Fuel, Cape Town → Gqeberha', detail: '~1,300 km', estimate: 2800 },
  { item: 'Knysna stay', detail: '1 night', estimate: 1800 },
  { item: 'Addo: Main Camp + Nyathi', detail: '3 nights + park fees · SANParks RR776219', estimate: 420, actual: 582.45, currency: 'EUR', paidBy: 'Jason' },
  { item: 'Addo game drive', detail: '2 people', estimate: 1600 },
  { item: 'Cannon Rocks stay', detail: '3 nights', estimate: 4500 },
  { item: 'Flight Gqeberha → Joburg', detail: 'Sat 19 Dec, 2 people', estimate: 3600 },
  { item: 'Boksburg stay', detail: '8 nights', estimate: 12000 },
  { item: 'Getting around Joburg', detail: 'Mostly lifts from family', estimate: 100, currency: 'EUR' },
  { item: 'Food & daily spending', detail: '~€60 a day for 2 × 22 days', estimate: 1320, currency: 'EUR' },
  { item: 'Travel insurance, Jason', detail: 'Single trip', estimate: 70, currency: 'EUR' },
];

export const leave = [['2026-12-14', '2026-12-18'], ['2026-12-23', '2026-12-28']];
export const publicHolidays = ['2026-12-25', '2026-12-26', '2027-01-01'];

export const tripStart = '2026-12-04';
export const tripEnd = '2026-12-28';

export const todos = [
  {
    group: 'Trip',
    items: [
      { done: true, what: 'Book Amsterdam ⇄ Joburg flights', when: 'Fri 4 & Sun 27 Dec', note: 'SWISS · LX735, LX282, LX283, LX724' },
      { what: 'Update leave', when: 'Mon 14 – Fri 18, Wed 23 – Mon 28 Dec', note: 'Instead of Mon 21 – Tue 22 and Tue 29 – Thu 31 Dec', who: 'Denisa' },
      { what: 'Get travel insurance', when: 'Before Fri 4 Dec', note: 'Single trip', who: 'Jason' },
      { what: 'Check travel insurance cover', when: 'Before Fri 4 Dec', note: 'Does the current policy cover South Africa?', who: 'Denisa' },
    ],
  },
  {
    group: 'cpt',
    items: [
      { what: 'Book Joburg → Cape Town flights', when: 'Sun 6 Dec, morning' },
      { what: 'Book Babylonstoren dinner', when: 'Fri 11 Dec, evening', note: '<a href="https://babylonstoren.com/babel" target="_blank" rel="noopener">Babel at Babylonstoren</a>' },
      { what: 'Book transport to and from Babylonstoren', when: 'Fri 11 Dec', note: '~1h each way' },
      { what: 'Book Cape Town stay', when: 'Sun 6 – Sat 12 Dec', note: '6 nights, good Wi-Fi for the work week' },
      { what: 'Book Cape Town car rental', when: 'Sat 12 – Sat 19 Dec', note: 'One way, drop off at Gqeberha' },
    ],
  },
  {
    group: 'gr',
    items: [
      { what: 'Book Knysna stay', when: 'Sat 12 Dec', note: '1 night, or Plettenberg Bay' },
    ],
  },
  {
    group: 'addo',
    items: [
      { done: true, what: 'Book Main Camp + Nyathi', when: 'Sun 13 – Wed 16 Dec', note: 'SANParks RR776219' },
      { what: 'Book Addo game drive', when: 'Sun 13 eve or Mon 14 morning', note: 'Sunrise 05:30, sunset 17:30 or night 19:30 · check in 30 min before' },
    ],
  },
  {
    group: 'cr',
    items: [
      { what: 'Book Cannon Rocks stay', when: 'Wed 16 – Sat 19 Dec', note: '3 nights, or Kenton-on-Sea' },
    ],
  },
  {
    group: 'xmas',
    items: [
      { what: 'Book Gqeberha → Joburg flights', when: 'Sat 19 Dec, early afternoon' },
      { what: 'Book Boksburg Airbnb', when: 'Sat 19 – Sun 27 Dec' },
    ],
  },
];
