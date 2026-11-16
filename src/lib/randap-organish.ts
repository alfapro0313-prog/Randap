export type OrganishBullet = {
  lead?: string;
  text: string;
};

export type OrganishSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: OrganishBullet[];
};

export type OrganishTopic = {
  id: string;
  title: string;
  subtitle: string;
  readMin: number;
  icon: "languages" | "brain" | "calculator" | "landmark";
  color: "rose" | "violet" | "amber" | "emerald";
  intro: string;
  sections: OrganishSection[];
};

export const ORGANISH_TOPICS: OrganishTopic[] = [
  {
    id: "ingliz-tili",
    title: "Ingliz tili",
    subtitle: "To'rt ko'nikma, grammatika poydevori va kunlik 30 daqiqalik rejim",
    readMin: 7,
    icon: "languages",
    color: "rose",
    intro:
      "Ingliz tili — dunyodagi eng ko'p ishlatiladigan tillardan biri. Unda taxminan 1,5 milliarddan ortiq odam gaplashadi, internetdagi ma'lumotlarning katta qismi, ilmiy maqolalar va xalqaro kompaniyalardagi ish o'rinlari aynan shu tilda. Ingliz tilini bilish shunchaki fan emas — bu yangi bilimlar, yangi do'stlar va yangi ish imkoniyatlariga ochiladigan kalitdir. Bu maqolada tilni noldan yoki mavjud darajadan yanada yuqoriga olib chiqish uchun aniq, amaliy yo'l bilan tanishasiz.",
    sections: [
      {
        heading: "To'rt asosiy ko'nikma",
        paragraphs: [
          "Til o'zlashtirish to'rt ko'nikma ustida quriladi. Ularning har birini alohida mashq qilish kerak — chunki faqat grammatika yoki faqat tinglash bilan gapiruvchi odamni chiqarib bo'lmaydi.",
        ],
        bullets: [
          {
            lead: "Tinglab tushunish (listening)",
            text: "kuniga kamida 10-15 daqiqa podcast, audiokitob yoki subtitrli video tinglang. Birinchi navbatda tushunarsiz so'zlarni yozib oling, so'ng ma'nosini toping.",
          },
          {
            lead: "Gapirish (speaking)",
            text: "ovoz chiqarib gapirish — eng muhim mashq. Kundalik mavzularda o'zingiz bilan gaplashing, ovozingizni yozib olib tinglang, xatolaringni ko'ring.",
          },
          {
            lead: "O'qish (reading)",
            text: "darajangizga mos qisqa hikoyalar va graded reader kitoblardan boshlang. Har sahifada 5-7 tadan yangi so'z yozib boring.",
          },
          {
            lead: "Yozish (writing)",
            text: "qisqa kundalik yurit: har kuni 5 gap bilan nima qilganingizni yozing. Bu grammatika va so'z boyligini bir vaqtda mustahkamlaydi.",
          },
        ],
      },
      {
        heading: "Grammatikadan boshlash joyi",
        paragraphs: [
          "Grammatikani hammasini birdan o'rganishga shoshilmang. Quyidagi to'rt zamir (zamon) bilan siz kundalik suhbatning 70-80 foizini qoplaysiz.",
        ],
        bullets: [
          {
            lead: "Present Simple",
            text: "muntazam qilinadigan ishlar uchun — I study English every day (Men har kuni ingliz tili o'rganaman).",
          },
          {
            lead: "Present Continuous",
            text: "hozir bo'layotgan harakat uchun — I am reading a book now (Men hozir kitob o'qiyapman).",
          },
          {
            lead: "Past Simple",
            text: "o'tgan zamondagi tugallangan ishlar uchun — I watched a film yesterday (Kecha film ko'rdim).",
          },
          {
            lead: "Future (will / going to)",
            text: "kelgusidagi reja va niyatlar uchun — I will visit Samarkand next month.",
          },
          {
            lead: "So'z tartibi",
            text: "inglizcha gap har doim Subyekt + Fe'l + Obyekt tartibida quriladi: She (u) plays (o'ynaydi) football (futbol).",
          },
        ],
      },
      {
        heading: "So'z yodlashning samarali yo'li",
        paragraphs: [
          "So'z boyligi — tilning qoni. Lekin so'zlarni ro'yxat bo'lib yodlash tez unutiladi. Gap ichida, mavzular bo'yicha va takrorlash orqali yodlangan so'zlar uzoq qoladi.",
        ],
        bullets: [
          {
            lead: "Kuniga 10 ta so'z",
            text: "ko'p emas, lekin muntazam. Bir yilda bu 3650 so'z degani — kundalik suhbat uchun etarli.",
          },
          {
            lead: "Gap ichida yodlash",
            text: "water so'zini yakka yodlash o'rniga I drink water every day deb yodlang — fe'l va qo'shimchalar bilan birga o'rnashadi.",
          },
          {
            lead: "Flashcard usuli",
            text: "Anki yoki qog'oz kartochkalarda bir tomonda inglizcha, ikkinchi tomonda o'zbekcha va misol gap yozib boring.",
          },
          {
            lead: "1-3-7-21 qoidasi",
            text: "yangi so'zni 1 kun, 3 kun, 7 kun va 21 kundan keyin takrorlang — bu interval bilan takrorlash (spaced repetition) usulining soddalashtirilgan ko'rinishi.",
          },
        ],
      },
      {
        heading: "30 daqiqalik kunlik rejim",
        paragraphs: [
          "Har kuni 30 daqiqa muntazam ishlagan odam, haftasiga bir marta 5 soat o'tirgan odamdan tezroq natijaga erishadi. Mana sodda va amaliy rejim:",
        ],
        bullets: [
          {
            lead: "1-10 daqiqa",
            text: "oldingi kunlari yodlagan so'zlaringizni takrorlash (flashcard).",
          },
          {
            lead: "11-20 daqiqa",
            text: "bitta grammatik mavzu va 10-15 ta mashq yoki qisqa matn o'qish.",
          },
          {
            lead: "21-30 daqiqa",
            text: "tinglash + ovozingizni chiqarib takrorlash (shadowing) yoki kundalik yozish.",
          },
        ],
      },
      {
        heading: "Ko'p uchraydigan xatolar",
        bullets: [
          {
            lead: "So'zma-so'z tarjima",
            text: "har bir o'zbekcha so'zni inglizchaga aniq mos qo'yishga urinish xato keltiradi. Iboralarni butunlay o'rganing.",
          },
          {
            lead: "Mashqsiz grammatika",
            text: "qoidani o'qibgina bilib bo'lmaydi — har qoidani o'z gaplaringizda qo'llab ko'ring.",
          },
          {
            lead: "Gapirishdan qochish",
            text: "xato qilishdan qo'rqmang — til o'rganuvchining eng katta dushmani jimlikdir.",
          },
          {
            lead: "Muntazamlik yo'qligi",
            text: "bir kunda 4 soat, keyin ikki hafta dam olish — bu yo'l natija bermaydi. Kichik, lekin har kunlik mashq eng kuchlidir.",
          },
        ],
      },
    ],
  },
  {
    id: "xotira",
    title: "Xotira",
    subtitle: "Yodlash qanday ishlaydi va uni qanday kuchaytirish mumkin",
    readMin: 7,
    icon: "brain",
    color: "violet",
    intro:
      "Xotira — o'rganishning negizi. Har qanday bilim, so'z, formula yoki sana avval xotiraga kiradi, so'ng shu yerda saqlanadi va kerak bo'lganda qaytariladi. Yaxshi xabar shundaki, xotira bu tug'ma qobiliyat emas, balki mashq qilish bilan kuchayadigan ko'nikma. Bu maqolada xotira qanday ishlashini va uning samarali ishlashi uchun fandan olingan aniq usullarni ko'rib chiqamiz.",
    sections: [
      {
        heading: "Xotira qanday ishlaydi",
        paragraphs: [
          "Xotira uch bosqichdan iborat: kodlash (ma'lumotni qabul qilish), saqlash (uni miyada ushlab turish) va tiklash (kerak bo'lganda eslab olish). Odam «yodlay olmayman» deydi — aslida ko'pincha muammo saqlashda yoki tiklashda bo'ladi, chunki ma'lumot to'g'ri kodlanmagan.",
          "Ma'lumot uch xil xotirada bo'ladi. Sezgi xotirasi bir necha soniya yashaydi. Qisqa muddatli xotira taxminan 7±2 ta elementni 20-30 soniya ushlab turadi — shuning uchun telefon raqamini bir marta eshitib uzoq eslab qolish qiyin. Uzoq muddatli xotira esa cheksiz sig'imli: u yerda ma'lumot takrorlash va ma'noga bog'lash orqali o'tkaziladi.",
        ],
      },
      {
        heading: "Unutish egri chizig'i",
        paragraphs: [
          "German psixologi Hermann Ebbinghaus o'z tajribalarida quyidagi qonuniyatni ko'rsatdi: o'rganilgan ma'lumotning katta qismi — birinchi soat ichida 50 foizga yaqini — bir kun ichida unutiladi. Agar takrorlanmasa, bir haftadan keyin eslab qolish juda qiyinlashadi.",
          "Lekin har bir takrorlash egri chizig'ini tekislaydi: birinchi takrorlashdan keyin unutish sekinlashadi, ikkinchisidan keyin yanada sekinlashadi. Shuning uchun muntazam takrorlash — xotiraning eng kuchli quroli hisoblanadi.",
        ],
      },
      {
        heading: "Samarali yodlash usullari",
        bullets: [
          {
            lead: "Faol eslab olish (active recall)",
            text: "matnni qayta-qayta o'qish o'rniga kitobni yoping va o'qiganingizni eslab gapirib bering yoki yozing. Bu usul oddiy o'qishdan 2-3 barobar kuchli.",
          },
          {
            lead: "Interval bilan takrorlash",
            text: "yangi ma'lumotni 1 kun, 3 kun, 7 kun va 21 kundan keyin takrorlang. Har safar takrorlash talab qiladigan oralish uzunlashib boradi.",
          },
          {
            lead: "Xotira saroyi (method of loci)",
            text: "yodlash kerak bo'lgan ro'yxatni tanishingizdagi tanish joylarga (xona, yo'l bo'ylab) tasavvur qilib «joylashtiring». Yurish joylarini eslang — ro'yxat ham esdan chiqmaydi.",
          },
          {
            lead: "Guruhlab yodlash (chunking)",
            text: "uzun ma'lumotni kichik bloklarga bo'ling: telefon raqamini 3+3+4 qilib, so'zlarni mavzular bo'yicha guruhlab yodlash osonlashadi.",
          },
          {
            lead: "Assotsiatsiya",
            text: "yangi bilimni allaqachon biladigan narsangizga bog'lang. G'ayrioddiy, mazaqili tasvirlar xotirada eng uzoq qoladi.",
          },
          {
            lead: "Mnemonika",
            text: "ro'yxatlarni bosh harflardan so'z yasash, qofiyali jumlalar yoki qisqa qoidalar (masalan, kamalak ranglari uchun qisqartmalar) orqali mustahkamlang.",
          },
        ],
      },
      {
        heading: "Miyaga parvarish",
        bullets: [
          {
            lead: "Uyqu",
            text: "yetarli uyqu (7-9 soat) davomida miya kunduzi o'rgangan ma'lumotlarni saralaydi va uzoq xotiraga o'tkazadi. Uykusiz o'qigan bilim tez parlaydi.",
          },
          {
            lead: "Harakat",
            text: "jismoniy mashq miyaga qon aylanishini kuchaytiradi — hatto 20 daqiqalik yurish ham o'rganishdan oldingi diqqatni oshiradi.",
          },
          {
            lead: "Ovqat va suv",
            text: "miya energiyani ko'p sarflaydi; suvsizlik diqqatni pasaytiradi. To'liq nonushta — uzoq mashg'ulotlar uchun yoqilg'i.",
          },
          {
            lead: "Bir vaqtda bir ish",
            text: "telefon bilan «multitasking» o'rganishni keskin pasaytiradi. 25-30 daqiqalik to'liq fokusli bloklar + qisqa tanaffus eng samarali rejimdir.",
          },
        ],
      },
      {
        heading: "21 kunlik oddiy mashq rejimi",
        bullets: [
          {
            lead: "1-hafta",
            text: "har kuni o'qigan narsangizni kitobni yopib 5 gap bilan takrorlab bering.",
          },
          {
            lead: "2-hafta",
            text: "flashcard (kartochka) usulini qo'shing: kunda 10 ta yangi karta, 1-3-7 takrorlash bilan.",
          },
          {
            lead: "3-hafta",
            text: "xotira saroyi yoki assotsiatsiya usuli bilan 10-15 ta elementlik ro'yxat yodlang va natijani o'zingiz sinab ko'ring.",
          },
        ],
      },
    ],
  },
  {
    id: "matematika",
    title: "Matematika",
    subtitle: "Poydevordan tortib masala yechishning 4 qadamigacha",
    readMin: 7,
    icon: "calculator",
    color: "amber",
    intro:
      "Matematika — faqat raqamlar fani emas, bu mantiqli tafakkur fani. U odamga muammoni bo'laklarga bo'lishni, qoidabasarlik bilan ishlashni va xulosani tekshirishni o'rgatadi. Dasturlash, muhandislik, moliya va hatto kundalik hayotdagi chegirma foizini hisoblash — hammasi matematik tafakkurga tayanadi. Va eng muhimi: matematika «talant» emas, balki mashq bilan o'sadigan ko'nikma — mana bu yo'l xaritasi.",
    sections: [
      {
        heading: "Poydevorni mustahkamlash",
        paragraphs: [
          "Ko'pchilikning qiyinchiligi yuqori mavzularda emas — poydevordagi kichik teshiklarda. Quyidagi to'rt mavzuni to'liq egallash sizga algebra va geometriyada ishonch beradi.",
        ],
        bullets: [
          {
            lead: "Tabulatsiya (arifmetika)",
            text: "qo'shish, ayirish, ko'paytirish va bo'lishni kalkulyatorsiz tez bajarish — barcha keyingi mavzular shunga tayanadi.",
          },
          {
            lead: "Kasr va foizlar",
            text: "1/2 va 0.5 va 50% — bular bir xil narsaning uch ko'rinishi. Uchala shaklda ham tez ishlay olish kerak.",
          },
          {
            lead: "Proporsiya (doimiy nisbat)",
            text: "agar 2 kg olma 14 000 so'm bo'lsa, 5 kg qancha? Bunday masalalar kundalik hayotning o'zidir.",
          },
          {
            lead: "Salbiy sonlar va darajalar",
            text: "−(−5)=5, 2³=8, kvadrat ildiz tushunchasi — keyingi algebraning tili.",
          },
        ],
      },
      {
        heading: "Masala yechishning 4 qadami",
        paragraphs: [
          "Har qanday masala — oddiydan murakkabgacha — bir xil tartib bilan yechiladi. Bu qadamlarni odat qilsangiz, «qayerdan boshlashni bilmayman» muammosi yo'qoladi.",
        ],
        bullets: [
          {
            lead: "1. Tushunish",
            text: "masalani sekin o'qing. Berilganlar nimalar? Noma'lum — aynan nima topilishi kerak? Kerak bo'lsa, qisqa shakl (rasm, sxema) chizing.",
          },
          {
            lead: "2. Reja tuzish",
            text: "qaysi formula yoki qoida burdan o'tadi? O'xshash eski masalani eslang. Masalani mayda qadamlarga bo'ling.",
          },
          {
            lead: "3. Yechish",
            text: "har qadamni yozib boring — og'zaki hisobda yashirin xatolar yig'iladi. Bitta qadamda bitta amal.",
          },
          {
            lead: "4. Tekshirish",
            text: "javob mantiqan to'g'rimi? (Odam 5 soatda 300 km yugurmaydi.) Teskari yo'l bilan yoki boshqa usul bilan tekshiring.",
          },
        ],
      },
      {
        heading: "Algebra va geometriyadan asosiy g'oyalar",
        bullets: [
          {
            lead: "Tenglamaning oltin qoidasi",
            text: "tenglikni saqlash uchun tenglamaga qanday amal qilsangiz, ikkala tomonga ham qilasiz. Bu bitta qoida butun algebrani ochib beradi.",
          },
          {
            lead: "Asosiy formulalar",
            text: "perimetr P=2(a+b), yuz S=a·b, Pifagor teoremasi a²+b²=c². Formulani yodlashdan ko'ra — uni qayerda ishlatishni bilish muhim.",
          },
          {
            lead: "Funksiya — mashina g'oyasi",
            text: "f(x) — bu kirish sonini oladigan va natija chiqaradigan mashina. Grafik esa bu mashinaning xatti-harakati rasmi.",
          },
          {
            lead: "Chizma bilan ishlash",
            text: "geometriyada har doim shakl chizing — berilganlarni rasmga yozsangiz, yechim o'zi ko'rina boshlaydi.",
          },
        ],
      },
      {
        heading: "Kunlik mashq va «matematika qo'rquvi»ni yengish",
        bullets: [
          {
            lead: "Kuniga 20-30 daqiqa",
            text: "5-10 ta masala, lekin har kun. Yechimi ko'rilgan masalani keyin o'zingiz noldan yechib ko'ring.",
          },
          {
            lead: "Xatolar daftari",
            text: "har bir xato masalani yozib qo'ying: qayerda xato qildim va to'g'ri yo'l qanday. Xatolar — eng zo'r o'qituvchi.",
          },
          {
            lead: "Qiyinlikni bosqichli oshirish",
            text: "avval o'xshash masalalarni ko'p yeching, yangi tur masala kelganda uni bo'laklarga bo'lib tahlil qiling.",
          },
          {
            lead: "Fikrni o'zgartirish",
            text: "«men matematikachi emasman» — o'rganilmagan ko'nikma haqidagi gap, qobiliyat haqidagi emas. Har kunlik mashq bu fikrni o'zgartiradi.",
          },
        ],
      },
    ],
  },
  {
    id: "tarix",
    title: "Tarix",
    subtitle: "Vaqt chizig'i, sabab-natija zanjiri va qiziqarli o'rganish usullari",
    readMin: 7,
    icon: "landmark",
    color: "emerald",
    intro:
      "Tarix — bu o'tmishdagi sanalar to'plami emas, bu odamlarning qanday yashagani, qanday xato qilgani va ulardan biz nima o'rganishimiz mumkinligi haqidagi fanda. Tarixni bilish odamga ildizini ko'rsatadi, tanqidiy tafakkur beradi va hozirgi voqealarni chuqurroq tushunishga yordam beradi. Bu maqolada tarixni qiziqarli va samarali o'rganish usullarini ko'rib chiqamiz.",
    sections: [
      {
        heading: "Tarixni o'rganishning asosiy usullari",
        bullets: [
          {
            lead: "Vaqt chizig'i (timeline)",
            text: "katta qog'ozga asrlarni chizing va muhim voqealarni joylashtiring. Vaqt chizig'ida voqealar «to'qima» bo'lib ko'rinadi — nima oldin, nima keyin bo'lgani aniq bo'ladi.",
          },
          {
            lead: "Sabab-natija zanjiri",
            text: "har voqeadan «nima uchun?» deb so'rang: urush nima uchun boshlandi, nima uchun shu vaqtda? Tarix sabab-natija zanjirlaridan iborat — ularni ko'rsangiz, sanalar o'zi esda qoladi.",
          },
          {
            lead: "Kartochkalar",
            text: "uch turdagi kartochka yuritib boring: sanalar, shaxslar (kim, nima qildi, nega muhim) va atamalar (xonlik, amirlik, diktatura...).",
          },
          {
            lead: "Xarita bilan ishlash",
            text: "davlatlarning qanday paydo bo'lgani va qanday o'zgarganini xaritada ko'rish — nom va hududlarni eslab qolishni osonlashtiradi.",
          },
          {
            lead: "Manbalarga tanqidiy qarash",
            text: "har manba (kitob, film, maqola) biror nuqtai nazardan yozilgan. Bir voqeani 2-3 manbadan solishtirish — tarixchi ko'nikmasining boshlanishi.",
          },
        ],
      },
      {
        heading: "O'zbekiston tarixidan muhim davrlar",
        bullets: [
          {
            lead: "Qadimgi davlatlar",
            text: "Baqtriya, Xorazm va So'g'd — O'rta Osiyoning qadimgi davlatlari; So'g'dlik savdogarlar Buyuk ipak yo'lining ustalari bo'lgan.",
          },
          {
            lead: "Buyuk ipak yo'li",
            text: "Xitoyni Yevropa bilan bog'lagan buyuk savdo yo'li — Samarqand, Buxoro va Xiva uning eng boy shaharlari bo'lgan.",
          },
          {
            lead: "Temuriylar davri",
            text: "Amir Temur davlatining barpo etilishi va Temuriylar zamonida fan, me'morchilik va madaniyatning gullashi: Ulug'bek rasadxonasi, Navoiy va Bobur.",
          },
          {
            lead: "Uch xonlik davri",
            text: "XIX asrda Buxoro amirligi, Xiva va Qo'qon xonliklari — o'zaro kurash va mustaqillikning yo'qolish jarayoni.",
          },
          {
            lead: "Mustaqillik",
            text: "1991-yil 31-avgust — O'zbekiston mustaqilligi e'lon qilingan kun; yangi tarixning boshlanishi.",
          },
        ],
      },
      {
        heading: "Jahon tarixidan yo'nalishlar",
        bullets: [
          {
            lead: "Qadimgi tsivilizatsiyalar",
            text: "Misr, Mesopotamiya, Hind va Xitoy — dastlabki shaharlar, yozuv va qonunlar shu yerda paydo bo'lgan.",
          },
          {
            lead: "Buyuk geografik kashfiyotlar",
            text: "XV-XVI asrlarda yangi yo'llar va qit'alar ochilishi — jahon savdosining birlashishi.",
          },
          {
            lead: "Sanoat inqilobi",
            text: "XVIII-XIX asrlarda bug' mashinasi va fabrikalar — hayot tartibining tubdan o'zgarishi.",
          },
          {
            lead: "XX asr",
            text: "ikki jahon urushi, texnika-texnologiya taraqqiyoti va zamonaviy xalqaro tartibning shakllanishi.",
          },
        ],
      },
      {
        heading: "Qiziqarli usulda o'rganish",
        bullets: [
          {
            lead: "Tarixiy hujjatli filmlar",
            text: "ko'rsatilgan film yoki hujjatli serial — mavzuga «kirish» uchun zo'r vosita; so'ng kitobda chuqurlashtiring.",
          },
          {
            lead: "Ijodiy topshiriqlar",
            text: "tarixiy shaxsga «intervyu» yozing yoki o'sha kunning kundaligini uning nomidan yuritib ko'ring — voqea ichida yashash uni mustahkamlaydi.",
          },
          {
            lead: "Tarixiy romanlar",
            text: "yaxshi roman tarixni his qildiradi; lekin romandagi faktlarni tarixiy manbalar bilan tekshirishni unutmang.",
          },
          {
            lead: "Test bilan tekshirish",
            text: "Randapning Testlar bo'limidagi tarix testlarini yeching — o'z bilimingizni darhol baholang va ball to'plang.",
          },
        ],
      },
    ],
  },
];

export type OrganishTopicContent = Omit<
  OrganishTopic,
  "icon" | "color" | "readMin"
>;

/* ---------------- EN translations ---------------- */

const TOPICS_EN: OrganishTopicContent[] = [
  {
    id: "ingliz-tili",
    title: "English language",
    subtitle:
      "Four skills, a grammar foundation and a daily 30-minute routine",
    intro:
      "English is one of the most widely used languages in the world. More than 1.5 billion people speak it, most of the information on the internet, scientific articles and jobs in international companies are in this language. Knowing English is not just a school subject — it is a key that opens new knowledge, new friends and new career opportunities. In this article you will learn a clear, practical path to take the language from zero, or from your current level to a higher one.",
    sections: [
      {
        heading: "The four core skills",
        paragraphs: [
          "Learning a language is built on four skills. Each of them needs separate practice — because grammar alone or listening alone will not make you a speaker.",
        ],
        bullets: [
          {
            lead: "Listening",
            text: "listen to a podcast, audiobook or subtitled video for at least 10-15 minutes a day. First write down the words you don't understand, then look up their meaning.",
          },
          {
            lead: "Speaking",
            text: "speaking out loud is the most important exercise. Talk to yourself about everyday topics, record your voice and listen to find your mistakes.",
          },
          {
            lead: "Reading",
            text: "start with short stories and graded readers that match your level. Write down 5-7 new words from every page.",
          },
          {
            lead: "Writing",
            text: "keep a short diary: write 5 sentences a day about what you did. It strengthens grammar and vocabulary at the same time.",
          },
        ],
      },
      {
        heading: "Where to start with grammar",
        paragraphs: [
          "Don't rush to learn all the grammar at once. With the following four tenses you will cover 70-80% of everyday conversation.",
        ],
        bullets: [
          {
            lead: "Present Simple",
            text: "for regular actions — I study English every day.",
          },
          {
            lead: "Present Continuous",
            text: "for actions happening now — I am reading a book now.",
          },
          {
            lead: "Past Simple",
            text: "for finished actions in the past — I watched a film yesterday.",
          },
          {
            lead: "Future (will / going to)",
            text: "for plans and intentions — I will visit Samarkand next month.",
          },
          {
            lead: "Word order",
            text: "an English sentence is always built as Subject + Verb + Object: She plays football.",
          },
        ],
      },
      {
        heading: "An effective way to memorize words",
        paragraphs: [
          "Vocabulary is the blood of a language. But memorizing words as bare lists is quickly forgotten. Words learned inside sentences, by topic and with repetition stay long.",
        ],
        bullets: [
          {
            lead: "10 words a day",
            text: "not many, but regular. In a year that is 3,650 words — enough for everyday conversation.",
          },
          {
            lead: "Memorize inside sentences",
            text: "instead of memorizing 'water' alone, learn 'I drink water every day' — the word settles together with verbs and endings.",
          },
          {
            lead: "Flashcards",
            text: "in Anki or on paper cards, write the English word on one side and the meaning plus an example sentence on the other.",
          },
          {
            lead: "The 1-3-7-21 rule",
            text: "repeat a new word after 1 day, 3 days, 7 days and 21 days — a simplified form of spaced repetition.",
          },
        ],
      },
      {
        heading: "A 30-minute daily routine",
        paragraphs: [
          "A person who works 30 minutes every day reaches results faster than a person who sits 5 hours once a week. Here is a simple, practical routine:",
        ],
        bullets: [
          {
            lead: "Minutes 1-10",
            text: "repeat the words you learned on previous days (flashcards).",
          },
          {
            lead: "Minutes 11-20",
            text: "one grammar topic with 10-15 exercises, or a short text to read.",
          },
          {
            lead: "Minutes 21-30",
            text: "listening + repeating out loud (shadowing), or diary writing.",
          },
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          {
            lead: "Word-for-word translation",
            text: "trying to map every word of your language onto English leads to mistakes. Learn phrases as wholes.",
          },
          {
            lead: "Grammar without practice",
            text: "you cannot master a rule just by reading it — apply every rule in your own sentences.",
          },
          {
            lead: "Avoiding speaking",
            text: "don't be afraid of mistakes — silence is the biggest enemy of a language learner.",
          },
          {
            lead: "Lack of regularity",
            text: "4 hours one day, then two weeks off — that road leads nowhere. Small daily practice is the strongest.",
          },
        ],
      },
    ],
  },
  {
    id: "xotira",
    title: "Memory",
    subtitle: "How memorization works and how to strengthen it",
    intro:
      "Memory is the foundation of learning. Every piece of knowledge, word, formula or date first enters memory, is stored there and is recalled when needed. The good news is that memory is not an inborn talent but a skill that grows with practice. In this article we look at how memory works and the concrete, science-based methods for making it work well.",
    sections: [
      {
        heading: "How memory works",
        paragraphs: [
          "Memory consists of three stages: encoding (taking information in), storage (holding it in the brain) and retrieval (recalling it when needed). When people say 'I can't memorize', the problem is usually in storage or retrieval, because the information was not encoded properly.",
          "Information lives in three kinds of memory. Sensory memory lives for a few seconds. Short-term memory holds about 7±2 items for 20-30 seconds — that is why it is hard to remember a phone number heard once. Long-term memory has practically unlimited capacity: information gets there through repetition and connecting it to meaning.",
        ],
      },
      {
        heading: "The forgetting curve",
        paragraphs: [
          "The German psychologist Hermann Ebbinghaus showed in his experiments the following pattern: a large part of what is learned — close to 50% — is forgotten within the first hour, and even more within a day. Without repetition, after a week recall becomes very hard.",
          "But every review flattens the curve: after the first repetition forgetting slows down, and after the second it slows even more. That is why regular repetition is memory's most powerful weapon.",
        ],
      },
      {
        heading: "Effective memorization methods",
        bullets: [
          {
            lead: "Active recall",
            text: "instead of re-reading a text again and again, close the book and tell or write down what you remember. This method is 2-3 times stronger than plain reading.",
          },
          {
            lead: "Spaced repetition",
            text: "repeat new information after 1 day, 3 days, 7 days and 21 days. Each time, the gap before the next repetition grows longer.",
          },
          {
            lead: "Memory palace (method of loci)",
            text: "imagine the list you need to memorize 'placed' in familiar places you know well (rooms, a route you walk). Recall the places — the list comes with them.",
          },
          {
            lead: "Chunking",
            text: "split long information into small blocks: a phone number as 3+3+4, words grouped by topic — memorization gets easier.",
          },
          {
            lead: "Association",
            text: "connect new knowledge to something you already know. Unusual, funny images stay in memory the longest.",
          },
          {
            lead: "Mnemonics",
            text: "build words from first letters, rhyming sentences or short rules (for example abbreviations for the rainbow colors).",
          },
        ],
      },
      {
        heading: "Taking care of the brain",
        bullets: [
          {
            lead: "Sleep",
            text: "during enough sleep (7-9 hours) the brain sorts what you learned during the day and moves it to long-term memory. Knowledge learned without sleep fades fast.",
          },
          {
            lead: "Movement",
            text: "physical exercise strengthens blood flow to the brain — even a 20-minute walk raises focus before studying.",
          },
          {
            lead: "Food and water",
            text: "the brain spends a lot of energy; dehydration lowers attention. A full breakfast is fuel for long study sessions.",
          },
          {
            lead: "One thing at a time",
            text: "'multitasking' with a phone sharply lowers learning. Fully focused blocks of 25-30 minutes + short breaks are the most effective regime.",
          },
        ],
      },
      {
        heading: "A simple 21-day exercise plan",
        bullets: [
          {
            lead: "Week 1",
            text: "every day, retell what you read in 5 sentences with the book closed.",
          },
          {
            lead: "Week 2",
            text: "add flashcards: 10 new cards a day with 1-3-7 repetition.",
          },
          {
            lead: "Week 3",
            text: "memorize a list of 10-15 items with the memory palace or association method and test yourself.",
          },
        ],
      },
    ],
  },
  {
    id: "matematika",
    title: "Mathematics",
    subtitle: "From foundations to the 4 steps of problem solving",
    intro:
      "Mathematics is not just a subject of numbers — it is a subject of logical thinking. It teaches a person to break a problem into parts, to work by rules and to check conclusions. Programming, engineering, finance and even calculating a discount in daily life — all rely on mathematical thinking. And most importantly: mathematics is not a 'talent' but a skill that grows with practice — here is the road map.",
    sections: [
      {
        heading: "Strengthening the foundation",
        paragraphs: [
          "For most people the difficulty is not in advanced topics but in small gaps in the foundation. Fully mastering the following four topics will give you confidence in algebra and geometry.",
        ],
        bullets: [
          {
            lead: "Arithmetic",
            text: "adding, subtracting, multiplying and dividing quickly without a calculator — all later topics rest on this.",
          },
          {
            lead: "Fractions and percentages",
            text: "1/2, 0.5 and 50% are three views of the same thing. You should be able to work quickly in all three forms.",
          },
          {
            lead: "Proportion",
            text: "if 2 kg of apples cost 14,000, how much do 5 kg cost? Such problems are everyday life itself.",
          },
          {
            lead: "Negative numbers and powers",
            text: "−(−5)=5, 2³=8, the idea of a square root — the language of the algebra that follows.",
          },
        ],
      },
      {
        heading: "The 4 steps of problem solving",
        paragraphs: [
          "Any problem — from simple to complex — is solved with the same order. If you make these steps a habit, the 'I don't know where to start' problem disappears.",
        ],
        bullets: [
          {
            lead: "1. Understand",
            text: "read the problem slowly. What is given? What exactly must be found? If needed, draw a short sketch (picture, diagram).",
          },
          {
            lead: "2. Plan",
            text: "which formula or rule passes through here? Recall a similar old problem. Split the problem into small steps.",
          },
          {
            lead: "3. Solve",
            text: "write down every step — hidden mistakes pile up in mental arithmetic. One operation per step.",
          },
          {
            lead: "4. Check",
            text: "is the answer logical? (A person cannot run 300 km in 5 hours.) Check by the reverse path or by another method.",
          },
        ],
      },
      {
        heading: "Key ideas from algebra and geometry",
        bullets: [
          {
            lead: "The golden rule of equations",
            text: "to keep equality, do to both sides whatever you do to the equation. This one rule unlocks all of algebra.",
          },
          {
            lead: "Core formulas",
            text: "perimeter P=2(a+b), area S=a·b, the Pythagorean theorem a²+b²=c². More important than memorizing a formula is knowing where to use it.",
          },
          {
            lead: "A function as a machine",
            text: "f(x) is a machine that takes an input number and produces a result. The graph is a picture of that machine's behavior.",
          },
          {
            lead: "Working with drawings",
            text: "in geometry always draw the shape — if you write the given values onto the picture, the solution starts to appear by itself.",
          },
        ],
      },
      {
        heading: "Daily practice and beating 'math fear'",
        bullets: [
          {
            lead: "20-30 minutes a day",
            text: "5-10 problems, but every day. After solving a worked example, solve it again yourself from zero.",
          },
          {
            lead: "Notebook of mistakes",
            text: "write every failed problem down: where did I go wrong and what is the right path? Mistakes are the best teacher.",
          },
          {
            lead: "Raise difficulty step by step",
            text: "first solve many similar problems; when a new type comes, split it into parts and analyze it.",
          },
          {
            lead: "Change your mindset",
            text: "'I am not a math person' is a statement about an unlearned skill, not about ability. Daily practice changes that belief.",
          },
        ],
      },
    ],
  },
  {
    id: "tarix",
    title: "History",
    subtitle:
      "Timelines, cause-and-effect chains and fun ways to learn",
    intro:
      "History is not a collection of dates from the past — it is a subject about how people lived, what mistakes they made and what we can learn from them. Knowing history shows a person their roots, gives critical thinking and helps understand today's events more deeply. In this article we look at interesting and effective ways to learn history.",
    sections: [
      {
        heading: "The main methods of learning history",
        bullets: [
          {
            lead: "Timeline",
            text: "draw the centuries on a large sheet of paper and place the important events on it. On a timeline events become 'fabric' — what came first and what came after becomes clear.",
          },
          {
            lead: "Cause-and-effect chain",
            text: "ask 'why?' for every event: why did the war start, why at that time? History is made of cause-and-effect chains — once you see them, dates remember themselves.",
          },
          {
            lead: "Cards",
            text: "keep three kinds of cards: dates, persons (who, did what, why it matters) and terms (khanate, emirate, dictatorship...).",
          },
          {
            lead: "Working with maps",
            text: "seeing on the map how states appeared and changed makes names and territories easier to remember.",
          },
          {
            lead: "A critical view of sources",
            text: "every source (book, film, article) is written from some point of view. Comparing one event in 2-3 sources is the beginning of a historian's skill.",
          },
        ],
      },
      {
        heading: "Important periods of Uzbek history",
        bullets: [
          {
            lead: "Ancient states",
            text: "Bactria, Khwarazm and Sogd — the ancient states of Central Asia; Sogdian merchants were masters of the Great Silk Road.",
          },
          {
            lead: "The Great Silk Road",
            text: "the great trade route connecting China with Europe — Samarkand, Bukhara and Khiva were its richest cities.",
          },
          {
            lead: "The Timurid era",
            text: "the rise of Amir Temur's state and the flourishing of science, architecture and culture in the Timurid period: Ulugh Beg's observatory, Navoiy and Babur.",
          },
          {
            lead: "The three khanates",
            text: "in the 19th century the Emirate of Bukhara and the khanates of Khiva and Kokand — mutual struggle and the process of losing independence.",
          },
          {
            lead: "Independence",
            text: "August 31, 1991 — the day the independence of Uzbekistan was declared; the beginning of a new history.",
          },
        ],
      },
      {
        heading: "Directions from world history",
        bullets: [
          {
            lead: "Ancient civilizations",
            text: "Egypt, Mesopotamia, India and China — the first cities, writing and laws appeared there.",
          },
          {
            lead: "The great geographic discoveries",
            text: "in the 15th-16th centuries new routes and continents opened — world trade became united.",
          },
          {
            lead: "The industrial revolution",
            text: "in the 18th-19th centuries the steam engine and factories — a radical change in the way of life.",
          },
          {
            lead: "The 20th century",
            text: "two world wars, technological progress and the formation of the modern international order.",
          },
        ],
      },
      {
        heading: "Learning in fun ways",
        bullets: [
          {
            lead: "Historical documentaries",
            text: "a shown film or documentary series is a great entry point into a topic; then go deeper with books.",
          },
          {
            lead: "Creative tasks",
            text: "write an 'interview' with a historical figure or keep the diary of that day in their name — living inside the event strengthens it.",
          },
          {
            lead: "Historical novels",
            text: "a good novel makes you feel history; but don't forget to check the facts of the novel against historical sources.",
          },
          {
            lead: "Check with tests",
            text: "solve the history tests in Randap's Tests section — assess your knowledge instantly and earn points.",
          },
        ],
      },
    ],
  },
];

/* ---------------- RU translations ---------------- */

const TOPICS_RU: OrganishTopicContent[] = [
  {
    id: "ingliz-tili",
    title: "Английский язык",
    subtitle:
      "Четыре навыка, грамматическая база и ежедневный режим на 30 минут",
    intro:
      "Английский — один из самых используемых языков мира. На нём говорят более 1,5 миллиарда человек, большая часть информации в интернете, научных статей и рабочих мест в международных компаниях — именно на этом языке. Знание английского — не просто школьный предмет: это ключ, открывающий новые знания, новых друзей и новые возможности в карьере. В этой статье вы познакомитесь с понятным практическим путём, как вывести язык с нуля или с текущего уровня на более высокий.",
    sections: [
      {
        heading: "Четыре основных навыка",
        paragraphs: [
          "Изучение языка строится на четырёх навыках. Каждый из них нужно тренировать отдельно — потому что только грамматика или только аудирование говорящего человека не сделают.",
        ],
        bullets: [
          {
            lead: "Аудирование",
            text: "слушайте подкаст, аудиокнигу или видео с субтитрами минимум 10-15 минут в день. Сначала выпишите непонятные слова, потом найдите их значение.",
          },
          {
            lead: "Говорение",
            text: "говорить вслух — самое важное упражнение. Разговаривайте с собой на бытовые темы, записывайте голос и слушайте, находя ошибки.",
          },
          {
            lead: "Чтение",
            text: "начните с коротких рассказов и адаптированных книг своего уровня. Выписывайте по 5-7 новых слов с каждой страницы.",
          },
          {
            lead: "Письмо",
            text: "ведите короткий дневник: каждый день пишите 5 предложений о том, что делали. Это одновременно укрепляет грамматику и словарный запас.",
          },
        ],
      },
      {
        heading: "С чего начать грамматику",
        paragraphs: [
          "Не спешите учить всю грамматику сразу. Следующих четырёх времён хватит, чтобы покрыть 70-80% повседневного общения.",
        ],
        bullets: [
          {
            lead: "Present Simple",
            text: "для регулярных действий — I study English every day (Я учу английский каждый день).",
          },
          {
            lead: "Present Continuous",
            text: "для действия, происходящего сейчас — I am reading a book now (Я сейчас читаю книгу).",
          },
          {
            lead: "Past Simple",
            text: "для завершённых действий в прошлом — I watched a film yesterday (Вчера я посмотрел фильм).",
          },
          {
            lead: "Future (will / going to)",
            text: "для планов и намерений — I will visit Samarkand next month (В следующем месяце я поеду в Самарканд).",
          },
          {
            lead: "Порядок слов",
            text: "английское предложение всегда строится как Подлежащее + Сказуемое + Дополнение: She (она) plays (играет) football (в футбол).",
          },
        ],
      },
      {
        heading: "Эффективный способ запоминать слова",
        paragraphs: [
          "Словарный запас — кровь языка. Но заучивание слов списками быстро забывается. Слова, выученные внутри предложений, по темам и с повторением, остаются надолго.",
        ],
        bullets: [
          {
            lead: "10 слов в день",
            text: "немного, но регулярно. За год это 3650 слов — достаточно для повседневного общения.",
          },
          {
            lead: "Запоминание в предложении",
            text: "вместо того чтобы учить слово water отдельно, выучите I drink water every day — слово встаёт вместе с глаголами и формами.",
          },
          {
            lead: "Метод карточек",
            text: "в Anki или на бумажных карточках: на одной стороне английское слово, на другой — перевод и пример предложения.",
          },
          {
            lead: "Правило 1-3-7-21",
            text: "повторяйте новое слово через 1 день, 3 дня, 7 дней и 21 день — упрощённая форма интервального повторения (spaced repetition).",
          },
        ],
      },
      {
        heading: "Ежедневный режим на 30 минут",
        paragraphs: [
          "Тот, кто занимается 30 минут каждый день, приходит к результату быстрее того, кто сидит 5 часов раз в неделю. Вот простой и практичный режим:",
        ],
        bullets: [
          {
            lead: "1-10 минута",
            text: "повторение слов, выученных в предыдущие дни (карточки).",
          },
          {
            lead: "11-20 минута",
            text: "одна грамматическая тема и 10-15 упражнений или короткий текст для чтения.",
          },
          {
            lead: "21-30 минута",
            text: "аудирование + повторение вслух (shadowing) или ведение дневника.",
          },
        ],
      },
      {
        heading: "Частые ошибки",
        bullets: [
          {
            lead: "Дословный перевод",
            text: "попытка точно подставить каждое родное слово под английское ведёт к ошибкам. Учитесь целыми фразами.",
          },
          {
            lead: "Грамматика без практики",
            text: "правило нельзя освоить, только читая его — применяйте каждое правило в собственных предложениях.",
          },
          {
            lead: "Бегство от разговора",
            text: "не бойтесь ошибаться — молчание главный враг изучающего язык.",
          },
          {
            lead: "Отсутствие регулярности",
            text: "4 часа в один день и две недели отдыха — этот путь не даёт результата. Маленькая, но ежедневная практика самая сильная.",
          },
        ],
      },
    ],
  },
  {
    id: "xotira",
    title: "Память",
    subtitle: "Как работает запоминание и как его укрепить",
    intro:
      "Память — основа обучения. Любое знание, слово, формула или дата сначала попадает в память, хранится там и возвращается, когда нужно. Хорошая новость: память — не врождённый талант, а навык, который растёт от упражнений. В этой статье мы рассмотрим, как работает память, и конкретные научно обоснованные методы её эффективной работы.",
    sections: [
      {
        heading: "Как работает память",
        paragraphs: [
          "Память состоит из трёх этапов: кодирование (принятие информации), хранение (удержание её в мозге) и извлечение (вспоминание, когда нужно). Когда человек говорит «не могу запомнить» — проблема обычно в хранении или извлечении, потому что информация была закодирована неправильно.",
          "Информация находится в трёх видах памяти. Сенсорная память живёт несколько секунд. Кратковременная память удерживает примерно 7±2 элемента в течение 20-30 секунд — поэтому номер телефона, услышанный один раз, трудно запомнить надолго. Долговременная память практически безгранична: информация попадает туда через повторение и связывание со смыслом.",
        ],
      },
      {
        heading: "Кривая забывания",
        paragraphs: [
          "Немецкий психолог Герман Эббингауз в своих опытах показал следующую закономерность: большая часть выученного — около 50% — забывается в первый час, ещё больше за один день. Без повторения через неделю вспомнить становится очень трудно.",
          "Но каждое повторение выравнивает кривую: после первого повторения забывание замедляется, после второго — замедляется ещё сильнее. Поэтому регулярное повторение — самое сильное оружие памяти.",
        ],
      },
      {
        heading: "Эффективные методы запоминания",
        bullets: [
          {
            lead: "Активное вспоминание (active recall)",
            text: "вместо того чтобы перечитывать текст, закройте книгу и расскажите или запишите, что запомнили. Этот метод в 2-3 раза сильнее простого чтения.",
          },
          {
            lead: "Интервальное повторение",
            text: "повторяйте новую информацию через 1 день, 3 дня, 7 дней и 21 день. Каждый раз промежуток до следующего повторения становится длиннее.",
          },
          {
            lead: "Дворец памяти (method of loci)",
            text: "представьте список, который нужно запомнить, «размещённым» в знакомых местах (комнаты, дорога). Вспомните места — список вспомнится вместе с ними.",
          },
          {
            lead: "Запоминание группами (chunking)",
            text: "делите длинную информацию на маленькие блоки: номер телефона как 3+3+4, слова по темам — запоминать легче.",
          },
          {
            lead: "Ассоциация",
            text: "свяжите новое знание с тем, что уже знаете. Необычные, смешные образы остаются в памяти дольше всего.",
          },
          {
            lead: "Мнемоника",
            text: "закрепляйте списки через слова из первых букв, рифмованные фразы или короткие правила (например, аббревиатуры цветов радуги).",
          },
        ],
      },
      {
        heading: "Забота о мозге",
        bullets: [
          {
            lead: "Сон",
            text: "во время достаточного сна (7-9 часов) мозг сортирует выученное за день и переводит в долговременную память. Знания, полученные без сна, быстро тают.",
          },
          {
            lead: "Движение",
            text: "физическая нагрузка усиливает кровоток мозга — даже 20-минутная прогулка поднимает внимание перед учёбой.",
          },
          {
            lead: "Еда и вода",
            text: "мозг тратит много энергии; обезвоживание снижает внимание. Полный завтрак — топливо для долгих занятий.",
          },
          {
            lead: "Одно дело за раз",
            text: "«мультизадачность» с телефоном резко снижает обучение. Полностью сосредоточенные блоки 25-30 минут + короткие перерывы — самый эффективный режим.",
          },
        ],
      },
      {
        heading: "Простой 21-дневный план упражнений",
        bullets: [
          {
            lead: "1-я неделя",
            text: "каждый день пересказывайте прочитанное 5 предложениями с закрытой книгой.",
          },
          {
            lead: "2-я неделя",
            text: "добавьте карточки: 10 новых карт в день с повторением 1-3-7.",
          },
          {
            lead: "3-я неделя",
            text: "выучите список из 10-15 элементов методом дворца памяти или ассоциаций и проверьте себя.",
          },
        ],
      },
    ],
  },
  {
    id: "matematika",
    title: "Математика",
    subtitle: "От базы до 4 шагов решения задач",
    intro:
      "Математика — не просто предмет о числах, это предмет о логическом мышлении. Она учит человека делить проблему на части, работать по правилам и проверять выводы. Программирование, инженерия, финансы и даже подсчёт скидки в повседневной жизни — всё опирается на математическое мышление. И главное: математика — не «талант», а навык, растущий от упражнений — вот эта дорожная карта.",
    sections: [
      {
        heading: "Укрепление базы",
        paragraphs: [
          "Трудность у большинства не в продвинутых темах, а в маленьких дырах в базе. Полное освоение следующих четырёх тем даст уверенность в алгебре и геометрии.",
        ],
        bullets: [
          {
            lead: "Арифметика",
            text: "быстро складывать, вычитать, умножать и делить без калькулятора — все следующие темы опираются на это.",
          },
          {
            lead: "Дроби и проценты",
            text: "1/2, 0.5 и 50% — три вида одного и того же. Нужно уметь быстро работать во всех трёх формах.",
          },
          {
            lead: "Пропорция",
            text: "если 2 кг яблок стоят 14 000, сколько стоят 5 кг? Такие задачи — сама повседневная жизнь.",
          },
          {
            lead: "Отрицательные числа и степени",
            text: "−(−5)=5, 2³=8, понятие квадратного корня — язык дальнейшей алгебры.",
          },
        ],
      },
      {
        heading: "4 шага решения задачи",
        paragraphs: [
          "Любая задача — от простой до сложной — решается одним и тем же порядком. Если сделать эти шаги привычкой, проблема «не знаю, с чего начать» исчезает.",
        ],
        bullets: [
          {
            lead: "1. Понять",
            text: "медленно прочитайте задачу. Что дано? Что именно нужно найти? Если нужно, нарисуйте короткую схему (рисунок).",
          },
          {
            lead: "2. Составить план",
            text: "какая формула или правило проходит здесь? Вспомните похожую старую задачу. Разделите задачу на маленькие шаги.",
          },
          {
            lead: "3. Решить",
            text: "записывайте каждый шаг — в устном счёте копятся скрытые ошибки. Один шаг — одно действие.",
          },
          {
            lead: "4. Проверить",
            text: "логичен ли ответ? (Человек не может пробежать 300 км за 5 часов.) Проверьте обратным путём или другим способом.",
          },
        ],
      },
      {
        heading: "Ключевые идеи алгебры и геометрии",
        bullets: [
          {
            lead: "Золотое правило уравнения",
            text: "чтобы сохранить равенство, делайте с обеими частями то, что делаете с уравнением. Это одно правило открывает всю алгебру.",
          },
          {
            lead: "Основные формулы",
            text: "периметр P=2(a+b), площадь S=a·b, теорема Пифагора a²+b²=c². Важнее выучить формулу — знать, где её применять.",
          },
          {
            lead: "Функция как машина",
            text: "f(x) — машина, которая берёт входное число и выдаёт результат. График — картина поведения этой машины.",
          },
          {
            lead: "Работа с чертежом",
            text: "в геометрии всегда рисуйте фигуру — если записать данные на рисунок, решение само начинает появляться.",
          },
        ],
      },
      {
        heading: "Ежедневная практика и как победить «страх математики»",
        bullets: [
          {
            lead: "20-30 минут в день",
            text: "5-10 задач, но каждый день. Решённую с ответом задачу потом решите сами с нуля.",
          },
          {
            lead: "Тетрадь ошибок",
            text: "записывайте каждую неудачную задачу: где я ошибся и какой правильный путь? Ошибки — лучший учитель.",
          },
          {
            lead: "Постепенное усложнение",
            text: "сначала решите много похожих задач; когда приходит новый тип задачи — разделите её на части и разберите.",
          },
          {
            lead: "Сменить мышление",
            text: "«я не математик» — фраза о неосвоенном навыке, а не о способности. Ежедневная практика меняет это убеждение.",
          },
        ],
      },
    ],
  },
  {
    id: "tarix",
    title: "История",
    subtitle:
      "Лента времени, причинно-следственные цепочки и интересные способы изучения",
    intro:
      "История — не сборник дат прошлого, это наука о том, как жили люди, какие ошибки совершали и чему мы можем из этого научиться. Знание истории показывает человеку корни, даёт критическое мышление и помогает глубже понимать события сегодняшнего дня. В этой статье мы рассмотрим интересные и эффективные способы изучения истории.",
    sections: [
      {
        heading: "Основные способы изучения истории",
        bullets: [
          {
            lead: "Лента времени (timeline)",
            text: "нарисуйте на большом листе века и разместите важные события. На ленте времени события видны «тканью» — что было раньше, а что позже, становится ясно.",
          },
          {
            lead: "Причинно-следственная цепочка",
            text: "задавайте каждому событию вопрос «почему?»: почему началась война, почему именно в это время? История состоит из причинно-следственных цепочек — увидите их, и даты запомнятся сами.",
          },
          {
            lead: "Карточки",
            text: "ведите три вида карточек: даты, личности (кто, что сделал, почему важен) и термины (ханство, эмират, диктатура...).",
          },
          {
            lead: "Работа с картой",
            text: "видеть на карте, как возникали и менялись государства, облегчает запоминание названий и территорий.",
          },
          {
            lead: "Критический взгляд на источники",
            text: "каждый источник (книга, фильм, статья) написан с какой-то точки зрения. Сравнение одного события по 2-3 источникам — начало навыка историка.",
          },
        ],
      },
      {
        heading: "Важные периоды истории Узбекистана",
        bullets: [
          {
            lead: "Древние государства",
            text: "Бактрия, Хорезм и Согд — древние государства Центральной Азии; согдийские купцы были мастерами Великого шёлкового пути.",
          },
          {
            lead: "Великий шёлковый путь",
            text: "великий торговый путь, соединявший Китай с Европой — Самарканд, Бухара и Хива были его богатейшими городами.",
          },
          {
            lead: "Эпоха Тимуридов",
            text: "возведение государства Амира Темура и расцвет науки, архитектуры и культуры в эпоху Тимуридов: обсерватория Улугбека, Навои и Бабур.",
          },
          {
            lead: "Эпоха трёх ханств",
            text: "в XIX веке Бухарский эмират, Хивинское и Кокандское ханства — взаимная борьба и процесс потери независимости.",
          },
          {
            lead: "Независимость",
            text: "31 августа 1991 года — день провозглашения независимости Узбекистана; начало новой истории.",
          },
        ],
      },
      {
        heading: "Направления всемирной истории",
        bullets: [
          {
            lead: "Древние цивилизации",
            text: "Египет, Месопотамия, Индия и Китай — первые города, письменность и законы появились именно там.",
          },
          {
            lead: "Великие географические открытия",
            text: "в XV-XVI веках открылись новые пути и континенты — мировая торговля объединилась.",
          },
          {
            lead: "Промышленная революция",
            text: "в XVIII-XIX веках паровая машина и фабрики — коренное изменение уклада жизни.",
          },
          {
            lead: "XX век",
            text: "две мировые войны, научно-технический прогресс и формирование современного международного порядка.",
          },
        ],
      },
      {
        heading: "Учиться интересно",
        bullets: [
          {
            lead: "Исторические документальные фильмы",
            text: "показанный фильм или документальный сериал — отличный вход в тему; потом углубляйтесь в книгах.",
          },
          {
            lead: "Творческие задания",
            text: "напишите «интервью» с исторической личностью или ведите дневник того дня от её имени — проживание внутри события укрепляет его.",
          },
          {
            lead: "Исторические романы",
            text: "хороший роман даёт почувствовать историю; но не забудьте проверить факты романа по историческим источникам.",
          },
          {
            lead: "Проверка тестами",
            text: "решайте исторические тесты в разделе «Тесты» Randap — сразу оцените свои знания и наберите баллы.",
          },
        ],
      },
    ],
  },
];

const TOPICS_BY_LANG: Record<"en" | "ru", OrganishTopicContent[] | null> = {
  en: TOPICS_EN,
  ru: TOPICS_RU,
};

/** Tilga qarab 4 mavzuni qaytaradi (uz — asl matn, en/ru — tarjima). */
export function getOrganishTopics(lang: string): OrganishTopic[] {
  const translated = TOPICS_BY_LANG[lang as "en" | "ru"];
  if (!translated) return ORGANISH_TOPICS;
  return ORGANISH_TOPICS.map((base, i) => ({
    ...base,
    ...translated[i],
  }));
}

export type BurchSection = {
  heading: string;
  bullets: { lead: string; text: string }[];
};

export const HAYOT_BURCHLARI = {
  title: "Din va hayot burchlari",
  subtitle:
    "Ichki asosdan jamiyatgacha: e'tiqod, ibodat, ezgulik va tabiatga munosabat",
  sections: [
    {
      heading: "1. E'tiqod va tanish (Ichki asos)",
      bullets: [
        {
          lead: "Yagonaligini tan olish",
          text: "Xudoning borligi va yagonaligiga chin dildan ishonish hamda unga hech narsani sherik qilmaslik eng birinchi qadamdir.",
        },
        {
          lead: "Uni tanish (Ma'rifat)",
          text: "Xudoning ismlari, sifatlari va qudratini koinotdagi yaratilgan narsalar orqali tafakkur qilish.",
        },
      ],
    },
    {
      heading: "2. Asosiy ibodatlarni ado etish",
      bullets: [
        {
          lead: "Zikr va duo",
          text: "Xudoni tez-tez eslash, undan yordam so'rash va bergan ne'matlari uchun shukr qilish.",
        },
        {
          lead: "Farz ibodatlar",
          text: "Islomda kunlik besh vaqt namoz o'qish, Ramazon oyida ro'za tutish, imkoniyat bo'lsa zakot berish va haj ziyoratini bajarish asosiy vazifalar sanaladi.",
        },
      ],
    },
    {
      heading: "3. Go'zal xulq va ezgulik (Jamiyat oldidagi burch)",
      bullets: [
        {
          lead: "Yaxshilik qilish",
          text: "Ota-onaga hurmat ko'rsatish, qo'shnilarga, muhtojlarga va barcha insonlarga yordam qo'lini cho'zish.",
        },
        {
          lead: "Halollik va adolat",
          text: "Har bir ishda rostgo'y bo'lish, birovning haqqiga xiyonat qilmaslik va halol mehnat bilan kun kechirish.",
        },
        {
          lead: "Yomonlikdan tiyilish",
          text: "Yolg'on gapirish, g'iybat qilish, zulm o'tkazish va boshqalarga zarar yetkazish kabi qaytariqlardan saqlanish.",
        },
      ],
    },
    {
      heading: "4. Tabiat va jonzotlarga munosabat",
      bullets: [
        {
          lead: "Omonatga sadoqat",
          text: "Atrof-muhitni asrash, hayvonlar va o'simliklarga ozor bermaslik ham Yaratuvchining yaratganlariga bo'lgan hurmat belgisidir.",
        },
      ],
    },
  ],
  question:
    "Ushbu amallardan qaysi biri haqida batafsilroq ma'lumot olishni xohlaysiz?",
  options: [
    "Ibodatlar tartibi (namoz, ro'za yoki duo qilish qoidalari)",
    "Islom axloqi va kundalik hayotdagi odoblar",
    "Boshqa dinlardagi vazifa va ibodat turlari",
  ],
} as const;
