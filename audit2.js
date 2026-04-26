const fs = require("fs");
const h = fs.readFileSync("index.html","utf8");
const js = fs.readFileSync("app.js","utf8");
const css = fs.readFileSync("style.css","utf8");
const sw = fs.readFileSync("sw.js","utf8");

try { new Function(js); console.log("JS syntax: OK"); } catch(e) { console.log("JS ERR:", e.message); }
console.log("HTML:", h.length, "bytes,", h.split("\n").length, "lines");
console.log("CSS:", css.length, "bytes,", css.split("\n").length, "lines");
console.log("JS:", js.length, "bytes,", js.split("\n").length, "lines");

// Count actual <a> tags linking to twitter/linkedin (not meta tags or aria-labels)
const twitterLinks = (h.match(/href="https?:\/\/(www\.)?twitter\.com/gi)||[]).length;
const linkedinLinks = (h.match(/href="https?:\/\/(www\.)?linkedin\.com/gi)||[]).length;
console.log("Twitter links:", twitterLinks, "(expected 0)");
console.log("LinkedIn links:", linkedinLinks, "(expected 1)");

// Check twitter:card meta tag is present (good SEO)
const twitterCard = h.includes('name="twitter:card"');
console.log("Twitter card meta:", twitterCard ? "OK" : "MISSING");

// Check Arabic verse is real Quran (not placeholder)
const arabicOk = h.includes('\u0648\u064e\u0645\u064e\u0627 \u062a\u064e\u062f\u0652\u0631\u0650\u064a');
console.log("Arabic verse:", arabicOk ? "OK (Quran 31:34)" : "CHECK NEEDED");

// Check all required IDs exist in HTML
const requiredIds = ["hero-dob","hero-name","hero-error","btn-calculate","results-section",
  "g-days","g-hours","g-sleep","g-hearts","g-sunsets","g-seconds",
  "ih-hijri-year","ih-hijri-month","ih-day","ih-ramadans","ih-hajj","ih-islamic-years","ih-next-ramadan",
  "w-pm","w-president","w-currency","w-population","w-event","w-tech",
  "journey-pct","journey-pct2","ring-fill","story-body","truth-grid","truth-intro","truth-verdict",
  "insight-card","salah-bar-fill","salah-done","salah-streak","dhikr-done","dhikr-msg","week-grid",
  "share-modal","story-modal","loading-overlay","btn-start-again","pwa-prompt"];
let missingIds = requiredIds.filter(id => !h.includes('id="'+id+'"'));
console.log("Required IDs:", missingIds.length === 0 ? "ALL OK ("+requiredIds.length+" checked)" : "MISSING: "+missingIds.join(", "));

// Check all required functions exist in JS
const fns = ["renderAll","renderLifeStory","renderTimeTruth","renderInsight","initTracker",
  "revealStep","showCelebration","openStoryModal","showLoading","animateRing",
  "animateCounter","renderWeekGrid","getStreakCount","updateSalahUI","loadTrackerData",
  "saveTrackerData","getTodayKey","getWorldData","toHijri","getNextRamadan","getNextJumua"];
let missingFns = fns.filter(fn => js.indexOf("function "+fn) === -1);
console.log("JS functions:", missingFns.length === 0 ? "ALL OK ("+fns.length+" checked)" : "MISSING: "+missingFns.join(", "));

// Check no var declarations remain in app.js
const varCount = (js.match(/^\s*var /gm)||[]).length;
console.log("Remaining var declarations:", varCount === 0 ? "NONE (all converted)" : varCount+" found!");

// Check SW cache version
const swCache = sw.match(/CACHE = '([^']+)'/);
console.log("SW cache version:", swCache ? swCache[1] : "NOT FOUND");

// Check manifest has required fields
const manifest = JSON.parse(fs.readFileSync("manifest.json","utf8"));
const mFields = ["name","short_name","start_url","display","icons"];
let missingM = mFields.filter(f => !manifest[f]);
console.log("Manifest fields:", missingM.length === 0 ? "ALL OK" : "MISSING: "+missingM.join(", "));

// Check CSS has media queries
const mq = (css.match(/@media/g)||[]).length;
console.log("CSS media queries:", mq, "(expected 4+)");

// Check no broken CSS (unclosed braces)
const openBraces = (css.match(/\{/g)||[]).length;
const closeBraces = (css.match(/\}/g)||[]).length;
console.log("CSS brace balance:", openBraces === closeBraces ? "OK ("+openBraces+" pairs)" : "MISMATCH! open="+openBraces+" close="+closeBraces);

console.log("\n--- DEPLOY READY:", missingIds.length===0 && missingFns.length===0 && varCount===0 && openBraces===closeBraces ? "YES ✓" : "NO — fix issues above");
