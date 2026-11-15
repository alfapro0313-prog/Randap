"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#home", label: "Bosh sahifa" },
  { href: "#courses", label: "Kurslar" },
  { href: "#about", label: "Nega biz?" },
  { href: "#pricing", label: "Narxlar" },
  { href: "#testimonials", label: "Fikrlar" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Aloqa" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-stone-200 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/60 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-stone-900">
              ZamonBilim
            </span>
            <span className="block text-[11px] font-medium text-stone-500">
              o&apos;quv markazi
            </span>
          </span>
        </Link>

        <nav aria-label="Asosiy menyu" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 sm:inline-flex"
          >
            <a href="#contact">Kursga yozilish</a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Menyuni ochish"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-stone-900">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <GraduationCap className="size-4" aria-hidden="true" />
                  </span>
                  ZamonBilim
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobil menyu"
                className="mt-2 flex flex-col gap-1 px-3 pb-6"
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  asChild
                  className="mt-3 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <a href="#contact" onClick={() => setOpen(false)}>
                    Kursga yozilish
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
