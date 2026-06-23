"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

type JournalFiltersProps = {
  rooms: Array<{ id: string; name: string }>;
  initialRoomId?: string;
  initialFrom?: string;
  initialTo?: string;
};

export function JournalFilters({
  rooms,
  initialRoomId = "",
  initialFrom = "",
  initialTo = "",
}: JournalFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("journal.filters");

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const room = String(formData.get("room") ?? "").trim();
    const from = String(formData.get("from") ?? "").trim();
    const to = String(formData.get("to") ?? "").trim();

    if (room) params.set("room", room);
    else params.delete("room");

    if (from) params.set("from", from);
    else params.delete("from");

    if (to) params.set("to", to);
    else params.delete("to");

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `/dashboard/journal?${query}` : "/dashboard/journal");
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push("/dashboard/journal");
    });
  }

  const inputClassName =
    "mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100";

  return (
    <form onSubmit={applyFilters} className="grid gap-3 md:grid-cols-4">
      <div>
        <label htmlFor="journal-filter-room" className="text-sm text-zinc-200">
          {t("room")}
        </label>
        <select
          id="journal-filter-room"
          name="room"
          defaultValue={initialRoomId}
          className={inputClassName}
        >
          <option value="">{t("allRooms")}</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="journal-filter-from" className="text-sm text-zinc-200">
          {t("from")}
        </label>
        <input
          id="journal-filter-from"
          name="from"
          type="date"
          defaultValue={initialFrom}
          className={inputClassName}
        />
      </div>
      <div>
        <label htmlFor="journal-filter-to" className="text-sm text-zinc-200">
          {t("to")}
        </label>
        <input
          id="journal-filter-to"
          name="to"
          type="date"
          defaultValue={initialTo}
          className={inputClassName}
        />
      </div>
      <div className="flex items-end gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
        >
          {isPending ? t("filtering") : t("apply")}
        </button>
        <button
          type="button"
          onClick={clearFilters}
          disabled={isPending}
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:border-zinc-500 disabled:opacity-60"
        >
          {t("clear")}
        </button>
      </div>
    </form>
  );
}
