'use strict';

// WaqtX Language System v1

var LANGS = {
  en: { code:'en', name:'English',          dir:'ltr' },
  ur: { code:'ur', name:'اردو',             dir:'rtl' },
  ar: { code:'ar', name:'العربية',          dir:'rtl' },
  hi: { code:'hi', name:'हिंदी',            dir:'ltr' },
  bn: { code:'bn', name:'বাংলা',            dir:'ltr' },
  tr: { code:'tr', name:'Türkçe',           dir:'ltr' },
  id: { code:'id', name:'Bahasa Indonesia', dir:'ltr' },
  fr: { code:'fr', name:'Français',         dir:'ltr' },
  fa: { code:'fa', name:'فارسی',            dir:'rtl' },
  ms: { code:'ms', name:'Malay',            dir:'ltr' }
};

var T = {
  en: {
    ayahTrans:    'Every soul shall taste death.',
    headline:     'Time was given to you.',
    headlineAccent:'And it is being taken back.',
    subtext:      'See your life through reflection — not prediction.',
    ctaReflect:   'Reflect on My Life',
    inputTop:     'You were brought into this world on a day chosen by Allah.',
    ctaBegin:     'Begin Reflection ⏳',
    loadMsg1:     'Analyzing your time…',
    loadMsg2:     'Every moment you\'ve lived…',
    loadMsg3:     'Every opportunity you were given…',
    wowLine1pre:  'You have had over',
    wowLine1post: 'chances to pray Fajr.',
    wowLine2:     'Only you know how many you kept.',
    wowLine3:     'And time… is still passing.',
    coreSub:      'Days that will never return.',
    ibadahTitle:  'In your lifetime, you were given:',
    ibadahRef:    'Each one was a chance to turn back to Allah.<br>Some you kept. Some you lost.<br><em>Only you know the truth.</em>',
    ramadanText:  'Nights of mercy. Days of forgiveness.<br>Some passed like any other days…<br>Some may have changed your life.',
    ramadanWarn:  'And more may never come.',
    reflP1:       'Most people think they have time.',
    reflP2:       'Until time quietly slips away.',
    reflP3:       'You planned your studies. Your career. Your future.',
    reflHL:       'But did you plan your',
    existP1:      'Millions share your birth date.',
    existP2:      'But no one will live your life.',
    existP3:      'No one will answer for your actions.',
    existHL:      'Your time is yours alone.<br>Your story is yours alone.',
    passL1:       'Years passed.',
    passL2:       'Without announcement. Without warning.',
    passL3:       'Moments turned into memories.',
    passL4:       'Memories turned into silence.',
    passL5:       'And most of it… felt like nothing.',
    freezeL1:     'Your time is not counted in days…',
    freezeL2:     'It is counted in what you did with them.',
    finalL1:      'You still have this moment.',
    finalL2:      'What will you do with it?',
    shareBtn:     '📿 Share Reflection',
    startAgain:   '🔁 Start Again',
    spcLabel:     'of my life has passed.',
    spcQuote:     'Only Allah knows what remains.<br>May I use my time better.',
    ummahTitle:   'The world you were born into',
    ummahText:    'When you were born, the Ummah was already moving through time.<br>Scholars were teaching. People were returning to Allah. Others were forgetting.<br><br>You entered a world already in motion.<br><em>And one day… you will leave it behind.</em>',
    planetTitle:  '🪐 Your Age Across the Universe',
    exploreBtn:   '✨ Explore Full Life Report',
    langLabel:    'Language'
  }
};

T.ur = {
  ayahTrans:    'ہر روح کو موت کا ذائقہ چکھنا ہے۔',
  headline:     'وقت آپ کو دیا گیا تھا۔',
  headlineAccent:'اور اسے واپس لیا جا رہا ہے۔',
  subtext:      'اپنی زندگی کو پیشین گوئی نہیں، غور و فکر سے دیکھیں۔',
  ctaReflect:   'اپنی زندگی پر غور کریں',
  inputTop:     'آپ کو اس دنیا میں اللہ کے چنے ہوئے دن لایا گیا۔',
  ctaBegin:     'غور شروع کریں ⏳',
  loadMsg1:     'آپ کے وقت کا تجزیہ ہو رہا ہے…',
  loadMsg2:     'آپ کی زندگی کا ہر لمحہ…',
  loadMsg3:     'آپ کو دیا گیا ہر موقع…',
  wowLine1pre:  'آپ کو نماز فجر کے',
  wowLine1post: 'مواقع ملے۔',
  wowLine2:     'صرف آپ جانتے ہیں کتنے ادا کیے۔',
  wowLine3:     'اور وقت… ابھی بھی گزر رہا ہے۔',
  coreSub:      'وہ دن جو کبھی واپس نہیں آئیں گے۔',
  ibadahTitle:  'آپ کی زندگی میں آپ کو دیا گیا:',
  ibadahRef:    'ہر موقع اللہ کی طرف لوٹنے کا موقع تھا۔<br>کچھ آپ نے ادا کیے۔ کچھ گنوا دیے۔<br><em>صرف آپ جانتے ہیں سچ۔</em>',
  ramadanText:  'رحمت کی راتیں۔ مغفرت کے دن۔<br>کچھ عام دنوں کی طرح گزر گئے…<br>کچھ نے شاید آپ کی زندگی بدل دی۔',
  ramadanWarn:  'اور شاید مزید کبھی نہ آئیں۔',
  reflP1:       'اکثر لوگ سوچتے ہیں کہ وقت ہے۔',
  reflP2:       'جب تک وقت خاموشی سے گزر جاتا ہے۔',
  reflP3:       'آپ نے تعلیم، کیریئر، مستقبل کی منصوبہ بندی کی۔',
  reflHL:       'لیکن کیا آپ نے اپنی',
  existP1:      'لاکھوں لوگ آپ کی تاریخ پیدائش شیئر کرتے ہیں۔',
  existP2:      'لیکن کوئی آپ کی زندگی نہیں جیئے گا۔',
  existP3:      'کوئی آپ کے اعمال کا جواب نہیں دے گا۔',
  existHL:      'آپ کا وقت صرف آپ کا ہے۔<br>آپ کی کہانی صرف آپ کی ہے۔',
  passL1:       'سال گزر گئے۔',
  passL2:       'بغیر اعلان کے۔ بغیر انتباہ کے۔',
  passL3:       'لمحے یادیں بن گئے۔',
  passL4:       'یادیں خاموشی بن گئیں۔',
  passL5:       'اور زیادہ تر… کچھ محسوس نہیں ہوا۔',
  freezeL1:     'آپ کا وقت دنوں میں نہیں گنا جاتا…',
  freezeL2:     'بلکہ اس میں جو آپ نے کیا۔',
  finalL1:      'ابھی بھی یہ لمحہ آپ کے پاس ہے۔',
  finalL2:      'آپ اس کے ساتھ کیا کریں گے؟',
  shareBtn:     '📿 غور شیئر کریں',
  startAgain:   '🔁 دوبارہ شروع کریں',
  spcLabel:     'میری زندگی گزر چکی ہے۔',
  spcQuote:     'صرف اللہ جانتا ہے کیا باقی ہے۔<br>کاش میں اپنا وقت بہتر استعمال کروں۔',
  ummahTitle:   'وہ دنیا جس میں آپ پیدا ہوئے',
  ummahText:    'جب آپ پیدا ہوئے، امت پہلے سے وقت میں آگے بڑھ رہی تھی۔<br>علماء پڑھا رہے تھے۔ لوگ اللہ کی طرف لوٹ رہے تھے۔<br><br>آپ ایک متحرک دنیا میں داخل ہوئے۔<br><em>اور ایک دن… آپ اسے پیچھے چھوڑ جائیں گے۔</em>',
  planetTitle:  '🪐 کائنات میں آپ کی عمر',
  exploreBtn:   '✨ مکمل رپورٹ دیکھیں',
  langLabel:    'زبان'
};

T.ar = {
  ayahTrans:    'كل نفس ستذوق الموت.',
  headline:     'الوقت أُعطي لك.',
  headlineAccent:'وهو يُؤخذ منك الآن.',
  subtext:      'انظر إلى حياتك بالتأمل — لا بالتنبؤ.',
  ctaReflect:   'تأمل في حياتي',
  inputTop:     'جئت إلى هذا العالم في يوم اختاره الله.',
  ctaBegin:     'ابدأ التأمل ⏳',
  loadMsg1:     'جارٍ تحليل وقتك…',
  loadMsg2:     'كل لحظة عشتها…',
  loadMsg3:     'كل فرصة أُعطيت لك…',
  wowLine1pre:  'لديك أكثر من',
  wowLine1post: 'فرصة لصلاة الفجر.',
  wowLine2:     'أنت وحدك تعرف كم أديت منها.',
  wowLine3:     'والوقت… لا يزال يمضي.',
  coreSub:      'أيام لن تعود أبداً.',
  ibadahTitle:  'في حياتك، أُعطيت:',
  ibadahRef:    'كل واحدة كانت فرصة للعودة إلى الله.<br>بعضها أديت. بعضها ضاع.<br><em>أنت وحدك تعرف الحقيقة.</em>',
  ramadanText:  'ليالي الرحمة. أيام المغفرة.<br>بعضها مرّ كأي يوم عادي…<br>بعضها ربما غيّر حياتك.',
  ramadanWarn:  'وقد لا يأتي المزيد.',
  reflP1:       'معظم الناس يظنون أن لديهم وقتاً.',
  reflP2:       'حتى يمضي الوقت بهدوء.',
  reflP3:       'خططت لدراستك. مسيرتك. مستقبلك.',
  reflHL:       'لكن هل خططت لـ',
  existP1:      'الملايين يشاركونك تاريخ ميلادك.',
  existP2:      'لكن لن يعيش أحد حياتك.',
  existP3:      'لن يجيب أحد عن أعمالك.',
  existHL:      'وقتك لك وحدك.<br>قصتك لك وحدك.',
  passL1:       'مرّت السنون.',
  passL2:       'بلا إعلان. بلا تحذير.',
  passL3:       'تحولت اللحظات إلى ذكريات.',
  passL4:       'تحولت الذكريات إلى صمت.',
  passL5:       'ومعظمها… لم يُحسّ بشيء.',
  freezeL1:     'وقتك لا يُحسب بالأيام…',
  freezeL2:     'بل بما فعلته فيها.',
  finalL1:      'لا يزال هذا اللحظة بين يديك.',
  finalL2:      'ماذا ستفعل بها؟',
  shareBtn:     '📿 شارك تأملك',
  startAgain:   '🔁 ابدأ من جديد',
  spcLabel:     'من حياتي قد مضى.',
  spcQuote:     'الله وحده يعلم ما تبقى.<br>أسأل الله أن أستثمر وقتي.',
  ummahTitle:   'العالم الذي وُلدت فيه',
  ummahText:    'حين وُلدت، كانت الأمة تسير في الزمن.<br>العلماء يعلّمون. الناس يعودون إلى الله.<br><br>دخلت عالماً في حركة دائمة.<br><em>ويوماً ما… ستتركه خلفك.</em>',
  planetTitle:  '🪐 عمرك عبر الكون',
  exploreBtn:   '✨ استكشف التقرير الكامل',
  langLabel:    'اللغة'
};

T.hi = {
  ayahTrans:    'हर आत्मा को मृत्यु का स्वाद चखना है।',
  headline:     'समय आपको दिया गया था।',
  headlineAccent:'और इसे वापस लिया जा रहा है।',
  subtext:      'अपने जीवन को भविष्यवाणी नहीं, चिंतन से देखें।',
  ctaReflect:   'अपने जीवन पर विचार करें',
  inputTop:     'आप इस दुनिया में अल्लाह के चुने हुए दिन आए।',
  ctaBegin:     'चिंतन शुरू करें ⏳',
  loadMsg1:     'आपके समय का विश्लेषण हो रहा है…',
  loadMsg2:     'आपके जीवन का हर पल…',
  loadMsg3:     'आपको दिया गया हर अवसर…',
  wowLine1pre:  'आपको फज्र की नमाज़ के',
  wowLine1post: 'अवसर मिले।',
  wowLine2:     'केवल आप जानते हैं कितने अदा किए।',
  wowLine3:     'और समय… अभी भी बीत रहा है।',
  coreSub:      'वे दिन जो कभी वापस नहीं आएंगे।',
  ibadahTitle:  'आपके जीवन में आपको दिया गया:',
  ibadahRef:    'हर मौका अल्लाह की ओर लौटने का था।<br>कुछ आपने अदा किए। कुछ खो दिए।<br><em>केवल आप सच जानते हैं।</em>',
  ramadanText:  'रहमत की रातें। माफी के दिन।<br>कुछ सामान्य दिनों की तरह बीत गए…<br>कुछ ने शायद आपकी जिंदगी बदल दी।',
  ramadanWarn:  'और शायद और कभी न आएं।',
  reflP1:       'अधिकांश लोग सोचते हैं कि समय है।',
  reflP2:       'जब तक समय चुपचाप बीत जाता है।',
  reflP3:       'आपने पढ़ाई, करियर, भविष्य की योजना बनाई।',
  reflHL:       'लेकिन क्या आपने अपनी',
  existP1:      'लाखों लोग आपकी जन्म तिथि साझा करते हैं।',
  existP2:      'लेकिन कोई आपका जीवन नहीं जिएगा।',
  existP3:      'कोई आपके कार्यों का जवाब नहीं देगा।',
  existHL:      'आपका समय केवल आपका है।<br>आपकी कहानी केवल आपकी है।',
  passL1:       'साल बीत गए।',
  passL2:       'बिना घोषणा के। बिना चेतावनी के।',
  passL3:       'पल यादें बन गए।',
  passL4:       'यादें खामोशी बन गईं।',
  passL5:       'और अधिकांश… कुछ महसूस नहीं हुआ।',
  freezeL1:     'आपका समय दिनों में नहीं गिना जाता…',
  freezeL2:     'बल्कि उसमें जो आपने किया।',
  finalL1:      'अभी भी यह पल आपके पास है।',
  finalL2:      'आप इसके साथ क्या करेंगे?',
  shareBtn:     '📿 चिंतन साझा करें',
  startAgain:   '🔁 फिर से शुरू करें',
  spcLabel:     'मेरा जीवन बीत चुका है।',
  spcQuote:     'केवल अल्लाह जानता है क्या बचा है।<br>काश मैं अपना समय बेहतर उपयोग करूं।',
  ummahTitle:   'वह दुनिया जिसमें आप पैदा हुए',
  ummahText:    'जब आप पैदा हुए, उम्मत पहले से समय में आगे बढ़ रही थी।<br>आप एक गतिशील दुनिया में आए।<br><em>और एक दिन… आप इसे पीछे छोड़ जाएंगे।</em>',
  planetTitle:  '🪐 ब्रह्मांड में आपकी आयु',
  exploreBtn:   '✨ पूरी रिपोर्ट देखें',
  langLabel:    'भाषा'
};

T.bn = {
  ayahTrans:    'প্রতিটি আত্মাকে মৃত্যুর স্বাদ নিতে হবে।',
  headline:     'সময় আপনাকে দেওয়া হয়েছিল।',
  headlineAccent:'এবং এটি ফিরিয়ে নেওয়া হচ্ছে।',
  subtext:      'আপনার জীবনকে ভবিষ্যদ্বাণী নয়, প্রতিফলনের মাধ্যমে দেখুন।',
  ctaReflect:   'আমার জীবন নিয়ে ভাবুন',
  inputTop:     'আপনি আল্লাহর বেছে নেওয়া দিনে এই পৃথিবীতে এসেছিলেন।',
  ctaBegin:     'প্রতিফলন শুরু করুন ⏳',
  loadMsg1:     'আপনার সময় বিশ্লেষণ করা হচ্ছে…',
  loadMsg2:     'আপনার জীবনের প্রতিটি মুহূর্ত…',
  loadMsg3:     'আপনাকে দেওয়া প্রতিটি সুযোগ…',
  wowLine1pre:  'আপনার ফজর নামাজের',
  wowLine1post: 'সুযোগ ছিল।',
  wowLine2:     'শুধু আপনি জানেন কতটা আদায় করেছেন।',
  wowLine3:     'এবং সময়… এখনও চলছে।',
  coreSub:      'যে দিনগুলো আর ফিরবে না।',
  ibadahTitle:  'আপনার জীবনে আপনাকে দেওয়া হয়েছিল:',
  ibadahRef:    'প্রতিটি সুযোগ আল্লাহর দিকে ফেরার ছিল।<br>কিছু আদায় করেছেন। কিছু হারিয়েছেন।<br><em>শুধু আপনি সত্য জানেন।</em>',
  ramadanText:  'রহমতের রাত। ক্ষমার দিন।<br>কিছু সাধারণ দিনের মতো কেটে গেছে…<br>কিছু হয়তো আপনার জীবন বদলে দিয়েছে।',
  ramadanWarn:  'এবং আর নাও আসতে পারে।',
  reflP1:       'বেশিরভাগ মানুষ মনে করে সময় আছে।',
  reflP2:       'যতক্ষণে সময় চুপচাপ চলে যায়।',
  reflP3:       'আপনি পড়াশোনা, ক্যারিয়ার, ভবিষ্যতের পরিকল্পনা করেছেন।',
  reflHL:       'কিন্তু আপনি কি আপনার',
  existP1:      'লক্ষ লক্ষ মানুষ আপনার জন্মতারিখ ভাগ করে।',
  existP2:      'কিন্তু কেউ আপনার জীবন বাঁচবে না।',
  existP3:      'কেউ আপনার কাজের জবাব দেবে না।',
  existHL:      'আপনার সময় শুধু আপনার।<br>আপনার গল্প শুধু আপনার।',
  passL1:       'বছর কেটে গেছে।',
  passL2:       'ঘোষণা ছাড়া। সতর্কতা ছাড়া।',
  passL3:       'মুহূর্তগুলো স্মৃতি হয়ে গেছে।',
  passL4:       'স্মৃতিগুলো নীরবতা হয়ে গেছে।',
  passL5:       'এবং বেশিরভাগ… কিছু অনুভব হয়নি।',
  freezeL1:     'আপনার সময় দিনে গণনা হয় না…',
  freezeL2:     'বরং আপনি তাতে কী করেছেন।',
  finalL1:      'এখনও এই মুহূর্ত আপনার কাছে আছে।',
  finalL2:      'আপনি এটি দিয়ে কী করবেন?',
  shareBtn:     '📿 প্রতিফলন শেয়ার করুন',
  startAgain:   '🔁 আবার শুরু করুন',
  spcLabel:     'আমার জীবন কেটে গেছে।',
  spcQuote:     'শুধু আল্লাহ জানেন কী বাকি আছে।<br>আমি যেন আমার সময় ভালোভাবে ব্যবহার করি।',
  ummahTitle:   'যে পৃথিবীতে আপনি জন্মেছিলেন',
  ummahText:    'যখন আপনি জন্মেছিলেন, উম্মাহ ইতিমধ্যে সময়ের মধ্য দিয়ে এগিয়ে যাচ্ছিল।<br><em>এবং একদিন… আপনি এটি পিছনে রেখে যাবেন।</em>',
  planetTitle:  '🪐 মহাবিশ্বে আপনার বয়স',
  exploreBtn:   '✨ সম্পূর্ণ রিপোর্ট দেখুন',
  langLabel:    'ভাষা'
};

T.tr = {
  ayahTrans:    'Her nefis ölümü tadacaktır.',
  headline:     'Zaman sana verildi.',
  headlineAccent:'Ve geri alınıyor.',
  subtext:      'Hayatını tahminle değil, yansımayla gör.',
  ctaReflect:   'Hayatımı Yansıt',
  inputTop:     'Allah\'ın seçtiği bir günde bu dünyaya geldin.',
  ctaBegin:     'Yansımayı Başlat ⏳',
  loadMsg1:     'Zamanın analiz ediliyor…',
  loadMsg2:     'Yaşadığın her an…',
  loadMsg3:     'Sana verilen her fırsat…',
  wowLine1pre:  'Sabah namazı için',
  wowLine1post: 'fırsatın oldu.',
  wowLine2:     'Kaçını kıldığını yalnızca sen bilirsin.',
  wowLine3:     'Ve zaman… hâlâ geçiyor.',
  coreSub:      'Bir daha geri gelmeyecek günler.',
  ibadahTitle:  'Hayatında sana verildi:',
  ibadahRef:    'Her biri Allah\'a dönmek için bir fırsattı.<br>Bazılarını yerine getirdin. Bazılarını kaybettin.<br><em>Gerçeği yalnızca sen bilirsin.</em>',
  ramadanText:  'Rahmet geceleri. Bağışlanma günleri.<br>Bazıları sıradan günler gibi geçti…<br>Bazıları belki hayatını değiştirdi.',
  ramadanWarn:  'Ve belki bir daha gelmeyebilir.',
  reflP1:       'Çoğu insan zamanı olduğunu düşünür.',
  reflP2:       'Ta ki zaman sessizce geçip gidene kadar.',
  reflP3:       'Eğitimini, kariyerini, geleceğini planladın.',
  reflHL:       'Ama âhiretini planladın mı?',
  existP1:      'Milyonlarca kişi doğum tarihinizi paylaşıyor.',
  existP2:      'Ama kimse senin hayatını yaşamayacak.',
  existP3:      'Kimse senin eylemlerinden sorumlu olmayacak.',
  existHL:      'Zamanın yalnızca senin.<br>Hikayen yalnızca senin.',
  passL1:       'Yıllar geçti.',
  passL2:       'Duyurusuz. Uyarısız.',
  passL3:       'Anlar anılara dönüştü.',
  passL4:       'Anılar sessizliğe dönüştü.',
  passL5:       'Ve çoğu… hiçbir şey hissettirmedi.',
  freezeL1:     'Zamanın günlerle sayılmaz…',
  freezeL2:     'Onlarla ne yaptığınla sayılır.',
  finalL1:      'Hâlâ bu an sende.',
  finalL2:      'Onunla ne yapacaksın?',
  shareBtn:     '📿 Yansımayı Paylaş',
  startAgain:   '🔁 Yeniden Başla',
  spcLabel:     'hayatım geçti.',
  spcQuote:     'Yalnızca Allah ne kaldığını bilir.<br>Zamanımı daha iyi kullanmayı umuyorum.',
  ummahTitle:   'Doğduğun dünya',
  ummahText:    'Doğduğunda, ümmet zaten zamanda ilerliyordu.<br><em>Ve bir gün… onu geride bırakacaksın.</em>',
  planetTitle:  '🪐 Evrende Yaşın',
  exploreBtn:   '✨ Tam Raporu Keşfet',
  langLabel:    'Dil'
};

T.id = {
  ayahTrans:    'Setiap jiwa pasti akan merasakan kematian.',
  headline:     'Waktu diberikan kepadamu.',
  headlineAccent:'Dan sedang diambil kembali.',
  subtext:      'Lihat hidupmu melalui refleksi — bukan prediksi.',
  ctaReflect:   'Renungkan Hidupku',
  inputTop:     'Kamu dibawa ke dunia ini pada hari yang dipilih Allah.',
  ctaBegin:     'Mulai Renungan ⏳',
  loadMsg1:     'Menganalisis waktumu…',
  loadMsg2:     'Setiap momen yang kamu jalani…',
  loadMsg3:     'Setiap kesempatan yang diberikan kepadamu…',
  wowLine1pre:  'Kamu memiliki lebih dari',
  wowLine1post: 'kesempatan untuk shalat Subuh.',
  wowLine2:     'Hanya kamu yang tahu berapa yang kamu lakukan.',
  wowLine3:     'Dan waktu… masih terus berlalu.',
  coreSub:      'Hari-hari yang tidak akan pernah kembali.',
  ibadahTitle:  'Dalam hidupmu, kamu diberikan:',
  ibadahRef:    'Setiap satu adalah kesempatan untuk kembali kepada Allah.<br>Sebagian kamu lakukan. Sebagian hilang.<br><em>Hanya kamu yang tahu kebenarannya.</em>',
  ramadanText:  'Malam-malam rahmat. Hari-hari pengampunan.<br>Sebagian berlalu seperti hari biasa…<br>Sebagian mungkin mengubah hidupmu.',
  ramadanWarn:  'Dan mungkin tidak akan datang lagi.',
  reflP1:       'Kebanyakan orang berpikir mereka punya waktu.',
  reflP2:       'Sampai waktu berlalu dengan diam.',
  reflP3:       'Kamu merencanakan studi, karier, masa depanmu.',
  reflHL:       'Tapi apakah kamu merencanakan',
  existP1:      'Jutaan orang berbagi tanggal lahirmu.',
  existP2:      'Tapi tidak ada yang akan menjalani hidupmu.',
  existP3:      'Tidak ada yang akan menjawab atas tindakanmu.',
  existHL:      'Waktumu hanya milikmu.<br>Kisahmu hanya milikmu.',
  passL1:       'Tahun-tahun berlalu.',
  passL2:       'Tanpa pengumuman. Tanpa peringatan.',
  passL3:       'Momen berubah menjadi kenangan.',
  passL4:       'Kenangan berubah menjadi keheningan.',
  passL5:       'Dan sebagian besar… terasa seperti tidak ada.',
  freezeL1:     'Waktumu tidak dihitung dalam hari…',
  freezeL2:     'Tapi dalam apa yang kamu lakukan dengannya.',
  finalL1:      'Kamu masih memiliki momen ini.',
  finalL2:      'Apa yang akan kamu lakukan dengannya?',
  shareBtn:     '📿 Bagikan Renungan',
  startAgain:   '🔁 Mulai Lagi',
  spcLabel:     'hidupku telah berlalu.',
  spcQuote:     'Hanya Allah yang tahu apa yang tersisa.<br>Semoga aku menggunakan waktuku lebih baik.',
  ummahTitle:   'Dunia tempat kamu dilahirkan',
  ummahText:    'Ketika kamu lahir, Umat sudah bergerak melalui waktu.<br><em>Dan suatu hari… kamu akan meninggalkannya.</em>',
  planetTitle:  '🪐 Usiamu di Seluruh Alam Semesta',
  exploreBtn:   '✨ Jelajahi Laporan Lengkap',
  langLabel:    'Bahasa'
};

T.fr = {
  ayahTrans:    'Toute âme goûtera la mort.',
  headline:     'Le temps t\'a été donné.',
  headlineAccent:'Et il est en train d\'être repris.',
  subtext:      'Vois ta vie à travers la réflexion — pas la prédiction.',
  ctaReflect:   'Réfléchir à ma vie',
  inputTop:     'Tu as été amené dans ce monde un jour choisi par Allah.',
  ctaBegin:     'Commencer la réflexion ⏳',
  loadMsg1:     'Analyse de ton temps…',
  loadMsg2:     'Chaque moment que tu as vécu…',
  loadMsg3:     'Chaque opportunité qui t\'a été donnée…',
  wowLine1pre:  'Tu as eu plus de',
  wowLine1post: 'chances de prier Fajr.',
  wowLine2:     'Toi seul sais combien tu en as accompli.',
  wowLine3:     'Et le temps… passe encore.',
  coreSub:      'Des jours qui ne reviendront jamais.',
  ibadahTitle:  'Dans ta vie, tu as reçu:',
  ibadahRef:    'Chacune était une chance de revenir à Allah.<br>Certaines tu les as accomplies. D\'autres tu les as perdues.<br><em>Toi seul connais la vérité.</em>',
  ramadanText:  'Nuits de miséricorde. Jours de pardon.<br>Certains sont passés comme des jours ordinaires…<br>Certains ont peut-être changé ta vie.',
  ramadanWarn:  'Et d\'autres ne viendront peut-être plus.',
  reflP1:       'La plupart des gens pensent avoir le temps.',
  reflP2:       'Jusqu\'à ce que le temps passe silencieusement.',
  reflP3:       'Tu as planifié tes études, ta carrière, ton avenir.',
  reflHL:       'Mais as-tu planifié ton',
  existP1:      'Des millions partagent ta date de naissance.',
  existP2:      'Mais personne ne vivra ta vie.',
  existP3:      'Personne ne répondra de tes actes.',
  existHL:      'Ton temps t\'appartient.<br>Ton histoire t\'appartient.',
  passL1:       'Les années ont passé.',
  passL2:       'Sans annonce. Sans avertissement.',
  passL3:       'Les moments sont devenus des souvenirs.',
  passL4:       'Les souvenirs sont devenus silence.',
  passL5:       'Et la plupart… ne semblaient rien.',
  freezeL1:     'Ton temps ne se compte pas en jours…',
  freezeL2:     'Mais en ce que tu en as fait.',
  finalL1:      'Tu as encore ce moment.',
  finalL2:      'Qu\'en feras-tu?',
  shareBtn:     '📿 Partager ma réflexion',
  startAgain:   '🔁 Recommencer',
  spcLabel:     'de ma vie s\'est écoulée.',
  spcQuote:     'Seul Allah sait ce qui reste.<br>Puissé-je mieux utiliser mon temps.',
  ummahTitle:   'Le monde dans lequel tu es né',
  ummahText:    'Quand tu es né, la Oumma avançait déjà dans le temps.<br><em>Et un jour… tu la laisseras derrière toi.</em>',
  planetTitle:  '🪐 Ton âge à travers l\'univers',
  exploreBtn:   '✨ Explorer le rapport complet',
  langLabel:    'Langue'
};

T.fa = {
  ayahTrans:    'هر نفسی چشنده مرگ است.',
  headline:     'زمان به تو داده شد.',
  headlineAccent:'و دارد پس گرفته می‌شود.',
  subtext:      'زندگی‌ات را از طریق تأمل ببین — نه پیش‌بینی.',
  ctaReflect:   'در زندگی‌ام تأمل کنم',
  inputTop:     'در روزی که خدا انتخاب کرد به این دنیا آمدی.',
  ctaBegin:     'شروع تأمل ⏳',
  loadMsg1:     'در حال تحلیل زمان شما…',
  loadMsg2:     'هر لحظه‌ای که زیستی…',
  loadMsg3:     'هر فرصتی که به تو داده شد…',
  wowLine1pre:  'بیش از',
  wowLine1post: 'فرصت برای نماز صبح داشتی.',
  wowLine2:     'فقط تو می‌دانی چند تا را خواندی.',
  wowLine3:     'و زمان… هنوز می‌گذرد.',
  coreSub:      'روزهایی که هرگز برنمی‌گردند.',
  ibadahTitle:  'در زندگی‌ات به تو داده شد:',
  ibadahRef:    'هر کدام فرصتی برای بازگشت به خدا بود.<br>برخی را انجام دادی. برخی را از دست دادی.<br><em>فقط تو حقیقت را می‌دانی.</em>',
  ramadanText:  'شب‌های رحمت. روزهای مغفرت.<br>برخی مثل روزهای عادی گذشت…<br>برخی شاید زندگی‌ات را تغییر داد.',
  ramadanWarn:  'و شاید دیگر نیاید.',
  reflP1:       'اکثر مردم فکر می‌کنند وقت دارند.',
  reflP2:       'تا زمانی که وقت آرام می‌گذرد.',
  reflP3:       'تحصیل، شغل، آینده‌ات را برنامه‌ریزی کردی.',
  reflHL:       'اما آیا آخرتت را برنامه‌ریزی کردی؟',
  existP1:      'میلیون‌ها نفر تاریخ تولدت را دارند.',
  existP2:      'اما هیچ‌کس زندگی تو را نخواهد زیست.',
  existP3:      'هیچ‌کس پاسخگوی اعمال تو نخواهد بود.',
  existHL:      'زمانت فقط مال توست.<br>داستانت فقط مال توست.',
  passL1:       'سال‌ها گذشت.',
  passL2:       'بدون اعلام. بدون هشدار.',
  passL3:       'لحظات به خاطرات تبدیل شدند.',
  passL4:       'خاطرات به سکوت تبدیل شدند.',
  passL5:       'و بیشترشان… هیچ احساسی نداشت.',
  freezeL1:     'زمانت با روزها شمرده نمی‌شود…',
  freezeL2:     'بلکه با آنچه در آن‌ها کردی.',
  finalL1:      'هنوز این لحظه را داری.',
  finalL2:      'با آن چه خواهی کرد؟',
  shareBtn:     '📿 اشتراک‌گذاری تأمل',
  startAgain:   '🔁 شروع دوباره',
  spcLabel:     'از زندگی‌ام گذشته.',
  spcQuote:     'فقط خدا می‌داند چه باقی مانده.<br>کاش زمانم را بهتر استفاده کنم.',
  ummahTitle:   'دنیایی که در آن متولد شدی',
  ummahText:    'وقتی متولد شدی، امت از قبل در حال حرکت بود.<br><em>و روزی… آن را پشت سر خواهی گذاشت.</em>',
  planetTitle:  '🪐 سن تو در سراسر کیهان',
  exploreBtn:   '✨ گزارش کامل را کاوش کن',
  langLabel:    'زبان'
};

T.ms = {
  ayahTrans:    'Setiap jiwa pasti akan merasai mati.',
  headline:     'Masa diberikan kepadamu.',
  headlineAccent:'Dan ia sedang diambil kembali.',
  subtext:      'Lihat hidupmu melalui renungan — bukan ramalan.',
  ctaReflect:   'Renungkan Hidupku',
  inputTop:     'Kamu dibawa ke dunia ini pada hari yang dipilih Allah.',
  ctaBegin:     'Mulakan Renungan ⏳',
  loadMsg1:     'Menganalisis masamu…',
  loadMsg2:     'Setiap saat yang kamu lalui…',
  loadMsg3:     'Setiap peluang yang diberikan kepadamu…',
  wowLine1pre:  'Kamu mempunyai lebih dari',
  wowLine1post: 'peluang untuk solat Subuh.',
  wowLine2:     'Hanya kamu yang tahu berapa yang kamu lakukan.',
  wowLine3:     'Dan masa… masih berlalu.',
  coreSub:      'Hari-hari yang tidak akan kembali.',
  ibadahTitle:  'Dalam hidupmu, kamu diberikan:',
  ibadahRef:    'Setiap satu adalah peluang untuk kembali kepada Allah.<br>Sebahagian kamu lakukan. Sebahagian hilang.<br><em>Hanya kamu yang tahu kebenarannya.</em>',
  ramadanText:  'Malam-malam rahmat. Hari-hari keampunan.<br>Sebahagian berlalu seperti hari biasa…<br>Sebahagian mungkin mengubah hidupmu.',
  ramadanWarn:  'Dan mungkin tidak akan datang lagi.',
  reflP1:       'Kebanyakan orang fikir mereka ada masa.',
  reflP2:       'Sehingga masa berlalu dengan senyap.',
  reflP3:       'Kamu merancang pelajaran, kerjaya, masa depanmu.',
  reflHL:       'Tapi adakah kamu merancang',
  existP1:      'Berjuta-juta orang berkongsi tarikh lahirmu.',
  existP2:      'Tapi tiada siapa yang akan menjalani hidupmu.',
  existP3:      'Tiada siapa yang akan menjawab atas tindakanmu.',
  existHL:      'Masamu hanya milikmu.<br>Kisahmu hanya milikmu.',
  passL1:       'Tahun-tahun berlalu.',
  passL2:       'Tanpa pengumuman. Tanpa amaran.',
  passL3:       'Saat bertukar menjadi kenangan.',
  passL4:       'Kenangan bertukar menjadi kesunyian.',
  passL5:       'Dan kebanyakannya… terasa seperti tiada.',
  freezeL1:     'Masamu tidak dikira dalam hari…',
  freezeL2:     'Tetapi dalam apa yang kamu lakukan dengannya.',
  finalL1:      'Kamu masih mempunyai saat ini.',
  finalL2:      'Apa yang akan kamu lakukan dengannya?',
  shareBtn:     '📿 Kongsi Renungan',
  startAgain:   '🔁 Mulakan Semula',
  spcLabel:     'hidupku telah berlalu.',
  spcQuote:     'Hanya Allah yang tahu apa yang tinggal.<br>Semoga aku menggunakan masaku dengan lebih baik.',
  ummahTitle:   'Dunia tempat kamu dilahirkan',
  ummahText:    'Ketika kamu lahir, Ummah sudah bergerak melalui masa.<br><em>Dan suatu hari… kamu akan meninggalkannya.</em>',
  planetTitle:  '🪐 Usiamu Merentasi Alam Semesta',
  exploreBtn:   '✨ Terokai Laporan Penuh',
  langLabel:    'Bahasa'
};

// ── Language Engine ───────────────────────────────────────────
var _currentLang = 'en';

function getLang(){ return _currentLang; }

function t(key){
  var lang = T[_currentLang] || T.en;
  return lang[key] !== undefined ? lang[key] : (T.en[key] || '');
}

function applyLang(code, animate){
  if(!T[code]) code = 'en';
  _currentLang = code;
  localStorage.setItem('waqtx_lang', code);

  var lang = LANGS[code];
  var isRTL = lang.dir === 'rtl';

  function doApply(){
    // Direction
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', lang.dir);
    document.body.classList.toggle('rtl', isRTL);

    // Hero
    var ayahTrans = document.querySelector('.hero-ayah-trans');
    if(ayahTrans) ayahTrans.textContent = t('ayahTrans');

    var hl = document.querySelector('.hero-headline');
    if(hl) hl.innerHTML = t('headline') + '<br><span class="hero-headline-accent">' + t('headlineAccent') + '</span>';

    var sub = document.querySelector('.hero-subtext');
    if(sub) sub.textContent = t('subtext');

    var btnR = document.getElementById('btn-reveal');
    if(btnR) btnR.textContent = t('ctaReflect');
    var btnN = document.getElementById('btn-nav-calc');
    if(btnN) btnN.textContent = t('ctaReflect');

    // Input
    var inputTop = document.querySelector('.input-card-top');
    if(inputTop) inputTop.textContent = t('inputTop');
    var btnCalc = document.getElementById('btn-calculate');
    if(btnCalc) btnCalc.textContent = t('ctaBegin');

    // Ibadah
    var ibTitle = document.querySelector('.ibadah-title');
    if(ibTitle) ibTitle.textContent = t('ibadahTitle');
    var ibRef = document.querySelector('.ibadah-reflection');
    if(ibRef) ibRef.innerHTML = t('ibadahRef');

    // Ramadan
    var ramText = document.querySelector('.ramadan-text');
    if(ramText) ramText.innerHTML = t('ramadanText') + '<br><span class="ramadan-warning">' + t('ramadanWarn') + '</span>';

    // Reflection
    var rps = document.querySelectorAll('.reflection-inner p');
    var rkeys = ['reflP1','reflP2','reflP3'];
    rps.forEach(function(p,i){ if(rkeys[i] && !p.classList.contains('reflection-highlight')) p.textContent = t(rkeys[i]); });
    var rhl = document.querySelector('.reflection-highlight');
    if(rhl) rhl.innerHTML = t('reflHL') + ' <span class="arabic-inline">آخِرَة</span>؟';

    // Existence
    var eps = document.querySelectorAll('.existence-inner p');
    var ekeys = ['existP1','existP2','existP3'];
    eps.forEach(function(p,i){ if(ekeys[i] && !p.classList.contains('existence-highlight')) p.textContent = t(ekeys[i]); });
    var ehl = document.querySelector('.existence-highlight');
    if(ehl) ehl.innerHTML = t('existHL');

    // Passing
    var plines = document.querySelectorAll('.passing-line');
    var pkeys = ['passL1','passL2','passL3','passL4','passL5'];
    plines.forEach(function(l,i){ if(pkeys[i]) l.textContent = t(pkeys[i]); });

    // Freeze
    var fl1 = document.querySelector('.freeze-line1');
    var fl2 = document.querySelector('.freeze-line2');
    if(fl1) fl1.textContent = t('freezeL1');
    if(fl2) fl2.textContent = t('freezeL2');

    // Final
    var fn1 = document.querySelector('.final-line1');
    var fn2 = document.querySelector('.final-line2');
    if(fn1) fn1.textContent = t('finalL1');
    if(fn2) fn2.textContent = t('finalL2');

    // Share
    var btnShare = document.getElementById('btn-share-reflection');
    if(btnShare) btnShare.textContent = t('shareBtn');
    var btnAgain = document.getElementById('btn-start-again');
    if(btnAgain) btnAgain.textContent = t('startAgain');
    var spcLbl = document.querySelector('.spc-label');
    if(spcLbl) spcLbl.textContent = t('spcLabel');
    var spcQ = document.querySelector('.spc-quote');
    if(spcQ) spcQ.innerHTML = t('spcQuote');

    // Ummah
    var uTitle = document.querySelector('.ummah-title');
    if(uTitle) uTitle.textContent = t('ummahTitle');
    var uText = document.querySelector('.ummah-text');
    if(uText) uText.innerHTML = t('ummahText');

    // Planet
    var pTitle = document.querySelector('.planet-section-title');
    if(pTitle) pTitle.textContent = t('planetTitle');

    // Explore
    var expBtn = document.getElementById('explore-toggle-text');
    if(expBtn && expBtn.textContent.indexOf('Hide') === -1) expBtn.textContent = t('exploreBtn');

    // Core sub
    var cSub = document.querySelector('.core-sub');
    if(cSub) cSub.textContent = t('coreSub');

    // WOW lines (if results shown)
    var w2 = document.getElementById('wow-line2');
    if(w2) w2.textContent = t('wowLine2');
    var w3 = document.getElementById('wow-line3');
    if(w3) w3.textContent = t('wowLine3');

    // Update lang panel active state
    document.querySelectorAll('.lang-option').forEach(function(opt){
      opt.classList.toggle('active', opt.getAttribute('data-lang') === code);
    });
  }

  if(animate){
    document.body.style.opacity = '0.5';
    document.body.style.transition = 'opacity 0.35s ease';
    setTimeout(function(){
      doApply();
      document.body.style.opacity = '1';
      setTimeout(function(){ document.body.style.transition = ''; }, 400);
    }, 350);
  } else {
    doApply();
  }
}

function getLoadMsgs(){
  return [t('loadMsg1'), t('loadMsg2'), t('loadMsg3')];
}

// ── Language Panel ────────────────────────────────────────────
function buildLangPanel(){
  var panel = document.createElement('div');
  panel.id = 'lang-panel';
  panel.className = 'lang-panel hidden';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Choose language');
  panel.innerHTML =
    '<div class="lang-panel-inner">' +
      '<div class="lang-panel-title">🌐 ' + t('langLabel') + '</div>' +
      '<div class="lang-grid">' +
        Object.keys(LANGS).map(function(code){
          var l = LANGS[code];
          return '<button class="lang-option' + (code === _currentLang ? ' active' : '') + '" data-lang="' + code + '">' + l.name + '</button>';
        }).join('') +
      '</div>' +
    '</div>' +
    '<div class="lang-panel-backdrop"></div>';
  document.body.appendChild(panel);

  // Option click
  panel.querySelectorAll('.lang-option').forEach(function(btn){
    btn.addEventListener('click', function(){
      var code = btn.getAttribute('data-lang');
      closeLangPanel();
      applyLang(code, true);
    });
  });

  // Backdrop click
  panel.querySelector('.lang-panel-backdrop').addEventListener('click', closeLangPanel);
}

function openLangPanel(){
  var panel = document.getElementById('lang-panel');
  if(!panel) return;
  // Refresh title in current lang
  var title = panel.querySelector('.lang-panel-title');
  if(title) title.textContent = '🌐 ' + t('langLabel');
  panel.classList.remove('hidden');
  requestAnimationFrame(function(){ panel.classList.add('open'); });
}

function closeLangPanel(){
  var panel = document.getElementById('lang-panel');
  if(!panel) return;
  panel.classList.remove('open');
  setTimeout(function(){ panel.classList.add('hidden'); }, 350);
}

// ── First-visit language picker ───────────────────────────────
function initLang(){
  var saved = localStorage.getItem('waqtx_lang');
  var firstVisit = !localStorage.getItem('waqtx_visited');

  if(saved && T[saved]){
    _currentLang = saved;
    applyLang(saved, false);
  }

  buildLangPanel();

  // Globe button in navbar
  var navActions = document.querySelector('.nav-actions');
  if(navActions){
    var globeBtn = document.createElement('button');
    globeBtn.className = 'btn-lang-globe';
    globeBtn.setAttribute('aria-label','Change language');
    globeBtn.innerHTML = '🌐';
    globeBtn.addEventListener('click', openLangPanel);
    navActions.insertBefore(globeBtn, navActions.firstChild);
  }

  // First visit: show picker after 1s
  if(firstVisit){
    localStorage.setItem('waqtx_visited','1');
    setTimeout(openLangPanel, 1200);
  }
}
