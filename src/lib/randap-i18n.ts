/**
 * Randap global i18n — til tanlash HAMMA bo'limlarga tegishli.
 * Tillar: en (default), ru, uz.
 * Ushbu fayl faqat UI (interfeys) matnlari uchun. DB va maqola kontenti
 * alohida fayllarda lokalizatsiya qilinadi (randap-content-i18n, randap-organish).
 */

export type Lang = "en" | "ru" | "uz";

export const LANG_STORAGE = "randap_lang";
export const LANG_STORAGE_LEGACY = "randap_chat_lang";

export const LANGS: Array<{ code: Lang; label: string }> = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "uz", label: "O'zbekcha" },
];

export function isLang(value: string | null | undefined): value is Lang {
  return value === "en" || value === "ru" || value === "uz";
}

export function langLocale(lang: Lang): string {
  if (lang === "ru") return "ru-RU";
  if (lang === "uz") return "uz-UZ";
  return "en-US";
}

const en = {
  // Umumiy
  back: "Back",
  cancel: "Cancel",
  close: "Close",
  save: "Save",
  saving: "Saving...",
  loading: "Loading...",
  error: "Error",
  retry: "Please try again",
  retryDesc: "Please try again.",
  you: "YOU",
  send: "Send",
  search: "Search",
  searchButton: "Search",
  searchPlaceholder: "Search videos and people...",
  searching: "Searching...",
  searchAria: "Search",
  searchTitle: "Search: «{q}»",
  profiles: "Profiles",
  videosHeading: "Videos",
  profileBtn: "Profile",
  nothingFound: "Nothing found",
  nothingFoundHint: "Nothing found — try another word.",
  nothingFoundDesc:
    "No video or profile found for «{q}». Try another word.",
  empty: "Empty",
  minutes: "min",
  pointUnit: "points",
  videoUnit: "video",
  shortsUnit: "shorts",
  subscriberUnit: "subscribers",
  viewsUnit: "views",
  fanUnit: "subjects",
  testUnit: "tests",
  orgatuvUnit: "lessons",
  lessonUnit: "lesson",
  questionUnit: "questions",

  // Sidebar
  navPortal: "Main menu",
  navHome: "Videos",
  navShorts: "Shorts",
  navVideos: "Videos",
  navSections: "Tests",
  navOrganish: "Learn",
  navChat: "Chat",
  navBallar: "Points",
  navProfile: "Profile",
  navPortalMobile: "Home",
  subs: "Subscriptions",
  subsSectionAria: "Subscriptions section",
  subsGoAria: "Go to subscriptions",
  goChannelTitle: "Go to {name} channel",
  uploadVideo: "Upload video",
  sidebarTagline: "Videos, Shorts and Tests platform",
  settings: "Settings",
  language: "Language",
  settingsAria: "Settings",
  languageAppliesAll:
    "The selected language applies to all sections of Randap.",

  // Header
  logoAria: "Randap — go to main menu",
  logoTitle: "Randap — main menu",
  profileGoAria: "Go to profile",

  // Portal
  portalWelcome: "Welcome to the Randap platform",
  portalChoose: "Which section will you start with?",
  enter: "Enter",
  enterVideoAria: "Open the Randap Video section",
  enterTestsAria: "Open the Tests section",
  enterOrganishAria: "Open the Learn section",
  enterChatAria: "Open the Chat section",
  portalVideoSub: "Like YouTube",
  portalVideoDesc:
    "Watch videos and Shorts — with likes, comments and subscriptions.",
  portalTestsSub: "All subjects, a separate section",
  portalTestsA: "Tests and lessons on all subjects. Points are counted ",
  portalTestsBold: "separately",
  portalTestsB: ".",
  portalOrganishSub: "Long articles section",
  portalOrganishDesc:
    "Long articles about English, memory, math and history. Below — duties of religion and life.",
  fourTopics: "4 topics",
  dinBadge: "Religion and life duties",
  portalChatSub: "Like Telegram",
  portalChatDesc:
    "Chat with people, send stickers and photos. Random chat is here too.",
  randomChatBadge: "Random chat",
  stickersBadge: "Stickers",
  photoBadge: "Photo",
  ballarBarTitle: "Points — a separate ranking",
  ballarBarDesc:
    "Solve tests to earn points and compete with other people",

  // Home / feed
  homeNow: "Current videos",
  all: "All",
  emptyHome:
    "No videos yet. Be the first — use the + button in the left menu.",
  videosAllTitle: "Videos — all videos",
  emptyVideos:
    "The Videos section is empty. Upload a video with the + button.",
  subsFeedTitle: "Videos from channels you subscribed to",
  emptySubs:
    "No subscriptions yet. Watch a video and subscribe to a channel — new videos will appear here.",

  // Sections (tests)
  sectionsTitle: "Tests — all subjects",
  sectionsSub: "Choose a subject, solve tests and earn points",
  testsHeading: "Tests",
  orgatuvsHeading: "Lessons",
  savolCount: "{n} questions",
  best: "Best: {a}/{b}",
  solveAgain: "Solve again",
  startQuiz: "Start test",
  testsCountLine: "{q} tests · {l} lessons",

  // Organish
  organishHeadSub:
    "Deep knowledge in every topic — learn with long articles",
  readMin: "{n} min read",
  readMinShort: "{n} min",
  articleNotFound: "Article not found.",
  backToOrganish: "Back to Learn",
  openArticleAria: "Open the article {title}",
  dinSectionAria: "Religion and life duties",

  // Quiz
  quizNotFound: "Test not found",
  unansweredTitle: "{n} questions were left unanswered",
  unansweredDesc: "Unanswered questions count as wrong.",
  submitFailDesc: "The result could not be submitted. Please try again.",
  resultGreat: "Excellent result! You know this well.",
  resultGood: "Good! Solve it once more and you will score higher.",
  resultBad: "Learn the lessons first and try again.",
  pointsAdded: "+{n} points added",
  totalParen: "(total: {n} points)",
  resultReviewAria: "Results review",
  yourAnswer: "Your answer: ",
  noAnswer: "— (no answer)",
  correctAnswer: "Correct answer: ",
  backToSection: "Back to section",
  questionN: "Question {a} / {b}",
  upToPoints: "up to {n} points",
  answeredCount: "{a} / {b} answered",
  finish: "Finish",
  nextQ: "Next",
  prevQ: "Previous",

  // Lesson
  lessonNotFound: "Lesson not found",
  orgatuvBadge: "Lesson",
  nextLesson: "Next lesson",
  go: "Go →",

  // Ballar
  ballarTitle: "Points",
  ballarSub: "Ranking of the points people earned from tests",
  ballarHow:
    "How are points earned? Solve the tests in the sections — every correct answer gives 10 points. Your points in this list update instantly.",

  // Profile
  profileUpdated: "Profile updated",
  saveError: "Error while saving",
  nameLengthDesc: "Name must be 2-40 characters.",
  chooseImage: "Choose an image",
  chooseImageDesc: "Upload JPG, PNG or WebP as the profile photo.",
  imageTooBig: "Image is too large",
  imageTooBigDesc: "The image must be under 5 MB.",
  avatarUpdated: "Profile photo updated",
  avatarFailed: "The photo was not uploaded",
  changeAvatarAria: "Change profile photo",
  uploadPhotoTitle: "Upload photo",
  chooseAvatarAria: "Choose profile photo",
  myVideosInfo: "{n} uploaded videos · your profile",
  pointsWithValue: "{n} points",
  renameLabel: "Change name",
  myVideos: "My videos",
  emptyMyVideos:
    "You have not uploaded videos yet. Press the + button below or in the left menu.",
  deviceProfile: "Device profile",
  deviceProfileDesc:
    "Randap does not require registration: your profile is tied to this browser's device key ({key}). If you press the button below, the profile on this device and the likes/subscriptions made from it will be reset.",
  resetConfirm: "Yes, reset profile",
  resetDevice: "Reset device profile",

  // Channel
  channelStats:
    "{subs} subscribers · {v} videos · {p} points",
  subscribed: "Subscribed",
  subscribe: "Subscribe",
  emptyChannel: "No videos on this channel yet.",

  // Watch
  videoNotFound: "Video not found",
  browserNoVideo: "Your browser does not support the video tag.",
  commentsOffSuffix: " · Comments are off",
  subsCount: "{n} subscribers",
  soon: "Coming soon",
  commentsHeading: "Comments",
  commentPlaceholder: "Write a comment...",
  commentAria: "Write a comment",
  sendCommentAria: "Send the comment",
  commentsOffNote:
    "Comments are off on this video — the author has disabled them.",
  commentAdded: "Comment added",
  subToastOk: "You subscribed to the {name} channel",
  subToastCancel: "Subscription cancelled",

  // Shorts
  shortsEmpty: "No Shorts yet",
  shortsEmptyDesc:
    "Press the «+» button and upload a video up to 1:20 (80 seconds) — it will appear in the Shorts section.",
  unmute: "Unmute",
  mute: "Mute",
  likeAria: "Like",
  commentsAria: "Comments",
  writeComment: "Write a comment",
  yourThoughts: "Your thoughts...",
  shortsCommentAria: "Shorts comment",
  sendAria: "Send",
  seeAllComments: "See all comments in the video",
  likeFail: "The like was not sent",
  commentFail: "The comment was not sent",

  // Upload
  uploadStep1: "1. Video file",
  pickVideo: "Press to choose a video",
  pickVideoHint: "MP4, WebM, MOV · max 300 MB",
  pickVideoAria: "Choose a video file",
  readingDuration: "reading duration...",
  removeFileAria: "Remove the file",
  kindVideoDesc: "Unlimited length",
  kindShortsDesc: "Max 1:20 (80 seconds)",
  shortTooLongNote:
    "This video is {n} seconds — too long for Shorts (max 80 seconds). Upload it as a regular «Video».",
  uploadStep2: "2. Details",
  titleLabel: "Video title *",
  titlePlaceholder: "For example: daily vlog from a Tashkent bazaar",
  descLabel: "Description",
  descPlaceholder: "Write briefly about the video...",
  thumbLabel: "Thumbnail (image)",
  thumbReplace: "Replace",
  thumbPick: "Choose image",
  thumbAuto: "auto",
  thumbAutoHint: "If no image is chosen, one is taken from the video automatically",
  allowComments: "Allow comments",
  allowCommentsDesc:
    "If checked, people can comment on the video. If unchecked, comments are disabled.",
  duplicateFound: "Duplicate detected",
  duplicateToastDesc: "This video is already in the Videos section.",
  duplicateDefault: "This video has already been uploaded.",
  seeExisting: "View the existing video",
  uploadShortsBtn: "Upload Shorts",
  toastVideoPick: "Choose a video file",
  toastVideoPickDesc:
    "MP4, WebM and similar video formats are accepted.",
  toastFileReadFail: "The file could not be read",
  toastFileReadFailDesc:
    "This file did not open as a video. Try another file.",
  toastThumbPickDesc:
    "An image file is required for the thumbnail (JPG, PNG, WebP).",
  toastProfilePreparing: "The profile is being prepared",
  toastProfilePreparingDesc: "Wait a second and press again.",
  toastNoFile: "No video file chosen",
  toastTitleShort: "The title is too short",
  toastTitleShortDesc: "Enter a video title (at least 2 characters).",
  toastShortTooLong: "Shorts is too long",
  toastShortTooLongDesc:
    "Maximum 1:20 (80 seconds) for Shorts. This video is {n} seconds — upload it as a regular Video.",
  toastUploaded: "Video uploaded",
  toastUploadedShorts: "It appeared in the Shorts section.",
  toastUploadedVideos: "It appeared in the Videos section.",
  toastUploadFail: "Upload error",
  toastUploadFailed: "Upload failed",
  toastUploadFailedDesc: "Check your connection and try again.",

  // Chat-sms (kichkina esemes)
  newChatAria: "New chat messages",

  // Search view
  videoCountLine: "{n} videos · {p} points",
} as const;

export type TKey = keyof typeof en;
type Dict = Record<TKey, string>;

const ru: Dict = {
  back: "Назад",
  cancel: "Отмена",
  close: "Закрыть",
  save: "Сохранить",
  saving: "Сохранение...",
  loading: "Загрузка...",
  error: "Ошибка",
  retry: "Попробуйте ещё раз",
  retryDesc: "Попробуйте ещё раз.",
  you: "ВЫ",
  send: "Отправить",
  search: "Поиск",
  searchButton: "Поиск",
  searchPlaceholder: "Поиск видео и людей...",
  searching: "Поиск...",
  searchAria: "Поиск",
  searchTitle: "Поиск: «{q}»",
  profiles: "Профили",
  videosHeading: "Видео",
  profileBtn: "Профиль",
  nothingFound: "Ничего не найдено",
  nothingFoundHint: "Ничего не найдено — попробуйте другое слово.",
  nothingFoundDesc:
    "По запросу «{q}» видео или профиль не найдены. Попробуйте другое слово.",
  empty: "Пусто",
  minutes: "мин",
  pointUnit: "баллов",
  videoUnit: "видео",
  shortsUnit: "shorts",
  subscriberUnit: "подписчиков",
  viewsUnit: "просмотров",
  fanUnit: "предметов",
  testUnit: "тестов",
  orgatuvUnit: "уроков",
  lessonUnit: "урок",
  questionUnit: "вопросов",

  navPortal: "Главное меню",
  navHome: "Видео",
  navShorts: "Shorts",
  navVideos: "Видео",
  navSections: "Тесты",
  navOrganish: "Обучение",
  navChat: "Чат",
  navBallar: "Баллы",
  navProfile: "Профиль",
  navPortalMobile: "Главная",
  subs: "Подписки",
  subsSectionAria: "Раздел подписок",
  subsGoAria: "Перейти к подпискам",
  goChannelTitle: "Перейти на канал {name}",
  uploadVideo: "Загрузить видео",
  sidebarTagline: "Платформа видео, Shorts и тестов",
  settings: "Настройки",
  language: "Язык",
  settingsAria: "Настройки",
  languageAppliesAll:
    "Выбранный язык применяется ко всем разделам Randap.",

  logoAria: "Randap — на главную",
  logoTitle: "Randap — главное меню",
  profileGoAria: "К профилю",

  portalWelcome: "Добро пожаловать на платформу Randap",
  portalChoose: "С какого раздела начнём?",
  enter: "Войти",
  enterVideoAria: "Открыть раздел Randap Video",
  enterTestsAria: "Открыть раздел Тесты",
  enterOrganishAria: "Открыть раздел Обучение",
  enterChatAria: "Открыть раздел Чат",
  portalVideoSub: "Похоже на YouTube",
  portalVideoDesc:
    "Смотрите видео и Shorts — с лайками, комментариями и подписками.",
  portalTestsSub: "Все предметы, отдельный раздел",
  portalTestsA: "Тесты и уроки по всем предметам. Баллы считаются ",
  portalTestsBold: "отдельно",
  portalTestsB: ".",
  portalOrganishSub: "Раздел длинных статей",
  portalOrganishDesc:
    "Длинные статьи об английском языке, памяти, математике и истории. Ниже — обязанности религии и жизни.",
  fourTopics: "4 темы",
  dinBadge: "Обязанности религии и жизни",
  portalChatSub: "Похоже на Telegram",
  portalChatDesc:
    "Общайтесь с людьми, отправляйте стикеры и фото. Есть и случайный чат.",
  randomChatBadge: "Случайный чат",
  stickersBadge: "Стикеры",
  photoBadge: "Фото",
  ballarBarTitle: "Баллы — отдельный рейтинг",
  ballarBarDesc:
    "Решайте тесты, зарабатывайте баллы и соревнуйтесь с другими",

  homeNow: "Текущие видео",
  all: "Все",
  emptyHome:
    "Пока нет видео. Загрузите первое — кнопка «+» в левом меню.",
  videosAllTitle: "Видео — все видео",
  emptyVideos:
    "Раздел «Видео» пока пуст. Загрузите видео кнопкой «+».",
  subsFeedTitle: "Видео каналов, на которые вы подписаны",
  emptySubs:
    "Пока нет подписок. Посмотрите видео и подпишитесь на канал — новые видео появятся здесь.",

  sectionsTitle: "Тесты — все предметы",
  sectionsSub: "Выберите предмет, решайте тесты и зарабатывайте баллы",
  testsHeading: "Тесты",
  orgatuvsHeading: "Уроки",
  savolCount: "{n} вопросов",
  best: "Лучший: {a}/{b}",
  solveAgain: "Решить снова",
  startQuiz: "Начать тест",
  testsCountLine: "{q} тестов · {l} уроков",

  organishHeadSub:
    "Глубокие знания по каждой теме — учитесь с длинными статьями",
  readMin: "{n} мин чтения",
  readMinShort: "{n} мин",
  articleNotFound: "Статья не найдена.",
  backToOrganish: "Вернуться к обучению",
  openArticleAria: "Открыть статью {title}",
  dinSectionAria: "Обязанности религии и жизни",

  quizNotFound: "Тест не найден",
  unansweredTitle: "{n} вопросов остались без ответа",
  unansweredDesc: "Вопросы без ответа считаются неправильными.",
  submitFailDesc:
    "Не удалось отправить результат. Попробуйте ещё раз.",
  resultGreat: "Отличный результат! Вы хорошо знаете тему.",
  resultGood: "Хорошо! Решите ещё раз — и результат будет выше.",
  resultBad: "Сначала изучите уроки и попробуйте снова.",
  pointsAdded: "+{n} баллов добавлено",
  totalParen: "(всего: {n} баллов)",
  resultReviewAria: "Обзор результатов",
  yourAnswer: "Ваш ответ: ",
  noAnswer: "— (нет ответа)",
  correctAnswer: "Правильный ответ: ",
  backToSection: "Вернуться к разделу",
  questionN: "Вопрос {a} / {b}",
  upToPoints: "до {n} баллов",
  answeredCount: "{a} / {b} отвечено",
  finish: "Завершить",
  nextQ: "Далее",
  prevQ: "Назад",

  lessonNotFound: "Урок не найден",
  orgatuvBadge: "Урок",
  nextLesson: "Следующий урок",
  go: "Перейти →",

  ballarTitle: "Баллы",
  ballarSub: "Рейтинг людей по баллам за тесты",
  ballarHow:
    "Как начисляются баллы? Решайте тесты в разделах — за каждый правильный ответ даётся 10 баллов. Ваши баллы в этом списке обновляются мгновенно.",

  profileUpdated: "Профиль обновлён",
  saveError: "Ошибка при сохранении",
  nameLengthDesc: "Имя должно быть от 2 до 40 символов.",
  chooseImage: "Выберите изображение",
  chooseImageDesc: "Для фото профиля загрузите JPG, PNG или WebP.",
  imageTooBig: "Изображение слишком большое",
  imageTooBigDesc: "Размер изображения — не больше 5 МБ.",
  avatarUpdated: "Фото профиля обновлено",
  avatarFailed: "Фото не загружено",
  changeAvatarAria: "Изменить фото профиля",
  uploadPhotoTitle: "Загрузить фото",
  chooseAvatarAria: "Выбрать фото профиля",
  myVideosInfo: "{n} загруженных видео · ваш профиль",
  pointsWithValue: "{n} баллов",
  renameLabel: "Изменить имя",
  myVideos: "Мои видео",
  emptyMyVideos:
    "Вы ещё не загружали видео. Нажмите кнопку «+» внизу или в левом меню.",
  deviceProfile: "Профиль устройства",
  deviceProfileDesc:
    "Randap не требует регистрации: ваш профиль привязан к ключу устройства этого браузера ({key}). Если нажать кнопку ниже, профиль на этом устройстве и лайки/подписки, сделанные с него, будут сброшены.",
  resetConfirm: "Да, сбросить профиль",
  resetDevice: "Сбросить профиль устройства",

  channelStats: "{subs} подписчиков · {v} видео · {p} баллов",
  subscribed: "Вы подписаны",
  subscribe: "Подписаться",
  emptyChannel: "На этом канале пока нет видео.",

  videoNotFound: "Видео не найдено",
  browserNoVideo: "Ваш браузер не поддерживает тег video.",
  commentsOffSuffix: " · Комментарии отключены",
  subsCount: "{n} подписчиков",
  soon: "Скоро",
  commentsHeading: "Комментарии",
  commentPlaceholder: "Напишите комментарий...",
  commentAria: "Написать комментарий",
  sendCommentAria: "Отправить комментарий",
  commentsOffNote:
    "Комментарии отключены — автор выключил их для этого видео.",
  commentAdded: "Комментарий добавлен",
  subToastOk: "Вы подписались на канал {name}",
  subToastCancel: "Подписка отменена",

  shortsEmpty: "Пока нет Shorts",
  shortsEmptyDesc:
    "Нажмите кнопку «+» и загрузите видео до 1:20 (80 секунд) — оно появится в разделе Shorts.",
  unmute: "Включить звук",
  mute: "Выключить звук",
  likeAria: "Поставить лайк",
  commentsAria: "Комментарии",
  writeComment: "Написать комментарий",
  yourThoughts: "Ваше мнение...",
  shortsCommentAria: "Комментарий к Shorts",
  sendAria: "Отправить",
  seeAllComments: "Все комментарии в видео",
  likeFail: "Лайк не отправился",
  commentFail: "Комментарий не отправился",

  uploadStep1: "1. Видеофайл",
  pickVideo: "Нажмите, чтобы выбрать видео",
  pickVideoHint: "MP4, WebM, MOV · максимум 300 МБ",
  pickVideoAria: "Выбрать видеофайл",
  readingDuration: "читается длительность...",
  removeFileAria: "Удалить файл",
  kindVideoDesc: "Любая длительность",
  kindShortsDesc: "Максимум 1:20 (80 секунд)",
  shortTooLongNote:
    "Это видео {n} секунд — слишком длинно для Shorts (макс. 80 секунд). Загрузите его как обычное «Видео».",
  uploadStep2: "2. Информация",
  titleLabel: "Название видео *",
  titlePlaceholder: "Например: ежедневный влог с рынка Ташкента",
  descLabel: "Описание",
  descPlaceholder: "Коротко опишите видео...",
  thumbLabel: "Превью (изображение)",
  thumbReplace: "Заменить",
  thumbPick: "Выбрать изображение",
  thumbAuto: "авто",
  thumbAutoHint:
    "Если изображение не выбрано, оно берётся из видео автоматически",
  allowComments: "Разрешить комментарии",
  allowCommentsDesc:
    "Если отмечено — люди могут комментировать видео. Если нет — комментарии отключены.",
  duplicateFound: "Обнаружен дубликат",
  duplicateToastDesc: "Это видео уже есть в разделе «Видео».",
  duplicateDefault: "Это видео уже загружено.",
  seeExisting: "Смотреть существующее видео",
  uploadShortsBtn: "Загрузить Shorts",
  toastVideoPick: "Выберите видеофайл",
  toastVideoPickDesc:
    "Принимаются форматы MP4, WebM и другие видеоформаты.",
  toastFileReadFail: "Файл не удалось прочитать",
  toastFileReadFailDesc:
    "Этот файл не открылся как видео. Попробуйте другой файл.",
  toastThumbPickDesc:
    "Для превью нужно изображение (JPG, PNG, WebP).",
  toastProfilePreparing: "Профиль готовится",
  toastProfilePreparingDesc: "Подождите секунду и нажмите снова.",
  toastNoFile: "Видеофайл не выбран",
  toastTitleShort: "Слишком короткое название",
  toastTitleShortDesc:
    "Введите название видео (минимум 2 символа).",
  toastShortTooLong: "Shorts слишком длинное",
  toastShortTooLongDesc:
    "Максимум 1:20 (80 секунд) для Shorts. Это видео {n} секунд — загрузите его как обычное видео.",
  toastUploaded: "Видео загружено",
  toastUploadedShorts: "Появилось в разделе Shorts.",
  toastUploadedVideos: "Появилось в разделе «Видео».",
  toastUploadFail: "Ошибка загрузки",
  toastUploadFailed: "Загрузка не удалась",
  toastUploadFailedDesc:
    "Проверьте соединение и попробуйте ещё раз.",

  newChatAria: "Новые сообщения чата",

  videoCountLine: "{n} видео · {p} баллов",
};

const uz: Dict = {
  back: "Orqaga",
  cancel: "Bekor qilish",
  close: "Yopish",
  save: "Saqlash",
  saving: "Saqlanmoqda...",
  loading: "Yuklanmoqda...",
  error: "Xatolik",
  retry: "Qayta urinib ko'ring",
  retryDesc: "Qayta urinib ko'ring.",
  you: "SIZ",
  send: "Yuborish",
  search: "Qidiruv",
  searchButton: "Qidirish",
  searchPlaceholder: "Videolar va odamlarni qidirish...",
  searching: "Qidirilmoqda...",
  searchAria: "Qidiruv",
  searchTitle: "Qidiruv: «{q}»",
  profiles: "Profillar",
  videosHeading: "Videolar",
  profileBtn: "Profili",
  nothingFound: "Hech narsa topilmadi",
  nothingFoundHint: "Hech narsa topilmadi — boshqa so'z bilan urinib ko'ring.",
  nothingFoundDesc:
    "«{q}» bo'yicha video yoki profil topilmadi. Boshqa so'z bilan urinib ko'ring.",
  empty: "Bo'sh",
  minutes: "daqiqa",
  pointUnit: "ball",
  videoUnit: "video",
  shortsUnit: "shorts",
  subscriberUnit: "obunachi",
  viewsUnit: "ko'rildi",
  fanUnit: "fan",
  testUnit: "test",
  orgatuvUnit: "o'rgatuv",
  lessonUnit: "dars",
  questionUnit: "savol",

  navPortal: "Asosiy menyu",
  navHome: "Videolar",
  navShorts: "Shorts",
  navVideos: "Videos",
  navSections: "Testlar",
  navOrganish: "O'rganish",
  navChat: "Chat",
  navBallar: "Ballar",
  navProfile: "Profil",
  navPortalMobile: "Asosiy",
  subs: "Obunalar",
  subsSectionAria: "Obunalar bo'limi",
  subsGoAria: "Obunalar bo'limiga o'tish",
  goChannelTitle: "{name} kanaliga o'tish",
  uploadVideo: "Video yuklash",
  sidebarTagline: "Videolar, Shorts va Testlar platformasi",
  settings: "Sozlamalar",
  language: "Til",
  settingsAria: "Sozlamalar",
  languageAppliesAll:
    "Tanlangan til Randapning barcha bo'limlariga tegishli bo'ladi.",

  logoAria: "Randap — asosiy menyuga o'tish",
  logoTitle: "Randap — asosiy menyu",
  profileGoAria: "Profilga o'tish",

  portalWelcome: "Randap platformasiga xush kelibsiz",
  portalChoose: "Qaysi bo'limdan boshlaysiz?",
  enter: "Kirish",
  enterVideoAria: "Randap Video bo'limiga kirish",
  enterTestsAria: "Testlar bo'limiga kirish",
  enterOrganishAria: "O'rganish bo'limiga kirish",
  enterChatAria: "Chat bo'limiga kirish",
  portalVideoSub: "YouTubega o'xshagan",
  portalVideoDesc:
    "Videolar va Shorts ko'rish — layk, komment, obuna bo'lish bilan.",
  portalTestsSub: "Hamma fandan, alohida bo'lim",
  portalTestsA: "Barcha fanlardan testlar va o'rgatuvlar. Ballari ",
  portalTestsBold: "alohida",
  portalTestsB: " hisoblanadi.",
  portalOrganishSub: "Uzun maqolalar bo'limi",
  portalOrganishDesc:
    "Ingliz tili, xotira, matematika va tarix haqida uzun ma'lumotlar. Pastida din va hayot burchlari yozilgan.",
  fourTopics: "4 mavzu",
  dinBadge: "Din va hayot burchlari",
  portalChatSub: "Telegramga o'xshagan",
  portalChatDesc:
    "Odamlar bilan yozishing, stiker va rasm tashishing mumkin. Random chat ham bor.",
  randomChatBadge: "Random chat",
  stickersBadge: "Stikerlar",
  photoBadge: "Rasm",
  ballarBarTitle: "Ballar — alohida reyting",
  ballarBarDesc:
    "Test yechib ball to'plang, boshqalar bilan raqobat qiling",

  homeNow: "Hozirgi videolar",
  all: "Barchasi",
  emptyHome:
    "Hozircha video yo'q. Chap menyudagi + tugmasi bilan birinchisini yuklang.",
  videosAllTitle: "Videos — barcha videolar",
  emptyVideos:
    "Videos bo'limi hozircha bo'sh. + tugmasi bilan video yuklang.",
  subsFeedTitle: "Obuna bo'lgan kanallar videolari",
  emptySubs:
    "Hozircha obuna yo'q. Video ko'rib, kanalga obuna bo'ling — bu yerda yangi videolari chiqadi.",

  sectionsTitle: "Testlar — hamma fanlar",
  sectionsSub: "Fan tanlang, testlarni yechib ball to'plang",
  testsHeading: "Testlar",
  orgatuvsHeading: "O'rgatuvlar (darslar)",
  savolCount: "{n} savol",
  best: "Eng yaxshi: {a}/{b}",
  solveAgain: "Yana yechish",
  startQuiz: "Testni boshlash",
  testsCountLine: "{q} test · {l} dars",

  organishHeadSub:
    "Mavzulalarda bilim boyligi — uzun maqolalar bilan chuqur o'rganing",
  readMin: "{n} daqiqa o'qish",
  readMinShort: "{n} daqiqa",
  articleNotFound: "Maqola topilmadi.",
  backToOrganish: "O'rganishga qaytish",
  openArticleAria: "{title} maqolasini ochish",
  dinSectionAria: "Din va hayot burchlari",

  quizNotFound: "Test topilmadi",
  unansweredTitle: "{n} ta savol javobsiz qoldi",
  unansweredDesc: "Javobsiz savollar noto'g'ri hisoblanadi.",
  submitFailDesc:
    "Natijani yuborib bo'lmadi. Qayta urinib ko'ring.",
  resultGreat: "Ajoyib natija! Bilimingiz qattiq ekan.",
  resultGood: "Yaxshi! Yana bir marta yechsangiz yuqoriga chiqasiz.",
  resultBad: "Avval darslarni o'rganing va qayta yechib ko'ring.",
  pointsAdded: "+{n} ball qo'shildi",
  totalParen: "(jami: {n} ball)",
  resultReviewAria: "Natijalar ko'rigi",
  yourAnswer: "Sizning javobingiz: ",
  noAnswer: "— (javob yo'q)",
  correctAnswer: "To'g'ri javob: ",
  backToSection: "Bo'limga qaytish",
  questionN: "Savol {a} / {b}",
  upToPoints: "{n} ballgacha",
  answeredCount: "{a} / {b} javob berildi",
  finish: "Yakunlash",
  nextQ: "Keyingi",
  prevQ: "Oldingi",

  lessonNotFound: "Dars topilmadi",
  orgatuvBadge: "O'rgatuv",
  nextLesson: "Keyingi dars",
  go: "O'tish →",

  ballarTitle: "Ballar",
  ballarSub: "Odamlarning testlardan olgan ballari reytingi",
  ballarHow:
    "Ball qanday to'planadi? Bo'limlardagi testlarni yeching — har bir to'g'ri javob uchun 10 ball beriladi. Ballaringiz shu ro'yxatda darhol yangilanadi.",

  profileUpdated: "Profil yangilandi",
  saveError: "Saqlashda xatolik",
  nameLengthDesc: "Ism 2-40 belgi orasida bo'lishi kerak.",
  chooseImage: "Rasm tanlang",
  chooseImageDesc: "Profil rasmi sifatida JPG, PNG yoki WebP yuklang.",
  imageTooBig: "Rasm juda katta",
  imageTooBigDesc: "Rasm hajmi 5 MB dan oshmasligi kerak.",
  avatarUpdated: "Profil rasmi yangilandi",
  avatarFailed: "Rasm yuklanmadi",
  changeAvatarAria: "Profil rasmini o'zgartirish",
  uploadPhotoTitle: "Rasm yuklash",
  chooseAvatarAria: "Profil rasmi tanlash",
  myVideosInfo: "{n} yuklangan video · sizning profilingiz",
  pointsWithValue: "{n} ball",
  renameLabel: "Ismni o'zgartirish",
  myVideos: "Mening videolarim",
  emptyMyVideos:
    "Siz hozircha video yuklamagansiz. Pastdagi yoki chap menyudagi + tugmasini bosing.",
  deviceProfile: "Qurilma profili",
  deviceProfileDesc:
    "Randap ro'yxatdan o'tishni talab qilmaydi: profilingiz shu brauzerdagi qurilma kalitiga bog'langan ({key}). Pastdagi tugmani bossangiz, bu qurilmadagi profil va shu qurilma qo'ygan layklar/obunalar tiklanadi.",
  resetConfirm: "Ha, profilni tiklash",
  resetDevice: "Qurilma profilini tiklash",

  channelStats: "{subs} obunachi · {v} video · {p} ball",
  subscribed: "Obuna bo'lingan",
  subscribe: "Obuna bo'lish",
  emptyChannel: "Bu kanalda hozircha video yo'q.",

  videoNotFound: "Video topilmadi",
  browserNoVideo: "Brauzeringiz video tag'ni qo'llab-quvvatlamaydi.",
  commentsOffSuffix: " · Chat o'chirilgan",
  subsCount: "{n} obunachi",
  soon: "Yaqinda qo'shiladi",
  commentsHeading: "Izohlar",
  commentPlaceholder: "Izoh yozing...",
  commentAria: "Izoh yozish",
  sendCommentAria: "Izohni yuborish",
  commentsOffNote:
    "Bu videoda chat o'chirilgan — muallif izohlarni yoqib qo'ymagan.",
  commentAdded: "Izohingiz qo'shildi",
  subToastOk: "{name} kanaliga obuna bo'ldingiz",
  subToastCancel: "Obuna bekor qilindi",

  shortsEmpty: "Shorts hozircha yo'q",
  shortsEmptyDesc:
    "«+» tugmasini bosib, 1:20 (80 soniya) gacha bo'lgan video yuklang — u Shorts bo'limida paydo bo'ladi.",
  unmute: "Ovozni yoqish",
  mute: "Ovozni o'chirish",
  likeAria: "Layk bosish",
  commentsAria: "Izohlar",
  writeComment: "Izoh yozish",
  yourThoughts: "Fikringiz...",
  shortsCommentAria: "Shorts izohi",
  sendAria: "Yuborish",
  seeAllComments: "Barcha izohlarni videoda ko'rish",
  likeFail: "Layk yuborilmadi",
  commentFail: "Izoh yuborilmadi",

  uploadStep1: "1. Video fayl",
  pickVideo: "Video tanlash uchun bosing",
  pickVideoHint: "MP4, WebM, MOV · maksimal 300 MB",
  pickVideoAria: "Video fayl tanlash",
  readingDuration: "davomiylik o'qilmoqda...",
  removeFileAria: "Faylni olib tashlash",
  kindVideoDesc: "Davomiyligi cheksiz",
  kindShortsDesc: "Maksimal 1:20 (80 soniya)",
  shortTooLongNote:
    "Bu video {n} soniya — Shorts uchun juda uzun (max 80 soniya). Oddiy «Video» sifatida yuklang.",
  uploadStep2: "2. Ma'lumotlar",
  titleLabel: "Video nomi *",
  titlePlaceholder: "Masalan: Toshkent bozoridan kunlik vlog",
  descLabel: "Tavsif",
  descPlaceholder: "Video haqida qisqacha yozing...",
  thumbLabel: "Thumbnail (rasm)",
  thumbReplace: "Almashtirish",
  thumbPick: "Rasm tanlash",
  thumbAuto: "avtomatik",
  thumbAutoHint: "Agar rasm tanlanmasa, videodan avtomatik oladi",
  allowComments: "Chat / izohlarga ruxsat berish",
  allowCommentsDesc:
    "Belgilansa odamlar videoga izoh qoldiradi. Belgilanmasa chat o'chiriladi.",
  duplicateFound: "Dublikat aniqlandi",
  duplicateToastDesc: "Bu video allaqachon Videos bo'limida bor.",
  duplicateDefault: "Bu video allaqachon yuklangan.",
  seeExisting: "Mavjud videoni ko'rish",
  uploadShortsBtn: "Shorts yuklash",
  toastVideoPick: "Video fayl tanlang",
  toastVideoPickDesc:
    "MP4, WebM va shunga o'xshash video formatlar qabul qilinadi.",
  toastFileReadFail: "Fayl o'qilmadi",
  toastFileReadFailDesc:
    "Bu fayl video sifatida ochilmadi. Boshqa fayl tanlab ko'ring.",
  toastThumbPickDesc:
    "Thumbnail sifatida rasm fayli kerak (JPG, PNG, WebP).",
  toastProfilePreparing: "Profil tayyorlanmoqda",
  toastProfilePreparingDesc: "Bir soniya kutib qayta bosing.",
  toastNoFile: "Video fayl tanlanmagan",
  toastTitleShort: "Nom juda qisqa",
  toastTitleShortDesc: "Video nomini kiriting (kamida 2 belgi).",
  toastShortTooLong: "Shorts juda uzun",
  toastShortTooLongDesc:
    "Shorts uchun maksimal 1:20 (80 soniya). Bu video {n} soniya — uni oddiy Video sifatida yuklang.",
  toastUploaded: "Video yuklandi",
  toastUploadedShorts: "Shorts bo'limida paydo bo'ldi.",
  toastUploadedVideos: "Videos bo'limida paydo bo'ldi.",
  toastUploadFail: "Yuklashda xatolik",
  toastUploadFailed: "Yuklash muvaffaqiyatsiz",
  toastUploadFailedDesc:
    "Internet aloqasini tekshirib qayta urinib ko'ring.",

  newChatAria: "Yangi chat xabarlar",

  videoCountLine: "{n} video · {p} ball",
};

export const I18N: Record<Lang, Dict> = { en, ru, uz };

export type TFunc = (
  key: TKey,
  params?: Record<string, string | number>
) => string;

export function makeT(lang: Lang): TFunc {
  return (key, params) => {
    const dict = I18N[lang] ?? I18N.en;
    let value = dict[key] ?? I18N.en[key] ?? String(key);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.split(`{${k}}`).join(String(v));
      }
    }
    return value;
  };
}

/** formatCount holatlari: 1 234 → "1.2 K" / "1.2 ming" / "1.2 тыс." */
export function compactCount(n: number, lang: Lang): string {
  const kUnit = lang === "ru" ? "тыс." : lang === "uz" ? "ming" : "K";
  const mUnit = lang === "ru" ? "млн" : lang === "uz" ? "mln" : "M";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} ${mUnit}`;
  if (n >= 1_000)
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")} ${kUnit}`;
  return String(n);
}

/** "3 daqiqa oldin" / "3 minutes ago" / "3 мин. назад" */
export function timeAgo(iso: string, lang: Lang): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (lang === "en") {
    if (min < 1) return "just now";
    if (min < 60) return `${min} min ago`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} d ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} mo ago`;
    return `${Math.floor(mo / 12)} y ago`;
  }
  if (lang === "ru") {
    if (min < 1) return "только что";
    if (min < 60) return `${min} мин. назад`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} ч. назад`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} дн. назад`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} мес. назад`;
    return `${Math.floor(mo / 12)} г. назад`;
  }
  if (min < 1) return "hozir";
  if (min < 60) return `${min} daqiqa oldin`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} kun oldin`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} oy oldin`;
  return `${Math.floor(months / 12)} yil oldin`;
}
