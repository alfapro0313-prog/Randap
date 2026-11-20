/**
 * Geografiya savollari generatori — poytaxtlar, daryolar, tog'lar, okeanlar,
 * O'zbekiston viloyatlari va superlativ faktlar bazasidan savollar yasaydi.
 */
import {
  dedupe,
  optionsFor,
  rangeInt,
  rngOf,
  same,
  shuffle,
  type L3,
  type QGen,
  type Rng,
} from "./gen-core";

type Country = { c: L3; cap: L3; cont: L3 };

const CONT: Record<string, L3> = {
  eu: { uz: "Yevropa", ru: "Европа", en: "Europe" },
  as: { uz: "Osiyo", ru: "Азия", en: "Asia" },
  af: { uz: "Afrika", ru: "Африка", en: "Africa" },
  na: { uz: "Shimoliy Amerika", ru: "Северная Америка", en: "North America" },
  sa: { uz: "Janubiy Amerika", ru: "Южная Америка", en: "South America" },
  oc: { uz: "Okeaniya", ru: "Океания", en: "Oceania" },
};

const C = (uz: string, ru: string, en: string, capUz: string, capRu: string, capEn: string, cont: string): Country => ({
  c: { uz, ru, en },
  cap: { uz: capUz, ru: capRu, en: capEn },
  cont: CONT[cont] as L3,
});

const COUNTRIES: Country[] = [
  C("O'zbekiston", "Узбекистан", "Uzbekistan", "Toshkent", "Ташкент", "Tashkent", "as"),
  C("Qozog'iston", "Казахстан", "Kazakhstan", "Astana", "Астана", "Astana", "as"),
  C("Qirg'iziston", "Киргизия", "Kyrgyzstan", "Bishkek", "Бишкек", "Bishkek", "as"),
  C("Tojikiston", "Таджикистан", "Tajikistan", "Dushanbe", "Душанбе", "Dushanbe", "as"),
  C("Turkmaniston", "Туркмения", "Turkmenistan", "Ashxobod", "Ашхабад", "Ashgabat", "as"),
  C("Xitoy", "Китай", "China", "Pekin", "Пекин", "Beijing", "as"),
  C("Yaponiya", "Япония", "Japan", "Tokio", "Токио", "Tokyo", "as"),
  C("Janubiy Koreya", "Южная Корея", "South Korea", "Seul", "Сеул", "Seoul", "as"),
  C("Hindiston", "Индия", "India", "Yangi Dehli", "Нью-Дели", "New Delhi", "as"),
  C("Pokiston", "Пакистан", "Pakistan", "Islomobod", "Исламабад", "Islamabad", "as"),
  C("Afg'oniston", "Афганистан", "Afghanistan", "Kobul", "Кабул", "Kabul", "as"),
  C("Eron", "Иран", "Iran", "Tehron", "Тегеран", "Tehran", "as"),
  C("Iroq", "Ирак", "Iraq", "Bag'dod", "Багдад", "Baghdad", "as"),
  C("Suriya", "Сирия", "Syria", "Damashq", "Дамаск", "Damascus", "as"),
  C("Saudiya Arabistoni", "Саудовская Аравия", "Saudi Arabia", "Riyod", "Рияд", "Riyadh", "as"),
  C("Yaman", "Йемен", "Yemen", "Sano", "Сана", "Sanaa", "as"),
  C("BAA", "ОАЭ", "UAE", "Abu-Dabi", "Абу-Даби", "Abu Dhabi", "as"),
  C("Qatar", "Катар", "Qatar", "Doha", "Доха", "Doha", "as"),
  C("Gruziya", "Грузия", "Georgia", "Tbilisi", "Тбилиси", "Tbilisi", "as"),
  C("Armaniston", "Армения", "Armenia", "Yerevan", "Ереван", "Yerevan", "as"),
  C("Ozarbayjon", "Азербайджан", "Azerbaijan", "Boku", "Баку", "Baku", "as"),
  C("Turkiya", "Турция", "Turkey", "Anqara", "Анкара", "Ankara", "as"),
  C("Bangladesh", "Бангладеш", "Bangladesh", "Dakka", "Дакка", "Dhaka", "as"),
  C("Tailand", "Таиланд", "Thailand", "Bangkok", "Бангкок", "Bangkok", "as"),
  C("Vyetnam", "Вьетнам", "Vietnam", "Xanoy", "Ханой", "Hanoi", "as"),
  C("Indoneziya", "Индонезия", "Indonesia", "Jakarta", "Джакарта", "Jakarta", "as"),
  C("Malayziya", "Малайзия", "Malaysia", "Kuala-Lumpur", "Куала-Лумпур", "Kuala Lumpur", "as"),
  C("Filippin", "Филиппины", "Philippines", "Manila", "Манила", "Manila", "as"),
  C("Mongoliya", "Монголия", "Mongolia", "Ulan-Bator", "Улан-Батор", "Ulaanbaatar", "as"),
  C("Nepal", "Непал", "Nepal", "Katmandu", "Катманду", "Kathmandu", "as"),
  C("Fransiya", "Франция", "France", "Parij", "Париж", "Paris", "eu"),
  C("Germaniya", "Германия", "Germany", "Berlin", "Берлин", "Berlin", "eu"),
  C("Buyuk Britaniya", "Великобритания", "United Kingdom", "London", "Лондон", "London", "eu"),
  C("Italiya", "Италия", "Italy", "Rim", "Рим", "Rome", "eu"),
  C("Ispaniya", "Испания", "Spain", "Madrid", "Мадрид", "Madrid", "eu"),
  C("Portugaliya", "Португалия", "Portugal", "Lissabon", "Лиссабон", "Lisbon", "eu"),
  C("Gollandiya", "Нидерланды", "Netherlands", "Amsterdam", "Амстердам", "Amsterdam", "eu"),
  C("Belgiya", "Бельгия", "Belgium", "Bryussel", "Брюссель", "Brussels", "eu"),
  C("Shveytsariya", "Швейцария", "Switzerland", "Bern", "Берн", "Bern", "eu"),
  C("Avstriya", "Австрия", "Austria", "Vena", "Вена", "Vienna", "eu"),
  C("Polsha", "Польша", "Poland", "Varshava", "Варшава", "Warsaw", "eu"),
  C("Chexiya", "Чехия", "Czechia", "Praga", "Прага", "Prague", "eu"),
  C("Slovakiya", "Словакия", "Slovakia", "Bratislava", "Братислава", "Bratislava", "eu"),
  C("Vengriya", "Венгрия", "Hungary", "Budapesht", "Будапешт", "Budapest", "eu"),
  C("Rumyniya", "Румыния", "Romania", "Buxarest", "Бухарест", "Bucharest", "eu"),
  C("Bolgariya", "Болгария", "Bulgaria", "Sofiya", "София", "Sofia", "eu"),
  C("Gretsiya", "Греция", "Greece", "Afina", "Афины", "Athens", "eu"),
  C("Shvetsiya", "Швеция", "Sweden", "Stokgolm", "Стокгольм", "Stockholm", "eu"),
  C("Norvegiya", "Норвегия", "Norway", "Oslo", "Осло", "Oslo", "eu"),
  C("Finlandiya", "Финляндия", "Finland", "Xelsinki", "Хельсинки", "Helsinki", "eu"),
  C("Daniya", "Дания", "Denmark", "Kopengagen", "Копенгаген", "Copenhagen", "eu"),
  C("Islandiya", "Исландия", "Iceland", "Reykyavik", "Рейкьявик", "Reykjavik", "eu"),
  C("Irlandiya", "Ирландия", "Ireland", "Dublin", "Дублин", "Dublin", "eu"),
  C("Ukraina", "Украина", "Ukraine", "Kiyev", "Киев", "Kyiv", "eu"),
  C("Belarus", "Беларусь", "Belarus", "Minsk", "Минск", "Minsk", "eu"),
  C("Moldova", "Молдова", "Moldova", "Kishinyov", "Кишинёв", "Chisinau", "eu"),
  C("Rossiya", "Россия", "Russia", "Moskva", "Москва", "Moscow", "eu"),
  C("Estoniya", "Эстония", "Estonia", "Tallin", "Таллин", "Tallinn", "eu"),
  C("Latviya", "Латвия", "Latvia", "Riga", "Рига", "Riga", "eu"),
  C("Litva", "Литва", "Lithuania", "Vilnyus", "Вильнюс", "Vilnius", "eu"),
  C("Serbiya", "Сербия", "Serbia", "Belgrad", "Белград", "Belgrade", "eu"),
  C("Xorvatiya", "Хорватия", "Croatia", "Zagreb", "Загреб", "Zagreb", "eu"),
  C("Albaniya", "Албания", "Albania", "Tirana", "Тирана", "Tirana", "eu"),
  C("Misr", "Египет", "Egypt", "Qohira", "Каир", "Cairo", "af"),
  C("Liviya", "Ливия", "Libya", "Tripoli", "Триполи", "Tripoli", "af"),
  C("Tunis", "Тунис", "Tunisia", "Tunis", "Тунис", "Tunis", "af"),
  C("Jazoir", "Алжир", "Algeria", "Jazoir", "Алжир", "Algiers", "af"),
  C("Marokash", "Марокко", "Morocco", "Rabot", "Рабат", "Rabat", "af"),
  C("Sudan", "Судан", "Sudan", "Xartum", "Хартум", "Khartoum", "af"),
  C("Efiopiya", "Эфиопия", "Ethiopia", "Addis-Abeba", "Аддис-Абеба", "Addis Ababa", "af"),
  C("Keniya", "Кения", "Kenya", "Nayrobi", "Найроби", "Nairobi", "af"),
  C("Tanzaniya", "Танзания", "Tanzania", "Dodoma", "Додома", "Dodoma", "af"),
  C("Uganda", "Уганда", "Uganda", "Kampala", "Кампала", "Kampala", "af"),
  C("Nigeriya", "Нигерия", "Nigeria", "Abuja", "Абуджа", "Abuja", "af"),
  C("Gana", "Гана", "Ghana", "Akra", "Аккра", "Accra", "af"),
  C("Senegal", "Сенегал", "Senegal", "Dakar", "Дакар", "Dakar", "af"),
  C("Mali", "Мали", "Mali", "Bamako", "Бамако", "Bamako", "af"),
  C("Chad", "Чад", "Chad", "Njamena", "Нджамена", "N'Djamena", "af"),
  C("Kamerun", "Камерун", "Cameroon", "Yaunde", "Яунде", "Yaounde", "af"),
  C("Angola", "Ангола", "Angola", "Luanda", "Луанда", "Luanda", "af"),
  C("Zambiya", "Замбия", "Zambia", "Lusaka", "Лусака", "Lusaka", "af"),
  C("Zimbabve", "Зимбабве", "Zimbabwe", "Xarare", "Хараре", "Harare", "af"),
  C("Mozambik", "Мозамбик", "Mozambique", "Maputu", "Мапуту", "Maputo", "af"),
  C("Janubiy Afrika", "ЮАР", "South Africa", "Pretoriya", "Претория", "Pretoria", "af"),
  C("Madagaskar", "Мадагаскар", "Madagascar", "Antananarivu", "Антананариву", "Antananarivo", "af"),
  C("AQSh", "США", "USA", "Vashington", "Вашингтон", "Washington", "na"),
  C("Kanada", "Канада", "Canada", "Ottava", "Оттава", "Ottawa", "na"),
  C("Meksika", "Мексика", "Mexico", "Mexiko", "Мехико", "Mexico City", "na"),
  C("Kuba", "Куба", "Cuba", "Gavana", "Гавана", "Havana", "na"),
  C("Gvatemala", "Гватемала", "Guatemala", "Gvatemala", "Гватемала", "Guatemala City", "na"),
  C("Kolumbiya", "Колумбия", "Colombia", "Bogota", "Богота", "Bogota", "sa"),
  C("Venesuela", "Венесуэла", "Venezuela", "Karakas", "Каракас", "Caracas", "sa"),
  C("Ekvador", "Эквадор", "Ecuador", "Kito", "Кито", "Quito", "sa"),
  C("Peru", "Перу", "Peru", "Lima", "Лима", "Lima", "sa"),
  C("Boliviya", "Боливия", "Bolivia", "La-Pas", "Ла-Пас", "La Paz", "sa"),
  C("Braziliya", "Бразилия", "Brazil", "Brazilia", "Бразилиа", "Brasilia", "sa"),
  C("Paragvay", "Парагвай", "Paraguay", "Asunsion", "Асунсьон", "Asuncion", "sa"),
  C("Urugvay", "Уругвай", "Uruguay", "Montevideo", "Монтевидео", "Montevideo", "sa"),
  C("Argentina", "Аргентина", "Argentina", "Buenos-Ayres", "Буэнос-Айрес", "Buenos Aires", "sa"),
  C("Chili", "Чили", "Chile", "Santyago", "Сантьяго", "Santiago", "sa"),
  C("Avstraliya", "Австралия", "Australia", "Kanberra", "Канберра", "Canberra", "oc"),
  C("Yangi Zelandiya", "Новая Зеландия", "New Zealand", "Velington", "Веллингтон", "Wellington", "oc"),
  C("Papua — Yangi Gvineya", "Папуа — Новая Гвинея", "Papua New Guinea", "Port-Morsbi", "Порт-Морсби", "Port Moresby", "oc"),
];

type River = { n: L3; place: L3 };
const RIVERS: River[] = [
  { n: { uz: "Nil", ru: "Нил", en: "The Nile" }, place: { uz: "Afrika", ru: "Африка", en: "Africa" } },
  { n: { uz: "Amazonka", ru: "Амазонка", en: "The Amazon" }, place: { uz: "Janubiy Amerika", ru: "Южная Америка", en: "South America" } },
  { n: { uz: "Yangtsi", ru: "Янцзы", en: "The Yangtze" }, place: { uz: "Xitoy", ru: "Китай", en: "China" } },
  { n: { uz: "Xuangxe", ru: "Хуанхэ", en: "The Yellow River" }, place: { uz: "Xitoy", ru: "Китай", en: "China" } },
  { n: { uz: "Volga", ru: "Волга", en: "The Volga" }, place: { uz: "Rossiya", ru: "Россия", en: "Russia" } },
  { n: { uz: "Dnepr", ru: "Днепр", en: "The Dnieper" }, place: { uz: "Ukraina", ru: "Украина", en: "Ukraine" } },
  { n: { uz: "Amudaryo", ru: "Амударья", en: "The Amu Darya" }, place: { uz: "Markaziy Osiyo", ru: "Центральная Азия", en: "Central Asia" } },
  { n: { uz: "Sirdaryo", ru: "Сырдарья", en: "The Syr Darya" }, place: { uz: "Markaziy Osiyo", ru: "Центральная Азия", en: "Central Asia" } },
  { n: { uz: "Danay", ru: "Дунай", en: "The Danube" }, place: { uz: "Yevropa", ru: "Европа", en: "Europe" } },
  { n: { uz: "Reyn", ru: "Рейн", en: "The Rhine" }, place: { uz: "Germaniya", ru: "Германия", en: "Germany" } },
  { n: { uz: "Gang", ru: "Ганг", en: "The Ganges" }, place: { uz: "Hindiston", ru: "Индия", en: "India" } },
  { n: { uz: "Ind", ru: "Инд", en: "The Indus" }, place: { uz: "Pokiston", ru: "Пакистан", en: "Pakistan" } },
  { n: { uz: "Missisipi", ru: "Миссисипи", en: "The Mississippi" }, place: { uz: "AQSh", ru: "США", en: "the USA" } },
  { n: { uz: "Mekong", ru: "Меконг", en: "The Mekong" }, place: { uz: "Janubi-sharqiy Osiyo", ru: "Юго-Восточная Азия", en: "Southeast Asia" } },
];

type Mountain = { n: L3; place: L3; h: string };
const MOUNTAINS: Mountain[] = [
  { n: { uz: "Everest (Jomolungma)", ru: "Эверест (Джомолунгма)", en: "Everest" }, place: { uz: "Himoloy", ru: "Гималаи", en: "the Himalayas" }, h: "8848" },
  { n: { uz: "Elbrus", ru: "Эльбрус", en: "Elbrus" }, place: { uz: "Kavkaz", ru: "Кавказ", en: "the Caucasus" }, h: "5642" },
  { n: { uz: "Xazrati Sulton", ru: "Хазрат-Султан", en: "Khazrati Sulton" }, place: { uz: "Turkiston tizmasi", ru: "Таласский Ала-Тоо", en: "the Turkestan Range" }, h: "4643" },
  { n: { uz: "Chimyon", ru: "Чимган", en: "Chimgan" }, place: { uz: "Tyan-Shan", ru: "Тянь-Шань", en: "the Tien Shan" }, h: "3309" },
  { n: { uz: "Kilimanjaro", ru: "Килиманджаро", en: "Kilimanjaro" }, place: { uz: "Afrika", ru: "Африка", en: "Africa" }, h: "5895" },
  { n: { uz: "Akonkagua", ru: "Аконкагуа", en: "Aconcagua" }, place: { uz: "Andlar", ru: "Анды", en: "the Andes" }, h: "6961" },
  { n: { uz: "Montblan", ru: "Монблан", en: "Mont Blanc" }, place: { uz: "Alp tog'lari", ru: "Альпы", en: "the Alps" }, h: "4808" },
  { n: { uz: "Fujisan", ru: "Фудзияма", en: "Mount Fuji" }, place: { uz: "Yaponiya", ru: "Япония", en: "Japan" }, h: "3776" },
  { n: { uz: "Denali", ru: "Денали", en: "Denali" }, place: { uz: "Shimoliy Amerika", ru: "Северная Америка", en: "North America" }, h: "6190" },
];

type Region = { r: L3; cap: L3 };
const UZ_REGIONS: Region[] = [
  { r: { uz: "Andijon viloyati", ru: "Андижанская область", en: "Andijan region" }, cap: { uz: "Andijon", ru: "Андижан", en: "Andijan" } },
  { r: { uz: "Buxoro viloyati", ru: "Бухарская область", en: "Bukhara region" }, cap: { uz: "Buxoro", ru: "Бухара", en: "Bukhara" } },
  { r: { uz: "Farg'ona viloyati", ru: "Ферганская область", en: "Fergana region" }, cap: { uz: "Farg'ona", ru: "Фергана", en: "Fergana" } },
  { r: { uz: "Jizzax viloyati", ru: "Джизакская область", en: "Jizzakh region" }, cap: { uz: "Jizzax", ru: "Джизак", en: "Jizzakh" } },
  { r: { uz: "Xorazm viloyati", ru: "Хорезмская область", en: "Khorezm region" }, cap: { uz: "Urganch", ru: "Ургенч", en: "Urgench" } },
  { r: { uz: "Namangan viloyati", ru: "Наманганская область", en: "Namangan region" }, cap: { uz: "Namangan", ru: "Наманган", en: "Namangan" } },
  { r: { uz: "Navoiy viloyati", ru: "Навоийская область", en: "Navoi region" }, cap: { uz: "Navoiy", ru: "Навои", en: "Navoi" } },
  { r: { uz: "Qashqadaryo viloyati", ru: "Кашкадарьинская область", en: "Kashkadarya region" }, cap: { uz: "Qarshi", ru: "Карши", en: "Karshi" } },
  { r: { uz: "Qoraqalpog'iston Respublikasi", ru: "Республика Каракалпакстан", en: "Republic of Karakalpakstan" }, cap: { uz: "Nukus", ru: "Нукус", en: "Nukus" } },
  { r: { uz: "Samarqand viloyati", ru: "Самаркандская область", en: "Samarkand region" }, cap: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" } },
  { r: { uz: "Sirdaryo viloyati", ru: "Сырдарьинская область", en: "Sirdaryo region" }, cap: { uz: "Guliston", ru: "Гулистан", en: "Gulistan" } },
  { r: { uz: "Surxondaryo viloyati", ru: "Сурхандарьинская область", en: "Surkhandarya region" }, cap: { uz: "Termiz", ru: "Термез", en: "Termez" } },
  { r: { uz: "Toshkent viloyati", ru: "Ташкентская область", en: "Tashkent region" }, cap: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" } },
];

type Fact = { q: L3; a: L3; d: L3[] };
const GEO_FACTS: Fact[] = [
  {
    q: { uz: "Dunyodagi eng katta okean qaysi?", ru: "Какой океан самый большой?", en: "Which ocean is the largest?" },
    a: { uz: "Tinch okeani", ru: "Тихий океан", en: "The Pacific Ocean" },
    d: [
      { uz: "Atlantika okeani", ru: "Атлантический океан", en: "The Atlantic Ocean" },
      { uz: "Hind okeani", ru: "Индийский океан", en: "The Indian Ocean" },
      { uz: "Shimoliy Muz okeani", ru: "Северный Ледовитый океан", en: "The Arctic Ocean" },
    ],
  },
  {
    q: { uz: "Dunyodagi eng uzun daryo qaysi?", ru: "Какая река самая длинная в мире?", en: "Which river is the longest in the world?" },
    a: { uz: "Nil", ru: "Нил", en: "The Nile" },
    d: [
      { uz: "Amazonka", ru: "Амазонка", en: "The Amazon" },
      { uz: "Yangtsi", ru: "Янцзы", en: "The Yangtze" },
      { uz: "Volga", ru: "Волга", en: "The Volga" },
    ],
  },
  {
    q: { uz: "Dunyodagi eng katta cho'l (issiq cho'l) qaysi?", ru: "Какая пустыня самая большая (жаркая) в мире?", en: "Which is the largest (hot) desert in the world?" },
    a: { uz: "Sahroi Kabir", ru: "Сахара", en: "The Sahara" },
    d: [
      { uz: "Qizilqum", ru: "Кызылкум", en: "The Kyzylkum" },
      { uz: "Gobi", ru: "Гоби", en: "The Gobi" },
      { uz: "Karakum", ru: "Каракумы", en: "The Karakum" },
    ],
  },
  {
    q: { uz: "Dunyodagi eng chuqur ko'l qaysi?", ru: "Какое озеро самое глубокое в мире?", en: "Which lake is the deepest in the world?" },
    a: { uz: "Baykal", ru: "Байкал", en: "Lake Baikal" },
    d: [
      { uz: "Kaspiy dengizi", ru: "Каспийское море", en: "The Caspian Sea" },
      { uz: "Victoria ko'li", ru: "озеро Виктория", en: "Lake Victoria" },
      { uz: "Balxash ko'li", ru: "озеро Балхаш", en: "Lake Balkhash" },
    ],
  },
  {
    q: { uz: "Hududi eng katta davlat qaysi?", ru: "Какая страна самая большая по территории?", en: "Which country has the largest territory?" },
    a: { uz: "Rossiya", ru: "Россия", en: "Russia" },
    d: [
      { uz: "Xitoy", ru: "Китай", en: "China" },
      { uz: "Kanada", ru: "Канада", en: "Canada" },
      { uz: "AQSh", ru: "США", en: "the USA" },
    ],
  },
  {
    q: { uz: "Hududi eng kichik davlat qaysi?", ru: "Какая страна самая маленькая по территории?", en: "Which is the smallest country in the world?" },
    a: { uz: "Vatikan", ru: "Ватикан", en: "Vatican City" },
    d: [
      { uz: "Monako", ru: "Монако", en: "Monaco" },
      { uz: "Malta", ru: "Мальта", en: "Malta" },
      { uz: "San-Marino", ru: "Сан-Марино", en: "San Marino" },
    ],
  },
  {
    q: { uz: "Dunyodagi eng ko'p aholi yashaydigan davlat qaysi?", ru: "В какой стране самая большая численность населения?", en: "Which country has the largest population?" },
    a: { uz: "Hindiston", ru: "Индия", en: "India" },
    d: [
      { uz: "Xitoy", ru: "Китай", en: "China" },
      { uz: "AQSh", ru: "США", en: "the USA" },
      { uz: "Indoneziya", ru: "Индонезия", en: "Indonesia" },
    ],
  },
  {
    q: { uz: "Yer yuzida nechta qit'a bor?", ru: "Сколько материков на Земле?", en: "How many continents are there on Earth?" },
    a: same("6"),
    d: [same("5"), same("7"), same("4")],
  },
  {
    q: { uz: "Yer yuzida nechta okean bor?", ru: "Сколько океанов на Земле?", en: "How many oceans are there on Earth?" },
    a: same("5"),
    d: [same("4"), same("6"), same("3")],
  },
  {
    q: { uz: "O'zbekiston nechta viloyatdan iborat (Qoraqalpog'istondan tashqari)?", ru: "Из скольких областей состоит Узбекистан (без Каракалпакстана)?", en: "How many regions does Uzbekistan have (excluding Karakalpakstan)?" },
    a: same("12"),
    d: [same("10"), same("14"), same("11")],
  },
  {
    q: { uz: "Yevropadagi eng uzun daryo qaysi?", ru: "Какая река самая длинная в Европе?", en: "Which is the longest river in Europe?" },
    a: { uz: "Volga", ru: "Волга", en: "The Volga" },
    d: [
      { uz: "Danay", ru: "Дунай", en: "The Danube" },
      { uz: "Reyn", ru: "Рейн", en: "The Rhine" },
      { uz: "Dnepr", ru: "Днепр", en: "The Dnieper" },
    ],
  },
  {
    q: { uz: "Yevropadagi eng baland tog' cho'qqisi qaysi?", ru: "Какая вершина самая высокая в Европе?", en: "Which is the highest peak in Europe?" },
    a: { uz: "Elbrus", ru: "Эльбрус", en: "Elbrus" },
    d: [
      { uz: "Montblan", ru: "Монблан", en: "Mont Blanc" },
      { uz: "Everest", ru: "Эверест", en: "Everest" },
      { uz: "Kilimanjaro", ru: "Килиманджаро", en: "Kilimanjaro" },
    ],
  },
  {
    q: { uz: "Janubiy Amerikadagi eng quruq cho'l qaysi?", ru: "Какая пустыня самая сухая в Южной Америке?", en: "Which is the driest desert in South America?" },
    a: { uz: "Atakama", ru: "Атакама", en: "The Atacama" },
    d: [
      { uz: "Sahroi Kabir", ru: "Сахара", en: "The Sahara" },
      { uz: "Gobi", ru: "Гоби", en: "The Gobi" },
      { uz: "Qizilqum", ru: "Кызылкум", en: "The Kyzylkum" },
    ],
  },
];

/* ---------------- GENERATORLAR ---------------- */

function capQ(rng: Rng, rows: Country[], i: number): QGen {
  const r = rows[i] as Country;
  const distr = rows.filter((x) => x.cap.uz !== r.cap.uz).map((x) => x.cap);
  const { o, correct } = optionsFor(rng, r.cap, shuffle(rng, distr));
  return {
    t: {
      uz: `«${r.c.uz}» poytaxti qaysi shahar?`,
      ru: `Какая столица у страны «${r.c.ru}»?`,
      en: `What is the capital of “${r.c.en}”?`,
    },
    o,
    correct,
  };
}

function countryQ(rng: Rng, rows: Country[], i: number): QGen {
  const r = rows[i] as Country;
  const distr = rows.filter((x) => x.c.uz !== r.c.uz).map((x) => x.c);
  const { o, correct } = optionsFor(rng, r.c, shuffle(rng, distr));
  return {
    t: {
      uz: `«${r.cap.uz}» shahri — qaysi davlatning poytaxti?`,
      ru: `Город «${r.cap.ru}» — столица какой страны?`,
      en: `The city of “${r.cap.en}” is the capital of which country?`,
    },
    o,
    correct,
  };
}

function contQ(rng: Rng, rows: Country[], i: number): QGen {
  const r = rows[i] as Country;
  const distr = Object.values(CONT).filter((x) => x.uz !== r.cont.uz);
  const { o, correct } = optionsFor(rng, r.cont, shuffle(rng, distr));
  return {
    t: {
      uz: `«${r.c.uz}» davlati qaysi qit'ada joylashgan?`,
      ru: `На каком материке находится страна «${r.c.ru}»?`,
      en: `On which continent is “${r.c.en}” located?`,
    },
    o,
    correct,
  };
}

function contQHard(rng: Rng, rows: Country[], i: number): QGen {
  const r = rows[i] as Country;
  const distr = Object.values(CONT).filter((x) => x.uz !== r.cont.uz);
  const { o, correct } = optionsFor(rng, r.cont, shuffle(rng, distr));
  return {
    t: {
      uz: `«${r.c.uz}» qaysi qit'a bilan bog'liq?`,
      ru: `С каким материком связана страна «${r.c.ru}»?`,
      en: `With which continent is “${r.c.en}” associated?`,
    },
    o,
    correct,
  };
}

function capQHard(rng: Rng, rows: Country[], i: number): QGen {
  const r = rows[i] as Country;
  const distr = rows.filter((x) => x.c.uz !== r.c.uz).map((x) => x.c);
  const { o, correct } = optionsFor(rng, r.c, shuffle(rng, distr));
  return {
    t: {
      uz: `${r.cap.uz} shahri davlat poytaxti sifatida qaysi davlatga tegishli?`,
      ru: `Город ${r.cap.ru} как столица относится к какой стране?`,
      en: `As a national capital, the city of ${r.cap.en} belongs to which country?`,
    },
    o,
    correct,
  };
}

function riverQ(rng: Rng, i: number): QGen {
  const r = RIVERS[i] as River;
  const distr = RIVERS.filter((x) => x.n.uz !== r.n.uz).map((x) => x.n);
  const { o, correct } = optionsFor(rng, r.place, shuffle(rng, distr));
  return {
    t: {
      uz: `«${r.n.uz}» daryosi qayerda joylashgan / oqadi?`,
      ru: `Где расположена (протекает) река «${r.n.ru}»?`,
      en: `Where is the ${r.n.en} located?`,
    },
    o,
    correct,
  };
}

function mountainQ(rng: Rng, i: number): QGen {
  const m = MOUNTAINS[i] as Mountain;
  const distr = MOUNTAINS.filter((x) => x.n.uz !== m.n.uz).map((x) => x.place);
  const { o, correct } = optionsFor(rng, m.place, shuffle(rng, distr));
  return {
    t: {
      uz: `«${m.n.uz}» tog'i qayerda joylashgan?`,
      ru: `Где находится гора «${m.n.ru}»?`,
      en: `Where is ${m.n.en} located?`,
    },
    o,
    correct,
  };
}

function mountainHQ(rng: Rng, i: number): QGen {
  const m = MOUNTAINS[i] as Mountain;
  const distr = MOUNTAINS.filter((x) => x.h !== m.h).map((x) => x.h);
  const { o, correct } = optionsFor(rng, { uz: m.h, ru: m.h, en: m.h }, distr.map((h) => ({ uz: h, ru: h, en: h })));
  return {
    t: {
      uz: `«${m.n.uz}» cho'qqisining balandligi qancha (metr)?`,
      ru: `Какова высота вершины «${m.n.ru}» (в метрах)?`,
      en: `What is the height of ${m.n.en} (in metres)?`,
    },
    o,
    correct,
  };
}

function regionQ(rng: Rng, i: number): QGen {
  const r = UZ_REGIONS[i] as Region;
  const distr = UZ_REGIONS.filter((x) => x.cap.uz !== r.cap.uz).map((x) => x.cap);
  const { o, correct } = optionsFor(rng, r.cap, shuffle(rng, distr));
  return {
    t: {
      uz: `«${r.r.uz}» markazi qaysi shahar?`,
      ru: `Какой город является центром «${r.r.ru}»?`,
      en: `What is the centre of the “${r.r.en}”?`,
    },
    o,
    correct,
  };
}

function factQ(rng: Rng, f: Fact): QGen {
  const { o, correct } = optionsFor(rng, f.a, shuffle(rng, f.d));
  return { t: f.q, o, correct };
}

function genGeoBank(dif: string): QGen[] {
  const rng = rngOf(`geo-${dif}`);
  const out: QGen[] = [];
  for (let i = 0; i < COUNTRIES.length; i++) {
    if (dif === "easy") {
      out.push(capQ(rng, COUNTRIES, i), countryQ(rng, COUNTRIES, i), contQ(rng, COUNTRIES, i));
    } else if (dif === "middle") {
      out.push(countryQ(rng, COUNTRIES, i), contQ(rng, COUNTRIES, i), capQ(rng, COUNTRIES, i), capQHard(rng, COUNTRIES, i));
    } else {
      out.push(contQHard(rng, COUNTRIES, i), capQHard(rng, COUNTRIES, i), capQ(rng, COUNTRIES, i));
    }
  }
  for (let i = 0; i < RIVERS.length; i++) out.push(riverQ(rng, i));
  for (let i = 0; i < MOUNTAINS.length; i++) {
    out.push(mountainQ(rng, i));
    if (dif !== "easy") out.push(mountainHQ(rng, i));
  }
  for (let i = 0; i < UZ_REGIONS.length; i++) out.push(regionQ(rng, i));
  const factRep = dif === "easy" ? 5 : dif === "middle" ? 4 : 6;
  for (let k = 0; k < factRep; k++) {
    for (const f of GEO_FACTS) out.push(factQ(rng, f));
  }
  return dedupe(out);
}

export function genGeografiya(dif: string): QGen[] {
  return genGeoBank(dif);
}

void rangeInt;
