'use strict';
var AVG_LIFESPAN_YEARS = 75;
var _birth = null;

// ── Helpers ──────────────────────────────────────────────────
function parseDOB(str){var p=str.split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function getBreakdown(birth){
  var n=new Date();
  var yy=n.getFullYear()-birth.getFullYear(),mo=n.getMonth()-birth.getMonth(),dd=n.getDate()-birth.getDate();
  var hh=n.getHours()-birth.getHours(),mi=n.getMinutes()-birth.getMinutes(),ss=n.getSeconds()-birth.getSeconds();
  if(ss<0){ss+=60;mi--;}if(mi<0){mi+=60;hh--;}if(hh<0){hh+=24;dd--;}
  if(dd<0){dd+=new Date(n.getFullYear(),n.getMonth(),0).getDate();mo--;}
  if(mo<0){mo+=12;yy--;}
  return{yy:yy,mo:mo,dd:dd,hh:hh,mi:mi,ss:ss};
}
function getTotals(birth){
  var ms=new Date()-birth,sec=Math.floor(ms/1000),min=Math.floor(sec/60),hr=Math.floor(min/60);
  var day=Math.floor(hr/24),wk=Math.floor(day/7),mon=Math.floor(day/30.4375);
  return{sec:sec,min:min,hr:hr,day:day,wk:wk,mon:mon};
}
function fmt(n){return Number(n).toLocaleString();}
function fmtShort(n){
  if(n>=1e9)return(n/1e9).toFixed(1)+'B';
  if(n>=1e6)return(n/1e6).toFixed(1)+'M';
  if(n>=1e3)return(n/1e3).toFixed(1)+'K';
  return fmt(n);
}
function bornDay(birth){return birth.toLocaleDateString('en-US',{weekday:'long'});}
function el(id){return document.getElementById(id);}
function setText(id,v){var e=el(id);if(e)e.textContent=v;}

// ── Zodiac ────────────────────────────────────────────────────
function getZodiac(m,d){
  var signs=[
    [1,1,19,'Capricorn'],[1,20,31,'Aquarius'],
    [2,1,18,'Pisces'],[2,19,29,'Pisces'],
    [3,1,20,'Pisces'],[3,21,31,'Aries'],
    [4,1,19,'Aries'],[4,20,30,'Taurus'],
    [5,1,20,'Taurus'],[5,21,31,'Gemini'],
    [6,1,20,'Gemini'],[6,21,30,'Cancer'],
    [7,1,22,'Cancer'],[7,23,31,'Leo'],
    [8,1,22,'Leo'],[8,23,31,'Virgo'],
    [9,1,22,'Virgo'],[9,23,30,'Libra'],
    [10,1,22,'Libra'],[10,23,31,'Scorpio'],
    [11,1,21,'Scorpio'],[11,22,30,'Sagittarius'],
    [12,1,21,'Sagittarius'],[12,22,31,'Capricorn']
  ];
  var emojis={Capricorn:'\u2651',Aquarius:'\u2652',Pisces:'\u2653',Aries:'\u2648',Taurus:'\u2649',Gemini:'\u264A',Cancer:'\u264B',Leo:'\u264C',Virgo:'\u264D',Libra:'\u264E',Scorpio:'\u264F',Sagittarius:'\u2650'};
  for(var i=0;i<signs.length;i++){
    if(m===signs[i][0]&&d>=signs[i][1]&&d<=signs[i][2]){
      return signs[i][3]+' '+emojis[signs[i][3]];
    }
  }
  return 'Capricorn \u2651';
}
function getChineseZodiac(year){
  var animals=['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
  var emojis=['\uD83D\uDC00','\uD83D\uDC02','\uD83D\uDC05','\uD83D\uDC07','\uD83D\uDC09','\uD83D\uDC0D','\uD83D\uDC0E','\uD83D\uDC10','\uD83D\uDC12','\uD83D\uDC13','\uD83D\uDC15','\uD83D\uDC16'];
  var idx=((year-1900)%12+12)%12;
  return animals[idx]+' '+emojis[idx];
}
function getBirthStone(m){
  var s=['Garnet','Amethyst','Aquamarine','Diamond','Emerald','Pearl','Ruby','Peridot','Sapphire','Opal','Topaz','Turquoise'];
  return s[m-1];
}
function getBirthFlower(m){
  var f=['Carnation','Violet','Daffodil','Daisy','Lily of the Valley','Rose','Larkspur','Gladiolus','Aster','Marigold','Chrysanthemum','Narcissus'];
  return f[m-1];
}

// ── Cinematic: Word-by-word Ayah reveal ──────────────────────
function initAyahReveal(){
  var ayah=document.querySelector('.hero-ayah');
  if(!ayah)return;
  var text=ayah.textContent.trim();
  var words=text.split(' ');
  ayah.innerHTML=words.map(function(w,i){
    return '<span class="ayah-word" style="animation-delay:'+(0.3+i*0.28)+'s">'+w+'</span>';
  }).join(' ');
}

// ── Cinematic: Screen fade on CTA click ──────────────────────
function initScreenFade(){
  var fade=document.createElement('div');
  fade.className='screen-fade';
  fade.id='screen-fade';
  document.body.appendChild(fade);
}

function triggerScreenFade(cb){
  var fade=el('screen-fade');
  if(!fade){cb();return;}
  fade.classList.add('active');
  setTimeout(function(){
    cb();
    setTimeout(function(){fade.classList.remove('active');},400);
  },600);
}

// ── Cinematic: Number counter ─────────────────────────────────
function animateCounter(el,target,duration){
  if(!el)return;
  var start=0,step=Math.ceil(target/60),current=0;
  var interval=Math.floor(duration/60);
  var timer=setInterval(function(){
    current=Math.min(current+step,target);
    el.textContent=Number(current).toLocaleString();
    if(current>=target)clearInterval(timer);
  },interval);
}

// ── Cinematic: Ibadah cards stagger ──────────────────────────
function initIbadahStagger(){
  var cards=document.querySelectorAll('.ibadah-card');
  if(!cards.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var idx=Array.prototype.indexOf.call(cards,entry.target);
        setTimeout(function(){entry.target.classList.add('card-visible');},idx*100);
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.1});
  cards.forEach(function(c){obs.observe(c);});
}

// ── Cinematic: Passing lines stagger ─────────────────────────
function initPassingLines(){
  var lines=document.querySelectorAll('.passing-line');
  if(!lines.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var idx=Array.prototype.indexOf.call(lines,entry.target);
        setTimeout(function(){entry.target.classList.add('line-visible');},idx*300);
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.2});
  lines.forEach(function(l){obs.observe(l);});
}

// ── Cinematic: Final section observer ────────────────────────
function initFinalObserver(){
  var sec=document.querySelector('.final-section');
  if(!sec)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){sec.classList.add('final-active');obs.unobserve(sec);}
    });
  },{threshold:0.3});
  obs.observe(sec);
}
  var container=el('hero-particles');
  if(!container)return;
  container.innerHTML='';
  var colors=['rgba(22,163,74,0.5)','rgba(250,204,21,0.3)','rgba(34,197,94,0.35)','rgba(20,83,45,0.4)'];
  for(var i=0;i<28;i++){
    var p=document.createElement('div');
    p.className='particle';
    var size=Math.random()*4+2;
    var left=Math.random()*100;
    var delay=Math.random()*8;
    var dur=Math.random()*10+8;
    var color=colors[Math.floor(Math.random()*colors.length)];
    p.style.cssText='width:'+size+'px;height:'+size+'px;left:'+left+'%;bottom:-10px;background:'+color+';animation-duration:'+dur+'s;animation-delay:'+delay+'s;';
    container.appendChild(p);
  }
}

// ── Time Twins ────────────────────────────────────────────────
var TIME_TWINS=[
  {month:1,day:3,name:'J.R.R. Tolkien',icon:'\uD83D\uDCD6',role:'Author, Lord of the Rings',born:'Born on 3 Jan 1892',trait:'You build entire worlds in your mind.'},
  {month:1,day:8,name:'Stephen Hawking',icon:'\uD83C\uDF0C',role:'Physicist',born:'Born on 8 Jan 1942',trait:'You think beyond what others can see.'},
  {month:1,day:14,name:'LL Cool J',icon:'\uD83C\uDFB5',role:'Rapper & Actor',born:'Born on 14 Jan 1968',trait:'You reinvent yourself and keep going.'},
  {month:1,day:17,name:'Muhammad Ali',icon:'\uD83E\uDD4A',role:'Boxing Legend',born:'Born on 17 Jan 1942',trait:'You hustle harder than anyone in the room.'},
  {month:1,day:25,name:'Alicia Keys',icon:'\uD83C\uDFB9',role:'Singer & Songwriter',born:'Born on 25 Jan 1981',trait:'You express what others can\'t put into words.'},
  {month:2,day:6,name:'Bob Marley',icon:'\uD83C\uDFB5',role:'Reggae Legend',born:'Born on 6 Feb 1945',trait:'You spread peace wherever you go.'},
  {month:2,day:11,name:'Thomas Edison',icon:'\uD83D\uDCA1',role:'Inventor',born:'Born on 11 Feb 1847',trait:'You turn failure into fuel.'},
  {month:2,day:23,name:'Steve Jobs',icon:'\uD83D\uDCBB',role:'Apple Co-founder',born:'Born on 24 Feb 1955',trait:'You think differently and change the game.'},
  {month:3,day:14,name:'Albert Einstein',icon:'\uD83E\uDDE0',role:'Physicist',born:'Born on 14 Mar 1879',trait:'You see patterns no one else notices.'},
  {month:3,day:26,name:'Diana Ross',icon:'\uD83C\uDFA4',role:'Singer & Icon',born:'Born on 26 Mar 1944',trait:'You command every room you walk into.'},
  {month:4,day:15,name:'Leonardo da Vinci',icon:'\uD83C\uDFA8',role:'Renaissance Genius',born:'Born on 15 Apr 1452',trait:'You create things that outlast generations.'},
  {month:4,day:23,name:'William Shakespeare',icon:'\uD83C\uDFAD',role:'Playwright',born:'Born on 23 Apr 1564',trait:'You tell stories that move people deeply.'},
  {month:5,day:5,name:'Karl Marx',icon:'\uD83D\uDCDC',role:'Philosopher',born:'Born on 5 May 1818',trait:'You question systems others take for granted.'},
  {month:5,day:21,name:'Mr. T',icon:'\uD83D\uDCAA',role:'Actor & Icon',born:'Born on 21 May 1952',trait:'You have a presence that can\'t be ignored.'},
  {month:6,day:1,name:'Marilyn Monroe',icon:'\uD83D\uDCAB',role:'Actress & Icon',born:'Born on 1 Jun 1926',trait:'You leave an impression that lasts forever.'},
  {month:6,day:12,name:'Anne Frank',icon:'\uD83D\uDCD3',role:'Diarist',born:'Born on 12 Jun 1929',trait:'Your words carry more weight than you know.'},
  {month:6,day:24,name:'Lionel Messi',icon:'\u26BD',role:'Football Legend',born:'Born on 24 Jun 1987',trait:'You make the impossible look effortless.'},
  {month:7,day:18,name:'Nelson Mandela',icon:'\u270A',role:'President & Activist',born:'Born on 18 Jul 1918',trait:'You stand firm when others give up.'},
  {month:7,day:23,name:'Daniel Radcliffe',icon:'\u2728',role:'Actor',born:'Born on 23 Jul 1989',trait:'You grow beyond the role the world gave you.'},
  {month:8,day:4,name:'Barack Obama',icon:'\uD83C\uDF0D',role:'44th US President',born:'Born on 4 Aug 1961',trait:'You inspire people to believe in something bigger.'},
  {month:8,day:15,name:'Napoleon Bonaparte',icon:'\u2694\uFE0F',role:'French Emperor',born:'Born on 15 Aug 1769',trait:'You lead with total conviction.'},
  {month:9,day:5,name:'Freddie Mercury',icon:'\uD83C\uDFA4',role:'Queen Frontman',born:'Born on 5 Sep 1946',trait:'You perform life at full volume.'},
  {month:9,day:15,name:'Agatha Christie',icon:'\uD83D\uDD0D',role:'Mystery Writer',born:'Born on 15 Sep 1890',trait:'You see what others overlook.'},
  {month:10,day:2,name:'Mahatma Gandhi',icon:'\uD83D\uDD4A\uFE0F',role:'Independence Leader',born:'Born on 2 Oct 1869',trait:'You change the world without raising your voice.'},
  {month:10,day:9,name:'John Lennon',icon:'\uD83C\uDFB5',role:'Beatle & Activist',born:'Born on 9 Oct 1940',trait:'You imagine a better world and make people believe it.'},
  {month:10,day:24,name:'Drake',icon:'\uD83C\uDFA7',role:'Rapper & Artist',born:'Born on 24 Oct 1986',trait:'You express your feelings with zero apology.'},
  {month:11,day:9,name:'Carl Sagan',icon:'\uD83C\uDF0C',role:'Astronomer',born:'Born on 9 Nov 1934',trait:'You make the universe feel personal.'},
  {month:11,day:30,name:'Mark Twain',icon:'\u270D\uFE0F',role:'American Author',born:'Born on 30 Nov 1835',trait:'You say the truth with a smile.'},
  {month:12,day:5,name:'Walt Disney',icon:'\u2728',role:'Animation Pioneer',born:'Born on 5 Dec 1901',trait:'You turn dreams into things people can touch.'},
  {month:12,day:16,name:'Ludwig van Beethoven',icon:'\uD83C\uDFB9',role:'Classical Composer',born:'Born on 16 Dec 1770',trait:'You create beauty even through struggle.'},
  {month:12,day:25,name:'Isaac Newton',icon:'\uD83C\uDF4E',role:'Physicist & Mathematician',born:'Born on 25 Dec 1642',trait:'You find the laws hidden inside chaos.'}
];
function getTimeTwins(birth){
  var m=birth.getMonth()+1,d=birth.getDate();
  // exact date matches first
  var exact=TIME_TWINS.filter(function(t){return t.month===m&&t.day===d;});
  if(exact.length>=2)return exact.slice(0,3);
  // same month, sorted by proximity
  var sameMonth=TIME_TWINS.filter(function(t){return t.month===m;}).sort(function(a,b){return Math.abs(a.day-d)-Math.abs(b.day-d);});
  var combined=exact.concat(sameMonth.filter(function(t){return t.day!==d;}));
  if(combined.length>=2)return combined.slice(0,3);
  // fallback: any 3
  return TIME_TWINS.sort(function(a,b){return Math.abs((a.month*31+a.day)-(m*31+d))-Math.abs((b.month*31+b.day)-(m*31+d));}).slice(0,3);
}
// keep single-twin getter for backward compat
function getTimeTwin(birth){return getTimeTwins(birth)[0];}

// ── Planet Age ────────────────────────────────────────────────
var PLANETS=[
  {name:'Mercury',icon:'\u263F',orbitalYears:0.2408,color:'#94a3b8',funny:function(a){return a<1?'You\'re basically a newborn here.':'You\'ve lapped the Sun '+Math.floor(a)+' times already.';}},
  {name:'Venus',icon:'\u2640',orbitalYears:0.6152,color:'#fbbf24',funny:function(a){return 'On Venus, beauty standards are '+Math.round(a)+' years old.';}},
  {name:'Earth',icon:'\uD83C\uDF0D',orbitalYears:1,color:'#60a5fa',funny:function(a){return 'Your official age. '+Math.floor(a)+' trips around the Sun.';}},
  {name:'Mars',icon:'\uD83D\uDD34',orbitalYears:1.8808,color:'#f87171',funny:function(a){return a<18?'On Mars, you\'re still figuring life out.':a<30?'On Mars, you\'re just getting started.':'On Mars, you\'re a seasoned explorer.';}},
  {name:'Jupiter',icon:'\uD83D\uDFE0',orbitalYears:11.862,color:'#fb923c',funny:function(a){return a<5?'On Jupiter, you\'re basically a toddler \uD83D\uDE04':a<10?'On Jupiter, you just started school.':'On Jupiter, you\'re finally a teenager.';}},
  {name:'Saturn',icon:'\uD83D\uDFE1',orbitalYears:29.457,color:'#fde68a',funny:function(a){return a<1?'On Saturn, you haven\'t even had your first birthday.':'On Saturn, you\'re only '+a.toFixed(1)+'. Still figuring life out.';}},
  {name:'Uranus',icon:'\uD83D\uDFE6',orbitalYears:84.011,color:'#67e8f9',funny:function(a){return 'On Uranus, you\'re '+a.toFixed(2)+' years old. Basically a cell.';}},
  {name:'Neptune',icon:'\uD83D\uDFE3',orbitalYears:164.8,color:'#818cf8',funny:function(a){return 'On Neptune, you\'re '+a.toFixed(3)+'. You don\'t even exist yet.';}},
  {name:'Moon',icon:'\uD83C\uDF15',orbitalYears:0.0748,color:'#e2e8f0',funny:function(a){return 'In lunar months, you\'ve seen '+Math.floor(a)+' full moons.';}},
];
function renderPlanetAge(birth){
  var t=getTotals(birth);
  var earthYears=t.day/365.25;
  var container=el('planet-scroll');
  if(!container)return;
  container.innerHTML=PLANETS.map(function(p){
    var age=earthYears/p.orbitalYears;
    var display=age>=100?Math.round(age).toLocaleString():age>=10?age.toFixed(1):age.toFixed(2);
    return '<div class="planet-card" style="--planet-color:'+p.color+'">'+
      '<div class="pc-icon">'+p.icon+'</div>'+
      '<div class="pc-name">'+p.name+'</div>'+
      '<div class="pc-age">'+display+'</div>'+
      '<div class="pc-unit">years</div>'+
      '<div class="pc-funny">'+p.funny(age)+'</div>'+
    '</div>';
  }).join('');
}

// ── Life Moments ──────────────────────────────────────────────
function renderLifeMoments(birth){
  var t=getTotals(birth);
  var b=getBreakdown(birth);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);
  var yearsLived=t.day/365.25;
  var yearsLeft=daysLeft/365.25;

  var pastItems=[
    {icon:'\uD83D\uDCA4',label:'Sleeping',val:fmtShort(Math.round(yearsLived*0.33))+' years',sub:'~8 hrs/day — you\'ve been unconscious for a third of your life.'},
    {icon:'\u2764\uFE0F',label:'Heartbeats',val:fmtShort(Math.floor(t.day*24*60*70)),sub:'Your heart has never taken a day off.'},
    {icon:'\uD83D\uDCF1',label:'Screen time',val:fmtShort(Math.round(yearsLived*0.17))+' years',sub:'~4 hrs/day average. More than you\'d like to admit.'},
    {icon:'\uD83D\uDEB6',label:'Walking',val:fmtShort(Math.round(t.day*8000))+' steps',sub:'You\'ve walked the equivalent of the Earth\'s circumference '+Math.round(t.day*8000/40075000)+' times.'},
    {icon:'\uD83C\uDF7D\uFE0F',label:'Meals eaten',val:fmtShort(Math.floor(t.day*3)),sub:'Three times a day, every day, without fail.'},
    {icon:'\uD83D\uDE04',label:'Laughs',val:fmtShort(Math.floor(t.day*15)),sub:'~15 laughs a day. Hopefully more.'},
  ];
  var futureItems=[
    {icon:'\uD83D\uDCA4',label:'More sleeping',val:fmtShort(Math.round(yearsLeft*0.33))+' years',sub:'You\'ll spend another third of your remaining life asleep.'},
    {icon:'\uD83D\uDCF1',label:'More screen time',val:fmtShort(Math.round(yearsLeft*0.17))+' years',sub:'At current rates. Want to change this?'},
    {icon:'\uD83D\uDEB6',label:'More walking',val:fmtShort(Math.round(daysLeft*8000))+' steps',sub:'Every step is a choice. Make them count.'},
    {icon:'\uD83C\uDF05',label:'More sunrises',val:fmt(daysLeft),sub:'You have '+fmt(daysLeft)+' more mornings. Each one is a fresh start.'},
    {icon:'\uD83C\uDF89',label:'More weekends',val:fmt(Math.floor(daysLeft/7)),sub:'~'+fmt(Math.floor(daysLeft/7))+' weekends left. How will you spend them?'},
    {icon:'\uD83D\uDCDA',label:'More learning',val:'Unlimited',sub:'The only resource that doesn\'t run out.'},
  ];

  var pastList=el('lm-past-list');
  if(pastList){
    pastList.innerHTML=pastItems.map(function(item){
      return '<div class="ff-item"><span class="ff-icon" aria-hidden="true">'+item.icon+'</span><div class="ff-body"><div class="ff-val">'+item.val+'</div><div class="ff-lbl">'+item.label+'</div><div class="ff-sub">'+item.sub+'</div></div></div>';
    }).join('');
  }
  var futureList=el('lm-future-list');
  if(futureList){
    futureList.innerHTML=futureItems.map(function(item){
      return '<div class="ff-item"><span class="ff-icon" aria-hidden="true">'+item.icon+'</span><div class="ff-body"><div class="ff-val">'+item.val+'</div><div class="ff-lbl">'+item.label+'</div><div class="ff-sub">'+item.sub+'</div></div></div>';
    }).join('');
  }
}

// ── Birthday Twin Reveal ──────────────────────────────────────
var BIRTH_COUNTS_BY_MONTH=[3.3,2.9,3.1,3.0,3.1,3.2,3.4,3.5,3.3,3.2,3.1,3.1]; // millions
function renderBirthdayTwinReveal(birth){
  var twins=getTimeTwins(birth);
  var m=birth.getMonth()+1;
  var d=birth.getDate();
  var dateStr=birth.toLocaleDateString('en-US',{month:'long',day:'numeric'});

  // Headline
  setText('tr-headline-name',twins[0].name);
  setText('tr-sub','People born on '+dateStr+' — you\'re in rare company.');

  // Twins row
  var rowEl=el('tr-twins-row');
  if(rowEl){
    rowEl.innerHTML=twins.map(function(tw,i){
      return '<div class="tr-twin-card'+(i===0?' tr-twin-featured':'')+'">'+
        '<div class="tr-twin-icon">'+tw.icon+'</div>'+
        '<div class="tr-twin-name">'+tw.name+'</div>'+
        '<div class="tr-twin-role">'+tw.role+'</div>'+
        '<div class="tr-twin-born">'+tw.born+'</div>'+
      '</div>';
    }).join('');
  }

  // Personality twist
  var personalityEl=el('tr-personality');
  if(personalityEl&&twins.length>=2){
    var lines=twins.map(function(tw){return '<span class="tr-trait-line">'+tw.trait+'</span>';});
    personalityEl.innerHTML=
      '<div class="tr-personality-inner">'+
        '<div class="tr-personality-label">But here\'s the twist\u2026</div>'+
        lines.join('')+
        '<div class="tr-personality-cta">These traits are in your DNA. Own them.</div>'+
      '</div>';
  }

  // Club count
  var monthCount=BIRTH_COUNTS_BY_MONTH[m-1]||3.2;
  var dayCount=Math.round((monthCount/30)*1000)/1000;
  setText('tr-club-count','~'+dayCount.toFixed(1)+' million');
}


// ── History events ────────────────────────────────────────────
var HISTORY_EVENTS={
  '1-1':[{y:1863,t:'Emancipation Proclamation took effect in the US.'},{y:1804,t:'Haiti declared independence from France.'},{y:1958,t:'European Economic Community established.'}],
  '1-8':[{y:1942,t:'Stephen Hawking was born in Oxford, England.'},{y:1935,t:'Elvis Presley was born in Tupelo, Mississippi.'},{y:1815,t:'Battle of New Orleans ended the War of 1812.'}],
  '1-15':[{y:1929,t:'Martin Luther King Jr. was born in Atlanta, Georgia.'},{y:1559,t:'Elizabeth I was crowned Queen of England.'},{y:2009,t:'Miracle on the Hudson: US Airways Flight 1549 landed safely.'}],
  '1-17':[{y:1942,t:'Muhammad Ali was born in Louisville, Kentucky.'},{y:1706,t:'Benjamin Franklin was born in Boston.'},{y:1991,t:'Operation Desert Storm began in the Gulf War.'}],
  '1-20':[{y:1961,t:'John F. Kennedy was inaugurated as 35th US President.'},{y:2009,t:'Barack Obama was inaugurated as 44th US President.'},{y:1981,t:'Iran hostage crisis ended after 444 days.'}],
  '1-27':[{y:1756,t:'Wolfgang Amadeus Mozart was born in Salzburg.'},{y:1945,t:'Soviet forces liberated Auschwitz concentration camp.'},{y:1967,t:'Apollo 1 fire killed three NASA astronauts.'}],
  '2-4':[{y:1945,t:'Yalta Conference began between Allied leaders.'},{y:2004,t:'Facebook was launched by Mark Zuckerberg.'},{y:1789,t:'George Washington was unanimously elected first US President.'}],
  '2-11':[{y:1847,t:'Thomas Edison was born in Milan, Ohio.'},{y:1990,t:'Nelson Mandela was released from prison after 27 years.'},{y:1929,t:'Lateran Treaty established Vatican City as independent state.'}],
  '2-14':[{y:1929,t:'St. Valentine Day Massacre occurred in Chicago.'},{y:1876,t:'Alexander Graham Bell applied for telephone patent.'},{y:1989,t:'Ayatollah Khomeini issued fatwa against Salman Rushdie.'}],
  '2-18':[{y:1930,t:'Pluto was discovered by astronomer Clyde Tombaugh.'},{y:1564,t:'Michelangelo died in Rome at age 88.'},{y:1861,t:'Jefferson Davis was inaugurated as Confederate President.'}],
  '3-6':[{y:1475,t:'Michelangelo was born in Caprese, Italy.'},{y:1836,t:'Battle of the Alamo ended in Texas.'},{y:1857,t:'Dred Scott decision issued by US Supreme Court.'}],
  '3-14':[{y:1879,t:'Albert Einstein was born in Ulm, Germany.'},{y:1883,t:'Karl Marx died in London.'},{y:1794,t:'Eli Whitney patented the cotton gin.'}],
  '3-21':[{y:1685,t:'Johann Sebastian Bach was born in Eisenach.'},{y:1960,t:'Sharpeville massacre occurred in South Africa.'},{y:2006,t:'Twitter was founded by Jack Dorsey.'}],
  '4-2':[{y:1805,t:'Hans Christian Andersen was born in Denmark.'},{y:1982,t:'Argentina invaded the Falkland Islands.'},{y:1792,t:'US Mint was established by Congress.'}],
  '4-15':[{y:1452,t:'Leonardo da Vinci was born in Vinci, Italy.'},{y:1912,t:'RMS Titanic sank in the North Atlantic.'},{y:1865,t:'Abraham Lincoln died after being shot the previous night.'}],
  '4-23':[{y:1564,t:'William Shakespeare was born in Stratford-upon-Avon.'},{y:1616,t:'Miguel de Cervantes died in Madrid.'},{y:1985,t:'Coca-Cola introduced New Coke formula.'}],
  '5-5':[{y:1818,t:'Karl Marx was born in Trier, Germany.'},{y:1961,t:'Alan Shepard became first American in space.'},{y:1821,t:'Napoleon Bonaparte died in exile on Saint Helena.'}],
  '5-14':[{y:1948,t:'State of Israel was proclaimed.'},{y:1804,t:'Lewis and Clark Expedition departed from Camp Dubois.'},{y:1973,t:'Skylab, first US space station, was launched.'}],
  '5-25':[{y:1977,t:'Star Wars was released in cinemas worldwide.'},{y:1961,t:'JFK announced goal to land on the Moon.'},{y:1979,t:'American Airlines Flight 191 crashed in Chicago.'}],
  '6-1':[{y:1926,t:'Marilyn Monroe was born in Los Angeles.'},{y:1980,t:'CNN launched as first 24-hour news network.'},{y:1967,t:'Beatles released Sgt. Peppers Lonely Hearts Club Band.'}],
  '6-12':[{y:1929,t:'Anne Frank was born in Frankfurt, Germany.'},{y:1963,t:'Civil rights leader Medgar Evers was assassinated.'},{y:1987,t:'Reagan challenged Gorbachev to tear down the Berlin Wall.'}],
  '6-18':[{y:1815,t:'Battle of Waterloo: Napoleon was defeated.'},{y:1928,t:'Amelia Earhart became first woman to fly across the Atlantic.'},{y:1983,t:'Sally Ride became first American woman in space.'}],
  '7-4':[{y:1776,t:'United States declared independence from Britain.'},{y:1826,t:'John Adams and Thomas Jefferson both died on this day.'},{y:1997,t:'Mars Pathfinder landed on Mars.'}],
  '7-18':[{y:1918,t:'Nelson Mandela was born in Mvezo, South Africa.'},{y:1969,t:'Ted Kennedy drove off Chappaquiddick Bridge.'},{y:1936,t:'Spanish Civil War began.'}],
  '7-20':[{y:1969,t:'Apollo 11: Neil Armstrong walked on the Moon.'},{y:1944,t:'Assassination attempt on Adolf Hitler failed.'},{y:1976,t:'Viking 1 landed on Mars.'}],
  '8-4':[{y:1961,t:'Barack Obama was born in Honolulu, Hawaii.'},{y:1914,t:'Britain declared war on Germany, entering World War I.'},{y:1944,t:'Anne Frank and family were arrested by Gestapo.'}],
  '8-6':[{y:1945,t:'Atomic bomb dropped on Hiroshima, Japan.'},{y:1991,t:'World Wide Web became publicly available.'},{y:1965,t:'Voting Rights Act signed by President Johnson.'}],
  '8-9':[{y:1945,t:'Atomic bomb dropped on Nagasaki, Japan.'},{y:1974,t:'Richard Nixon resigned as US President.'},{y:1963,t:'Great Train Robbery occurred in England.'}],
  '8-15':[{y:1947,t:'India gained independence from British rule.'},{y:1769,t:'Napoleon Bonaparte was born in Corsica.'},{y:1971,t:'Bahrain declared independence from the UK.'}],
  '8-26':[{y:1920,t:'19th Amendment ratified, giving women the right to vote.'},{y:1978,t:'Pope John Paul I was elected.'},{y:1883,t:'Krakatoa volcano erupted in Indonesia.'}],
  '9-5':[{y:1946,t:'Freddie Mercury was born in Zanzibar.'},{y:1972,t:'Munich massacre occurred at the Olympic Games.'},{y:1698,t:'Peter the Great imposed tax on beards in Russia.'}],
  '9-11':[{y:2001,t:'Terrorist attacks destroyed World Trade Center in New York.'},{y:1973,t:'Military coup overthrew Salvador Allende in Chile.'},{y:1789,t:'Alexander Hamilton became first US Secretary of the Treasury.'}],
  '9-15':[{y:1890,t:'Agatha Christie was born in Torquay, England.'},{y:1935,t:'Nuremberg Laws stripped Jews of German citizenship.'},{y:1916,t:'Tanks were used in battle for the first time.'}],
  '9-26':[{y:1888,t:'T.S. Eliot was born in St. Louis, Missouri.'},{y:1960,t:'First televised US presidential debate: Kennedy vs Nixon.'},{y:1983,t:'Soviet officer Stanislav Petrov prevented nuclear war.'}],
  '10-2':[{y:1869,t:'Mahatma Gandhi was born in Porbandar, India.'},{y:1950,t:'Peanuts comic strip by Charles Schulz first published.'},{y:1967,t:'Thurgood Marshall became first Black US Supreme Court Justice.'}],
  '10-9':[{y:1940,t:'John Lennon was born in Liverpool, England.'},{y:1967,t:'Che Guevara was executed in Bolivia.'},{y:1874,t:'Universal Postal Union was established.'}],
  '10-14':[{y:1947,t:'Chuck Yeager broke the sound barrier for the first time.'},{y:1066,t:'Battle of Hastings: William the Conqueror defeated King Harold.'},{y:1964,t:'Martin Luther King Jr. was awarded the Nobel Peace Prize.'}],
  '10-28':[{y:1955,t:'Bill Gates was born in Seattle, Washington.'},{y:1886,t:'Statue of Liberty was dedicated in New York Harbor.'},{y:1962,t:'Cuban Missile Crisis ended as Soviet ships turned back.'}],
  '11-9':[{y:1934,t:'Carl Sagan was born in Brooklyn, New York.'},{y:1989,t:'Berlin Wall fell, ending the Cold War division of Germany.'},{y:1938,t:'Kristallnacht: Nazi pogrom against Jews in Germany.'}],
  '11-19':[{y:1917,t:'Indira Gandhi was born in Allahabad, India.'},{y:1863,t:'Lincoln delivered the Gettysburg Address.'},{y:1969,t:'Apollo 12 astronauts landed on the Moon.'}],
  '11-22':[{y:1963,t:'President John F. Kennedy was assassinated in Dallas.'},{y:1718,t:'Blackbeard the pirate was killed in battle.'},{y:1990,t:'Margaret Thatcher resigned as British Prime Minister.'}],
  '11-30':[{y:1835,t:'Mark Twain was born in Florida, Missouri.'},{y:1874,t:'Winston Churchill was born at Blenheim Palace.'},{y:1954,t:'First meteorite to hit a human struck Ann Hodges in Alabama.'}],
  '12-5':[{y:1901,t:'Walt Disney was born in Chicago, Illinois.'},{y:1933,t:'Prohibition ended in the United States.'},{y:1955,t:'Montgomery Bus Boycott began after Rosa Parks arrest.'}],
  '12-16':[{y:1770,t:'Ludwig van Beethoven was born in Bonn, Germany.'},{y:1773,t:'Boston Tea Party took place in Boston Harbor.'},{y:1944,t:'Battle of the Bulge began in World War II.'}],
  '12-25':[{y:1642,t:'Isaac Newton was born in Woolsthorpe, England.'},{y:1991,t:'Soviet Union officially dissolved.'},{y:1914,t:'Christmas Truce: soldiers stopped fighting in World War I.'}],
  '12-31':[{y:1879,t:'Thomas Edison demonstrated incandescent light bulb publicly.'},{y:1999,t:'Y2K fears proved unfounded as millennium arrived.'},{y:1929,t:'Guy Lombardo played Auld Lang Syne on New Year Eve for first time.'}]
};
function getHistoryEvents(birth){
  var key=(birth.getMonth()+1)+'-'+birth.getDate();
  if(HISTORY_EVENTS[key])return HISTORY_EVENTS[key];
  var m=birth.getMonth()+1,d=birth.getDate();
  var keys=Object.keys(HISTORY_EVENTS).filter(function(k){return k.split('-')[0]===String(m);});
  if(keys.length){
    keys.sort(function(a,b){return Math.abs(parseInt(a.split('-')[1])-d)-Math.abs(parseInt(b.split('-')[1])-d);});
    return HISTORY_EVENTS[keys[0]];
  }
  return [{y:1969,t:'Apollo 11 landed on the Moon.'},{y:1989,t:'The Berlin Wall fell, ending the Cold War.'},{y:1945,t:'World War II ended, reshaping the modern world.'}];
}

var MONTH_EVENTS={
  1:[{icon:'\uD83C\uDF0D',y:1945,t:'United Nations was founded.'},{icon:'\uD83D\uDE80',y:1986,t:'Space Shuttle Challenger disaster.'},{icon:'\uD83C\uDFB5',y:1964,t:'Beatles arrived in the United States.'}],
  2:[{icon:'\uD83C\uDF0D',y:1945,t:'Yalta Conference shaped post-WWII world.'},{icon:'\uD83C\uDFAC',y:1895,t:'First public film screening by Lumiere brothers.'},{icon:'\u270A',y:1965,t:'Malcolm X was assassinated.'}],
  3:[{icon:'\uD83C\uDF0D',y:1945,t:'Battle of Iwo Jima ended.'},{icon:'\uD83D\uDD2C',y:1876,t:'Alexander Graham Bell patented the telephone.'},{icon:'\uD83C\uDFAD',y:1616,t:'William Shakespeare died.'}],
  4:[{icon:'\uD83D\uDE80',y:1961,t:'Yuri Gagarin became first human in space.'},{icon:'\uD83C\uDF0D',y:1912,t:'Titanic sank in the North Atlantic.'},{icon:'\uD83C\uDFB5',y:1994,t:'Kurt Cobain died.'}],
  5:[{icon:'\uD83C\uDF0D',y:1945,t:'World War II ended in Europe (V-E Day).'},{icon:'\uD83D\uDD2C',y:1953,t:'DNA double helix structure discovered.'},{icon:'\u26F0\uFE0F',y:1953,t:'Edmund Hillary summited Mount Everest.'}],
  6:[{icon:'\uD83C\uDF0D',y:1944,t:'D-Day: Allied forces landed in Normandy.'},{icon:'\uD83C\uDFB5',y:1967,t:'Beatles released Sgt. Peppers Lonely Hearts Club Band.'},{icon:'\uD83C\uDFC6',y:1966,t:'England won the FIFA World Cup.'}],
  7:[{icon:'\uD83D\uDE80',y:1969,t:'Apollo 11 landed on the Moon.'},{icon:'\uD83C\uDF0D',y:1776,t:'United States declared independence.'},{icon:'\uD83C\uDFB5',y:1985,t:'Live Aid concert raised millions for Africa.'}],
  8:[{icon:'\uD83C\uDF0D',y:1914,t:'World War I began.'},{icon:'\u270A',y:1963,t:'Martin Luther King Jr. delivered "I Have a Dream" speech.'},{icon:'\uD83C\uDFC5',y:2000,t:'Summer Olympics held in Sydney, Australia.'}],
  9:[{icon:'\uD83C\uDF0D',y:2001,t:'September 11 attacks in the United States.'},{icon:'\uD83D\uDD2C',y:1928,t:'Alexander Fleming discovered penicillin.'},{icon:'\uD83C\uDFB5',y:1969,t:'Beatles released Abbey Road album.'}],
  10:[{icon:'\uD83C\uDF0D',y:1962,t:'Cuban Missile Crisis began.'},{icon:'\uD83D\uDD2C',y:1901,t:'First Nobel Prizes were awarded.'},{icon:'\uD83C\uDFB5',y:1958,t:'Billboard Hot 100 chart was introduced.'}],
  11:[{icon:'\uD83C\uDF0D',y:1989,t:'Berlin Wall fell, ending the Cold War.'},{icon:'\uD83D\uDD2C',y:1895,t:'Wilhelm Rontgen discovered X-rays.'},{icon:'\uD83C\uDFB5',y:1963,t:'Beatles released "With the Beatles" album.'}],
  12:[{icon:'\uD83C\uDF0D',y:1991,t:'Soviet Union officially dissolved.'},{icon:'\uD83D\uDE80',y:1972,t:'Apollo 17 - last humans walked on the Moon.'},{icon:'\uD83C\uDFB5',y:1967,t:'Beatles released Magical Mystery Tour.'}]
};

// ── Peak Years ────────────────────────────────────────────────
function renderPeakYears(birth){
  var b=getBreakdown(birth);
  var age=b.yy;
  var currentYear=new Date().getFullYear();
  var birthYear=birth.getFullYear();
  var peaks=[
    {icon:'\uD83E\uDDE0',title:'Mental Peak',desc:'Cognitive flexibility and learning speed are highest.',ageRange:'15-25',startAge:15,endAge:25},
    {icon:'\uD83D\uDCAA',title:'Physical Peak',desc:'Strength, endurance and reaction time at their best.',ageRange:'20-30',startAge:20,endAge:30},
    {icon:'\uD83D\uDCBC',title:'Career Peak',desc:'Experience meets energy — your most productive decade.',ageRange:'35-50',startAge:35,endAge:50},
    {icon:'\uD83D\uDCB0',title:'Wealth Peak',desc:'Earnings and net worth typically peak in this window.',ageRange:'45-60',startAge:45,endAge:60},
    {icon:'\uD83D\uDE4F',title:'Wisdom Peak',desc:'Emotional intelligence and life perspective at their richest.',ageRange:'60-75',startAge:60,endAge:75}
  ];
  var container=el('peak-content');
  if(!container)return;
  container.innerHTML=peaks.map(function(p){
    var peakYear1=birthYear+p.startAge;
    var peakYear2=birthYear+p.endAge;
    var status='';
    if(age<p.startAge){status='<span style="color:#16A34A;font-size:0.7rem;font-weight:700;">UPCOMING ('+(peakYear1)+')</span>';}
    else if(age>=p.startAge&&age<=p.endAge){status='<span style="color:#FACC15;font-size:0.7rem;font-weight:700;">YOU ARE HERE NOW</span>';}
    else{status='<span style="color:rgba(255,255,255,0.28);font-size:0.7rem;">Completed ('+peakYear1+'-'+peakYear2+')</span>';}
    return '<div class="peak-item"><div class="peak-icon">'+p.icon+'</div><div><div class="peak-title">'+p.title+' <small style="color:#64748b;font-weight:400;">Age '+p.ageRange+'</small></div><div class="peak-desc">'+p.desc+'</div><div class="peak-age">'+status+'</div></div></div>';
  }).join('');
}

// ── Main render ───────────────────────────────────────────────
function renderAll(birth,name){
  _birth=birth;
  var _name=name||'';
  var b=getBreakdown(birth);
  var t=getTotals(birth);
  var ageYears=b.yy+b.mo/12;
  var pct=Math.min(100,(ageYears/AVG_LIFESPAN_YEARS)*100);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);

  // Hide input, show results
  el('input-section').classList.add('hidden');
  el('results-section').classList.remove('hidden');

  // ── WOW Section ──
  var fajrCount=t.day;
  var wowLine1=el('wow-line1');
  if(wowLine1){
    wowLine1.innerHTML=(typeof t==='function'?t('wowLine1pre'):'You have had over')+' <strong><span id="wow-counter">0</span></strong> '+(typeof t==='function'?t('wowLine1post'):'chances to pray Fajr.');
    // Animate counter after a short delay
    setTimeout(function(){
      animateCounter(el('wow-counter'),fajrCount,1200);
    },300);
  }
  setTimeout(function(){
    var l2=el('wow-line2');
    if(l2){l2.classList.remove('hidden');l2.classList.add('fade-in');}
  },1400);
  setTimeout(function(){
    var l3=el('wow-line3');
    if(l3){l3.classList.remove('hidden');l3.classList.add('fade-in');}
  },3200);

  // ── Core Data ──
  var coreEl=el('core-days');
  if(coreEl){coreEl.innerHTML='You have lived <strong>'+fmt(t.day)+'</strong> days.';}

  // ── Ibadah ──
  setText('ib-fajr',fmt(t.day));
  setText('ib-dhuhr',fmt(t.day));
  setText('ib-asr',fmt(t.day));
  setText('ib-maghrib',fmt(t.day));
  setText('ib-isha',fmt(t.day));

  // ── Ramadan ──
  var ramadans=Math.floor(ageYears);
  var ramadanEl=el('ramadan-count');
  if(ramadanEl){ramadanEl.textContent='You have witnessed around '+ramadans+' Ramadans.';}

  // ── Share preview ──
  setText('spc-pct',Math.round(pct)+'%');

  // ── Stats row (explore) ──
  setText('stat-age',b.yy+' yrs '+b.mo+' mo');
  setText('stat-age-days',fmt(t.day)+' days');
  setText('stat-days-used',fmt(t.day));
  setText('stat-hours-used',fmt(t.hr)+' hours');
  setText('stat-days-left',fmt(daysLeft));
  setText('stat-hours-left',fmt(daysLeft*24)+' hours');
  setText('stat-pct',Math.round(pct)+'%');
  setText('stat-pct-left','Still '+Math.round(100-pct)+'% to live');

  // ── Mini Calendar ──
  buildMiniCalendar(birth,t.day,10);

  // ── Birthday Twin Reveal ──
  renderBirthdayTwinReveal(birth);

  // ── Planet Age ──
  renderPlanetAge(birth);

  // ── Life Moments ──
  renderLifeMoments(birth);

  // ── Peak Years ──
  renderPeakYears(birth);

  // ── History ──
  renderHistory(birth);

  // ── Month events ──
  renderMonthEvents(birth);

  // ── Birth Details ──
  var m=birth.getMonth()+1,d=birth.getDate(),y=birth.getFullYear();
  setText('bd-day',bornDay(birth));
  setText('bd-zodiac',getZodiac(m,d));
  setText('bd-chinese',getChineseZodiac(y));
  setText('bd-stone',getBirthStone(m));
  setText('bd-flower',getBirthFlower(m));

  // ── Country events ──
  var countryEl=el('country-events');
  var histEvents=getHistoryEvents(birth);
  if(countryEl){
    countryEl.innerHTML=histEvents.slice(0,3).map(function(e){
      return '<div class="ce-item-sm"><span class="ce-year">'+e.y+'</span>'+e.t+'</div>';
    }).join('');
  }
  setText('country-title','\uD83C\uDF0D On '+birth.toLocaleDateString('en-US',{month:'long',day:'numeric'}));

  // ── Labels ──
  setText('history-date-label','Major events that happened on '+birth.toLocaleDateString('en-US',{month:'long',day:'numeric'}));
  setText('month-label','What happened in '+birth.toLocaleDateString('en-US',{month:'long'}));

  // ── Cal week labels ──
  var birthStr=birth.toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
  var deathYear=birth.getFullYear()+AVG_LIFESPAN_YEARS;
  var deathStr=birth.toLocaleDateString('en-US',{day:'numeric',month:'short'})+' '+deathYear;
  setText('cal-date-start',birthStr);
  setText('cal-date-end',deathStr);
  var weeksLived=Math.floor(t.day/7);
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  setText('cal-week-now','Week '+fmt(weeksLived));
  setText('cal-week-total',fmt(totalWeeks));

  // ── Share card ──
  setText('sc-pct',Math.round(pct)+'%');
  setText('sc-weekends','~'+fmt(Math.floor(daysLeft/7))+' weekends remaining');
  if(_name){setText('sc-name-card',_name);}else{setText('sc-name-card',b.yy+' years old');}
  var scStats=el('sc-stats-card');
  if(scStats)scStats.innerHTML=fmt(t.day)+' days lived &nbsp;&middot;&nbsp; '+fmtShort(Math.floor(t.day*24*60*70))+' heartbeats &nbsp;&middot;&nbsp; '+Math.round(pct)+'% of life used';

  // ── Live ticker ──
  clearInterval(window._ticker);
  window._ticker=setInterval(function(){tickUpdate(birth);},1000);
  tickUpdate(birth);

  // ── Save ──
  localStorage.setItem('aw_dob',birth.toISOString().split('T')[0]);

  // Re-init scroll reveal + cinematic observers for newly visible elements
  setTimeout(function(){
    initScrollReveal();
    initIbadahStagger();
    initPassingLines();
    el('wow-section').scrollIntoView({behavior:'smooth',block:'start'});
  },100);
}

function tickUpdate(birth){
  var t=getTotals(birth);
  var b=getBreakdown(birth);
  var ageYears=b.yy+b.mo/12;
  var pct=Math.min(100,(ageYears/AVG_LIFESPAN_YEARS)*100);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);
  setText('stat-age',b.yy+' yrs '+b.mo+' mo');
  setText('stat-age-days',fmt(t.day)+' days');
  setText('stat-days-used',fmt(t.day));
  setText('stat-hours-used',fmt(t.hr)+' hours');
  setText('stat-days-left',fmt(daysLeft));
  setText('stat-hours-left',fmt(daysLeft*24)+' hours');
  setText('stat-pct',Math.round(pct)+'%');
}

function buildMiniCalendar(birth,daysLived,years){
  var grid=el('mini-cal-grid');
  if(!grid)return;
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  var weeksLived=Math.floor(daysLived/7);
  var show=Math.min(totalWeeks,52*(years||10));
  var frag=document.createDocumentFragment();
  for(var w=0;w<show;w++){
    var cell=document.createElement('div');
    cell.className='mini-cal-cell '+(w<weeksLived?'mc-past':w===weeksLived?'mc-present':'mc-future');
    frag.appendChild(cell);
  }
  grid.innerHTML='';
  grid.appendChild(frag);
}

function buildFullCalendar(birth){
  var grid=el('full-cal-grid');
  if(!grid)return;
  var t=getTotals(birth);
  var totalWeeks=AVG_LIFESPAN_YEARS*52;
  var weeksLived=Math.floor(t.day/7);
  var frag=document.createDocumentFragment();
  for(var w=0;w<totalWeeks;w++){
    var cell=document.createElement('div');
    cell.className='full-cal-cell '+(w<weeksLived?'mc-past':w===weeksLived?'mc-present':'mc-future');
    cell.title='Week '+(w+1);
    frag.appendChild(cell);
  }
  grid.innerHTML='';
  grid.appendChild(frag);
}

function renderTimeTwin(birth){
  // Legacy stub — twin reveal is now handled by renderBirthdayTwinReveal
}

function renderHistory(birth){
  var events=getHistoryEvents(birth);
  var listEl=el('history-list');
  if(!listEl)return;
  var colors=['history-dot-green','history-dot-yellow','history-dot-blue'];
  listEl.innerHTML=events.map(function(e,i){
    return '<div class="history-item"><span class="history-dot '+colors[i%3]+'"></span><span class="history-year">'+e.y+'</span><span class="history-text">'+e.t+'</span></div>';
  }).join('');
}

function renderMonthEvents(birth){
  var m=birth.getMonth()+1;
  var events=MONTH_EVENTS[m]||MONTH_EVENTS[8];
  var listEl=el('month-list');
  if(!listEl)return;
  listEl.innerHTML=events.map(function(e){
    return '<div class="month-item"><span class="month-icon">'+e.icon+'</span><span class="month-year">'+e.y+'</span><span class="month-text">'+e.t+'</span><span class="month-arrow">\u203A</span></div>';
  }).join('');
}

// ── Loading sequence ──────────────────────────────────────────
function showLoading(cb){
  var overlay=el('loading-overlay');
  var lineEl=el('loading-line');
  overlay.classList.remove('hidden');
  overlay.classList.remove('fade-out');
  document.body.style.overflow='hidden';
  var msgs = (typeof getLoadMsgs === 'function') ? getLoadMsgs() : ['Analyzing your time\u2026','Every moment you\u2019ve lived\u2026','Every opportunity you were given\u2026'];
  var i=0;
  lineEl.textContent=msgs[0];
  var seq=setInterval(function(){
    i++;
    if(i<msgs.length){
      lineEl.style.opacity='0';
      setTimeout(function(){lineEl.textContent=msgs[i];lineEl.style.opacity='1';},300);
    } else {
      clearInterval(seq);
      setTimeout(function(){
        overlay.classList.add('fade-out');
        setTimeout(function(){
          overlay.classList.add('hidden');
          overlay.classList.remove('fade-out');
          document.body.style.overflow='';
          cb();
        },500);
      },600);
    }
  },1100);
}

// ── Share modal ───────────────────────────────────────────────
function openShare(){
  if(!_birth){
    el('input-section').classList.remove('hidden');
    el('hero').scrollIntoView({behavior:'smooth'});
    return;
  }
  var t=getTotals(_birth);
  var b=getBreakdown(_birth);
  var pct=Math.min(100,((b.yy+b.mo/12)/AVG_LIFESPAN_YEARS)*100);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);
  var weekendsLeft=Math.floor(daysLeft/7);
  var twin=getTimeTwin(_birth);
  setText('sc-pct',Math.round(pct)+'%');
  setText('sc-weekends','~'+fmt(weekendsLeft)+' weekends remaining');
  var savedName=localStorage.getItem('aw_name')||'';
  setText('sc-name-card',savedName||b.yy+' years old');
  var statsEl=el('sc-stats-card');
  if(statsEl){
    statsEl.innerHTML=fmt(t.day)+' days lived &nbsp;&middot;&nbsp; '+fmtShort(Math.floor(t.day*24*60*70))+' heartbeats';
    if(twin)statsEl.innerHTML+='<br><span style="color:#22c55e;font-size:0.82rem;">Birthday twin: '+twin.icon+' '+twin.name+'</span>';
  }
  el('share-modal').classList.remove('hidden');
  document.body.style.overflow='hidden';
}

function openTwinShare(){
  if(!_birth){return;}
  var twins=getTimeTwins(_birth);
  var b=getBreakdown(_birth);
  var t=getTotals(_birth);
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var daysLeft=Math.max(0,totalDays-t.day);
  var weekendsLeft=Math.floor(daysLeft/7);
  var dateStr=_birth.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
  setText('tsc-born','Born '+dateStr);
  var twinsCardEl=el('tsc-twins-card');
  if(twinsCardEl){
    twinsCardEl.innerHTML='<div style="font-size:0.7rem;font-weight:700;letter-spacing:1px;color:#7C5CFF;margin-bottom:10px;">YOU SHARE YOUR BIRTHDAY WITH</div>'+
      twins.map(function(tw){return '<div style="font-size:1rem;margin:4px 0;">'+tw.icon+' <strong>'+tw.name+'</strong> <span style="color:#64748b;font-size:0.78rem;">'+tw.role+'</span></div>';}).join('');
  }
  var twistEl=el('tsc-twist-card');
  if(twistEl&&twins[0]){
    twistEl.innerHTML='<div style="font-size:0.82rem;color:#c4b5fd;font-style:italic;margin-top:12px;padding:10px;background:rgba(124,92,255,0.1);border-radius:8px;">'+twins[0].trait+'</div>';
  }
  setText('tsc-weekends-card','You have ~'+fmt(weekendsLeft)+' weekends left. What will you do with them?');
  el('twin-share-modal').classList.remove('hidden');
  document.body.style.overflow='hidden';
}

// ── Compare modal ─────────────────────────────────────────────
function openCompare(){
  if(!_birth)return;
  var modal=el('compare-modal');
  if(modal){modal.classList.remove('hidden');document.body.style.overflow='hidden';}
}
function closeCompare(){
  var modal=el('compare-modal');
  if(modal){modal.classList.add('hidden');document.body.style.overflow='';}
}
function runComparison(){
  var friendDob=el('compare-dob').value;
  var friendName=(el('compare-name').value||'').trim()||'Friend';
  var errEl=el('compare-error');
  if(errEl)errEl.classList.add('hidden');
  if(!friendDob){if(errEl){errEl.textContent='Please enter a date of birth.';errEl.classList.remove('hidden');}return;}
  var friendBirth=parseDOB(friendDob);
  if(isNaN(friendBirth.getTime())||friendBirth>new Date()){if(errEl){errEl.textContent='Please enter a valid past date.';errEl.classList.remove('hidden');}return;}
  var savedName=localStorage.getItem('aw_name')||'You';
  var t1=getTotals(_birth),t2=getTotals(friendBirth);
  var b1=getBreakdown(_birth),b2=getBreakdown(friendBirth);
  var pct1=Math.round(Math.min(100,((b1.yy+b1.mo/12)/AVG_LIFESPAN_YEARS)*100));
  var pct2=Math.round(Math.min(100,((b2.yy+b2.mo/12)/AVG_LIFESPAN_YEARS)*100));
  var totalDays=Math.round(AVG_LIFESPAN_YEARS*365.25);
  var left1=Math.max(0,totalDays-t1.day),left2=Math.max(0,totalDays-t2.day);
  var resultEl=el('compare-result');
  if(resultEl){
    var older=_birth<friendBirth?savedName:friendName;
    var diffDays=Math.abs(t1.day-t2.day);
    resultEl.innerHTML=
      '<div class="cmp-row"><div class="cmp-person"><div class="cmp-name">'+savedName+'</div><div class="cmp-pct">'+pct1+'%</div><div class="cmp-sub">'+fmt(t1.day)+' days lived</div><div class="cmp-sub">'+fmt(left1)+' days left</div></div>'+
      '<div class="cmp-vs">VS</div>'+
      '<div class="cmp-person"><div class="cmp-name">'+friendName+'</div><div class="cmp-pct">'+pct2+'%</div><div class="cmp-sub">'+fmt(t2.day)+' days lived</div><div class="cmp-sub">'+fmt(left2)+' days left</div></div></div>'+
      '<div class="cmp-verdict">'+older+' is older by '+fmt(diffDays)+' days &nbsp;&middot;&nbsp; Difference: '+Math.abs(pct1-pct2)+'% of life</div>';
    resultEl.classList.remove('hidden');
  }
}

// ── Event listeners ───────────────────────────────────────────

// Hero CTA → scroll to input
document.getElementById('btn-reveal').addEventListener('click',function(){
  var inputSec=el('input-section');
  inputSec.classList.remove('hidden');
  setTimeout(function(){
    inputSec.scrollIntoView({behavior:'smooth',block:'center'});
    el('hero-dob').focus();
  },50);
});

// Nav calc button
document.getElementById('btn-nav-calc').addEventListener('click',function(){
  var inputSec=el('input-section');
  inputSec.classList.remove('hidden');
  setTimeout(function(){
    inputSec.scrollIntoView({behavior:'smooth',block:'center'});
    el('hero-dob').focus();
  },50);
});

// Calculate
document.getElementById('btn-calculate').addEventListener('click',function(){
  var dob=el('hero-dob').value;
  var errEl=el('hero-error');
  errEl.classList.add('hidden');
  if(!dob){errEl.textContent='Please select your date of birth.';errEl.classList.remove('hidden');return;}
  var birth=parseDOB(dob);
  if(birth>new Date()){errEl.textContent='Date of birth cannot be in the future.';errEl.classList.remove('hidden');return;}
  triggerScreenFade(function(){
    showLoading(function(){
      renderAll(birth,'');
      if(typeof gtag!=='undefined')gtag('event','calculate',{event_category:'MultiMain WaqtX',event_label:'main'});
    });
  });
});

// Enter key on date input
document.getElementById('hero-dob').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('btn-calculate').click();});

// Share reflection button
document.getElementById('btn-share-reflection').addEventListener('click',openShare);

// Start again
document.getElementById('btn-start-again').addEventListener('click',function(){
  el('results-section').classList.add('hidden');
  el('input-section').classList.remove('hidden');
  el('hero-dob').value='';
  _birth=null;
  clearInterval(window._ticker);
  el('hero').scrollIntoView({behavior:'smooth'});
});

// Share modal close
document.getElementById('share-close').addEventListener('click',function(){
  el('share-modal').classList.add('hidden');
  document.body.style.overflow='';
});
document.getElementById('share-modal').addEventListener('click',function(e){
  if(e.target===this){el('share-modal').classList.add('hidden');document.body.style.overflow='';}
});
// Twin share
document.getElementById('btn-twin-share').addEventListener('click',openTwinShare);
document.getElementById('twin-share-close').addEventListener('click',function(){
  el('twin-share-modal').classList.add('hidden');
  document.body.style.overflow='';
});
document.getElementById('twin-share-modal').addEventListener('click',function(e){
  if(e.target===this){el('twin-share-modal').classList.add('hidden');document.body.style.overflow='';}
});

// Download twin share card
document.getElementById('btn-download-twin-share').addEventListener('click',function(){
  var card=el('twin-share-card');
  if(typeof html2canvas==='undefined'){alert('Download not available. Please screenshot instead.');return;}
  var btn=this;btn.textContent='Generating...';btn.disabled=true;
  html2canvas(card,{backgroundColor:'#0d0b1e',scale:2}).then(function(canvas){
    var a=document.createElement('a');a.download='multimain-waqtx-twin-card.png';a.href=canvas.toDataURL('image/png');a.click();
    btn.textContent='Downloaded!';setTimeout(function(){btn.textContent='\u2B07\uFE0F Download Twin Card';btn.disabled=false;},2000);
  }).catch(function(){btn.textContent='\u2B07\uFE0F Download Twin Card';btn.disabled=false;alert('Download failed. Please screenshot instead.');});
});

// Download share card
document.getElementById('btn-download-share').addEventListener('click',function(){
  var card=el('share-card');
  if(typeof html2canvas==='undefined'){alert('Download not available. Please screenshot instead.');return;}
  var btn=this;btn.textContent='Generating...';btn.disabled=true;
  html2canvas(card,{backgroundColor:'#0d0b1e',scale:2}).then(function(canvas){
    var a=document.createElement('a');a.download='multimain-waqtx-life-card.png';a.href=canvas.toDataURL('image/png');a.click();
    btn.textContent='Downloaded!';setTimeout(function(){btn.textContent='\u2B07\uFE0F Download Card';btn.disabled=false;},2000);
  }).catch(function(){btn.textContent='\u2B07\uFE0F Download Card';btn.disabled=false;alert('Download failed. Please screenshot instead.');});
});

// Life moments tabs
document.getElementById('lm-tab-past').addEventListener('click',function(){
  el('lm-past').classList.remove('hidden');el('lm-future').classList.add('hidden');
  el('lm-tab-past').classList.add('active');el('lm-tab-future').classList.remove('active');
});
document.getElementById('lm-tab-future').addEventListener('click',function(){
  el('lm-future').classList.remove('hidden');el('lm-past').classList.add('hidden');
  el('lm-tab-future').classList.add('active');el('lm-tab-past').classList.remove('active');
});

// Explore toggle
document.getElementById('btn-explore-toggle').addEventListener('click',function(){
  var content=el('explore-content');
  var arrow=el('explore-arrow');
  var isHidden=content.classList.contains('hidden');
  content.classList.toggle('hidden');
  arrow.classList.toggle('open',isHidden);
  el('explore-toggle-text').textContent=isHidden?'\u2728 Hide Full Life Report':'\u2728 Explore Full Life Report';
  if(isHidden)setTimeout(function(){content.scrollIntoView({behavior:'smooth',block:'start'});},50);
});

// Full calendar
document.getElementById('btn-full-calendar').addEventListener('click',function(){
  if(!_birth)return;
  buildFullCalendar(_birth);
  el('full-calendar-section').classList.remove('hidden');
  setTimeout(function(){el('full-calendar-section').scrollIntoView({behavior:'smooth'});},50);
});
document.getElementById('btn-close-calendar').addEventListener('click',function(){
  el('full-calendar-section').classList.add('hidden');
});

// More events
document.getElementById('btn-more-events').addEventListener('click',function(){
  if(!_birth)return;
  var allEvents=getHistoryEvents(_birth);
  var listEl=el('history-list');
  if(listEl){
    var colors=['history-dot-green','history-dot-yellow','history-dot-blue'];
    listEl.innerHTML=allEvents.map(function(e,i){
      return '<div class="history-item"><span class="history-dot '+colors[i%3]+'"></span><span class="history-year">'+e.y+'</span><span class="history-text">'+e.t+'</span></div>';
    }).join('');
    this.style.display='none';
  }
});

// Explore more month events
document.getElementById('btn-explore-more').addEventListener('click',function(){
  if(!_birth)return;
  var m=_birth.getMonth()+1;
  var allMonthEvents=MONTH_EVENTS[m]||MONTH_EVENTS[8];
  var listEl=el('month-list');
  if(listEl){
    listEl.innerHTML=allMonthEvents.map(function(e){
      return '<div class="month-item"><span class="month-icon">'+e.icon+'</span><span class="month-year">'+e.y+'</span><span class="month-text">'+e.t+'</span><span class="month-arrow">\u203A</span></div>';
    }).join('');
    this.style.display='none';
  }
});

// Country more events
document.getElementById('btn-country-more').addEventListener('click',function(){
  if(!_birth)return;
  var events=getHistoryEvents(_birth);
  var countryEl=el('country-events');
  if(countryEl){
    countryEl.innerHTML=events.map(function(e){
      return '<div class="ce-item-sm"><span class="ce-year">'+e.y+'</span>'+e.t+'</div>';
    }).join('');
    this.style.display='none';
  }
});

// Hamburger
document.getElementById('hamburger').addEventListener('click',function(){
  var inputSec=el('input-section');
  inputSec.classList.remove('hidden');
  inputSec.scrollIntoView({behavior:'smooth',block:'center'});
});

// ── Scroll Reveal Observer ────────────────────────────────────
function initScrollReveal(){
  var els=document.querySelectorAll('.scene-reveal');
  if(!els.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){obs.observe(el);});
}

// ── Freeze Section Observer ───────────────────────────────────
function initFreezeObserver(){
  var sec=document.getElementById('freeze-section');
  if(!sec)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        sec.classList.add('freeze-active');
        // Reveal share section after freeze pause (1.4s line2 delay + 0.8s fade + 1.8s silence)
        setTimeout(function(){
          var shareEl=document.querySelector('.share-section');
          if(shareEl)shareEl.classList.add('share-visible');
        },4000);
        obs.unobserve(sec);
      }
    });
  },{threshold:0.4});
  obs.observe(sec);
}

// ── Daily Islamic Wisdom ──────────────────────────────────────
var WISDOM=[
  {q:'Indeed, with hardship comes ease.',s:'Quran 94:6'},
  {q:'The best among you are those who learn the Quran and teach it.',s:'Sahih Bukhari'},
  {q:'Do not lose hope in the mercy of Allah. Indeed, Allah forgives all sins.',s:'Quran 39:53'},
  {q:'Take advantage of five before five: your youth before old age, your health before sickness, your wealth before poverty, your free time before busyness, and your life before death.',s:'Prophet Muhammad ﷺ'},
  {q:'Speak good or remain silent.',s:'Sahih Bukhari & Muslim'},
  {q:'The strong person is not the one who can overpower others. The strong person is the one who controls himself when he is angry.',s:'Sahih Bukhari'},
  {q:'Make things easy, do not make them difficult. Give glad tidings, do not drive people away.',s:'Sahih Bukhari'},
  {q:'None of you truly believes until he loves for his brother what he loves for himself.',s:'Sahih Bukhari & Muslim'},
  {q:'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',s:'Sahih Bukhari'},
  {q:'The world is a prison for the believer and a paradise for the disbeliever.',s:'Sahih Muslim'},
  {q:'Be in this world as if you were a stranger or a traveler.',s:'Sahih Bukhari'},
  {q:'Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.',s:'Sahih Muslim'},
  {q:'Verily, the hearts of all the sons of Adam are between the two fingers of the Most Merciful as one heart.',s:'Sahih Muslim'},
  {q:'Whoever removes a worldly grief from a believer, Allah will remove from him one of the griefs of the Day of Judgment.',s:'Sahih Muslim'},
  {q:'The most beloved of deeds to Allah are those that are most consistent, even if they are small.',s:'Sahih Bukhari'},
];

var _wisdomIdx=0;
function initWisdom(){
  var qEl=el('wisdom-quote');
  var sEl=el('wisdom-source');
  var dotsEl=el('wisdom-dots');
  if(!qEl||!sEl)return;

  // Pick today's wisdom as default (rotates daily)
  var today=new Date();
  _wisdomIdx=(today.getFullYear()*366+today.getMonth()*31+today.getDate())%WISDOM.length;

  function renderWisdom(idx,animate){
    var w=WISDOM[idx];
    if(animate){
      qEl.classList.add('fading');sEl.classList.add('fading');
      setTimeout(function(){
        qEl.textContent='\u201C'+w.q+'\u201D';
        sEl.textContent='— '+w.s;
        qEl.classList.remove('fading');sEl.classList.remove('fading');
      },400);
    } else {
      qEl.textContent='\u201C'+w.q+'\u201D';
      sEl.textContent='— '+w.s;
    }
    // dots
    if(dotsEl){
      dotsEl.innerHTML=WISDOM.map(function(_,i){
        return '<div class="wisdom-dot'+(i===idx?' active':'')+'" data-i="'+i+'"></div>';
      }).join('');
      dotsEl.querySelectorAll('.wisdom-dot').forEach(function(d){
        d.addEventListener('click',function(){
          _wisdomIdx=parseInt(d.getAttribute('data-i'));
          renderWisdom(_wisdomIdx,true);
        });
      });
    }
  }

  renderWisdom(_wisdomIdx,false);

  var prevBtn=el('wisdom-prev');
  var nextBtn=el('wisdom-next');
  if(prevBtn)prevBtn.addEventListener('click',function(){
    _wisdomIdx=(_wisdomIdx-1+WISDOM.length)%WISDOM.length;
    renderWisdom(_wisdomIdx,true);
  });
  if(nextBtn)nextBtn.addEventListener('click',function(){
    _wisdomIdx=(_wisdomIdx+1)%WISDOM.length;
    renderWisdom(_wisdomIdx,true);
  });
}

// ── Personalities "View More" toggle ─────────────────────────
function initPersonalitiesToggle(){
  var grid=document.querySelector('.ps-grid');
  if(!grid)return;
  // Check if btn already exists
  if(document.getElementById('ps-view-more'))return;
  var btn=document.createElement('button');
  btn.id='ps-view-more';
  btn.className='ps-view-more-btn scene-reveal';
  btn.style.cssText='--reveal-delay:0.4s';
  btn.textContent='View More Personalities';
  btn.setAttribute('aria-expanded','false');
  grid.parentNode.insertBefore(btn,grid.nextSibling);
  btn.addEventListener('click',function(){
    var hidden=grid.querySelectorAll('.ps-card:nth-child(n+4)');
    var expanded=btn.getAttribute('aria-expanded')==='true';
    hidden.forEach(function(c){
      if(expanded){c.classList.remove('ps-visible');}
      else{c.classList.add('ps-visible');}
    });
    btn.setAttribute('aria-expanded',expanded?'false':'true');
    btn.textContent=expanded?'View More Personalities':'Show Less';
    if(!expanded)setTimeout(function(){initScrollReveal();},50);
  });
}

// ── PWA Install Prompt ────────────────────────────────────────
var _deferredInstall=null;
function initPWA(){
  // Upgrade prompt text
  var subEl=document.querySelector('.pwa-sub');
  if(subEl)subEl.textContent='Install for daily reflection — works offline';
  var installBtnText=el('pwa-install-btn');
  if(installBtnText)installBtnText.textContent='Install Free';

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    _deferredInstall=e;
    setTimeout(function(){
      var prompt=el('pwa-prompt');
      if(prompt)prompt.classList.remove('hidden');
    },8000);
  });

  var installBtn=el('pwa-install-btn');
  var dismissBtn=el('pwa-dismiss');

  if(installBtn){
    installBtn.addEventListener('click',function(){
      if(!_deferredInstall)return;
      _deferredInstall.prompt();
      _deferredInstall.userChoice.then(function(){
        _deferredInstall=null;
        var prompt=el('pwa-prompt');
        if(prompt)prompt.classList.add('hidden');
      });
    });
  }
  if(dismissBtn){
    dismissBtn.addEventListener('click',function(){
      var prompt=el('pwa-prompt');
      if(prompt)prompt.classList.add('hidden');
      localStorage.setItem('pwa_dismissed',Date.now());
    });
  }

  var dismissed=localStorage.getItem('pwa_dismissed');
  if(dismissed&&(Date.now()-parseInt(dismissed))<3*24*60*60*1000){
    window.removeEventListener('beforeinstallprompt',function(){});
  }
}
// ── Init ──────────────────────────────────────────────────────
initParticles();
initAyahReveal();
initScreenFade();
if(typeof initLang==='function')initLang();
initScrollReveal();
initFreezeObserver();
initFinalObserver();
initWisdom();
initPWA();
initPersonalitiesToggle();

// Restore last DOB
(function(){
  var savedDob=localStorage.getItem('aw_dob');
  if(savedDob){var inp=el('hero-dob');if(inp)inp.value=savedDob;}
})();
