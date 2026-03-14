'use strict';

// ─── Tab switching ────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(s) { s.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ─── Parse DOB string as LOCAL date (avoids UTC timezone shift) ───
function parseDOB(str) {
  var parts = str.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

// ─── Validate inputs ──────────────────────────────────────────
function validate(name, dob) {
  if (!name.trim()) return 'Please enter a name.';
  if (!dob) return 'Please select a date of birth.';
  if (parseDOB(dob) > new Date()) return 'Date of birth cannot be in the future.';
  return '';
}

// ─── Age breakdown from birth date to now ────────────────────
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

// ─── Totals since birth ───────────────────────────────────────
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

// ─── Exact diff between two Date objects (d1 <= d2) ──────────
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

// ─── Born day name ────────────────────────────────────────────
function bornDay(birth) {
  return birth.toLocaleDateString('en-US', { weekday: 'long' });
}

// ─── Next birthday countdown string ──────────────────────────
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

// ─── Build stat boxes HTML ────────────────────────────────────
function statsHTML(rows) {
  return rows.map(function(row) {
    return '<div class="stat-box"><div class="stat-val">' +
      Number(row[0]).toLocaleString() +
      '</div><div class="stat-lbl">' + row[1] + '</div></div>';
  }).join('');
}

// ─── Show / hide inline error ─────────────────────────────────
function showError(id, msg) {
  var el = document.getElementById(id);
  if (msg) {
    el.textContent = msg;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

// ─── Single Age ───────────────────────────────────────────────
document.getElementById('calc-single').addEventListener('click', function() {
  var name = document.getElementById('s-name').value;
  var dob  = document.getElementById('s-dob').value;
  var err  = validate(name, dob);
  showError('s-error', err);
  if (err) return;

  var birth = parseDOB(dob);
  var card  = document.getElementById('single-result');

  function render() {
    var b = getBreakdown(birth);
    var t = getTotals(birth);

    document.getElementById('sr-title').textContent = name.trim() + "'s Age";

    document.getElementById('sr-banner').textContent =
      'Age: ' + b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';

    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'],
      [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],
      [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],
      [t.sec, 'Total Seconds']
    ]);

    document.getElementById('sr-pills').innerHTML =
      '<div class="pill">📅 Born on ' + bornDay(birth) + '</div>' +
      '<div class="pill" id="s-bday">' + nextBirthday(birth) + '</div>';
  }

  render();
  card.classList.remove('hidden');

  clearInterval(window._sTimer);
  window._sTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._sTimer); return; }
    var b = getBreakdown(birth);
    var t = getTotals(birth);

    document.getElementById('sr-banner').textContent =
      'Age: ' + b.yy + ' Years  ' + b.mo + ' Months  ' + b.dd + ' Days  ' +
      b.hh + ' Hours  ' + b.mi + ' Minutes  ' + b.ss + ' Seconds';

    document.getElementById('sr-stats').innerHTML = statsHTML([
      [t.mon, 'Total Months'],
      [t.wk,  'Total Weeks'],
      [t.day, 'Total Days'],
      [t.hr,  'Total Hours'],
      [t.min, 'Total Minutes'],
      [t.sec, 'Total Seconds']
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

  var e1 = validate(n1, d1);
  var e2 = validate(n2, d2);
  var errMsg = (e1 ? 'Person 1: ' + e1 : '') + (e1 && e2 ? '  |  ' : '') + (e2 ? 'Person 2: ' + e2 : '');
  showError('c-error', errMsg);
  if (e1 || e2) return;

  var birth1 = parseDOB(d1);
  var birth2 = parseDOB(d2);
  var card   = document.getElementById('compare-result');

  function render() {
    var b1 = getBreakdown(birth1);
    var b2 = getBreakdown(birth2);

    // Who is older (born earlier = older)
    var olderName   = birth1 < birth2 ? n1.trim() : birth2 < birth1 ? n2.trim() : null;
    var youngerName = olderName === n1.trim() ? n2.trim() : n1.trim();

    document.getElementById('cr-winner').textContent = olderName
      ? olderName + ' is older than ' + youngerName
      : n1.trim() + ' and ' + n2.trim() + ' are the same age!';

    // Diff between the two birth dates
    var earlier = birth1 <= birth2 ? birth1 : birth2;
    var later   = birth1 <= birth2 ? birth2 : birth1;
    var df      = dateDiff(earlier, later);

    var diffMs  = Math.abs(birth1 - birth2);
    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHr  = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHr  / 24);

    document.getElementById('cr-diff').textContent =
      'Age Difference: ' + df.yy + ' Years  ' + df.mo + ' Months  ' + df.dd + ' Days  ' +
      df.hh + ' Hours  ' + df.mi + ' Minutes  ' + df.ss + ' Seconds';

    document.getElementById('cr-stats').innerHTML = statsHTML([
      [diffDay, 'Days Difference'],
      [diffHr,  'Hours Difference'],
      [diffMin, 'Minutes Difference'],
      [diffSec, 'Seconds Difference']
    ]);

    document.getElementById('cr-cards').innerHTML =
      miniCard(n1.trim(), birth1, b1) + miniCard(n2.trim(), birth2, b2);
  }

  render();
  card.classList.remove('hidden');

  clearInterval(window._cTimer);
  window._cTimer = setInterval(function() {
    if (card.classList.contains('hidden')) { clearInterval(window._cTimer); return; }
    render();
  }, 1000);
});

// ─── Person mini card HTML ────────────────────────────────────
function miniCard(name, birth, b) {
  var t = getTotals(birth);
  return '<div class="person-mini">' +
    '<h3>' + name + '</h3>' +
    '<p>' +
      'Age: ' + b.yy + 'y ' + b.mo + 'm ' + b.dd + 'd<br>' +
      'Born: ' + bornDay(birth) + '<br>' +
      nextBirthday(birth) + '<br>' +
      'Total Days: ' + t.day.toLocaleString() +
    '</p>' +
    '</div>';
}
