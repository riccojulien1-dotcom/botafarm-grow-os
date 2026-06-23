"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChevronDown, Globe, LogOut } from "lucide-react";

import { signOutAction } from "@/app/(auth)/actions";
import { setLocaleAction } from "@/app/actions/locale";
import type { AppLocale } from "@/i18n/config";
import { locales } from "@/i18n/config";

type UserMenuProps = {
  email: string;
};

const localeActionInitialState = {};

const localeLabelKey: Record<AppLocale, "localeEn" | "localeFr"> = {
  en: "localeEn",
  fr: "localeFr",
};

export function UserMenu({ email }: UserMenuProps) {
  const t = useTranslations("userMenu");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, localeAction, localePending] = useActionState(setLocaleAction, localeActionInitialState);
  const wasLocalePendingRef = useRef(false);

  useEffect(() => {
    if (wasLocalePendingRef.current && !localePending) {
      router.refresh();
    }
    wasLocalePendingRef.current = localePending;
  }, [localePending, router]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-zinc-300 transition hover:border-fuchsia-500/30 hover:text-fuchsia-200"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="hidden max-w-[180px] truncate font-mono text-xs text-zinc-500 sm:inline">
          {email}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/90">
          {locale}
        </span>
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-950/95 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        >
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {t("account")}
          </p>
          <p className="truncate px-3 pb-2 font-mono text-xs text-zinc-400">{email}</p>

          <div className="border-t border-white/[0.06] px-3 py-2">
            <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
              <Globe className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
              {t("language")}
            </div>
            <div className="grid gap-1">
              {locales.map((value) => (
                <form key={value} action={localeAction}>
                  <input type="hidden" name="locale" value={value} />
                  <button
                    type="submit"
                    disabled={localePending}
                    role="menuitemradio"
                    aria-checked={locale === value}
                    className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition ${
                      locale === value
                        ? "bg-fuchsia-950/50 text-fuchsia-200"
                        : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {t(localeLabelKey[value])}
                  </button>
                </form>
              ))}
            </div>
          </div>

          <form action={signOutAction} className="border-t border-white/[0.06] p-2">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-fuchsia-200"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              {t("logOut")}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
