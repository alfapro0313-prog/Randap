"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLang } from "./lang-provider";
import {
  SHOP_ITEMS,
  OTKAZ_ITEM_ID,
  BARABAN_ITEM_ID,
  BARABAN_PRICE,
  type ShopItem,
} from "@/lib/shop-catalog";
import type { ShopData } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type ShopCategory = "special" | "faces" | "hands" | "hearts" | "animals" | "food" | "symbols";

/** /api/shop/baraban javobi */
type BarabanApi = {
  seg: number;
  winDzf: number;
  sticker: { emoji: string; name: string } | null;
  dzf: number;
};

/** G'ildirak bo'laklari: 0 — 50 DZF (oltin), 1 — 10 DZF (yashil), 2 — 40 DZF (binafsha), 3 — Stiker (pushti) */
const SEG_CENTERS = [45, 135, 225, 315];
const SEG_LABEL_KEYS = ["50 DZF", "10 DZF", "40 DZF", "barabanPrizeSticker"] as const;

export function ShopView({
  deviceKey,
  onGoToTests,
}: {
  deviceKey: string;
  onGoToTests: () => void;
}) {
  const { t } = useLang();
  const [data, setData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [category, setCategory] = useState<ShopCategory>("special");
  const [barabanOpen, setBarabanOpen] = useState(false);
  const [barabanRes, setBarabanRes] = useState<BarabanApi | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/shop?deviceKey=${encodeURIComponent(deviceKey)}`
      );
      const d = await res.json();
      if (d?.ok) setData(d as ShopData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [deviceKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function buy(item: ShopItem) {
    if (!data || buying) return;
    if (data.ownedIds.includes(item.id)) return;
    setBuying(item.id);
    try {
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey, itemId: item.id }),
      });
      const d = await res.json();
      if (d?.ok) {
        toast({ title: t("shopBought") });
        await load();
      } else if (d?.notEnough) {
        toast({ title: t("shopNotEnough"), variant: "destructive" });
      } else {
        toast({ title: t("shopFail"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("shopFail"), variant: "destructive" });
    } finally {
      setBuying(null);
    }
  }

  /** B baraban: server sovg'ani tanlaydi, dialog aylanib natijani ko'rsatadi */
  async function spinBaraban() {
    if (buying) return;
    setBuying(BARABAN_ITEM_ID);
    try {
      const res = await fetch("/api/shop/baraban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceKey }),
      });
      const d = (await res.json()) as
        | (BarabanApi & { ok: boolean; notEnough?: boolean })
        | null;
      if (d?.ok) {
        setBarabanRes({
          seg: d.seg,
          winDzf: d.winDzf,
          sticker: d.sticker,
          dzf: d.dzf,
        });
        setBarabanOpen(true);
        await load();
      } else if (d?.notEnough) {
        toast({ title: t("shopNotEnough"), variant: "destructive" });
      } else {
        toast({ title: t("shopFail"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("shopFail"), variant: "destructive" });
    } finally {
      setBuying(null);
    }
  }

  const items = useMemo(
    () => SHOP_ITEMS.filter((i) => i.category === category),
    [category]
  );

  const cats: Array<[ShopCategory, string]> = [
    ["special", t("shopCatSpecial")],
    ["faces", t("shopCatFaces")],
    ["hands", t("shopCatHands")],
    ["hearts", t("shopCatHearts")],
    ["animals", t("shopCatAnimals")],
    ["food", t("shopCatFood")],
    ["symbols", t("shopCatSymbols")],
  ];

  const ownedSet = new Set(data?.ownedIds ?? []);
  const avatarItem = SHOP_ITEMS.find((i) => i.id === "avatar-photo")!;
  const otkazItem = SHOP_ITEMS.find((i) => i.id === OTKAZ_ITEM_ID)!;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-6">
      {/* Sarlavha + hamyon */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-foreground">{t("shopTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("shopSub")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Wallet className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                {t("shopBalance")}
              </p>
              <p className="text-2xl font-extrabold text-amber-900">
                {loading ? "..." : `${data?.dzf ?? 0} DZF`}
              </p>
            </div>
          </div>
          <button
            onClick={onGoToTests}
            className="flex h-10 items-center gap-2 rounded-full bg-amber-600 px-4 text-sm font-bold text-white transition-colors hover:bg-amber-700"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {t("shopEarnHint")}
          </button>
        </div>
      </div>

      {/* Kategoriyalar */}
      <div className="flex flex-wrap items-center gap-2" role="group">
        {cats.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            aria-pressed={category === key}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              category === key
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-secondary/60 text-foreground hover:bg-secondary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* B — omad barabani (takroriy olinadi, har safar baraban aylanadi) */}
      {category === "special" ? (
        <div className="flex items-center gap-4 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-5 shadow-sm">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
            🎰
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-zinc-900">
              {t("barabanCard")}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-600">
              {t("barabanDesc")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-700">
              {BARABAN_PRICE} DZF
            </span>
            <button
              onClick={() => void spinBaraban()}
              disabled={buying === BARABAN_ITEM_ID}
              className="flex h-9 items-center gap-1.5 rounded-full bg-amber-600 px-4 text-sm font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
            >
              {buying === BARABAN_ITEM_ID ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {t("barabanSpin")}
            </button>
          </div>
        </div>
      ) : null}

      {/* Avatar rasmi — maxsus tovar */}
      {category === "special" ? (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            {ownedSet.has(avatarItem.id) ? (
              <ImagePlus className="size-7" aria-hidden="true" />
            ) : (
              <Camera className="size-7" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground">
              {t("shopAvatarCard")}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t("shopAvatarDesc")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-700">
              {avatarItem.price} DZF
            </span>
            {ownedSet.has(avatarItem.id) ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Check className="size-3.5" aria-hidden="true" />
                {t("shopOwned")}
              </span>
            ) : (
              <button
                onClick={() => void buy(avatarItem)}
                disabled={buying === avatarItem.id}
                className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {buying === avatarItem.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {t("shopBuy")}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* O'tkaz — chatda pul o'tkazish vositasi */}
      {category === "special" ? (
        <div className="flex items-center gap-4 rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-3xl">
            💸
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-foreground">
              {t("shopOtkazCard")}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t("shopOtkazDesc")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-700">
              {otkazItem.price} DZF
            </span>
            {ownedSet.has(otkazItem.id) ? (
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Check className="size-3.5" aria-hidden="true" />
                {t("shopOwned")}
              </span>
            ) : (
              <button
                onClick={() => void buy(otkazItem)}
                disabled={buying === otkazItem.id}
                className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {buying === otkazItem.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {t("shopBuy")}
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* Stikerlar */}
      {category === "special" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items
            .filter((i) => i.kind === "sticker")
            .map((item) => (
              <ShopCard
                key={item.id}
                item={item}
                owned={ownedSet.has(item.id)}
                buying={buying === item.id}
                onBuy={() => void buy(item)}
                buyLabel={t("shopBuy")}
                ownedLabel={t("shopOwned")}
              />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
          {items.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              owned={ownedSet.has(item.id)}
              buying={buying === item.id}
              onBuy={() => void buy(item)}
              buyLabel={t("shopBuy")}
              ownedLabel={t("shopOwned")}
            />
          ))}
        </div>
      )}
      {/* B baraban — aylanuvchi g'ildirak dialogi */}
      {barabanOpen ? (
        <BarabanDialog
          result={barabanRes}
          busy={buying === BARABAN_ITEM_ID}
          onAgain={() => void spinBaraban()}
          onClose={() => {
            setBarabanOpen(false);
            setBarabanRes(null);
          }}
        />
      ) : null}
    </div>
  );
}

/** "B" omad barabani — g'ildirak aylanadi va sovg'a bo'limiga to'xtaydi */
function BarabanDialog({
  result,
  busy,
  onAgain,
  onClose,
}: {
  result: BarabanApi | null;
  busy: boolean;
  onAgain: () => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [landed, setLanded] = useState(false);

  // Yangi natija kelganda g'ildirak 5+ aylanish qilib yutgan bo'lakka to'xtaydi
  useEffect(() => {
    if (!result) return;
    setLanded(false);
    const jitter = Math.floor(Math.random() * 76) - 38;
    const targetMod =
      ((((360 - SEG_CENTERS[result.seg] + jitter) % 360) + 360) % 360);
    const cur = rotationRef.current % 360;
    const delta = (((targetMod - cur) % 360) + 360) % 360;
    const next = rotationRef.current + 360 * 5 + delta;
    rotationRef.current = next;
    const raf = requestAnimationFrame(() => setRotation(next));
    const timer = window.setTimeout(() => setLanded(true), 4700);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [result]);

  const spinning = Boolean(result) && !landed && !busy;
  const labels: string[] = [
    SEG_LABEL_KEYS[0],
    SEG_LABEL_KEYS[1],
    SEG_LABEL_KEYS[2],
    t("barabanPrizeSticker"),
  ];

  let winText = "";
  if (landed && result) {
    if (result.seg === 3 && result.sticker) {
      winText = t("barabanWinSticker", {
        emoji: result.sticker.emoji,
        name: result.sticker.name,
      }).trim();
    } else if (result.seg === 3) {
      winText = t("barabanWinStickerCash");
    } else {
      winText = t("barabanWinDzf", { dzf: result.winDzf });
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("barabanTitle")}
      onClick={(e) => {
        if (e.target === e.currentTarget && !spinning && !busy) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-6 shadow-2xl">
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-zinc-900">
            {t("barabanTitle")}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {t("barabanRules")}
          </p>
        </div>

        {/* G'ildirak */}
        <div className="relative mx-auto mt-7 h-64 w-64">
          {/* Strelka (yuqorida) */}
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1">
            <div className="size-0 border-x-[10px] border-t-[18px] border-x-transparent border-t-red-600 drop-shadow" />
          </div>
          <div
            className="absolute inset-0 rounded-full shadow-xl ring-8 ring-white"
            style={{
              background:
                "conic-gradient(#f59e0b 0deg 90deg, #22c55e 90deg 180deg, #a855f7 180deg 270deg, #ec4899 270deg 360deg)",
              transform: `rotate(${rotation}deg)`,
              transition:
                landed || !result
                  ? "none"
                  : "transform 4.5s cubic-bezier(0.12, 0.72, 0.18, 1)",
            }}
          >
            {SEG_CENTERS.map((center, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 whitespace-nowrap text-sm font-extrabold text-white drop-shadow"
                style={{
                  transform: `translate(-50%, -50%) rotate(${center}deg) translateY(-74px) rotate(${-center}deg)`,
                }}
              >
                {labels[i]}
              </span>
            ))}
          </div>
          {/* Markaz */}
          <div className="absolute left-1/2 top-1/2 z-10 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-white text-3xl shadow-lg">
            🎁
          </div>
        </div>

        {/* Natija / holat */}
        <div className="mt-6 min-h-[52px] text-center">
          {busy ? (
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-500">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("barabanSpin")}...
            </p>
          ) : spinning ? (
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-zinc-500">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t("barabanSpinning")}
            </p>
          ) : winText ? (
            <p className="text-base font-extrabold text-emerald-600">
              {winText}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">{t("barabanRules")}</p>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={onAgain}
            disabled={spinning || busy}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-4 text-sm font-bold text-white transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            🎰 {t("barabanAgain")}
          </button>
          <button
            onClick={onClose}
            disabled={spinning}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60"
          >
            {t("barabanClose")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShopCard({
  item,
  owned,
  buying,
  onBuy,
  buyLabel,
  ownedLabel,
}: {
  item: ShopItem;
  owned: boolean;
  buying: boolean;
  onBuy: () => void;
  buyLabel: string;
  ownedLabel: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 transition-colors",
        owned ? "border-emerald-300 bg-emerald-50/40" : "border-border hover:border-primary/40"
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary/60 text-3xl leading-none">
        {item.content}
      </span>
      {item.name ? (
        <p className="text-center text-[11px] font-semibold text-foreground">{item.name}</p>
      ) : null}
      {owned ? (
        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          <Check className="size-3" aria-hidden="true" />
          {ownedLabel}
        </span>
      ) : (
        <>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-700">
            {item.price} DZF
          </span>
          <button
            onClick={onBuy}
            disabled={buying}
            aria-label={`${buyLabel} — ${item.content}`}
            className="flex h-7 w-full items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {buying ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : buyLabel}
          </button>
        </>
      )}
    </div>
  );
}
