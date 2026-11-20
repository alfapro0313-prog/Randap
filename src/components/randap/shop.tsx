"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  type ShopItem,
} from "@/lib/shop-catalog";
import type { ShopData } from "@/lib/randap-types";
import { cn } from "@/lib/utils";

type ShopCategory = "special" | "faces" | "hands" | "hearts" | "animals" | "food" | "symbols";

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
