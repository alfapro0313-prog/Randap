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
