
'use strict';
/* ═══════════════════════════════════════════════
   WaqtX — App Logic v1
   ═══════════════════════════════════════════════ */

var AVG_LIFESPAN_YEARS = 75;
var _birth = null;

/* ── Helpers ── */
function el(id) { return document.getElementById(id); }
function setText(id, v) { var e = el(id); if (e) e.textContent = v; }
function fmt(n) { return Number(n).toLocaleString(); }

function parseDOB(str) {
  var p = str.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

function getTotals(birth) {
  var ms = Date.now() - birth.getTime();
  var sec = Math.floor(ms / 1000);
  var min = Math.floor(sec / 60);
  var hr  = Math.floor(min / 60);
  var day = Math.floor(hr / 24);
  return { sec: sec, min: min, hr: hr, day: day };
}

function getBreakdown(birth) {
  var n = new Date();
  var yy = n.getFullYear() - birth.getFullYear();
  var mo = n.getMonth()    - birth.getMonth();
  var dd = n.getDate()     - birth.getDate();
  if (dd < 0) { dd += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yy--; }
  return { yy: yy, mo: mo, dd: dd };
}

/* ── Gregorian → Hijri ── */
function toHijri(date) {
  var jd = Math.floor((14 + date.getMonth() + 1) / 12);
  var y  = date.getFullYear() + 4800 - jd;
  var m  = date.getMonth() + 1 + 12 * jd - 3;
  var jdn = date.getDate()
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;
  var l = jdn - 1948440 + 10632;
  var n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  var j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719))
        + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l
    - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50))
    - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43))
    + 29;
  var hYear  = 19 * n + Math.floor(j / 4) + Math.floor(l / 29) - 30;
  var hMonth = Math.floor((59 * (l - 1) + 1) / 1771);
  return { year: hYear, month: hMonth };
}

var HIJRI_MONTHS = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'
];

/* ── World Data (Pakistan-focused, 1947–2024) ── */
var WORLD_DATA = {
  1947: { pm: 'Liaquat Ali Khan',        president: 'Muhammad Ali Jinnah',    currency: 'Pakistani Rupee (PKR)', pop: '2.3 Billion', event: 'Pakistan Independence',        tech: 'First Transistor Invented' },
  1948: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.4 Billion', event: 'State of Israel Founded',       tech: 'Long-Playing Record (LP)' },
  1949: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.5 Billion', event: 'NATO Founded',                  tech: 'First Stored-Program Computer' },
  1950: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.5 Billion', event: 'Korean War Began',              tech: 'Credit Card Invented' },
  1951: { pm: 'Liaquat Ali Khan',        president: 'Khawaja Nazimuddin',     currency: 'Pakistani Rupee (PKR)', pop: '2.6 Billion', event: 'First Nuclear Power Plant',     tech: 'Color TV Introduced' },
  1952: { pm: 'Khawaja Nazimuddin',      president: 'Ghulam Mohammad',        currency: 'Pakistani Rupee (PKR)', pop: '2.6 Billion', event: 'Queen Elizabeth II Crowned',    tech: 'Polio Vaccine Developed' },
  1953: { pm: 'Mohammad Ali Bogra',      president: 'Ghulam Mohammad',        currency: 'Pakistani Rupee (PKR)', pop: '2.7 Billion', event: 'Korean War Ended',              tech: 'DNA Double Helix Discovered' },
  1954: { pm: 'Mohammad Ali Bogra',      president: 'Ghulam Mohammad',        currency: 'Pakistani Rupee (PKR)', pop: '2.8 Billion', event: 'First Nuclear Submarine',       tech: 'FORTRAN Language Created' },
  1955: { pm: 'Chaudhry Mohammad Ali',   president: 'Iskander Mirza',         currency: 'Pakistani Rupee (PKR)', pop: '2.8 Billion', event: 'Warsaw Pact Signed',            tech: 'Disneyland Opened' },
  1956: { pm: 'Huseyn Shaheed Suhrawardy', president: 'Iskander Mirza',       currency: 'Pakistani Rupee (PKR)', pop: '2.9 Billion', event: 'Suez Crisis',                   tech: 'Hard Disk Drive Invented' },
  1957: { pm: 'Huseyn Shaheed Suhrawardy', president: 'Iskander Mirza',       currency: 'Pakistani Rupee (PKR)', pop: '3.0 Billion', event: 'Sputnik Launched',              tech: 'First Satellite in Space' },
  1958: { pm: 'Feroz Khan Noon',         president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.0 Billion', event: 'NASA Founded',                  tech: 'Integrated Circuit Invented' },
  1959: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.1 Billion', event: 'Cuban Revolution',              tech: 'Microchip Invented' },
  1960: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.0 Billion', event: 'Islamabad Became Capital',       tech: 'Laser Invented' },
  1961: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.1 Billion', event: 'Berlin Wall Built',             tech: 'First Human in Space' },
  1962: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.2 Billion', event: 'Cuban Missile Crisis',          tech: 'First Communications Satellite' },
  1963: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.2 Billion', event: 'JFK Assassinated',              tech: 'Cassette Tape Invented' },
  1964: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.3 Billion', event: 'Civil Rights Act Signed',       tech: 'BASIC Language Created' },
  1965: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.4 Billion', event: 'Indo-Pak War 1965',             tech: 'Minicomputer Introduced' },
  1966: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.4 Billion', event: 'Cultural Revolution in China',  tech: 'First Soft Landing on Moon' },
  1967: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.5 Billion', event: 'Six-Day War',                   tech: 'First Heart Transplant' },
  1968: { pm: 'Ayub Khan',               president: 'Ayub Khan',              currency: 'Pakistani Rupee (PKR)', pop: '3.6 Billion', event: 'Martin Luther King Killed',     tech: 'Intel Founded' },
  1969: { pm: 'Yahya Khan',              president: 'Yahya Khan',             currency: 'Pakistani Rupee (PKR)', pop: '3.7 Billion', event: 'Moon Landing',                  tech: 'ARPANET (Internet) Created' },
  1970: { pm: 'Yahya Khan',              president: 'Yahya Khan',             currency: 'Pakistani Rupee (PKR)', pop: '3.7 Billion', event: 'Bangladesh Liberation War',     tech: 'Floppy Disk Invented' },
  1971: { pm: 'Zulfikar Ali Bhutto',     president: 'Zulfikar Ali Bhutto',    currency: 'Pakistani Rupee (PKR)', pop: '3.8 Billion', event: 'Bangladesh Independence',       tech: 'Email Invented' },
  1972: { pm: 'Zulfikar Ali Bhutto',     president: 'Zulfikar Ali Bhutto',    currency: 'Pakistani Rupee (PKR)', pop: '3.9 Billion', event: 'Nixon Visits China',            tech: 'Pong Video Game Released' },
  1973: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.0 Billion', event: 'Oil Crisis',                    tech: 'Ethernet Invented' },
  1974: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.0 Billion', event: 'India Nuclear Test',            tech: 'Barcode Scanner Used' },
  1975: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.1 Billion', event: 'Vietnam War Ended',             tech: 'Microsoft Founded' },
  1976: { pm: 'Zulfikar Ali Bhutto',     president: 'Fazal Ilahi Chaudhry',   currency: 'Pakistani Rupee (PKR)', pop: '4.2 Billion', event: 'Mao Zedong Died',              tech: 'Apple Computer Founded' },
  1977: { pm: 'Zulfikar Ali Bhutto',     president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.2 Billion', event: 'Zia ul-Haq Coup',              tech: 'Apple II Released' },
  1978: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.3 Billion', event: 'Camp David Accords',            tech: 'First Test-Tube Baby Born' },
  1979: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.4 Billion', event: 'Soviet Invasion of Afghanistan', tech: 'VisiCalc Spreadsheet Released' },
  1980: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.4 Billion', event: 'Iran-Iraq War Began',           tech: 'Pac-Man Released' },
  1981: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.5 Billion', event: 'Reagan Inaugurated',            tech: 'IBM PC Released' },
  1982: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.6 Billion', event: 'Falklands War',                 tech: 'CD Player Released' },
  1983: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.7 Billion', event: 'US Embassy Bombing Beirut',     tech: 'Internet Protocols Established' },
  1984: { pm: 'Zia ul-Haq',             president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.8 Billion', event: 'Bhopal Gas Tragedy',            tech: 'Apple Macintosh Released' },
  1985: { pm: 'Muhammad Khan Junejo',    president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.8 Billion', event: 'Live Aid Concert',              tech: 'Windows 1.0 Released' },
  1986: { pm: 'Muhammad Khan Junejo',    president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '4.9 Billion', event: 'Chernobyl Disaster',            tech: 'Pixar Founded' },
  1987: { pm: 'Muhammad Khan Junejo',    president: 'Zia ul-Haq',             currency: 'Pakistani Rupee (PKR)', pop: '5.0 Billion', event: 'Black Monday Stock Crash',      tech: 'GIF Format Created' },
  1988: { pm: 'Benazir Bhutto',          president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.1 Billion', event: 'Lockerbie Bombing',             tech: 'World Wide Web Proposed' },
  1989: { pm: 'Benazir Bhutto',          president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.2 Billion', event: 'Berlin Wall Fell',              tech: 'WWW Invented' },
  1990: { pm: 'Nawaz Sharif',            president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.3 Billion', event: 'German Reunification',          tech: 'World Wide Web Created' },
  1991: { pm: 'Nawaz Sharif',            president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.4 Billion', event: 'Soviet Union Dissolved',        tech: 'Linux Released' },
  1992: { pm: 'Nawaz Sharif',            president: 'Ghulam Ishaq Khan',      currency: 'Pakistani Rupee (PKR)', pop: '5.5 Billion', event: 'Maastricht Treaty Signed',      tech: 'SMS Text Messaging' },
  1993: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.6 Billion', event: 'Oslo Accords Signed',           tech: 'Mosaic Browser Released' },
  1994: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.6 Billion', event: 'Nelson Mandela Elected',        tech: 'Amazon Founded' },
  1995: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.7 Billion', event: 'Oklahoma City Bombing',         tech: 'Windows 95 Released' },
  1996: { pm: 'Benazir Bhutto',          president: 'Farooq Leghari',         currency: 'Pakistani Rupee (PKR)', pop: '5.8 Billion', event: 'Summer Olympics in Atlanta',    tech: 'DVD Format Introduced' },
  1997: { pm: 'Nawaz Sharif',            president: 'Muhammad Rafiq Tarar',   currency: 'Pakistani Rupee (PKR)', pop: '5.9 Billion', event: 'Hong Kong Handover to China',   tech: 'Deep Blue Beats Kasparov' },
  1998: { pm: 'Nawaz Sharif',            president: 'Muhammad Rafiq Tarar',   currency: 'Pakistani Rupee (PKR)', pop: '5.9 Billion', event: 'Pakistan Nuclear Tests',        tech: 'Google Founded' },
  1999: { pm: 'Pervez Musharraf',        president: 'Muhammad Rafiq Tarar',   currency: 'Pakistani Rupee (PKR)', pop: '6.0 Billion', event: 'NATO Kosovo Campaign',          tech: 'Napster Launched' },
  2000: { pm: 'Pervez Musharraf',        president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.1 Billion', event: 'Y2K Fears Unfounded',           tech: 'USB Flash Drive Invented' },
  2001: { pm: 'Pervez Musharraf',        president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.2 Billion', event: 'September 11 Attacks',          tech: 'Wikipedia Launched' },
  2002: { pm: 'Zafarullah Khan Jamali',  president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.2 Billion', event: 'Euro Coins Introduced',         tech: 'Friendster Launched' },
  2003: { pm: 'Zafarullah Khan Jamali',  president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.3 Billion', event: 'Iraq War Began',                tech: 'Skype Launched' },
  2004: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.4 Billion', event: 'Indian Ocean Tsunami',          tech: 'Facebook Founded' },
  2005: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.5 Billion', event: 'Kashmir Earthquake',            tech: 'YouTube Founded' },
  2006: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.6 Billion', event: 'Saddam Hussein Executed',       tech: 'Twitter Launched' },
  2007: { pm: 'Shaukat Aziz',            president: 'Pervez Musharraf',       currency: 'Pakistani Rupee (PKR)', pop: '6.6 Billion', event: 'Benazir Bhutto Assassinated',   tech: 'iPhone Released' },
  2008: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '6.7 Billion', event: 'Global Financial Crisis',       tech: 'Android OS Released' },
  2009: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '6.8 Billion', event: 'Obama Inaugurated',             tech: 'WhatsApp Founded' },
  2010: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '6.9 Billion', event: 'Pakistan Floods',               tech: 'Instagram Launched' },
  2011: { pm: 'Yousaf Raza Gillani',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '7.0 Billion', event: 'Arab Spring',                   tech: 'Siri Launched' },
  2012: { pm: 'Raja Pervaiz Ashraf',     president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '7.1 Billion', event: 'London Olympics',               tech: 'Raspberry Pi Released' },
  2013: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.2 Billion', event: 'Malala Nobel Prize',            tech: 'Snapchat Launched' },
  2014: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.3 Billion', event: 'ISIS Declared Caliphate',       tech: 'Apple Watch Announced' },
  2015: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.4 Billion', event: 'Paris Climate Agreement',       tech: 'Windows 10 Released' },
  2016: { pm: 'Nawaz Sharif',            president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.4 Billion', event: 'Brexit Vote',                   tech: 'Pokemon Go Released' },
  2017: { pm: 'Shahid Khaqan Abbasi',    president: 'Mamnoon Hussain',        currency: 'Pakistani Rupee (PKR)', pop: '7.5 Billion', event: 'Rohingya Crisis',               tech: 'Bitcoin Surged' },
  2018: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.6 Billion', event: 'Saudi Arabia Reforms',          tech: '5G Networks Launched' },
  2019: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.7 Billion', event: 'Notre Dame Fire',               tech: 'Foldable Phones Released' },
  2020: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.8 Billion', event: 'COVID-19 Pandemic',             tech: 'Zoom Became Essential' },
  2021: { pm: 'Imran Khan',              president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '7.9 Billion', event: 'Taliban Retook Afghanistan',    tech: 'NFTs Exploded' },
  2022: { pm: 'Shehbaz Sharif',          president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '8.0 Billion', event: 'Russia-Ukraine War',            tech: 'ChatGPT Launched' },
  2023: { pm: 'Anwaar-ul-Haq Kakar',     president: 'Arif Alvi',              currency: 'Pakistani Rupee (PKR)', pop: '8.1 Billion', event: 'Gaza Conflict',                 tech: 'AI Revolution' },
  2024: { pm: 'Shehbaz Sharif',          president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '8.2 Billion', event: 'Global Elections Year',         tech: 'AI Everywhere' },
  2025: { pm: 'Shehbaz Sharif',          president: 'Asif Ali Zardari',       currency: 'Pakistani Rupee (PKR)', pop: '8.2 Billion', event: 'AI Reshaping the World',        tech: 'Agentic AI Era' }
};

function getWorldData(year) {
  if (WORLD_DATA[year]) return WORLD_DATA[year];
  if (year < 1947) return {
    pm: 'British Colonial Rule', president: 'N/A (Pre-Independence)',
    currency: 'British Indian Rupee', pop: 'Below 2.3 Billion',
    event: 'World War II Era', tech: 'Early Radio & Aviation'
  };
  return WORLD_DATA[2024];
}

/* ── Islamic Dates ── */
function getNextRamadan() {
  var today = new Date();
  // Approximate Ramadan start dates (calculated)
  var ramadans = [
    new Date(2025, 2, 1),   // 1 Mar 2025
    new Date(2026, 1, 18),  // 18 Feb 2026
    new Date(2027, 1, 7),   // 7 Feb 2027
    new Date(2028, 0, 27),  // 27 Jan 2028
    new Date(2029, 0, 16)   // 16 Jan 2029
  ];
  for (var i = 0; i < ramadans.length; i++) {
    if (ramadans[i] > today) {
      return ramadans[i].toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  return '2030';
}

function getNextJumua() {
  var today = new Date();
  var day = today.getDay(); // 0=Sun, 5=Fri
  var daysUntil = (5 - day + 7) % 7;
  if (daysUntil === 0) daysUntil = 7; // already Friday, next one
  var next = new Date(today);
  next.setDate(today.getDate() + daysUntil);
  return next.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

function getMilestoneDate(birth, targetDays) {
  var d = new Date(birth.getTime());
  d.setDate(d.getDate() + targetDays);
  if (d <= new Date()) return 'Achieved \u2713';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Ring Animation ── */
function animateRing(pct) {
  var ring = el('ring-fill');
  if (!ring) return;
  var circumference = 314;
  var offset = circumference - (pct / 100) * circumference;
  setTimeout(function () { ring.style.strokeDashoffset = offset; }, 400);
}

/* ── Counter Animation ── */
function animateCounter(elId, target, duration) {
  var e = el(elId);
  if (!e) return;
  var steps = 60;
  var step = Math.ceil(target / steps);
  var current = 0;
  var interval = Math.floor(duration / steps);
  var timer = setInterval(function () {
    current = Math.min(current + step, target);
    e.textContent = Number(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, interval);
}

/* ── Main Render ── */
function renderAll(birth) {
  _birth = birth;
  var t = getTotals(birth);
  var b = getBreakdown(birth);
  var ageYears = b.yy + b.mo / 12 + b.dd / 365;
  var pct = Math.min(100, (ageYears / AVG_LIFESPAN_YEARS) * 100);
  var pctRound = Math.round(pct * 10) / 10;
  var pctInt = Math.round(pct);

  var hijriBirth = toHijri(birth);
  var hijriNow   = toHijri(new Date());
  var islamicYears = hijriNow.year - hijriBirth.year;
  var ramadans = Math.floor(ageYears);

  var worldData = getWorldData(birth.getFullYear());
  var sleepYears = (ageYears * 0.333).toFixed(1);
  var heartBillions = (t.day * 24 * 60 * 70 / 1e9).toFixed(2);
  var secondsMillion = (t.sec / 1e6).toFixed(1);

  var dayName = birth.toLocaleDateString('en-US', { weekday: 'long' });
  var daySubMap = {
    Friday:    "Jumu'ah \u2013 the best day of the week.",
    Monday:    'A blessed day of the week.',
    Thursday:  'A day of fasting for many.',
    Wednesday: 'A day of remembrance.',
    Saturday:  'A day of rest.',
    Sunday:    'A new beginning.',
    Tuesday:   'A day of strength.'
  };

  /* Show results */
  el('results-section').classList.remove('hidden');
  el('hero').style.minHeight = 'auto';

  /* Glance */
  setText('g-days',    fmt(t.day));
  setText('g-hours',   fmt(t.hr));
  setText('g-sleep',   sleepYears);
  setText('g-hearts',  heartBillions);
  setText('g-sunsets', fmt(t.day));
  setText('g-seconds', secondsMillion);

  /* Islamic */
  setText('ih-hijri-year',    hijriBirth.year + ' AH');
  setText('ih-hijri-month',   HIJRI_MONTHS[(hijriBirth.month - 1) || 0]);
  setText('ih-day',           dayName);
  setText('ih-day-sub',       daySubMap[dayName] || 'A blessed day.');
  setText('ih-ramadans',      ramadans);
  setText('ih-ramadans2',     ramadans);
  setText('ih-hajj',          ramadans);
  setText('ih-hajj2',         ramadans);
  setText('ih-islamic-years', islamicYears);
  setText('ih-hijri-range',   hijriBirth.year + ' AH \u2013 ' + hijriNow.year + ' AH');
  setText('ih-next-ramadan',  getNextRamadan());

  /* World */
  setText('w-pm',         worldData.pm);
  setText('w-president',  worldData.president);
  setText('w-currency',   worldData.currency);
  setText('w-population', worldData.pop);
  setText('w-event',      worldData.event);
  setText('w-tech',       worldData.tech);

  /* Journey ring */
  setText('journey-pct',  pctInt + '%');
  setText('journey-pct2', pctRound + '%');
  animateRing(pctInt);

  /* Milestones */
  setText('ms-jumua',  getNextJumua());
  setText('ms-10k',    getMilestoneDate(birth, 10000));
  var age30 = new Date(birth.getFullYear() + 30, birth.getMonth(), birth.getDate());
  setText('ms-age30',  age30 <= new Date() ? 'Achieved \u2713' : age30.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));
  setText('ms-1b',     getMilestoneDate(birth, Math.floor(1e9 / 86400)));

  /* Share preview */
  setText('sp-days',  fmt(t.day));
  setText('sp-hijri', hijriBirth.year + ' AH \u2013 ' + hijriNow.year + ' AH');

  /* Modal card */
  setText('scdl-pct',   pctInt + '%');
  setText('scdl-days',  fmt(t.day) + ' Days Lived');
  setText('scdl-hijri', hijriBirth.year + ' AH \u2013 ' + hijriNow.year + ' AH');

  /* ── New Features ── */
  renderLifeStory(birth, ageYears, hijriBirth, hijriNow, ramadans, t);
  renderTimeTruth(ageYears, t);
  renderInsight(birth, t);

  /* Animate day counter */
  setTimeout(function () { animateCounter('g-days', t.day, 1200); }, 500);

  /* Live tick every second */
  clearInterval(window._ticker);
  window._ticker = setInterval(function () {
    var t2 = getTotals(_birth);
    setText('g-hours',   fmt(t2.hr));
    setText('g-seconds', (t2.sec / 1e6).toFixed(1));
  }, 1000);

  /* Save DOB */
  try { localStorage.setItem('waqtx_dob', birth.toISOString().split('T')[0]); } catch(e) {}

  /* Scroll to results */
  setTimeout(function () {
    var gs = el('results-section');
    if (gs) gs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

/* ── Loading Sequence ── */
function showLoading(cb) {
  var overlay = el('loading-overlay');
  var textEl  = el('loading-text');
  var barFill = el('loading-bar-fill');

  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  /* Reset and animate bar */
  if (barFill) {
    barFill.style.transition = 'none';
    barFill.style.width = '0%';
    setTimeout(function () {
      barFill.style.transition = 'width 2.7s ease';
      barFill.style.width = '100%';
    }, 30);
  }

  var msgs = [
    'Analyzing your time\u2026',
    'Calculating your Islamic history\u2026',
    'Building your timeline\u2026'
  ];
  var i = 0;
  textEl.textContent = msgs[0];
  textEl.style.opacity = '1';

  var seq = setInterval(function () {
    i++;
    if (i < msgs.length) {
      textEl.style.opacity = '0';
      setTimeout(function () {
        textEl.textContent = msgs[i];
        textEl.style.opacity = '1';
      }, 300);
    } else {
      clearInterval(seq);
      setTimeout(function () {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        if (barFill) { barFill.style.transition = 'none'; barFill.style.width = '0%'; }
        cb();
      }, 600);
    }
  }, 900);
}

/* ── Event Listeners ── */
el('btn-calculate').addEventListener('click', function () {
  var dob   = el('hero-dob').value;
  var errEl = el('hero-error');
  errEl.classList.add('hidden');

  if (!dob) {
    errEl.textContent = 'Please select your date of birth.';
    errEl.classList.remove('hidden');
    return;
  }
  var birth = parseDOB(dob);
  if (birth > new Date()) {
    errEl.textContent = 'Date of birth cannot be in the future.';
    errEl.classList.remove('hidden');
    return;
  }
  var minYear = 1900;
  if (birth.getFullYear() < minYear) {
    errEl.textContent = 'Please enter a year after ' + minYear + '.';
    errEl.classList.remove('hidden');
    return;
  }
  showLoading(function () { renderAll(birth); });
});

el('hero-dob').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') el('btn-calculate').click();
});

el('btn-start-again').addEventListener('click', function () {
  el('results-section').classList.add('hidden');
  el('hero').style.minHeight = '';
  el('hero-dob').value = '';
  _birth = null;
  clearInterval(window._ticker);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Share nav button */
el('btn-share-nav').addEventListener('click', function () {
  if (!_birth) { el('hero-dob').focus(); return; }
  el('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

/* Download image button */
el('btn-download').addEventListener('click', function () {
  if (!_birth) return;
  el('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

/* Copy link */
el('btn-copy-link').addEventListener('click', function () {
  var btn = this;
  var url = 'https://mianhassam96.github.io/MultiMian-WaqtX/';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      btn.textContent = '\u2713 Copied!';
      setTimeout(function () { btn.textContent = '\uD83D\uDD17 Copy Link'; }, 2000);
    }).catch(function () {
      btn.textContent = 'Copy failed';
      setTimeout(function () { btn.textContent = '\uD83D\uDD17 Copy Link'; }, 2000);
    });
  } else {
    /* Fallback */
    var ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); btn.textContent = '\u2713 Copied!'; } catch(e) { btn.textContent = 'Copy failed'; }
    document.body.removeChild(ta);
    setTimeout(function () { btn.textContent = '\uD83D\uDD17 Copy Link'; }, 2000);
  }
});

/* Modal close */
el('share-close').addEventListener('click', function () {
  el('share-modal').classList.add('hidden');
  document.body.style.overflow = '';
});
el('share-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    el('share-modal').classList.add('hidden');
    document.body.style.overflow = '';
  }
});

/* Download card */
el('btn-dl-card').addEventListener('click', function () {
  var card = el('share-card-dl');
  if (typeof html2canvas === 'undefined') {
    alert('Please take a screenshot to save your card.');
    return;
  }
  var btn = this;
  btn.textContent = 'Generating\u2026';
  btn.disabled = true;
  html2canvas(card, { backgroundColor: '#061008', scale: 2 }).then(function (canvas) {
    var a = document.createElement('a');
    a.download = 'waqtx-timeline.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    btn.textContent = 'Downloaded!';
    setTimeout(function () { btn.textContent = '\u2B07 Download Card'; btn.disabled = false; }, 2000);
  }).catch(function () {
    btn.textContent = '\u2B07 Download Card';
    btn.disabled = false;
  });
});

/* Hamburger */
el('hamburger').addEventListener('click', function () {
  var links = el('nav-links');
  if (links) links.classList.toggle('open');
});

/* Close mobile menu on link click */
document.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    var links = el('nav-links');
    if (links) links.classList.remove('open');
  });
});

/* Navbar scroll effect */
window.addEventListener('scroll', function () {
  var nav = el('navbar');
  if (nav) {
    if (window.scrollY > 20) {
      nav.style.borderBottomColor = 'rgba(201,168,76,0.2)';
    } else {
      nav.style.borderBottomColor = 'rgba(201,168,76,0.12)';
    }
  }
});

/* PWA Install */
var _deferredInstall = null;
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  _deferredInstall = e;
  setTimeout(function () {
    var p = el('pwa-prompt');
    if (p) p.classList.remove('hidden');
  }, 10000);
});

var pwaInstall = el('pwa-install');
var pwaDismiss = el('pwa-dismiss');
if (pwaInstall) pwaInstall.addEventListener('click', function () {
  if (!_deferredInstall) return;
  _deferredInstall.prompt();
  _deferredInstall.userChoice.then(function () {
    _deferredInstall = null;
    var p = el('pwa-prompt');
    if (p) p.classList.add('hidden');
  });
});
if (pwaDismiss) pwaDismiss.addEventListener('click', function () {
  var p = el('pwa-prompt');
  if (p) p.classList.add('hidden');
  try { localStorage.setItem('pwa_dismissed', Date.now()); } catch(e) {}
});

/* Restore last DOB */
(function () {
  try {
    var saved = localStorage.getItem('waqtx_dob');
    if (saved) {
      var inp = el('hero-dob');
      if (inp) inp.value = saved;
    }
  } catch(e) {}
})();

/* Init tracker on page load — works without DOB */
initTracker();


/* ══════════════════════════════════════════════
   FEATURE 1 — LIFE STORY (Narrative)
   ══════════════════════════════════════════════ */
function renderLifeStory(birth, ageYears, hijriBirth, hijriNow, ramadans, t) {
  var container = el('story-body');
  if (!container) return;

  var b = getBreakdown(birth);
  var birthYear = birth.getFullYear();
  var birthMonth = birth.toLocaleDateString('en-US', { month: 'long' });
  var birthDay = birth.toLocaleDateString('en-US', { weekday: 'long' });
  var fajrOpportunities = Math.floor(t.day);
  var fridaysPassed = Math.floor(t.day / 7);
  var sleepYears = (ageYears * 0.333).toFixed(1);
  var screenYears = (ageYears * 0.17).toFixed(1);
  var meaningfulHours = Math.round(ageYears * 365 * 0.08); // ~8% meaningful

  var lines = [
    'You were born on a <strong>' + birthDay + '</strong> in <em>' + birthMonth + ' ' + birthYear + '</em> — a day chosen by Allah, not by chance.',
    'In the Islamic calendar, that was the year <strong>' + hijriBirth.year + ' AH</strong>, in the month of <em>' + (HIJRI_MONTHS[(hijriBirth.month - 1) || 0]) + '</em>.',
    'Since that day, you have lived <strong>' + fmt(t.day) + ' days</strong> — each one a gift, each one a test.',
    'You have witnessed <strong>' + ramadans + ' Ramadans</strong> — ' + ramadans + ' months of mercy, forgiveness, and renewal.',
    'The Fajr prayer was called <strong>' + fmt(fajrOpportunities) + ' times</strong> since you were born. Each one was a chance to stand before Allah.',
    'You have seen <strong>' + fmt(fridaysPassed) + ' Fridays</strong> — the best day of the week, repeated ' + fmt(fridaysPassed) + ' times in your life.',
    'You have slept for approximately <strong>' + sleepYears + ' years</strong> — your body resting while your soul continued its journey.',
    'The world has changed around you — from <em>' + (birthYear < 2000 ? 'the pre-internet era' : 'the digital age') + '</em> to today. You lived through all of it.',
    'You are now <strong>' + b.yy + ' years, ' + b.mo + ' months, and ' + b.dd + ' days</strong> old. Your story is still unfolding.',
    'From <strong>' + hijriBirth.year + ' AH</strong> to <strong>' + hijriNow.year + ' AH</strong> — that is your Islamic timeline. ' + (hijriNow.year - hijriBirth.year) + ' Islamic years of life.'
  ];

  container.innerHTML = lines.map(function(line) {
    return '<div class="story-line">' + line + '</div>';
  }).join('');
}

/* ══════════════════════════════════════════════
   FEATURE 2 — TIME TRUTH
   ══════════════════════════════════════════════ */
function renderTimeTruth(ageYears, t) {
  var introEl   = el('truth-intro');
  var gridEl    = el('truth-grid');
  var verdictEl = el('truth-verdict');
  if (!gridEl) return;

  var sleepYears    = +(ageYears * 0.333).toFixed(1);
  var screenYears   = +(ageYears * 0.17).toFixed(1);
  var workYears     = +(ageYears * 0.13).toFixed(1);
  var eatYears      = +(ageYears * 0.04).toFixed(1);
  var commYears     = +(ageYears * 0.05).toFixed(1);
  var meaningYears  = +(ageYears - sleepYears - screenYears - workYears - eatYears - commYears).toFixed(1);
  if (meaningYears < 0) meaningYears = 0;

  var meaningPct = Math.round((meaningYears / ageYears) * 100);

  if (introEl) {
    introEl.innerHTML = 'You have lived <strong>' + ageYears.toFixed(1) + ' years</strong>. Here is where that time actually went — based on global averages.';
  }

  var cards = [
    { icon: '😴', label: 'Sleeping',       value: sleepYears,   unit: 'Years', sub: '~8 hrs/day — your body needed rest.', cls: '' },
    { icon: '📱', label: 'Screen Time',    value: screenYears,  unit: 'Years', sub: '~4 hrs/day on phones, TV, social media.', cls: 'truth-bad' },
    { icon: '💼', label: 'Work / Study',   value: workYears,    unit: 'Years', sub: 'Building your dunya, day by day.', cls: '' },
    { icon: '🍽️', label: 'Eating',         value: eatYears,     unit: 'Years', sub: '~1 hr/day — nourishing the body.', cls: '' },
    { icon: '🚗', label: 'Commuting',      value: commYears,    unit: 'Years', sub: '~1.2 hrs/day in transit.', cls: '' },
    { icon: '✨', label: 'Meaningful Time', value: meaningYears, unit: 'Years', sub: 'Growth, ibadah, family, purpose.', cls: 'truth-good' }
  ];

  gridEl.innerHTML = cards.map(function(c) {
    return '<div class="truth-card ' + c.cls + '">' +
      '<div class="truth-card-icon">' + c.icon + '</div>' +
      '<div class="truth-card-label">' + c.label + '</div>' +
      '<div class="truth-card-value">' + c.value + '</div>' +
      '<div class="truth-card-unit">' + c.unit + '</div>' +
      '<div class="truth-card-sub">' + c.sub + '</div>' +
    '</div>';
  }).join('');

  if (verdictEl) {
    var msg = meaningPct < 10
      ? 'Less than <strong>' + meaningPct + '%</strong> of your life has been truly meaningful. That is the honest truth. The rest of your life can be different — but only if you decide now.'
      : meaningPct < 20
      ? 'About <strong>' + meaningPct + '%</strong> of your life has been meaningful. There is still so much time to change the ratio. Every day is a new chance.'
      : 'Around <strong>' + meaningPct + '%</strong> of your life has been meaningful. You are doing better than most — keep building on it.';

    verdictEl.innerHTML = '<div class="truth-verdict-headline">The Honest Picture</div>' +
      '<div class="truth-verdict-text">' + msg + ' The Prophet ﷺ said: <em>"Take advantage of five before five: your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before your busyness, and your life before your death."</em></div>';
  }
}

/* ══════════════════════════════════════════════
   FEATURE 3 — SALAH & IBADAH TRACKER
   ══════════════════════════════════════════════ */
var TRACKER_KEY = 'waqtx_tracker';
var STREAK_KEY  = 'waqtx_streak';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadTrackerData() {
  try {
    var raw = localStorage.getItem(TRACKER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

function saveTrackerData(data) {
  try { localStorage.setItem(TRACKER_KEY, JSON.stringify(data)); } catch(e) {}
}

function getStreakCount() {
  try {
    var data = loadTrackerData();
    var today = getTodayKey();
    var streak = 0;
    var d = new Date();
    for (var i = 0; i < 365; i++) {
      var key = d.toISOString().split('T')[0];
      var dayData = data[key];
      if (!dayData) break;
      var salahDone = (dayData.salah || []).length;
      if (salahDone >= 5) { streak++; d.setDate(d.getDate() - 1); }
      else if (key === today) { d.setDate(d.getDate() - 1); } // today not complete yet
      else break;
    }
    return streak;
  } catch(e) { return 0; }
}

function updateSalahUI() {
  var data = loadTrackerData();
  var today = getTodayKey();
  var todayData = data[today] || { salah: [], dhikr: [] };
  var salahDone = todayData.salah || [];
  var dhikrDone = todayData.dhikr || [];

  // Update salah checkboxes
  document.querySelectorAll('.salah-item').forEach(function(item) {
    var name = item.querySelector('input').getAttribute('data-salah');
    if (salahDone.indexOf(name) > -1) {
      item.classList.add('checked');
    } else {
      item.classList.remove('checked');
    }
  });

  // Update dhikr checkboxes
  document.querySelectorAll('.dhikr-item').forEach(function(item) {
    var name = item.querySelector('input').getAttribute('data-dhikr');
    if (dhikrDone.indexOf(name) > -1) {
      item.classList.add('checked');
    } else {
      item.classList.remove('checked');
    }
  });

  // Progress bar
  var pct = (salahDone.length / 5) * 100;
  var barFill = el('salah-bar-fill');
  if (barFill) barFill.style.width = pct + '%';
  setText('salah-done', salahDone.length);

  // Streak
  setText('salah-streak', getStreakCount());

  // Dhikr count
  setText('dhikr-done', dhikrDone.length);

  // Dhikr message
  var msgs = [
    'Start your day with remembrance.',
    'One step closer to Allah. Keep going.',
    'Halfway there. Your heart is being polished.',
    'Almost complete. SubhanAllah.',
    'Four done. One more — finish strong.',
    'All completed. \u0627\u0644\u062D\u0645\u062F \u0644\u0644\u0647 — Alhamdulillah!'
  ];
  var dhikrMsg = el('dhikr-msg');
  if (dhikrMsg) dhikrMsg.textContent = msgs[Math.min(dhikrDone.length, 5)];

  // Week grid
  renderWeekGrid(data);
}

function renderWeekGrid(data) {
  var weekGrid = el('week-grid');
  var weekSummary = el('week-summary');
  if (!weekGrid) return;

  var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  var today = new Date();
  var totalFull = 0;
  var html = '';

  for (var i = 6; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(today.getDate() - i);
    var key = d.toISOString().split('T')[0];
    var dayData = data[key] || { salah: [] };
    var count = (dayData.salah || []).length;
    var isToday = (i === 0);
    var cls = count >= 5 ? 'full' : count > 0 ? 'partial' : isToday ? 'today' : '';
    if (count >= 5) totalFull++;
    html += '<div class="week-day">' +
      '<div class="week-day-label">' + days[d.getDay()] + '</div>' +
      '<div class="week-day-dot ' + cls + '">' + (count > 0 ? count : (isToday ? '·' : '')) + '</div>' +
    '</div>';
  }
  weekGrid.innerHTML = html;

  if (weekSummary) {
    weekSummary.innerHTML = '<strong>' + totalFull + '/7</strong> days with all 5 prayers this week.' +
      (totalFull === 7 ? ' 🌟 Perfect week!' : totalFull >= 5 ? ' Keep it up!' : ' Every prayer counts.');
  }
}

function initTracker() {
  // Salah click handlers
  document.querySelectorAll('.salah-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var name = item.querySelector('input').getAttribute('data-salah');
      var data = loadTrackerData();
      var today = getTodayKey();
      if (!data[today]) data[today] = { salah: [], dhikr: [] };
      var idx = data[today].salah.indexOf(name);
      if (idx > -1) data[today].salah.splice(idx, 1);
      else data[today].salah.push(name);
      saveTrackerData(data);
      updateSalahUI();
    });
  });

  // Dhikr click handlers
  document.querySelectorAll('.dhikr-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var name = item.querySelector('input').getAttribute('data-dhikr');
      var data = loadTrackerData();
      var today = getTodayKey();
      if (!data[today]) data[today] = { salah: [], dhikr: [] };
      var idx = data[today].dhikr.indexOf(name);
      if (idx > -1) data[today].dhikr.splice(idx, 1);
      else data[today].dhikr.push(name);
      saveTrackerData(data);
      updateSalahUI();
    });
  });

  // Reset today
  var resetBtn = el('btn-reset-tracker');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      var data = loadTrackerData();
      var today = getTodayKey();
      data[today] = { salah: [], dhikr: [] };
      saveTrackerData(data);
      updateSalahUI();
    });
  }

  updateSalahUI();
}

/* ══════════════════════════════════════════════
   FEATURE 4 — DAILY INSIGHT
   ══════════════════════════════════════════════ */
var DAILY_INSIGHTS = [
  {
    icon: '⏳',
    headline: 'Every second is a step closer.',
    body: 'Right now, as you read this, your life is moving forward. Not backward. Not paused. Forward. The question is not how much time you have — it is what you are doing with the time that is passing right now.',
    ayah: '"And He is with you wherever you are." — (Quran 57:4)'
  },
  {
    icon: '🌙',
    headline: 'Fajr changes everything.',
    body: 'The person who wakes for Fajr starts their day with Allah. That one act — 10 minutes before sunrise — sets the tone for the entire day. It is not just a prayer. It is a declaration: "My day belongs to You."',
    ayah: '"Establish prayer at the decline of the sun until the darkness of the night and the Quran of dawn." — (Quran 17:78)'
  },
  {
    icon: '📖',
    headline: 'One page a day. One life changed.',
    body: 'If you read just one page of the Quran every day, you will complete it in about 3 years. But the real change is not finishing — it is the daily habit of sitting with the words of Allah. That habit reshapes who you are.',
    ayah: '"Indeed, this Quran guides to that which is most suitable." — (Quran 17:9)'
  },
  {
    icon: '🤲',
    headline: 'Istighfar opens closed doors.',
    body: 'The Prophet ﷺ made istighfar more than 70 times a day — and he was already forgiven. Imagine what it does for us. Saying "Astaghfirullah" is not just asking forgiveness. It is resetting your connection with Allah.',
    ayah: '"Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver." — (Quran 71:10)'
  },
  {
    icon: '🌅',
    headline: 'This morning will never come again.',
    body: 'The morning you woke up today — this exact morning — will never exist again. Every sunrise is unique. Every day is a new page. What will you write on today\'s page before it closes tonight?',
    ayah: '"By the dawn. And by the ten nights." — (Quran 89:1-2)'
  },
  {
    icon: '💭',
    headline: 'Your thoughts become your life.',
    body: 'What you think about most becomes what you do. What you do becomes who you are. Guard your thoughts. Fill your mind with what is good, true, and purposeful. The battle for your life is won or lost in your mind first.',
    ayah: '"Allah does not change the condition of a people until they change what is in themselves." — (Quran 13:11)'
  },
  {
    icon: '🕌',
    headline: 'The masjid is waiting for you.',
    body: 'There is a masjid near you right now. It has been there every day. The call to prayer has gone out five times today. Each time was an invitation — personal, direct, from Allah to you. How many did you answer?',
    ayah: '"In houses which Allah has ordered to be raised and that His name be mentioned therein." — (Quran 24:36)'
  },
  {
    icon: '❤️',
    headline: 'Your parents\' du\'a is your shield.',
    body: 'The du\'a of a parent for their child is never rejected. If your parents are alive, their happiness with you is a door to Jannah. If they have passed, your du\'a for them is a gift that reaches them. Do not let this connection weaken.',
    ayah: '"Your Lord has decreed that you worship none but Him, and that you be kind to parents." — (Quran 17:23)'
  },
  {
    icon: '🎯',
    headline: 'Small consistent beats big occasional.',
    body: 'The Prophet ﷺ said the most beloved deeds to Allah are those done consistently, even if small. You do not need to pray all night. You need to pray every night. Consistency is the secret that most people miss.',
    ayah: '"The most beloved of deeds to Allah are those that are most consistent, even if they are small." — (Hadith, Bukhari)'
  },
  {
    icon: '🌍',
    headline: 'You are part of something bigger.',
    body: 'Right now, over 1.8 billion Muslims around the world are praying, fasting, making du\'a, and striving. You are not alone in this journey. You are part of the Ummah — a community that spans every country, every language, every generation.',
    ayah: '"And hold firmly to the rope of Allah all together and do not become divided." — (Quran 3:103)'
  },
  {
    icon: '⚖️',
    headline: 'The scales will be real.',
    body: 'On the Day of Judgment, every deed will be weighed. Not just the big ones — every word, every glance, every moment of patience, every act of kindness. Nothing is too small to matter. Nothing is too small to count.',
    ayah: '"So whoever does an atom\'s weight of good will see it, and whoever does an atom\'s weight of evil will see it." — (Quran 99:7-8)'
  },
  {
    icon: '🔑',
    headline: 'Gratitude is the key that opens more.',
    body: 'You woke up today. Your heart is beating. You can read these words. You have been given another chance. Gratitude is not just a feeling — it is a practice. Say Alhamdulillah and mean it. Watch what happens.',
    ayah: '"If you are grateful, I will surely increase you in favor." — (Quran 14:7)'
  },
  {
    icon: '🌿',
    headline: 'Sadaqah protects you.',
    body: 'Give something today — even a smile, a kind word, a small amount of money. The Prophet ﷺ said sadaqah extinguishes sins like water extinguishes fire. It also protects from calamity. Giving is not losing — it is investing.',
    ayah: '"The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes." — (Quran 2:261)'
  },
  {
    icon: '🕐',
    headline: 'Time is the only thing you cannot get back.',
    body: 'Money lost can be earned again. Health lost can sometimes be restored. But time lost is gone forever. The hour that just passed will never return. This is not meant to create anxiety — it is meant to create intention. Be intentional today.',
    ayah: '"By time, indeed, mankind is in loss." — (Quran 103:1-2)'
  }
];

var _insightIndex = 0;

function renderInsight(birth, t) {
  var container = el('insight-card');
  if (!container) return;

  // Pick insight based on day of year for consistency
  var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  _insightIndex = dayOfYear % DAILY_INSIGHTS.length;

  var today = new Date();
  var dateStr = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var daysLived = t.day;

  renderInsightCard(container, _insightIndex, dateStr, daysLived);
}

function renderInsightCard(container, idx, dateStr, daysLived) {
  var insight = DAILY_INSIGHTS[idx];
  container.innerHTML =
    '<div class="insight-date">' + dateStr + ' &nbsp;·&nbsp; Day ' + fmt(daysLived) + ' of your life</div>' +
    '<span class="insight-icon">' + insight.icon + '</span>' +
    '<div class="insight-headline">' + insight.headline + '</div>' +
    '<div class="insight-body">' + insight.body + '</div>' +
    '<div class="insight-ayah">' + insight.ayah + '</div>' +
    '<div class="insight-nav">' +
      '<button class="insight-nav-btn" id="insight-prev">← Previous</button>' +
      '<button class="insight-nav-btn" id="insight-next">Next →</button>' +
    '</div>';

  // Wire nav buttons
  var prevBtn = el('insight-prev');
  var nextBtn = el('insight-next');
  if (prevBtn) prevBtn.addEventListener('click', function() {
    _insightIndex = (_insightIndex - 1 + DAILY_INSIGHTS.length) % DAILY_INSIGHTS.length;
    renderInsightCard(container, _insightIndex, dateStr, daysLived);
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    _insightIndex = (_insightIndex + 1) % DAILY_INSIGHTS.length;
    renderInsightCard(container, _insightIndex, dateStr, daysLived);
  });
}
