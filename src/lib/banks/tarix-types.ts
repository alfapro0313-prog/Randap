/**
 * Tarix faktlari uchun umumiy turlar (generator ishlatadi).
 * HAR BIR matn uchta tilda: uz (o'zbek lotin), ru (rus kirill), en (ingliz lotin).
 */
export type L3 = { uz: string; ru: string; en: string };

export type HistFact = {
  /** Hodisaga aloqador shaxs / davlat / xalq — QISQA (masalan "Amir Temur") */
  who: L3;
  /** Hodisa nomi — OT USTASI IBORA (masalan "Temuriylar davlatining tashkil topishi") */
  what: L3;
  /** Yil yoki davr — faqat raqam/oraliq (masalan "1370" yoki "1865-1876") */
  year: string;
  /** Joy — shahar/mamlakat nomi (masalan "Samarqand") */
  where: L3;
  /** Natija yoki ahamiyati — OT USTASI IBORA (masalan "Movarounnahrda yagona kuchli davlat barpo etilishi") */
  result: L3;
};
