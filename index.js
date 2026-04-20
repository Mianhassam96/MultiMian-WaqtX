'use strict';

var AVG_LIFESPAN_YEARS = 72;

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

// ─── Life in Numbers ─────────────────────────────────────────
function lifeNumbersHTML(totalDays) {
  var items = [
    { icon: '❤️', label: 'Heartbeats',      val: Math.floor(totalDays * 24 * 60 * 70),  max: AVG_LIFESPAN_YEARS * 365 * 24 * 60 * 70, color: '#f87171' },
    { icon: '😴', label: 'Hours Slept',     val: Math.floor(totalDays * 8),              max: AVG_LIFESPAN_YEARS * 365 * 8,            color: '#818cf8' },
    { icon: '🍽️', label: 'Meals Eaten',     val: Math.floor(totalDays * 3),              max: AVG_LIFESPAN_YEARS * 365 * 3,            color: '#34d399' },
    { icon: '🚶', label: 'Steps Taken',     val: Math.floor(totalDays * 8000),           max: AVG_LIFESPAN_YEARS * 365 * 8000,         color: '#fbbf24' },
    { icon: '🌅', label: 'Sunrises Seen',   val: totalDays,                              max: AVG_LIFESPAN_YEARS * 365,                color: '#f97316' },
    { icon: '💧', label: 'Glasses of Water',val: Math.floor(totalDays * 8),              max: AVG_LIFESPAN_YEARS * 365 * 8,            color: '#38bdf8' }
  ];
  return items.map(function(item, i) {
    var pct = Math.min(100, (item.val / item.max) * 100).toFixed(1);
    var display = item.val >= 1e9
      ? (item.val / 1e9).toFixed(2) + 'B'
      : item.val >= 1e6
        ? (item.val / 1e6).toFixed(1) + 'M'
        : Number(item.val).toLocaleString();
    return '<div class="life-bar-item" style="animation-delay:' + (i * 80) + 'ms">' +
      '<div class="lb-header"><span class="lb-icon">' + item.icon + '</span>' +
      '<span class="lb-label">' + item.label + '</span>' +
      '<span class="lb-val">' + display + '</span></div>' +
      '<div class="lb-track"><div class="lb-fill" style="background:' + item.color +
      '" data-pct="' + pct + '"></div></div></div>';
  }).join('');
}

function animateBars() {
  document.querySelectorAll('.lb-fill').forEach(function(el, i) {
    var target = el.getAttribute('data-pct');
    el.style.width = '0%';
    setTimeout(function() { el.style.width = target + '%'; }, 100 + i * 80);
  });
}

// ─── Smart Insights ───────────────────────────────────────────
function getInsights(b, t) {
  var age = b.yy;
  var insights = [];

  // Phase insight
  if (age < 13)       insights.push({ icon: '🌱', title: 'Childhood',         text: 'Every day is a new discovery. The world is your playground.' });
  else if (age < 20)  insights.push({ icon: '⚡', title: 'Teen Years',         text: 'You\'re building the foundation of who you\'ll become. Make it count.' });
  else if (age < 25)  insights.push({ icon: '🚀', title: 'Growth Phase',       text: 'You\'re in your growth phase — the best time to take bold risks.' });
  else if (age < 35)  insights.push({ icon: '💼', title: 'Peak Productivity',  text: 'Peak productivity years. Your energy and ambition are at their highest.' });
  else if (age < 50)  insights.push({ icon: '🧠', title: 'Wisdom Phase',       text: 'Experience meets energy. You know what matters — and what doesn\'t.' });
  else if (age < 65)  insights.push({ icon: '🌟', title: 'Legacy Phase',       text: 'You\'re building your legacy. The impact you make now echoes forward.' });
  else                insights.push({ icon: '👑', title: 'Golden Years',        text: 'A life richly lived. Your wisdom is your greatest gift to the world.' });

  // Sleep insight
  var sleepYears = Math.round(t.day * 8 / 365);
  insights.push({ icon: '😴', title: 'Sleep Stats', text: 'You\'ve spent roughly ' + sleepYears + ' years sleeping — your body\'s secret superpower.' });

  // Days milestone
  if (t.day >= 10000) insights.push({ icon: '🏆', title: '10,000 Days Club!', text: 'You\'ve crossed 10,000 days alive. That\'s a rare milestone — celebrate it!' });
  else {
    var toMilestone = 10000 - t.day;
    if (toMilestone > 0 && toMilestone < 500) {
      insights.push({ icon: '⏳', title: '10,000 Days Soon!', text: 'Only ' + toMilestone + ' days until your 10,000-day milestone. Mark your calendar!' });
    }
  }

  // Billion seconds
  if (t.sec >= 1e9) insights.push({ icon: '🎯', title: 'Billion Seconds Club!', text: 'You\'ve lived over 1 billion seconds. Less than 5% of people ever reach this.' });
  else {
    var toB = 1e9 - t.sec;
    if (toB > 0 && toB < 3e7) {
      var daysToB = Math.ceil(toB / 86400);
      insights.push({ icon: '🎯', title: '1 Billion Seconds Soon!', text: 'Only ~' + daysToB + ' days until you hit 1 billion seconds alive. Incredible!' });
    }
  }

  // Weekend insight
  var weekends = Math.floor(t.wk);
  insights.push({ icon: '🎉', title: 'Weekends Lived', text: 'You\'ve enjoyed ~' + weekends.toLocaleString() + ' weekends. Hope most of them were great ones.' });

  return insights;
}

function insightsHTML(insights) {
  return insights.map(function(ins, i) {
    return '<div class="insight-card" style="animation-delay:' + (i * 60) + 'ms">' +
      '<div class="ins-icon">' + ins.icon + '</div>' +
      '<div class="ins-body"><div class="ins-title">' + ins.title + '</div>' +
      '<div class="ins-text">' + ins.text + '</div></div></div>';
  }).join('');
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

  initDailyHook(name.trim(), birth);

  function render() {
    var b = getBreakdown(birth);
    var t = getTotals(birth);

    document.getElementById('sr-title').textContent = name.trim() + "'s Age";
    document.getElementById('sr-banner').textContent =
      'Age: ' + b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';

    updateRing(b.yy + b.mo / 12);

    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'], [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],   [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],[t.sec, 'Total Seconds']
    ]);

    document.getElementById('life-bars').innerHTML = lifeNumbersHTML(t.day);
    document.getElementById('insights-grid').innerHTML = insightsHTML(getInsights(b, t));

    document.getElementById('sr-pills').innerHTML =
      '<div class="pill">📅 Born on ' + bornDay(birth) + '</div>' +
      '<div class="pill" id="s-bday">' + nextBirthday(birth) + '</div>';
  }

  render();
  card.classList.remove('hidden');
  animateBars();

  // count-up on stat boxes (first render only)
  setTimeout(function() {
    document.querySelectorAll('#sr-stats .stat-val').forEach(function(el) {
      var raw = parseInt(el.textContent.replace(/,/g, ''), 10);
      if (!isNaN(raw)) countUp(el, raw, 800);
    });
  }, 50);

  clearInterval(window._sTimer);
  window._sTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._sTimer); return; }
    var b = getBreakdown(birth);
    var t = getTotals(birth);
    document.getElementById('sr-banner').textContent =
      'Age: ' + b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';
    updateRing(b.yy + b.mo / 12);
    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'], [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],   [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],[t.sec, 'Total Seconds']
    ]);
    var bdayEl = document.getElementById('s-bday');
    if (bdayEl) bdayEl.textContent = nextBirthday(birth);
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

    document.getElementById('cr-winner').textContent = olderName
      ? olderName + ' is older than ' + youngerName
      : n1.trim() + ' and ' + n2.trim() + ' are the same age!';

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
    document.querySelectorAll('.sc-style-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    _shareStyle = btn.getAttribute('data-style');
    renderShareCard();
  });
});

function renderShareCard() {
  var data = window._shareData;
  if (!data) return;
  var b = getBreakdown(data.birth);
  var t = getTotals(data.birth);
  var pct = Math.min(100, ((b.yy + b.mo / 12) / AVG_LIFESPAN_YEARS) * 100);

  // mini ring
  var circ = 2 * Math.PI * 48;
  var scFill = document.getElementById('sc-ring-fill');
  var scPct  = document.getElementById('sc-ring-pct');
  if (scFill) {
    scFill.style.strokeDashoffset = circ - (pct / 100) * circ;
    scPct.textContent = Math.round(pct) + '%';
  }

  var card = document.getElementById('share-card');
  var headline = document.getElementById('sc-headline');
  var nameEl   = document.getElementById('sc-name');
  var ageEl    = document.getElementById('sc-age');
  var statsEl  = document.getElementById('sc-stats');

  nameEl.textContent = data.name;

  if (_shareStyle === 'classic') {
    card.className = 'share-card sc-classic';
    headline.textContent = "I've lived " + t.day.toLocaleString() + " days 🚀";
    ageEl.textContent = b.yy + ' years · ' + b.mo + ' months · ' + b.dd + ' days';
    statsEl.innerHTML = '❤️ ~' + (Math.floor(t.day * 24 * 60 * 70 / 1e9)).toFixed(1) + 'B heartbeats' +
      '  ·  😴 ~' + Math.floor(t.day * 8 / 365) + ' years sleeping' +
      '  ·  ' + nextBirthday(data.birth);
    document.getElementById('sc-ring-wrap').style.display = 'flex';

  } else if (_shareStyle === 'funny') {
    card.className = 'share-card sc-funny';
    headline.textContent = "I've eaten ~" + Math.floor(t.day * 3).toLocaleString() + " meals 🍕";
    ageEl.textContent = 'That\'s ' + b.yy + ' years of delicious life';
    statsEl.innerHTML = '🚶 ~' + (Math.floor(t.day * 8000 / 1e6)).toFixed(0) + 'M steps taken' +
      '  ·  ☕ ~' + Math.floor(t.day * 1.5).toLocaleString() + ' coffees' +
      '  ·  💧 ~' + Math.floor(t.day * 8).toLocaleString() + ' glasses of water';
    document.getElementById('sc-ring-wrap').style.display = 'none';

  } else {
    card.className = 'share-card sc-minimal';
    headline.textContent = data.name + ' · ' + b.yy + ' years old';
    ageEl.textContent = t.day.toLocaleString() + ' days · ' + t.wk.toLocaleString() + ' weeks · ' + t.mon.toLocaleString() + ' months';
    statsEl.innerHTML = Math.round(pct) + '% of an average life lived';
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
    alert('Download library not loaded. Please check your connection.');
    return;
  }
  html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true }).then(function(canvas) {
    var link = document.createElement('a');
    link.download = 'agewise-' + _shareStyle + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
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

  grid.appendChild(fragment);
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
// (injected after render, only once)
var _calBtnAdded = false;
function addCalendarButton(birth) {
  if (_calBtnAdded) return;
  _calBtnAdded = true;
  var shareBtn = document.getElementById('btn-share-single');
  var calBtn   = document.createElement('button');
  calBtn.className = 'btn-calendar';
  calBtn.id = 'btn-calendar';
  calBtn.textContent = '🗓️ View My Life Calendar';
  shareBtn.parentNode.insertBefore(calBtn, shareBtn);
  calBtn.addEventListener('click', function() {
    buildLifeCalendar(birth, window._shareData ? window._shareData.name : '');
  });
}

// patch into single calc render — wrap original
var _origCalcClick = document.getElementById('calc-single').onclick;
document.getElementById('calc-single').addEventListener('click', function() {
  _calBtnAdded = false; // reset so button re-adds on new calc
});

// ─── PWA Install Banner ───────────────────────────────────────
var _deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  _deferredPrompt = e;
  var banner = document.getElementById('pwa-banner');
  if (banner && !localStorage.getItem('aw_pwa_dismissed')) {
    setTimeout(function() { banner.classList.remove('hidden'); }, 3000);
  }
});

document.getElementById('pwa-install').addEventListener('click', function() {
  if (!_deferredPrompt) return;
  _deferredPrompt.prompt();
  _deferredPrompt.userChoice.then(function() {
    _deferredPrompt = null;
    document.getElementById('pwa-banner').classList.add('hidden');
  });
});

document.getElementById('pwa-dismiss').addEventListener('click', function() {
  document.getElementById('pwa-banner').classList.add('hidden');
  localStorage.setItem('aw_pwa_dismissed', '1');
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
  document.getElementById('return-trigger').classList.add('hidden');
});

// patch showReturnTrigger into daily hook init
var _origInitDailyHook = initDailyHook;
initDailyHook = function(name, birth) {
  _origInitDailyHook(name, birth);
  showReturnTrigger(birth);
  addCalendarButton(birth);
};
