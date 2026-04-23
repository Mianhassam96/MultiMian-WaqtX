'use strict';

var AVG_LIFESPAN_YEARS = 75; // WHO global average life expectancy

// ─── Tab switching ────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(s) { s.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ─── Parse DOB ───────────────────────────────────────────────
function parseDOB(str) {
  var p = str.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

// ─── Validate ────────────────────────────────────────────────
function validate(name, dob) {
  if (!name.trim()) return 'Please enter a name.';
  if (!dob) return 'Please select a date of birth.';
  if (parseDOB(dob) > new Date()) return 'Date of birth cannot be in the future.';
  return '';
}

// ─── Age breakdown ────────────────────────────────────────────
function getBreakdown(birth) {
  var n = new Date();
  var yy = n.getFullYear() - birth.getFullYear();
  var mo = n.getMonth()    - birth.getMonth();
  var dd = n.getDate()     - birth.getDate();
  var hh = n.getHours()    - birth.getHours();
  var mi = n.getMinutes()  - birth.getMinutes();
  var ss = n.getSeconds()  - birth.getSeconds();
  if (ss < 0) { ss += 60; mi--; }
  if (mi < 0) { mi += 60; hh--; }
  if (hh < 0) { hh += 24; dd--; }
  if (dd < 0) { dd += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yy--; }
  return { yy: yy, mo: mo, dd: dd, hh: hh, mi: mi, ss: ss };
}

// ─── Totals ───────────────────────────────────────────────────
function getTotals(birth) {
  var ms  = new Date() - birth;
  var sec = Math.floor(ms / 1000);
  var min = Math.floor(sec / 60);
  var hr  = Math.floor(min / 60);
  var day = Math.floor(hr  / 24);
  var wk  = Math.floor(day / 7);
  var mon = Math.floor(day / 30.4375);
  return { sec: sec, min: min, hr: hr, day: day, wk: wk, mon: mon };
}

// ─── Date diff ───────────────────────────────────────────────
function dateDiff(d1, d2) {
  var yy = d2.getFullYear() - d1.getFullYear();
  var mo = d2.getMonth()    - d1.getMonth();
  var dd = d2.getDate()     - d1.getDate();
  var hh = d2.getHours()    - d1.getHours();
  var mi = d2.getMinutes()  - d1.getMinutes();
  var ss = d2.getSeconds()  - d1.getSeconds();
  if (ss < 0) { ss += 60; mi--; }
  if (mi < 0) { mi += 60; hh--; }
  if (hh < 0) { hh += 24; dd--; }
  if (dd < 0) { dd += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yy--; }
  return { yy: yy, mo: mo, dd: dd, hh: hh, mi: mi, ss: ss };
}

function bornDay(birth) {
  return birth.toLocaleDateString('en-US', { weekday: 'long' });
}

function nextBirthday(birth) {
  var n    = new Date();
  var next = new Date(n.getFullYear(), birth.getMonth(), birth.getDate());
  if (next <= n) next.setFullYear(n.getFullYear() + 1);
  var diff = next - n;
  var d = Math.floor(diff / 86400000);
  var h = Math.floor((diff % 86400000) / 3600000);
  var m = Math.floor((diff % 3600000)  / 60000);
  var s = Math.floor((diff % 60000)    / 1000);
  if (d === 0 && h === 0 && m < 1) return '🎂 Today is the birthday!';
  return '🎂 Next birthday in ' + d + 'd ' + h + 'h ' + m + 'm ' + s + 's';
}

function statsHTML(rows) {
  return rows.map(function(r) {
    return '<div class="stat-box"><div class="stat-val">' +
      Number(r[0]).toLocaleString() +
      '</div><div class="stat-lbl">' + r[1] + '</div></div>';
  }).join('');
}

function showError(id, msg) {
  var el = document.getElementById(id);
  if (msg) { el.textContent = msg; el.classList.remove('hidden'); }
  else { el.classList.add('hidden'); }
}

// ─── Count-up animation ───────────────────────────────────────
function countUp(el, target, duration) {
  var start = 0;
  var step  = target / (duration / 16);
  var timer = setInterval(function() {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

// ─── Life Progress Ring ───────────────────────────────────────
function updateRing(ageYears) {
  var pct  = Math.min(100, (ageYears / AVG_LIFESPAN_YEARS) * 100);
  var circ = 2 * Math.PI * 80;
  var fill = document.getElementById('ring-fill');
  var pctEl = document.getElementById('ring-pct');
  var subEl = document.getElementById('ring-sub');
  if (!fill) return;
  fill.style.strokeDashoffset = circ - (pct / 100) * circ;
  pctEl.textContent = Math.round(pct) + '%';
  var left = Math.max(0, AVG_LIFESPAN_YEARS - Math.floor(ageYears));
  subEl.textContent = 'You\'ve lived ' + Math.round(pct) + '% of an average ' +
    AVG_LIFESPAN_YEARS + '-year life · ~' + left + ' years ahead';
}

// ─── Daily Hook ───────────────────────────────────────────────
function initDailyHook(name, birth) {
  var t    = getTotals(birth);
  var b    = getBreakdown(birth);
  var hook = document.getElementById('daily-hook');
  var today = new Date().toDateString();

  // streak
  var stored = JSON.parse(localStorage.getItem('aw_streak') || '{"count":0,"last":""}');
  var streak = stored.count;
  if (stored.last !== today) {
    var yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    streak = (stored.last === yesterday.toDateString()) ? streak + 1 : 1;
    localStorage.setItem('aw_streak', JSON.stringify({ count: streak, last: today }));
  }

  // title & sub
  var titleEl = document.getElementById('dh-title');
  var subEl   = document.getElementById('dh-sub');
  var emojiEl = document.getElementById('dh-emoji');
  var streakEl = document.getElementById('dh-streak');
  var msEl    = document.getElementById('dh-milestone');

  titleEl.textContent = 'Today, ' + name + ' is ' + t.day.toLocaleString() + ' days old 🎉';
  subEl.textContent   = b.yy + ' years · ' + b.mo + ' months · ' + b.dd + ' days · ' + nextBirthday(birth);

  if (streak > 1) {
    streakEl.textContent = '🔥 ' + streak + '-day streak';
    streakEl.classList.remove('hidden');
  }

  // milestone check
  var milestones = [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,15000,20000,25000];
  var hit = milestones.filter(function(m) { return t.day >= m && t.day < m + 7; });
  if (hit.length) {
    emojiEl.textContent = '🏆';
    msEl.textContent = '🎊 Milestone! You just crossed ' + hit[hit.length-1].toLocaleString() + ' days alive!';
    msEl.classList.remove('hidden');
  }

  // next milestone
  var next = milestones.find(function(m) { return m > t.day; });
  if (next && !hit.length) {
    var daysLeft = next - t.day;
    subEl.textContent += ' · 🎯 ' + daysLeft + ' days to ' + next.toLocaleString() + '-day milestone';
  }

  hook.classList.remove('hidden');
  hook.classList.add('dh-in');
}

document.getElementById('dh-dismiss').addEventListener('click', function() {
  var hook = document.getElementById('daily-hook');
  hook.classList.add('dh-out');
  setTimeout(function() { hook.classList.add('hidden'); }, 300);
});

// ─── localStorage save/restore ────────────────────────────────
function saveInputs(name, dob) {
  localStorage.setItem('aw_last', JSON.stringify({ name: name, dob: dob }));
}

function restoreInputs() {
  var saved = JSON.parse(localStorage.getItem('aw_last') || 'null');
  if (!saved) return;
  document.getElementById('s-name').value = saved.name || '';
  document.getElementById('s-dob').value  = saved.dob  || '';
}

restoreInputs();

// ─── Life Budget / Life Spend ─────────────────────────────────
function updateBudget(birth) {
  var t = getTotals(birth);
  var b = getBreakdown(birth);
  var totalHours = Math.round(AVG_LIFESPAN_YEARS * 365.25 * 24);
  var usedHours  = Math.floor(t.hr);
  var leftHours  = Math.max(0, totalHours - usedHours);
  var pct        = Math.min(100, (usedHours / totalHours) * 100);

  var totalEl = document.getElementById('budget-total');
  var usedEl  = document.getElementById('budget-used');
  var leftEl  = document.getElementById('budget-left');
  var fillEl  = document.getElementById('budget-bar-fill');
  var pctLbl  = document.getElementById('budget-pct-lbl');
  var leftLbl = document.getElementById('budget-left-lbl');
  var paceEl  = document.getElementById('budget-pace');

  if (!totalEl) return;
  totalEl.textContent = totalHours.toLocaleString();
  usedEl.textContent  = usedHours.toLocaleString();
  leftEl.textContent  = leftHours.toLocaleString();
  if (fillEl) fillEl.style.width = pct.toFixed(2) + '%';
  if (pctLbl) pctLbl.textContent = pct.toFixed(1) + '% spent';
  if (leftLbl) leftLbl.textContent = leftHours.toLocaleString() + ' remaining';

  // emotional pace line
  if (paceEl) {
    var age = b.yy;
    var pace = age < 25
      ? 'You\'re early. But the clock has always been running.'
      : age < 40
      ? 'You\'re not early anymore. You\'re in the phase that defines everything.'
      : age < 60
      ? 'At your current pace, you are spending your life steadily — not slowly, not fast.'
      : 'Every hour from here carries more weight than any before it.';
    paceEl.textContent = pace;
  }
}

// ─── Time Twin data (same DOB match) ─────────────────────────
var TIME_TWINS = [
  // Jan
  { month: 1,  day: 3,  name: 'J.R.R. Tolkien',    icon: '📖', era: 'Author of The Lord of the Rings' },
  { month: 1,  day: 8,  name: 'Stephen Hawking',    icon: '🌌', era: 'Physicist who redefined our understanding of time' },
  { month: 1,  day: 14, name: 'LL Cool J',           icon: '🎤', era: 'Pioneer of hip-hop culture' },
  { month: 1,  day: 17, name: 'Muhammad Ali',        icon: '🥊', era: 'The greatest boxer who ever lived' },
  { month: 1,  day: 25, name: 'Virginia Woolf',      icon: '✍️', era: 'One of the most influential writers of the 20th century' },
  // Feb
  { month: 2,  day: 6,  name: 'Bob Marley',          icon: '🎵', era: 'Voice of a generation, still heard everywhere' },
  { month: 2,  day: 11, name: 'Thomas Edison',       icon: '💡', era: 'Inventor who lit up the world' },
  { month: 2,  day: 14, name: 'Frederick Douglass',  icon: '✊', era: 'Abolitionist who changed the course of history' },
  { month: 2,  day: 18, name: 'Yoko Ono',            icon: '🕊️', era: 'Artist and peace activist' },
  // Mar
  { month: 3,  day: 6,  name: 'Michelangelo',        icon: '🎨', era: 'Painted the Sistine Chapel ceiling' },
  { month: 3,  day: 14, name: 'Albert Einstein',     icon: '🧠', era: 'Redefined how humanity understands the universe' },
  { month: 3,  day: 21, name: 'Johann Sebastian Bach', icon: '🎼', era: 'Composer whose music outlived centuries' },
  { month: 3,  day: 26, name: 'Diana Ross',          icon: '🌟', era: 'Icon of soul and Motown' },
  // Apr
  { month: 4,  day: 2,  name: 'Hans Christian Andersen', icon: '📚', era: 'Storyteller whose tales shaped childhoods worldwide' },
  { month: 4,  day: 15, name: 'Leonardo da Vinci',   icon: '🖼️', era: 'The original Renaissance man' },
  { month: 4,  day: 23, name: 'William Shakespeare', icon: '🎭', era: 'The greatest writer in the English language' },
  // May
  { month: 5,  day: 5,  name: 'Karl Marx',           icon: '📜', era: 'Philosopher whose ideas reshaped the world' },
  { month: 5,  day: 14, name: 'George Lucas',        icon: '🎬', era: 'Creator of Star Wars' },
  { month: 5,  day: 25, name: 'Ralph Waldo Emerson', icon: '🌿', era: 'Philosopher of self-reliance and nature' },
  // Jun
  { month: 6,  day: 1,  name: 'Marilyn Monroe',      icon: '💫', era: 'Cultural icon of the 20th century' },
  { month: 6,  day: 12, name: 'Anne Frank',          icon: '📓', era: 'Her diary became one of the most read books in history' },
  { month: 6,  day: 18, name: 'Paul McCartney',      icon: '🎸', era: 'One half of the greatest songwriting duo ever' },
  // Jul
  { month: 7,  day: 4,  name: 'Nathaniel Hawthorne', icon: '🖊️', era: 'Author who explored the depths of human conscience' },
  { month: 7,  day: 18, name: 'Nelson Mandela',      icon: '✊', era: '27 years in prison. Then changed a nation.' },
  { month: 7,  day: 26, name: 'Mick Jagger',         icon: '🎤', era: 'Still performing decades after most would stop' },
  // Aug
  { month: 8,  day: 4,  name: 'Barack Obama',        icon: '🌍', era: '44th President of the United States' },
  { month: 8,  day: 9,  name: 'Whitney Houston',     icon: '🎶', era: 'One of the greatest voices in music history' },
  { month: 8,  day: 26, name: 'Mother Teresa',       icon: '🕊️', era: 'Spent her life in service to others' },
  // Sep
  { month: 9,  day: 5,  name: 'Freddie Mercury',     icon: '🎤', era: 'Frontman of Queen. Performer unlike any other.' },
  { month: 9,  day: 15, name: 'Agatha Christie',     icon: '🔍', era: 'Best-selling fiction writer of all time' },
  { month: 9,  day: 26, name: 'T.S. Eliot',          icon: '📖', era: 'Poet who defined modernist literature' },
  // Oct
  { month: 10, day: 2,  name: 'Mahatma Gandhi',      icon: '🕊️', era: 'Led a nation to freedom through nonviolence' },
  { month: 10, day: 9,  name: 'John Lennon',         icon: '🎵', era: 'Imagined a world at peace. Still does.' },
  { month: 10, day: 28, name: 'Bill Gates',          icon: '💾', era: 'Built the software that runs the modern world' },
  // Nov
  { month: 11, day: 9,  name: 'Carl Sagan',          icon: '🌌', era: 'Made the cosmos feel personal' },
  { month: 11, day: 19, name: 'Indira Gandhi',       icon: '🌸', era: 'First female Prime Minister of India' },
  { month: 11, day: 30, name: 'Mark Twain',          icon: '✍️', era: 'America\'s greatest storyteller' },
  // Dec
  { month: 12, day: 5,  name: 'Walt Disney',         icon: '✨', era: 'Built a world of imagination from nothing' },
  { month: 12, day: 16, name: 'Ludwig van Beethoven',icon: '🎹', era: 'Composed masterpieces after losing his hearing' },
  { month: 12, day: 25, name: 'Isaac Newton',        icon: '🍎', era: 'Discovered gravity. On Christmas Day.' }
];

function getTimeTwin(birth) {
  var m = birth.getMonth() + 1;
  var d = birth.getDate();
  // exact day match first
  var exact = TIME_TWINS.filter(function(t) { return t.month === m && t.day === d; });
  if (exact.length) return exact[Math.floor(Math.random() * exact.length)];
  // closest day in same month
  var sameMonth = TIME_TWINS.filter(function(t) { return t.month === m; });
  if (sameMonth.length) return sameMonth.sort(function(a, b) { return Math.abs(a.day - d) - Math.abs(b.day - d); })[0];
  // fallback: closest overall
  return TIME_TWINS.sort(function(a, b) {
    return Math.abs((a.month * 31 + a.day) - (m * 31 + d)) - Math.abs((b.month * 31 + b.day) - (m * 31 + d));
  })[0];
}

function renderAgeTwin(birth) {
  var twin = getTimeTwin(birth);
  if (!twin) return;
  var el = document.getElementById('age-twin');
  if (!el) return;
  document.getElementById('at-icon').textContent = twin.icon;
  document.getElementById('at-name').textContent = twin.name;
  var m = birth.getMonth() + 1;
  var d = birth.getDate();
  var isExact = twin.month === m && twin.day === d;
  var badgeEl = document.getElementById('at-badge');
  badgeEl.textContent = isExact ? 'Same day' : 'Same season';
  if (isExact) badgeEl.classList.add('same-day');
  else badgeEl.classList.remove('same-day');
  document.getElementById('at-fact').textContent = (isExact
    ? 'You were born on the same day as ' + twin.name + '. '
    : 'You share your time with ' + twin.name + '. ')
    + twin.era + '. Different lives. Same moment in time.';
  el.classList.remove('hidden');
}

// ─── Next Milestone ───────────────────────────────────────────
function renderNextMilestone(t) {
  var el = document.getElementById('next-milestone');
  var titleEl = document.getElementById('nm-title');
  var subEl   = document.getElementById('nm-sub');
  if (!el) return;
  var title = '', sub = '';

  if (t.sec < 1e9) {
    var dLeft = Math.ceil((1e9 - t.sec) / 86400);
    title = '🎯 Next: 1 Billion Seconds';
    sub   = dLeft.toLocaleString() + ' days away — ~' + Math.ceil(dLeft / 365) + ' years from now';
  } else if (t.day < 10000) {
    var d1 = 10000 - t.day;
    title = '🎯 Next: 10,000 Days Alive';
    sub   = d1.toLocaleString() + ' days to go';
  } else if (t.day < 15000) {
    var d2 = 15000 - t.day;
    title = '🎯 Next: 15,000 Days Alive';
    sub   = d2.toLocaleString() + ' days to go';
  } else if (t.day < 20000) {
    var d3 = 20000 - t.day;
    title = '🎯 Next: 20,000 Days Alive';
    sub   = d3.toLocaleString() + ' days to go';
  }

  if (title) {
    titleEl.textContent = title;
    subEl.textContent   = sub;
    el.classList.remove('hidden');
  }
}

// ─── Life Question + Send to Someone + Remember ───────────────
function showLifeQuestion() {
  var el    = document.getElementById('life-question');
  var sendEl = document.getElementById('send-someone');
  var remEl  = document.getElementById('remember-wrap');
  if (el) {
    el.classList.remove('hidden');
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    setTimeout(function() {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  }
  if (sendEl) sendEl.classList.remove('hidden');
  if (remEl)  remEl.classList.remove('hidden');
}

document.getElementById('lq-yes').addEventListener('click', function() {
  var resp = document.getElementById('lq-response');
  resp.textContent = 'Then protect it. Most people never stop to notice.';
  resp.classList.remove('hidden');
  document.getElementById('lq-yes').classList.add('lq-chosen');
  document.getElementById('lq-no').classList.add('lq-unchosen');
  track('life_question', 'yes');
});

document.getElementById('lq-no').addEventListener('click', function() {
  var resp = document.getElementById('lq-response');
  resp.textContent = 'Then this is not just a number. It\'s a warning.';
  resp.classList.remove('hidden');
  document.getElementById('lq-no').classList.add('lq-chosen');
  document.getElementById('lq-yes').classList.add('lq-unchosen');
  track('life_question', 'no');
});

document.getElementById('ss-copy-msg').addEventListener('click', function() {
  var link = window.location.href.split('?')[0];
  var msg = 'I just saw something about my life that made me think. You should try this.\n' + link;
  navigator.clipboard.writeText(msg).then(function() {
    var copied = document.getElementById('ss-copied');
    copied.textContent = '✅ Message copied. Send it to someone who matters.';
    copied.classList.remove('hidden');
    setTimeout(function() { copied.classList.add('hidden'); }, 3000);
  });
  track('send_someone', 'copy_msg');
});

document.getElementById('ss-copy-parents').addEventListener('click', function() {
  var link = window.location.href.split('?')[0];
  var msg = 'I saw something about time that made me think of you. Try this.\n' + link;
  navigator.clipboard.writeText(msg).then(function() {
    var copied = document.getElementById('ss-copied');
    copied.textContent = '✅ Message copied. Send it to someone who matters.';
    copied.classList.remove('hidden');
    setTimeout(function() { copied.classList.add('hidden'); }, 3000);
  });
  track('send_someone', 'copy_parents');
});

document.getElementById('ss-share-card').addEventListener('click', function() {
  if (!window._shareData) return;
  _shareStyle = 'classic';
  document.querySelectorAll('.sc-style-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelector('[data-style="classic"]').classList.add('active');
  renderShareCard();
  document.getElementById('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  track('send_someone', 'share_card');
});

document.getElementById('btn-remember').addEventListener('click', function() {
  if (!window._shareData) return;
  var b = getBreakdown(window._shareData.birth);
  var pct = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));
  localStorage.setItem('aw_moment', JSON.stringify({
    pct: pct,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    name: window._shareData.name
  }));
  var savedEl = document.getElementById('remember-saved');
  savedEl.textContent = '✅ Saved. Next time you visit, we\'ll show how much has changed.';
  savedEl.classList.remove('hidden');
  document.getElementById('btn-remember').style.opacity = '0.5';
  document.getElementById('btn-remember').disabled = true;
  track('remember_moment', window._shareData.name);
});

// ─── Perception toggle ────────────────────────────────────────
var _perceptionMode = 'realistic';

function renderPerceptionMsg(birth) {
  var b = getBreakdown(birth);
  var t = getTotals(birth);
  var leftHours = Math.max(0, Math.round(AVG_LIFESPAN_YEARS * 365.25 * 24) - Math.floor(t.hr));
  var msgEl = document.getElementById('perception-msg');
  if (!msgEl) return;
  if (_perceptionMode === 'optimistic') {
    msgEl.textContent = 'You still have ' + leftHours.toLocaleString() + ' hours of potential ahead. That\'s enough to build something extraordinary.';
    msgEl.className = 'perception-msg optimistic';
  } else {
    var age = b.yy;
    var msg = age < 30
      ? 'Time feels infinite right now. It isn\'t. But you still have more than most.'
      : age < 50
      ? 'The hours behind you are gone. The ones ahead are yours to direct.'
      : 'Every hour from here is more valuable than any you\'ve already spent.';
    msgEl.textContent = msg;
    msgEl.className = 'perception-msg realistic';
  }
}


function renderPhaseBar(ageYears) {
  var phases = [
    { label: 'Childhood', end: 13,  color: '#34d399' },
    { label: 'Growth',    end: 25,  color: '#60a5fa' },
    { label: 'Peak',      end: 40,  color: '#a78bfa' },
    { label: 'Wisdom',    end: 60,  color: '#f97316' },
    { label: 'Legacy',    end: 75,  color: '#f87171' }
  ];
  var barEl    = document.getElementById('phase-bar');
  var markerEl = document.getElementById('phase-marker');
  if (!barEl) return;

  var html = '';
  var prev = 0;
  phases.forEach(function(p) {
    var w = ((p.end - prev) / AVG_LIFESPAN_YEARS * 100).toFixed(2);
    html += '<div class="phase-seg" style="width:' + w + '%;background:' + p.color + '" title="' + p.label + '">' +
      '<span class="phase-seg-lbl">' + p.label + '</span></div>';
    prev = p.end;
  });
  barEl.innerHTML = html;

  var pct = Math.min(100, (ageYears / AVG_LIFESPAN_YEARS) * 100);
  markerEl.style.left = pct + '%';
  markerEl.title = 'You are here';
}

// ─── Calendar mini-preview ────────────────────────────────────
function buildCalPreview(birth) {
  var grid = document.getElementById('cal-preview-grid');
  if (!grid) return;
  var now        = new Date();
  var msPerWeek  = 7 * 24 * 3600 * 1000;
  var weeksLived = Math.floor((now - birth) / msPerWeek);
  var totalWeeks = AVG_LIFESPAN_YEARS * 52;
  var preview    = Math.min(totalWeeks, 52 * 10); // show first 10 years worth as preview
  var frag = document.createDocumentFragment();
  for (var w = 0; w < preview; w++) {
    var cell = document.createElement('div');
    cell.className = 'cal-cell ' + (w < weeksLived ? 'cal-lived' : w === weeksLived ? 'cal-now' : 'cal-future');
    frag.appendChild(cell);
  }
  grid.innerHTML = '';
  grid.appendChild(frag);
}

// ─── Single Age ───────────────────────────────────────────────
document.getElementById('calc-single').addEventListener('click', function() {
  var name = document.getElementById('s-name').value;
  var dob  = document.getElementById('s-dob').value;
  var err  = validate(name, dob);
  showError('s-error', err);
  if (err) return;

  saveInputs(name.trim(), dob);
  var birth = parseDOB(dob);
  var card  = document.getElementById('single-result');
  window._shareData = { name: name.trim(), birth: birth };

  // reset expand state
  document.getElementById('result-expand').classList.add('hidden');
  var expandBtn = document.getElementById('btn-expand-more');
  if (expandBtn) { expandBtn.textContent = 'Show more insights ↓'; expandBtn.setAttribute('aria-expanded', 'false'); }

  initDailyHook(name.trim(), birth);

  function render() {
    var b = getBreakdown(birth);
    var t = getTotals(birth);
    var pct = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));
    var weeksLeft = Math.max(0, Math.round((AVG_LIFESPAN_YEARS - (b.yy + b.mo / 12)) * 52));

    // Step 1 — hero stat
    document.getElementById('sr-title').textContent = name.trim() + "'s Age";
    document.getElementById('hero-stat-days').textContent = t.day.toLocaleString();
    wordReveal(document.getElementById('hero-stat-pct'), 'I\'ve already used ' + pct + '% of my life 😳', 200);
    document.getElementById('sr-banner').textContent =
      b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';
    // Step 2 — ring + phase + weeks left
    updateRing(b.yy + b.mo / 12);
    var weeksLeftEl = document.getElementById('wl-number');
    if (weeksLeftEl) weeksLeftEl.textContent = weeksLeft.toLocaleString();
    renderPhaseBar(b.yy + b.mo / 12);

    // Step 3 — top 2 insights only (keep it focused)
    var allInsights = getInsights(b, t);
    document.getElementById('insights-grid').innerHTML = insightsHTML(allInsights.slice(0, 2));

    // Life Spend
    updateBudget(birth);
    renderPerceptionMsg(birth);

    // Age Twin + Next Milestone
    renderAgeTwin(birth);
    renderNextMilestone(t);

    // Step 4 (expand) — full stats, pills, calendar preview
    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'], [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],   [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],[t.sec, 'Total Seconds']
    ]);
    document.getElementById('sr-pills').innerHTML =
      '<div class="pill">📅 Born on ' + bornDay(birth) + '</div>' +
      '<div class="pill" id="s-bday">' + nextBirthday(birth) + '</div>';

    buildCalPreview(birth);
  }

  render();
  card.classList.remove('hidden');

  // micro-shock before hero stat
  var microShock = document.getElementById('micro-shock');
  var stepHero   = card.querySelector('.step-hero');
  
  if (microShock && stepHero) {
    stepHero.style.opacity = '0';
    microShock.classList.remove('hidden');
    
    setTimeout(function() {
      microShock.classList.add('fade-out');
      setTimeout(function() {
        microShock.classList.add('hidden');
        stepHero.style.transition = 'opacity 0.6s ease';
        stepHero.style.opacity = '1';
        
        // trigger next step when hero finishes
        stepHero.addEventListener('transitionend', function onHeroEnd() {
          stepHero.removeEventListener('transitionend', onHeroEnd);
          revealLifeSpend();
        }, { once: true });
      }, 400);
    }, 1200);
  } else {
    revealLifeSpend();
  }

  // progressive reveal — event-driven, not fixed timing
  function revealLifeSpend() {
    var stepLifeSpend = card.querySelector('.reveal-first');
    if (stepLifeSpend) {
      stepLifeSpend.style.opacity = '0';
      stepLifeSpend.style.transform = 'translateY(16px)';
      setTimeout(function() {
        stepLifeSpend.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        stepLifeSpend.style.opacity = '1';
        stepLifeSpend.style.transform = 'translateY(0)';
        
        stepLifeSpend.addEventListener('transitionend', function onSpendEnd() {
          stepLifeSpend.removeEventListener('transitionend', onSpendEnd);
          revealTwins();
        }, { once: true });
      }, 50);
    } else {
      revealTwins();
    }
  }

  function revealTwins() {
    var stepTwins = card.querySelectorAll('.reveal-third');
    if (stepTwins.length) {
      var completed = 0;
      stepTwins.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        setTimeout(function() {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          
          el.addEventListener('transitionend', function onTwinEnd() {
            el.removeEventListener('transitionend', onTwinEnd);
            completed++;
            if (completed === stepTwins.length) revealInsights();
          }, { once: true });
        }, 50);
      });
    } else {
      revealInsights();
    }
  }

  function revealInsights() {
    var stepInsights = card.querySelector('.reveal-fourth');
    if (stepInsights) {
      stepInsights.style.opacity = '0';
      stepInsights.style.transform = 'translateY(16px)';
      setTimeout(function() {
        stepInsights.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        stepInsights.style.opacity = '1';
        stepInsights.style.transform = 'translateY(0)';
        
        stepInsights.addEventListener('transitionend', function onInsEnd() {
          stepInsights.removeEventListener('transitionend', onInsEnd);
          revealClosing();
        }, { once: true });
      }, 50);
    } else {
      revealClosing();
    }
  }

  function revealClosing() {
    var stepClosing = card.querySelector('.reveal-fifth');
    if (stepClosing) {
      var b = getBreakdown(birth);
      var pct = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));
      var quotes = [
        'You are not early or late. You are in motion.',
        'The numbers matter less than the awareness.',
        'Time is not visible until now.',
        'This is your life, simplified.'
      ];
      var quote = pct < 30 ? quotes[0] : pct < 50 ? quotes[1] : pct < 70 ? quotes[2] : quotes[3];

      // 400ms silence — then fade in container, then word reveal
      stepClosing.classList.remove('hidden');
      stepClosing.style.opacity = '0';
      var quoteEl = document.getElementById('ci-quote');
      quoteEl.innerHTML = '';

      setTimeout(function() {
        stepClosing.style.transition = 'opacity 1.2s ease';
        stepClosing.style.opacity = '1';
        // word reveal starts after container fades in
        setTimeout(function() {
          wordReveal(quoteEl, quote, 100);
        }, 500);
        // life question after closing settles
        stepClosing.addEventListener('transitionend', function onCI() {
          stepClosing.removeEventListener('transitionend', onCI);
          showLifeQuestion();
        }, { once: true });
        setTimeout(showLifeQuestion, 1800); // fallback
      }, 400);
    }
  }

  // 7-day return hook
  setTimeout(function() {
    var hookEl = document.getElementById('return-hook');
    var hookTx = document.getElementById('rh-text');
    if (hookEl && hookTx) {
      var t7 = getTotals(birth);
      var hoursIn7 = Math.round(7 * 24);
      hookTx.textContent = 'Come back in 7 days — your Life Spend will have grown by ' + hoursIn7.toLocaleString() + ' more hours.';
      hookEl.classList.remove('hidden');
    }
  }, 1800);

  // share nudge — show after 3s
  clearTimeout(window._nudgeTimer);
  window._nudgeTimer = setTimeout(function() {
    var nudge = document.getElementById('share-nudge');
    if (nudge && window._shareData) nudge.classList.remove('hidden');
  }, 3000);

  // count-up hero days
  setTimeout(function() {
    var t = getTotals(birth);
    var el = document.getElementById('hero-stat-days');
    if (el) countUp(el, t.day, 900);
  }, 100);

  // expand button
  var expandBtn2 = document.getElementById('btn-expand-more');
  if (expandBtn2) {
    expandBtn2.onclick = function() {
      var exp = document.getElementById('result-expand');
      var open = exp.classList.toggle('hidden');
      expandBtn2.textContent = open ? 'Show more insights ↓' : 'Show less ↑';
      expandBtn2.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (!open) {
        animateBars();
        setTimeout(function() {
          document.querySelectorAll('#sr-stats .stat-val').forEach(function(el) {
            var raw = parseInt(el.textContent.replace(/,/g, ''), 10);
            if (!isNaN(raw)) countUp(el, raw, 700);
          });
        }, 50);
        exp.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }

  // full calendar button
  var calFullBtn = document.getElementById('btn-cal-full');
  if (calFullBtn) {
    calFullBtn.onclick = function() {
      buildLifeCalendar(birth, name.trim());
    };
  }

  clearInterval(window._sTimer);
  window._sTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._sTimer); return; }
    var b = getBreakdown(birth);
    var t = getTotals(birth);
    var pct = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));
    document.getElementById('hero-stat-pct').textContent = 'I\'ve already used ' + pct + '% of my life 😳';
    document.getElementById('sr-banner').textContent =
      b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';
    updateRing(b.yy + b.mo / 12);
    var bdayEl = document.getElementById('s-bday');
    if (bdayEl) bdayEl.textContent = nextBirthday(birth);
    updateBudget(birth);
    if (window._shareData) renderPerceptionMsg(window._shareData.birth);
  }, 1000);
});

// ─── Compare Ages ─────────────────────────────────────────────
document.getElementById('calc-compare').addEventListener('click', function() {
  var n1 = document.getElementById('p1-name').value;
  var d1 = document.getElementById('p1-dob').value;
  var n2 = document.getElementById('p2-name').value;
  var d2 = document.getElementById('p2-dob').value;
  var e1 = validate(n1, d1), e2 = validate(n2, d2);
  var errMsg = (e1 ? 'Person 1: ' + e1 : '') + (e1 && e2 ? '  |  ' : '') + (e2 ? 'Person 2: ' + e2 : '');
  showError('c-error', errMsg);
  if (e1 || e2) return;

  var birth1 = parseDOB(d1), birth2 = parseDOB(d2);
  var card   = document.getElementById('compare-result');

  function render() {
    var b1 = getBreakdown(birth1), b2 = getBreakdown(birth2);
    var t1 = getTotals(birth1),    t2 = getTotals(birth2);
    var olderName   = birth1 < birth2 ? n1.trim() : birth2 < birth1 ? n2.trim() : null;
    var youngerName = olderName === n1.trim() ? n2.trim() : n1.trim();

    var winnerEl = document.getElementById('cr-winner');
    if (olderName) {
      var diffDaysFull = Math.floor(Math.abs(birth1 - birth2) / 86400000);
      winnerEl.innerHTML = olderName + ' is older than ' + youngerName +
        '<span class="winner-sub">You\'ve lived ' + diffDaysFull.toLocaleString() + ' more days 😏</span>';
    } else {
      winnerEl.textContent = n1.trim() + ' and ' + n2.trim() + ' are the same age!';
    }

    var earlier = birth1 <= birth2 ? birth1 : birth2;
    var later   = birth1 <= birth2 ? birth2 : birth1;
    var df      = dateDiff(earlier, later);
    var diffMs  = Math.abs(birth1 - birth2);
    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHr  = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHr  / 24);
    var coffees = Math.floor(diffDay * 1.5);
    var weekends = Math.floor(diffDay / 7);

    document.getElementById('cr-diff').innerHTML =
      'Age Difference: ' + df.yy + ' Years  ' + df.mo + ' Months  ' + df.dd + ' Days  ' +
      df.hh + ' Hours  ' + df.mi + ' Minutes  ' + df.ss + ' Seconds' +
      (olderName ? '<br><span class="fun-msg">☕ ' + olderName + ' is ~' + coffees.toLocaleString() +
      ' coffees older &nbsp;·&nbsp; 🎉 ' + weekends.toLocaleString() + ' more weekends lived</span>' : '');

    document.getElementById('cr-stats').innerHTML = statsHTML([
      [diffDay, 'Days Difference'], [diffHr,  'Hours Difference'],
      [diffMin, 'Minutes Difference'], [diffSec, 'Seconds Difference']
    ]);
    document.getElementById('cr-cards').innerHTML =
      miniCard(n1.trim(), birth1, b1, t1) + miniCard(n2.trim(), birth2, b2, t2);
  }

  render();
  card.classList.remove('hidden');
  clearInterval(window._cTimer);
  window._cTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._cTimer); return; }
    render();
  }, 1000);
});

function miniCard(name, birth, b, t) {
  return '<div class="person-mini">' +
    '<h3>' + name + '</h3>' +
    '<p>Age: ' + b.yy + 'y ' + b.mo + 'm ' + b.dd + 'd<br>' +
    'Born: ' + bornDay(birth) + '<br>' +
    nextBirthday(birth) + '<br>' +
    'Total Days: ' + t.day.toLocaleString() + '</p></div>';
}

// ─── Share Card ───────────────────────────────────────────────
var _shareStyle = 'classic';

document.querySelectorAll('.sc-style-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    if (!window._shareData) return;
    document.querySelectorAll('.sc-style-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    _shareStyle = btn.getAttribute('data-style');
    renderShareCard();
    track('share_card_style', _shareStyle);
  });
});

function renderShareCard() {
  var data = window._shareData;
  if (!data) return;
  var b = getBreakdown(data.birth);
  var t = getTotals(data.birth);
  var pct = Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100);

  // mini ring — update both main and share card rings
  var circ = 2 * Math.PI * 48;
  var offset = circ - (pct / 100) * circ;
  
  var scFill = document.getElementById('sc-ring-fill');
  var scPct  = document.getElementById('sc-ring-pct');
  if (scFill) {
    scFill.style.strokeDashoffset = offset;
    scPct.textContent = Math.round(pct) + '%';
  }
  
  // also update main ring if visible
  var ringFill = document.getElementById('ring-fill');
  if (ringFill) {
    var mainCirc = 2 * Math.PI * 80;
    ringFill.style.strokeDashoffset = mainCirc - (pct / 100) * mainCirc;
  }

  var card = document.getElementById('share-card');
  var headline = document.getElementById('sc-headline');
  var nameEl   = document.getElementById('sc-name');
  var ageEl    = document.getElementById('sc-age');
  var statsEl  = document.getElementById('sc-stats');

  if (!card || !headline || !nameEl || !ageEl || !statsEl) return;

  nameEl.textContent = data.name;

  if (_shareStyle === 'classic') {
    card.className = 'share-card sc-classic';
    headline.textContent = 'I\'ve already used ' + Math.round(pct) + '% of my life 😳';
    document.getElementById('sc-subhead').textContent = data.name + ' · ' + t.day.toLocaleString() + ' days lived';
    ageEl.textContent = b.yy + ' years · ' + b.mo + ' months · ' + b.dd + ' days';
    statsEl.innerHTML = '❤️ ~' + (Math.floor(t.day * 24 * 60 * 70 / 1e9)).toFixed(1) + 'B heartbeats' +
      '  ·  😴 ~' + Math.floor(t.day * 8 / 365) + ' years sleeping' +
      '  ·  ' + nextBirthday(data.birth);
    document.getElementById('sc-ring-wrap').style.display = 'flex';

  } else if (_shareStyle === 'funny') {
    card.className = 'share-card sc-funny';
    headline.textContent = 'I\'ve eaten ~' + Math.floor(t.day * 3).toLocaleString() + ' meals 🍕';
    document.getElementById('sc-subhead').textContent = 'That\'s ' + b.yy + ' years of delicious life';
    ageEl.textContent = data.name + ' · born on a ' + bornDay(data.birth);
    statsEl.innerHTML = '🚶 ~' + (Math.floor(t.day * 8000 / 1e6)).toFixed(0) + 'M steps taken' +
      '  ·  ☕ ~' + Math.floor(t.day * 1.5).toLocaleString() + ' coffees' +
      '  ·  💧 ~' + Math.floor(t.day * 8).toLocaleString() + ' glasses of water';
    document.getElementById('sc-ring-wrap').style.display = 'none';

  } else {
    card.className = 'share-card sc-minimal';
    headline.textContent = t.day.toLocaleString() + ' days';
    document.getElementById('sc-subhead').textContent = data.name + ' · ' + b.yy + ' years old';
    ageEl.textContent = t.wk.toLocaleString() + ' weeks · ' + t.mon.toLocaleString() + ' months';
    statsEl.innerHTML = Math.round(pct) + '% of an average life lived · ' + Math.max(0, Math.round((AVG_LIFESPAN_YEARS - b.yy - b.mo/12) * 52)).toLocaleString() + ' weeks ahead';
    document.getElementById('sc-ring-wrap').style.display = 'flex';
  }
}

document.getElementById('btn-share-single').addEventListener('click', function() {
  if (!window._shareData) return;
  _shareStyle = 'classic';
  document.querySelectorAll('.sc-style-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelector('[data-style="classic"]').classList.add('active');
  renderShareCard();
  document.getElementById('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  track('share_card_open', _shareStyle);

  // one-line share identity for clipboard
  var b = getBreakdown(window._shareData.birth);
  var pct = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));
  window._shareText = 'I\'ve used ' + pct + '% of my life — AgeWise';
});

document.getElementById('share-close').addEventListener('click', closeModal);
document.getElementById('share-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function closeModal() {
  document.getElementById('share-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

document.getElementById('btn-download').addEventListener('click', function() {
  var card = document.getElementById('share-card');
  if (typeof html2canvas === 'undefined') {
    alert('Download library not loaded. Please check your connection and try again.');
    return;
  }
  
  var btn = this;
  var originalText = btn.textContent;
  btn.textContent = '⏳ Generating...';
  btn.disabled = true;
  
  html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true }).then(function(canvas) {
    var link = document.createElement('a');
    link.download = 'agewise-' + (_shareStyle || 'card') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    btn.textContent = '✅ Downloaded!';
    setTimeout(function() {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
    
    track('share_card_download', _shareStyle);
  }).catch(function(err) {
    console.error('Download failed:', err);
    alert('Failed to download card. Please try again.');
    btn.textContent = originalText;
    btn.disabled = false;
  });
});

// ─── Hero live demo counter (fake ticking) ────────────────────
(function() {
  var baseDays = 9846;
  var baseSec  = baseDays * 86400;
  var tick = 0;
  function updateDemo() {
    tick++;
    var days = baseDays + Math.floor(tick / 86400);
    var sec  = baseSec  + tick;
    var hb   = Math.floor(days * 24 * 60 * 70 / 1e6);
    var dEl = document.getElementById('hd-days');
    var hEl = document.getElementById('hd-hb');
    var sEl = document.getElementById('hd-sec');
    if (dEl) dEl.textContent = days.toLocaleString();
    if (hEl) hEl.textContent = hb.toLocaleString() + 'M';
    if (sEl) sEl.textContent = sec.toLocaleString();
  }
  setInterval(updateDemo, 1000);
  updateDemo();
})();

// ─── Life Calendar ────────────────────────────────────────────
function buildLifeCalendar(birth, name) {
  var section = document.getElementById('life-calendar');
  var grid    = document.getElementById('cal-grid');
  var statsRow = document.getElementById('cal-stats-row');
  var tooltip  = document.getElementById('cal-tooltip');

  var now         = new Date();
  var totalWeeks  = AVG_LIFESPAN_YEARS * 52;
  var msPerWeek   = 7 * 24 * 3600 * 1000;
  var weeksLived  = Math.floor((now - birth) / msPerWeek);
  var pct         = Math.round((weeksLived / totalWeeks) * 100);
  var weeksLeft   = totalWeeks - weeksLived;

  statsRow.innerHTML =
    '<div class="cal-stat"><span class="cal-stat-val">' + weeksLived.toLocaleString() + '</span><span class="cal-stat-lbl">Weeks Lived</span></div>' +
    '<div class="cal-stat"><span class="cal-stat-val">' + weeksLeft.toLocaleString() + '</span><span class="cal-stat-lbl">Weeks Ahead</span></div>' +
    '<div class="cal-stat"><span class="cal-stat-val">' + pct + '%</span><span class="cal-stat-lbl">Life Used</span></div>' +
    '<div class="cal-stat"><span class="cal-stat-val">' + AVG_LIFESPAN_YEARS + '</span><span class="cal-stat-lbl">Avg Lifespan</span></div>';

  // build grid in chunks to avoid blocking
  grid.innerHTML = '';
  var fragment = document.createDocumentFragment();

  for (var w = 0; w < totalWeeks; w++) {
    var cell = document.createElement('div');
    cell.className = 'cal-cell';
    var weekDate = new Date(birth.getTime() + w * msPerWeek);
    var ageAtWeek = Math.floor(w / 52);

    if (w < weeksLived) {
      cell.classList.add('cal-lived');
    } else if (w === weeksLived) {
      cell.classList.add('cal-now');
      cell.setAttribute('aria-label', 'You are here');
      cell.title = 'You are here';
    } else {
      cell.classList.add('cal-future');
    }

    // tooltip data
    cell.setAttribute('data-week', w + 1);
    cell.setAttribute('data-age', ageAtWeek);
    cell.setAttribute('data-date', weekDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));

    cell.addEventListener('mouseenter', function(e) {
      var el = e.currentTarget;
      tooltip.textContent = 'Week ' + el.getAttribute('data-week') +
        ' · Age ' + el.getAttribute('data-age') +
        ' · ' + el.getAttribute('data-date');
      tooltip.classList.remove('hidden');
      var rect = el.getBoundingClientRect();
      var wrap = document.querySelector('.cal-grid-wrap').getBoundingClientRect();
      tooltip.style.left = Math.min(rect.left - wrap.left, wrap.width - 200) + 'px';
      tooltip.style.top  = (rect.top - wrap.top - 36) + 'px';
    });
    cell.addEventListener('mouseleave', function() { tooltip.classList.add('hidden'); });

    fragment.appendChild(cell);
  }

  // calendar reveal — perceived event, not instant UI
  grid.style.opacity = '0';
  grid.appendChild(fragment);
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(function() {
    grid.style.transition = 'opacity 0.6s ease';
    grid.style.opacity = '1';
  }, 350);
}

// ─── Story-style insights upgrade ────────────────────────────
function getInsights(b, t) {
  var age = b.yy;
  var insights = [];
  var pct = Math.round(Math.min(100, ((age + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));

  if (age < 13)
    insights.push({ icon: '🌱', title: 'Childhood', text: 'Every single day is a new discovery. The world is still being unwrapped — keep exploring.' });
  else if (age < 20)
    insights.push({ icon: '⚡', title: 'Teen Years', text: 'These years shape everything that follows. The habits, friendships, and ideas forming now will echo for decades.' });
  else if (age < 25)
    insights.push({ icon: '🚀', title: 'Growth Phase', text: 'You\'re in the most elastic phase of your life. Risks taken now cost the least and pay the most. Go bold.' });
  else if (age < 35)
    insights.push({ icon: '💼', title: 'Peak Productivity', text: 'Energy meets experience. The decisions you make in these years compound harder than any investment. Make them count.' });
  else if (age < 50)
    insights.push({ icon: '🧠', title: 'Wisdom Phase', text: 'You\'ve earned the clarity to know what truly matters. This is when purpose-driven people do their best work.' });
  else if (age < 65)
    insights.push({ icon: '🌟', title: 'Legacy Phase', text: 'The impact you create now outlasts you. Every mentor, project, and relationship is a thread in your legacy.' });
  else
    insights.push({ icon: '👑', title: 'Golden Years', text: 'A life richly and fully lived. Your perspective is irreplaceable — the world needs your story.' });

  insights.push({ icon: '⏳', title: 'Time Perspective',
    text: 'You\'ve already used ' + pct + '% of an average lifetime. Not to create fear — but to create focus. The most valuable years are happening right now.' });

  var sleepYears = Math.round(t.day * 8 / 365);
  insights.push({ icon: '😴', title: 'The Sleep Chapter',
    text: 'Roughly ' + sleepYears + ' of your years have been spent sleeping. That\'s not wasted time — it\'s the engine that powers everything else.' });

  if (t.day >= 10000)
    insights.push({ icon: '🏆', title: '10,000 Days Club',
      text: 'You\'ve crossed 10,000 days alive. Fewer than half of all people ever reach this milestone. That\'s worth celebrating.' });
  else if (10000 - t.day < 500)
    insights.push({ icon: '⏳', title: '10,000 Days Approaching',
      text: 'Only ' + (10000 - t.day) + ' days until your 10,000-day milestone. Mark the date — it\'s rarer than most birthdays.' });

  if (t.sec >= 1e9)
    insights.push({ icon: '🎯', title: '1 Billion Seconds',
      text: 'You\'ve lived over one billion seconds. This milestone is so rare that most people never even know it exists. You\'re in elite company.' });

  insights.push({ icon: '🎉', title: 'Weekends Lived',
    text: 'You\'ve had ~' + Math.floor(t.wk).toLocaleString() + ' weekends so far. Each one was a small gift. How many do you actually remember?' });

  return insights;
}

// ─── Add Life Calendar button to result card ──────────────────
// Uses a dedicated slot div — never touches btn-share-single's DOM position
var _calBtnAdded = false;
function addCalendarButton(birth) {
  var slot = document.getElementById('cal-btn-slot');
  if (!slot) return;
  // Always refresh the button so birth date is current
  slot.innerHTML = '';
  var calBtn = document.createElement('button');
  calBtn.className = 'btn-calendar';
  calBtn.id = 'btn-calendar';
  calBtn.textContent = '🗓️ View My Life Calendar';
  calBtn.addEventListener('click', function() {
    buildLifeCalendar(birth, window._shareData ? window._shareData.name : '');
  });
  slot.appendChild(calBtn);
  _calBtnAdded = true;
}

// patch into single calc render — wrap original
document.getElementById('calc-single').addEventListener('click', function() {
  _calBtnAdded = false; // reset for new calc
});

// ─── PWA Install Banner ───────────────────────────────────────
var _deferredPrompt = null;
var _pwaInstallHandled = false;

// Clear any stale dismissed flag so banner can show again
// (only clear if it was set more than 1 day ago via localStorage)
(function() {
  var dismissed = localStorage.getItem('aw_pwa_dismissed_ts');
  if (dismissed) {
    var age = Date.now() - parseInt(dismissed, 10);
    if (age > 86400000) { // older than 1 day — allow showing again
      localStorage.removeItem('aw_pwa_dismissed_ts');
      sessionStorage.removeItem('aw_pwa_dismissed');
    }
  }
})();

function showPWABanner() {
  var banner = document.getElementById('pwa-banner');
  if (!banner) return;
  if (sessionStorage.getItem('aw_pwa_dismissed')) return;
  // Don't show if already installed (standalone mode)
  if (window.navigator.standalone === true) return;
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  setTimeout(function() { banner.classList.remove('hidden'); }, 5000);
}

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  _deferredPrompt = e;
  showPWABanner();
});

// iOS — show manual install hint
(function() {
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var isStandalone = window.navigator.standalone === true;
  if (isIOS && !isStandalone) {
    var installBtn = document.getElementById('pwa-install');
    if (installBtn) {
      installBtn.textContent = 'How to Install';
      installBtn.onclick = function() {
        alert('To install AgeWise:\n\n1. Tap the Share button (□↑) in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
        sessionStorage.setItem('aw_pwa_dismissed', '1');
        document.getElementById('pwa-banner').classList.add('hidden');
      };
    }
    showPWABanner();
  }
})();

// Android / Desktop Chrome — show banner even if beforeinstallprompt already fired
// (handles case where user visits again after dismissing)
(function() {
  var isAndroid = /android/i.test(navigator.userAgent);
  var isChrome  = /chrome/i.test(navigator.userAgent) && !/edge|opr/i.test(navigator.userAgent);
  var isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!isIOS && (isAndroid || isChrome)) {
    // Show banner as a general "install" prompt even without the native event
    showPWABanner();
  }
})();

document.getElementById('pwa-install').addEventListener('click', function() {
  if (_pwaInstallHandled) return;
  _pwaInstallHandled = true;

  if (_deferredPrompt) {
    _deferredPrompt.prompt();
    _deferredPrompt.userChoice.then(function(result) {
      _deferredPrompt = null;
      document.getElementById('pwa-banner').classList.add('hidden');
      sessionStorage.setItem('aw_pwa_dismissed', '1');
      localStorage.setItem('aw_pwa_dismissed_ts', Date.now().toString());
    });
  } else {
    // No native prompt — show instructions
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      alert('To install AgeWise:\n\n1. Tap the Share button (□↑) in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
    } else {
      alert('To install AgeWise:\n\n1. Click the ⋮ menu in Chrome\n2. Select "Install AgeWise" or "Add to Home Screen"');
    }
    sessionStorage.setItem('aw_pwa_dismissed', '1');
    document.getElementById('pwa-banner').classList.add('hidden');
  }
  _pwaInstallHandled = false; // allow re-trigger if needed
});

document.getElementById('pwa-dismiss').addEventListener('click', function() {
  var banner = document.getElementById('pwa-banner');
  banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  banner.style.opacity = '0';
  banner.style.transform = 'translateY(12px)';
  setTimeout(function() {
    banner.classList.add('hidden');
    banner.style.opacity = '';
    banner.style.transform = '';
  }, 300);
  sessionStorage.setItem('aw_pwa_dismissed', '1');
  localStorage.setItem('aw_pwa_dismissed_ts', Date.now().toString());
});

// ─── Return Trigger ───────────────────────────────────────────
function showReturnTrigger(birth) {
  var t    = getTotals(birth);
  var rt   = document.getElementById('return-trigger');
  var rtTx = document.getElementById('rt-text');
  var milestones = [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,15000,20000,25000,30000];
  var next = milestones.find(function(m) { return m > t.day; });
  if (!next) return;
  var daysLeft = next - t.day;
  rtTx.textContent = '🎯 Come back in ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') +
    ' — you\'ll hit ' + next.toLocaleString() + ' days alive!';
  setTimeout(function() { rt.classList.remove('hidden'); }, 1500);
}

document.getElementById('rt-close').addEventListener('click', function() {
  var rt = document.getElementById('return-trigger');
  rt.style.transition = 'opacity 0.25s ease';
  rt.style.opacity = '0';
  setTimeout(function() {
    rt.classList.add('hidden');
    rt.style.opacity = '';
  }, 250);
});

// patch showReturnTrigger into daily hook init
var _origInitDailyHook = initDailyHook;
initDailyHook = function(name, birth) {
  _origInitDailyHook(name, birth);
  showReturnTrigger(birth);
  addCalendarButton(birth);
};

// ══════════════════════════════════════════════════════════════
// GROWTH ENGINE — Viral Loop, Challenge Mode, Profile, Analytics
// ══════════════════════════════════════════════════════════════

// ─── Analytics helper ────────────────────────────────────────
function track(action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, { event_category: 'AgeWise', event_label: label || '' });
  }
}

// ─── Personal Profile System ─────────────────────────────────
function loadProfile() {
  var saved = JSON.parse(localStorage.getItem('aw_last') || 'null');
  if (!saved || !saved.name || !saved.dob) return;

  var birth = parseDOB(saved.dob);
  var b = getBreakdown(birth);
  var t = getTotals(birth);

  var pw = document.getElementById('profile-welcome');
  var greeting = document.getElementById('pw-greeting');
  var sub = document.getElementById('pw-sub');
  var avatar = document.getElementById('pw-avatar');

  // pick avatar emoji by age
  var age = b.yy;
  avatar.textContent = age < 13 ? '🧒' : age < 20 ? '🧑' : age < 40 ? '👤' : age < 60 ? '🧔' : '👴';

  var hour = new Date().getHours();
  var timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  greeting.textContent = timeGreet + ', ' + saved.name + ' 👋';
  sub.textContent = 'You are ' + t.day.toLocaleString() + ' days old today · ' + b.yy + ' years ' + b.mo + 'm ' + b.dd + 'd';

  pw.classList.remove('hidden');

  // hide empty state if returning user
  var es = document.getElementById('empty-state');
  if (es) es.classList.add('hidden');
}

document.getElementById('pw-clear').addEventListener('click', function() {
  localStorage.removeItem('aw_last');
  localStorage.removeItem('aw_streak');
  document.getElementById('profile-welcome').classList.add('hidden');
  document.getElementById('empty-state').classList.remove('hidden');
  document.getElementById('s-name').value = '';
  document.getElementById('s-dob').value = '';
  track('profile_clear', '');
});

loadProfile();

// ─── Return visit: show saved moment delta ────────────────────
(function() {
  var saved = JSON.parse(localStorage.getItem('aw_moment') || 'null');
  var lastSaved = JSON.parse(localStorage.getItem('aw_last') || 'null');
  if (!saved || !lastSaved || !lastSaved.dob) return;
  var birth = parseDOB(lastSaved.dob);
  var b = getBreakdown(birth);
  var currentPct = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));
  if (currentPct > saved.pct) {
    var sub = document.getElementById('pw-sub');
    if (sub) sub.textContent = 'Last time you checked, you had used ' + saved.pct + '% of your life. Now it\'s ' + currentPct + '%.';
  }
})();

// ─── Empty state live demo ────────────────────────────────────
(function() {
  var birth2000 = new Date(2000, 0, 1);
  function updateES() {
    var t = getTotals(birth2000);
    var esD = document.getElementById('es-days');
    var esH = document.getElementById('es-hb');
    var esS = document.getElementById('es-sec');
    if (esD) esD.textContent = t.day.toLocaleString();
    if (esH) esH.textContent = Math.floor(t.day * 24 * 60 * 70 / 1e6).toLocaleString() + 'M';
    if (esS) esS.textContent = t.sec.toLocaleString();
  }
  updateES();
  setInterval(updateES, 1000);
})();

// ─── Challenge Mode ───────────────────────────────────────────
function buildChallengeLink(name, dob) {
  // encode as base64 URL param — no server needed
  var payload = btoa(JSON.stringify({ n: name, d: dob }));
  var base = window.location.href.split('?')[0].split('#')[0];
  return base + '?challenge=' + encodeURIComponent(payload);
}

document.getElementById('btn-challenge').addEventListener('click', function() {
  var data = window._shareData;
  if (!data) return;
  var dobStr = data.birth.getFullYear() + '-' +
    String(data.birth.getMonth() + 1).padStart(2, '0') + '-' +
    String(data.birth.getDate()).padStart(2, '0');
  var link = buildChallengeLink(data.name, dobStr);
  var out = document.getElementById('challenge-out');
  var inp = document.getElementById('co-link-input');
  inp.value = link;
  // emotional label
  var label = out.querySelector('.co-label');
  if (label) label.textContent = data.name + ' challenged you 👀 — share this link and see who\'s lived more:';
  out.classList.remove('hidden');
  out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  track('challenge_generate', data.name);
});

document.getElementById('btn-copy-link').addEventListener('click', function() {
  var data = window._shareData;
  if (!data) return;
  var dobStr = data.birth.getFullYear() + '-' +
    String(data.birth.getMonth() + 1).padStart(2, '0') + '-' +
    String(data.birth.getDate()).padStart(2, '0');
  var link = buildChallengeLink(data.name, dobStr);
  navigator.clipboard.writeText(link).then(function() {
    var btn = document.getElementById('btn-copy-link');
    btn.textContent = '✅ Copied!';
    setTimeout(function() { btn.textContent = '🔗 Copy My Link'; }, 2000);
  });
  track('copy_link', '');
});

document.getElementById('co-copy-btn').addEventListener('click', function() {
  var inp = document.getElementById('co-link-input');
  navigator.clipboard.writeText(inp.value).then(function() {
    var btn = document.getElementById('co-copy-btn');
    btn.textContent = '✅';
    setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
  });
});

// ─── Auto-load challenge param on page load ───────────────────
(function() {
  var params = new URLSearchParams(window.location.search);
  var raw = params.get('challenge');
  if (!raw) return;
  try {
    var data = JSON.parse(atob(decodeURIComponent(raw)));
    if (!data.n || !data.d) return;
    // pre-fill compare tab with challenger as person 1
    document.getElementById('p1-name').value = data.n;
    document.getElementById('p1-dob').value  = data.d;
    // switch to compare tab
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(s) { s.classList.remove('active'); });
    document.querySelector('[data-tab="compare"]').classList.add('active');
    document.getElementById('compare').classList.add('active');
    // show banner
    var banner = document.createElement('div');
    banner.className = 'challenge-banner';
    banner.innerHTML = '🏆 <strong>' + data.n + '</strong> challenged you! Enter your details as Person 2 to compare.';
    document.getElementById('compare').insertBefore(banner, document.getElementById('compare').firstChild);
    track('challenge_accept', data.n);
  } catch(e) {}
})();

// ─── Perception toggle ────────────────────────────────────────
document.querySelectorAll('.pt-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.pt-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    _perceptionMode = btn.getAttribute('data-mode');
    if (window._shareData) renderPerceptionMsg(window._shareData.birth);
  });
});

// ─── Focus Glow System ───────────────────────────────────────
function applyFocusGlow(activeEl) {
  var sections = document.querySelectorAll(
    '.result-step, .age-twin, .next-milestone, .closing-insight, .life-question, .send-someone, .bday-wrap'
  );
  sections.forEach(function(el) {
    if (el === activeEl || el.contains(activeEl)) {
      el.classList.remove('section-dimmed');
      el.classList.add('section-focused');
    } else {
      el.classList.remove('section-focused');
      el.classList.add('section-dimmed');
    }
  });
}

function clearFocusGlow() {
  document.querySelectorAll('.section-dimmed, .section-focused').forEach(function(el) {
    el.classList.remove('section-dimmed', 'section-focused');
  });
}

// apply glow on scroll — focus whichever section is most visible
var _glowTimer = null;
window.addEventListener('scroll', function() {
  clearTimeout(_glowTimer);
  _glowTimer = setTimeout(function() {
    var card = document.getElementById('single-result');
    if (!card || card.classList.contains('hidden')) return;
    var sections = card.querySelectorAll(
      '.result-step, .age-twin, .next-milestone, .closing-insight, .life-question'
    );
    var best = null, bestVis = 0;
    sections.forEach(function(el) {
      if (el.classList.contains('hidden')) return;
      var r = el.getBoundingClientRect();
      var vis = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (vis > bestVis) { bestVis = vis; best = el; }
    });
    if (best) applyFocusGlow(best); else clearFocusGlow();
  }, 80);
}, { passive: true });

// ─── Word-by-word reveal ──────────────────────────────────────
function wordReveal(el, text, delayBase) {
  el.classList.add('word-reveal');
  el.innerHTML = '';
  text.split(' ').forEach(function(word, i) {
    var span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.animationDelay = (delayBase + i * 80) + 'ms';
    el.appendChild(span);
  });
}

// ─── Life Question interaction feedback ──────────────────────
document.getElementById('lq-yes').addEventListener('click', function() {
  this.classList.add('glow');
  var self = this;
  setTimeout(function() { self.classList.remove('glow'); }, 600);
});

document.getElementById('lq-no').addEventListener('click', function() {
  this.classList.add('shake');
  var self = this;
  setTimeout(function() { self.classList.remove('shake'); }, 500);
});

// ─── Tap ripple ───────────────────────────────────────────────
document.addEventListener('click', function(e) {
  var btn = e.target.closest(
    '.btn-primary, .lq-btn, .ss-btn, .btn-remember, .btn-bday-trigger, .btn-gen-msg'
  );
  if (!btn) return;
  var r = btn.getBoundingClientRect();
  var ripple = document.createElement('span');
  ripple.className = 'ripple';
  var size = Math.max(btn.offsetWidth, btn.offsetHeight);
  ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;' +
    'left:' + (e.clientX - r.left - size / 2) + 'px;' +
    'top:'  + (e.clientY - r.top  - size / 2) + 'px;';
  btn.appendChild(ripple);
  setTimeout(function() { ripple.remove(); }, 600);
});

// ─── Share nudge popup ────────────────────────────────────────
document.getElementById('sn-close').addEventListener('click', function() {
  var nudge = document.getElementById('share-nudge');
  nudge.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  nudge.style.opacity = '0';
  nudge.style.transform = 'translateY(8px)';
  setTimeout(function() {
    nudge.classList.add('hidden');
    nudge.style.opacity = '';
    nudge.style.transform = '';
  }, 250);
});
document.getElementById('sn-share-btn').addEventListener('click', function() {
  document.getElementById('share-nudge').classList.add('hidden');
  // open share modal directly
  if (!window._shareData) return;
  _shareStyle = 'classic';
  document.querySelectorAll('.sc-style-btn').forEach(function(b) { b.classList.remove('active'); });
  var classicBtn = document.querySelector('[data-style="classic"]');
  if (classicBtn) classicBtn.classList.add('active');
  renderShareCard();
  document.getElementById('share-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

// ─── Birthday Message Generator ──────────────────────────────
var _bdayRel = 'friend';

document.getElementById('btn-bday-trigger').addEventListener('click', function() {
  var form = document.getElementById('bday-form');
  form.classList.toggle('hidden');
  this.style.opacity = form.classList.contains('hidden') ? '1' : '0.5';
});

document.querySelectorAll('.bf-rel').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.bf-rel').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    _bdayRel = btn.getAttribute('data-rel');
  });
});

document.getElementById('btn-gen-msg').addEventListener('click', function() {
  var name = document.getElementById('bf-name').value.trim();
  var dob  = document.getElementById('bf-dob').value;
  if (!name || !dob) return;

  var birth = parseDOB(dob);
  var t = getTotals(birth);
  var b = getBreakdown(birth);
  var days = t.day.toLocaleString();
  var pct  = Math.round(Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100));

  // message lines — name-personalized, unexpected opening line, breathing space
  var lines = {
    friend: [
      'Out of all the days that have ever existed… ' + name + ' got these ones.',
      name + ' has lived ' + days + ' days. Every single one led to who they are right now.',
      'I\'m glad our paths crossed in the same moment in time.'
    ],
    parent: [
      'Most of your time was never yours. You gave it away.',
      name + ' — ' + days + ' days of showing up, sacrificing, and making space for others.',
      'Today is just a small moment to say: that time mattered more than you know.'
    ],
    partner: [
      'Time didn\'t just pass. It changed when you entered it.',
      name + ' — ' + days + ' days lived. And the best ones have been shared.',
      'I\'m grateful for every second we\'ve spent in the same moment.'
    ]
  };

  var msgLines = lines[_bdayRel];
  var msgPlain = msgLines.join('\n\n');

  // render card with line breaks
  document.getElementById('bc-name').textContent = name;
  document.getElementById('bc-days').textContent = days + ' days lived · ' + pct + '% of an average life';
  var msgEl = document.getElementById('bc-msg');
  msgEl.innerHTML = '';
  msgLines.forEach(function(line, i) {
    var p = document.createElement('p');
    p.textContent = line;
    if (i > 0) p.style.marginTop = '14px';
    msgEl.appendChild(p);
  });

  var output = document.getElementById('bday-output');
  output.classList.remove('hidden');
  output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // delivery nudge
  var nudge = document.getElementById('bday-nudge');
  if (nudge) nudge.classList.remove('hidden');

  // copy button
  document.getElementById('btn-copy-bday').onclick = function() {
    var text = name + '\n\n' + msgPlain + '\n\n— Made with AgeWise\n' + window.location.href.split('?')[0];
    navigator.clipboard.writeText(text).then(function() {
      var el = document.getElementById('bday-copied');
      el.textContent = '✅ Copied. Don\'t just save this — send it.';
      el.classList.remove('hidden');
      setTimeout(function() { el.classList.add('hidden'); }, 3500);
    });
    track('bday_copy', _bdayRel);
  };

  // whatsapp share
  document.getElementById('btn-wa-bday').onclick = function() {
    var text = name + '\n\n' + msgPlain + '\n\n— Made with AgeWise\n' + window.location.href.split('?')[0];
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    track('bday_whatsapp', _bdayRel);
  };

  // download card
  document.getElementById('btn-download-bday').onclick = function() {
    var card = document.getElementById('bday-card');
    if (typeof html2canvas === 'undefined') return;
    html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true }).then(function(canvas) {
      var link = document.createElement('a');
      link.download = 'agewise-birthday-' + name.toLowerCase().replace(/\s+/g, '-') + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
    track('bday_download', _bdayRel);
  };

  // make another
  document.getElementById('btn-bday-again').onclick = function() {
    document.getElementById('bf-name').value = '';
    document.getElementById('bf-dob').value = '';
    output.classList.add('hidden');
    if (nudge) nudge.classList.add('hidden');
    document.getElementById('bf-name').focus();
  };

  track('bday_generate', _bdayRel);
});

// ─── Track key events ─────────────────────────────────────────
document.getElementById('calc-single').addEventListener('click', function() {
  track('calculate', 'single');
});
document.getElementById('calc-compare').addEventListener('click', function() {
  track('calculate', 'compare');
});
document.getElementById('btn-share-single').addEventListener('click', function() {
  track('share_card_open', _shareStyle);
});
document.getElementById('btn-download').addEventListener('click', function() {
  track('share_card_download', _shareStyle);
  // increment share count
  var base = parseInt(localStorage.getItem('aw_share_base') || '0', 10);
  localStorage.setItem('aw_share_base', base + 1);
});

// ══════════════════════════════════════════════════════════════
// COSMIC AGE + REALITY DISTORTION
// ══════════════════════════════════════════════════════════════

// ─── Planet data ─────────────────────────────────────────────
var PLANETS = [
  { name: 'Mercury', icon: '☿',  color: '#94a3b8', year: 0.2408,  twist: 'You\'ve lived many lifetimes here. Mercury moves fast — and so does time.' },
  { name: 'Venus',   icon: '♀',  color: '#fbbf24', year: 0.6152,  twist: 'On Venus, a day is longer than a year. Time here is beautifully broken.' },
  { name: 'Earth',   icon: '🌍', color: '#60a5fa', year: 1.0,     twist: 'This is the only timeline you actually know.' },
  { name: 'Mars',    icon: '♂',  color: '#f87171', year: 1.8808,  twist: 'On Mars, you\'re younger. A slower orbit, a slower life.' },
  { name: 'Jupiter', icon: '♃',  color: '#a78bfa', year: 11.862,  twist: 'Still a child on Jupiter. You haven\'t even started.' },
  { name: 'Saturn',  icon: '♄',  color: '#34d399', year: 29.457,  twist: 'On Saturn, most people never reach their first birthday.' },
  { name: 'Uranus',  icon: '⛢',  color: '#38bdf8', year: 84.011,  twist: 'On Uranus, you may not have been born yet in this orbit.' },
  { name: 'Neptune', icon: '♆',  color: '#818cf8', year: 164.8,   twist: 'Neptune hasn\'t even completed one orbit since humans landed on the Moon.' }
];

// ─── Render Cosmic Section ────────────────────────────────────
function renderCosmicSection(birth) {
  var section = document.getElementById('cosmic-section');
  if (!section) return;

  var t = getTotals(birth);
  var earthYears = t.day / 365.25;

  // Planet grid
  var grid = document.getElementById('planet-grid');
  if (grid) {
    grid.innerHTML = PLANETS.map(function(p) {
      var age = earthYears / p.year;
      var ageDisplay, label;
      if (age < 1) {
        var months = Math.floor(age * 12);
        ageDisplay = months > 0 ? months + ' months' : '< 1 month';
        label = 'barely begun';
      } else {
        ageDisplay = age.toFixed(1) + ' yrs';
        label = age < 5 ? 'still young' : age < 20 ? 'growing' : age < 50 ? 'in your prime' : age < 80 ? 'wise' : 'ancient';
      }
      var isEarth = p.name === 'Earth';
      return '<div class="planet-card' + (isEarth ? ' planet-earth' : '') + '">' +
        '<div class="pc-icon" style="color:' + p.color + '">' + p.icon + '</div>' +
        '<div class="pc-name">' + p.name + '</div>' +
        '<div class="pc-age" style="color:' + p.color + '">' + ageDisplay + '</div>' +
        '<div class="pc-label">' + label + '</div>' +
        '</div>';
    }).join('');
  }

  // Emotional twist
  var twist = document.getElementById('cosmic-twist');
  if (twist) {
    var mercuryAge = Math.floor(earthYears / 0.2408);
    var neptuneAge = (earthYears / 164.8);
    var neptuneStr = neptuneAge < 1
      ? 'haven\'t completed your first Neptune year'
      : 'are ' + neptuneAge.toFixed(2) + ' years old on Neptune';
    twist.innerHTML =
      '<span class="ct-line">On Mercury you\'re <strong>' + mercuryAge + ' years old</strong> — ancient.</span>' +
      '<span class="ct-sep">·</span>' +
      '<span class="ct-line">On Neptune you ' + neptuneStr + ' — barely a whisper.</span>' +
      '<span class="ct-full">Same life. Infinite perspectives.</span>';
  }

  // You vs The Universe
  var universeAgeYears = 13.8e9;
  var pctOfUniverse = (earthYears / universeAgeYears * 100);
  var pctStr = pctOfUniverse.toExponential(2);
  // If universe = 1 day (86400s), your life in seconds
  var lifeAsUniverseSeconds = (earthYears / universeAgeYears) * 86400;
  var lifeStr = lifeAsUniverseSeconds < 1
    ? (lifeAsUniverseSeconds * 1000).toFixed(1) + ' milliseconds'
    : lifeAsUniverseSeconds.toFixed(2) + ' seconds';

  var usStats = document.getElementById('us-stats');
  if (usStats) {
    usStats.innerHTML =
      '<div class="us-stat"><span class="us-val">' + pctStr + '%</span><span class="us-lbl">of universe age</span></div>' +
      '<div class="us-stat"><span class="us-val">' + lifeStr + '</span><span class="us-lbl">if universe = 1 day</span></div>' +
      '<div class="us-stat"><span class="us-val">' + (earthYears / 200000).toFixed(4) + 'x</span><span class="us-lbl">vs human species age</span></div>';
  }
  var usLine = document.getElementById('us-line');
  if (usLine) {
    usLine.textContent = 'You are a ' + lifeStr + ' in a 24-hour universe. And yet — here you are, aware of it.';
  }

  // Cosmic Events Since Birth
  var ceGrid = document.getElementById('ce-grid');
  if (ceGrid) {
    var days = t.day;
    var seconds = t.sec;
    var events = [
      { icon: '🌍', label: 'Earth orbits completed', val: (days / 365.25).toFixed(1) },
      { icon: '🌙', label: 'Full moons', val: Math.floor(days / 29.53).toLocaleString() },
      { icon: '☀️', label: 'km Sun traveled in galaxy', val: (seconds * 230).toLocaleString() },
      { icon: '☄️', label: 'Meteors hit Earth (est.)', val: Math.floor(days * 100).toLocaleString() },
      { icon: '⚡', label: 'Lightning strikes on Earth', val: (days * 86400 * 100).toLocaleString() },
      { icon: '💥', label: 'Supernovas in observable universe', val: Math.floor(days / 365.25 * 3).toLocaleString() }
    ];
    ceGrid.innerHTML = events.map(function(e) {
      return '<div class="ce-item">' +
        '<span class="ce-icon">' + e.icon + '</span>' +
        '<div class="ce-body"><div class="ce-val">' + e.val + '</div><div class="ce-lbl">' + e.label + '</div></div>' +
        '</div>';
    }).join('');
  }

  // Random Reality Fact — initial render
  renderRandomFact(earthYears, t);

  section.classList.remove('hidden');
}

// ─── Random Reality Facts ─────────────────────────────────────
var _factIndex = 0;
function renderRandomFact(earthYears, t) {
  var facts = [
    'Your heart has beaten approximately ' + Math.floor(t.day * 24 * 60 * 70).toLocaleString() + ' times. Each one was a small miracle.',
    'You\'ve blinked roughly ' + Math.floor(t.day * 24 * 60 * 15).toLocaleString() + ' times — and barely noticed any of them.',
    'Light from the Sun takes 8 minutes to reach Earth. In your lifetime, ' + Math.floor(t.day * 24 * 60 / 8).toLocaleString() + ' of those journeys have completed.',
    'You\'ve breathed approximately ' + Math.floor(t.day * 24 * 60 * 15).toLocaleString() + ' times. Your body did that without you asking.',
    'The Voyager 1 probe has traveled ' + (t.day * 24 * 3600 * 17000 / 1e9).toFixed(2) + ' billion km since launch — most of that during your lifetime.',
    'In the time you\'ve been alive, the universe expanded by roughly ' + (earthYears * 73.3 * 3.086e19 / 9.461e15).toFixed(0) + ' light-years in every direction.',
    'You\'ve slept through approximately ' + Math.floor(t.day / 3).toLocaleString() + ' days of your life. Your brain used every one of them.',
    'If your life were a film at 24fps, it would run for ' + Math.floor(t.day * 24 * 3600 * 24 / 3600).toLocaleString() + ' hours.',
    'The cells in your body have replaced themselves multiple times. You are not the same physical person you were 7 years ago.',
    'You\'ve experienced approximately ' + Math.floor(t.day * 24 * 60 / 90).toLocaleString() + ' complete sleep cycles — each one resetting your mind.'
  ];
  _factIndex = (_factIndex + 1) % facts.length;
  var el = document.getElementById('rf-text');
  if (el) {
    el.style.opacity = '0';
    setTimeout(function() {
      el.textContent = facts[_factIndex];
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity = '1';
    }, 150);
  }
}

document.getElementById('rf-btn').addEventListener('click', function() {
  if (!window._shareData) return;
  var t = getTotals(window._shareData.birth);
  var earthYears = t.day / 365.25;
  renderRandomFact(earthYears, t);
  track('random_fact', '');
});

// ─── Daily Insight ────────────────────────────────────────────
function renderDailyInsight(birth) {
  var el = document.getElementById('daily-insight');
  var txt = document.getElementById('di-text');
  if (!el || !txt) return;

  var t = getTotals(birth);
  var b = getBreakdown(birth);

  // Unique to today's exact day count
  var insights = [
    'Today you are exactly ' + t.day.toLocaleString() + ' days old. A number you will never see again.',
    'You have lived ' + t.wk.toLocaleString() + ' weeks. Each one was a chapter. Most went unnoticed.',
    'Right now, ' + b.hh + ' hours and ' + b.mi + ' minutes into today of your life. This second is already gone.',
    'You\'ve completed ' + (t.day / 365.25).toFixed(3) + ' Earth orbits. The universe counted every one.',
    'In the last 24 hours, your heart beat ~' + (24 * 60 * 70).toLocaleString() + ' times for you. Automatically. Silently.',
    'You are ' + t.day.toLocaleString() + ' days old today — and the only person on Earth with exactly this history.'
  ];

  // Pick based on day of year so it changes daily
  var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  txt.textContent = insights[dayOfYear % insights.length];
  el.classList.remove('hidden');
}

// ─── Improve My Life ─────────────────────────────────────────
function renderImproveSection(birth) {
  var section = document.getElementById('improve-section');
  var grid = document.getElementById('improve-grid');
  if (!section || !grid) return;

  var t = getTotals(birth);
  var b = getBreakdown(birth);
  var yearsLeft = Math.max(0, AVG_LIFESPAN_YEARS - (b.yy + b.mo / 12));

  var actions = [
    {
      icon: '📱',
      habit: 'Cut screen time by 1 hr/day',
      gain: Math.round(yearsLeft * 365 * 1 / 24 / 365 * 10) / 10,
      unit: 'years gained',
      color: '#f87171',
      note: 'That\'s ' + Math.round(yearsLeft * 365 * 1) + ' hours of real life back.'
    },
    {
      icon: '😴',
      habit: 'Sleep 8hrs instead of 6',
      gain: Math.round(yearsLeft * 365 * 2 / 24 / 365 * 10) / 10,
      unit: 'years of better health',
      color: '#818cf8',
      note: 'Sleep debt compounds. Every night matters.'
    },
    {
      icon: '🚶',
      habit: 'Walk 30 min/day',
      gain: Math.round(yearsLeft * 0.035 * 10) / 10,
      unit: 'extra years (avg)',
      color: '#34d399',
      note: 'Studies show 30min daily walking adds ~3.5 years to lifespan.'
    },
    {
      icon: '🚬',
      habit: 'Quit smoking (if applicable)',
      gain: 10,
      unit: 'years gained on average',
      color: '#fbbf24',
      note: 'The single highest-return health decision a person can make.'
    },
    {
      icon: '🧠',
      habit: 'Read 20 min/day instead of scrolling',
      gain: Math.round(yearsLeft * 365 * 20 / 60 / 24 / 365 * 10) / 10,
      unit: 'years of compounding knowledge',
      color: '#60a5fa',
      note: 'Same time. Completely different outcome.'
    },
    {
      icon: '🫂',
      habit: 'Invest in 1 deep relationship',
      gain: 7,
      unit: 'years longer (avg, research-backed)',
      color: '#f97316',
      note: 'Loneliness is as deadly as smoking 15 cigarettes a day.'
    }
  ];

  grid.innerHTML = actions.map(function(a) {
    return '<div class="improve-card">' +
      '<div class="ic-top">' +
        '<span class="ic-icon">' + a.icon + '</span>' +
        '<div class="ic-habit">' + a.habit + '</div>' +
      '</div>' +
      '<div class="ic-gain" style="color:' + a.color + '">+' + a.gain + ' <span class="ic-unit">' + a.unit + '</span></div>' +
      '<div class="ic-note">' + a.note + '</div>' +
      '</div>';
  }).join('');

  section.classList.remove('hidden');
}

// ─── Hook into render ─────────────────────────────────────────
// Patch the existing calc-single click to also render new sections
var _origCalcSingleForCosmic = document.getElementById('calc-single').onclick;
document.getElementById('calc-single').addEventListener('click', function() {
  // Wait for _shareData to be set by the main handler (runs first)
  setTimeout(function() {
    if (!window._shareData) return;
    var birth = window._shareData.birth;
    renderCosmicSection(birth);
    renderDailyInsight(birth);
    renderImproveSection(birth);
  }, 50);
});
