/**
 * Randap do'kon katalogi — DZF (dapzif) valyutasi uchun tovarlar.
 * Narxlar DZF da. Har bir tovarning id si barqaror (bazada OwnedItem.itemId).
 * Eslatma: bepul chat stikerlari (CHAT_STICKERS) bilan takrorlanmagan.
 */

export type ShopItem = {
  id: string;
  /** Chatda ko'rinadigan emoji / emojilar ketma-ketligi (avatar rasmi uchun null) */
  content: string | null;
  /** Narx (DZF) */
  price: number;
  category: "special" | "faces" | "hands";
  /** Qisqa nomi (maxsus tovarlar uchun) */
  name?: string;
  kind: "sticker" | "avatar";
};

export const AVATAR_ITEM_ID = "avatar-photo";

/** Maxsus tovarlar — foydalanuvchi bergan narxlar */
const SPECIAL: ShopItem[] = [
  {
    id: "st-moai-skull",
    content: "🗿💀",
    price: 30,
    category: "special",
    kind: "sticker",
    name: "Moay va bosh suyagi",
  },
  {
    id: "st-frog-crown",
    content: "🐸👑",
    price: 10,
    category: "special",
    kind: "sticker",
    name: "Qurbaqa toj bilan",
  },
  {
    id: "st-wine",
    content: "🍷",
    price: 10,
    category: "special",
    kind: "sticker",
    name: "Vino stakan",
  },
  {
    id: AVATAR_ITEM_ID,
    content: null,
    price: 200,
    category: "special",
    kind: "avatar",
    name: "Avatar rasmi",
  },
];

/** Yuzlar — har biri 20 DZF */
const FACES: Array<[string, string]> = [
  ["face-rolling", "🙄"],
  ["face-grimacing", "😬"],
  ["face-exhaling", "😮‍💨"],
  ["face-lying", "🤥"],
  ["face-shaking", "🫨"],
  ["face-head-shake-h", "🙂‍↔️"],
  ["face-head-shake-v", "🙂‍↕️"],
  ["face-relieved", "😌"],
  ["face-pensive", "😔"],
  ["face-sleepy", "😪"],
  ["face-drooling", "🤤"],
  ["face-sleeping", "😴"],
  ["face-medical-mask", "😷"],
  ["face-thermometer", "🤒"],
  ["face-head-bandage", "🤕"],
  ["face-nauseated", "🤢"],
  ["face-vomiting", "🤮"],
  ["face-sneezing", "🤧"],
  ["face-hot", "🥵"],
  ["face-crossed-out", "😵"],
  ["face-spiral", "😵‍💫"],
  ["face-exploding", "🤯"],
  ["face-cowboy", "🤠"],
  ["face-partying", "🥳"],
  ["face-disguised", "🥸"],
  ["face-nerd", "🤓"],
  ["face-monocle", "🧐"],
  ["face-confused", "😕"],
  ["face-diagonal-mouth", "🫤"],
  ["face-worried", "😟"],
  ["face-slightly-frowning", "🙁"],
  ["face-frowning", "☹️"],
  ["face-open-mouth", "😮"],
  ["face-hushed", "😯"],
  ["face-astonished", "😲"],
  ["face-flushed", "😳"],
  ["face-pleading", "🥺"],
  ["face-holding-tears", "🥹"],
  ["face-frowning-open", "😦"],
  ["face-anguished", "😧"],
  ["face-fearful", "😨"],
  ["face-anxious-sweat", "😰"],
  ["face-sad-relieved", "😥"],
  ["face-crying", "😢"],
  ["face-loudly-crying", "😭"],
  ["face-screaming", "😱"],
  ["face-confounded", "😖"],
  ["face-persevering", "😣"],
  ["face-disappointed", "😞"],
  ["face-downcast-sweat", "😓"],
  ["face-weary", "😩"],
  ["face-tired", "😫"],
  ["face-yawning", "🥱"],
  ["face-steam-nose", "😤"],
  ["face-enraged", "😡"],
  ["face-angry", "😠"],
  ["face-symbols-mouth", "🤬"],
];

/** Qo'llar, belgilar va tana qismlari — har biri 20 DZF */
const HANDS: Array<[string, string]> = [
  ["sym-speech-balloon", "💬"],
  ["sym-eye-speech", "👁️‍🗨️"],
  ["sym-left-bubble", "🗨️"],
  ["sym-right-anger", "🗯️"],
  ["sym-thought-balloon", "💭"],
  ["sym-good-night", "🌙"],
  ["hand-waving", "👋"],
  ["hand-raised-back", "🤚"],
  ["hand-fingers-splayed", "🖐️"],
  ["hand-raised", "✋"],
  ["hand-vulcan", "🖖"],
  ["hand-rightwards", "🫱"],
  ["hand-leftwards", "🫲"],
  ["hand-palm-down", "🫳"],
  ["hand-palm-up", "🫴"],
  ["hand-push-left", "🫷"],
  ["hand-push-right", "🫸"],
  ["hand-ok", "👌"],
  ["hand-pinched-fingers", "🤌"],
  ["hand-pinching", "🤏"],
  ["hand-victory", "✌️"],
  ["hand-crossed-fingers", "🤞"],
  ["hand-thumb-crossed", "🫰"],
  ["hand-love-you", "🤟"],
  ["hand-horns", "🤘"],
  ["hand-call-me", "🤙"],
  ["hand-point-left", "👈"],
  ["hand-point-right", "👉"],
  ["hand-point-up", "👆"],
  ["hand-middle-finger", "🖕"],
  ["hand-point-down", "👇"],
  ["hand-index-up", "☝️"],
  ["hand-point-viewer", "🫵"],
  ["hand-fist-oncoming", "👊"],
  ["hand-fist-left", "🤛"],
  ["hand-fist-right", "🤜"],
  ["hand-raising", "🙌"],
  ["hand-heart-hands", "🫶"],
  ["hand-open-hands", "👐"],
  ["hand-palms-together", "🤲"],
  ["hand-folded", "🙏"],
  ["hand-writing", "✍️"],
  ["hand-nail-polish", "💅"],
  ["hand-flexed-biceps", "💪"],
  ["body-mechanical-arm", "🦾"],
  ["body-mechanical-leg", "🦿"],
  ["body-leg", "🦵"],
  ["body-foot", "🦶"],
  ["body-person", "🧍"],
  ["body-ear-hearing", "🦻"],
  ["body-brain", "🧠"],
  ["body-anatomical-heart", "🫀"],
  ["body-lungs", "🫁"],
  ["body-tooth", "🦷"],
  ["body-bone", "🦴"],
  ["obj-camera", "📷"],
];

function build(list: Array<[string, string]>, category: "faces" | "hands"): ShopItem[] {
  return list.map(([id, emoji]) => ({
    id,
    content: emoji,
    price: 20,
    category,
    kind: "sticker",
  }));
}

export const SHOP_ITEMS: ShopItem[] = [
  ...SPECIAL,
  ...build(FACES, "faces"),
  ...build(HANDS, "hands"),
];

export function findShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

export function findShopItemByContent(content: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.content === content && i.kind === "sticker");
}

/** DZF balansini chiqarish uchun format (100 sentlik -> 0.2, 200 -> 2 va h.k.) */
export function dzfFromCents(cents: number): number {
  return Math.round(cents) / 100;
}
