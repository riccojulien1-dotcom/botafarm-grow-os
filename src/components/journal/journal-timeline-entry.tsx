"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowUpRight, DoorOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  deleteDailyLogAction,
  updateDailyLogAction,
} from "@/app/dashboard/journal/actions";
import { DailyLogFields } from "@/components/journal/daily-log-fields";
import { DailyLogPhotoField } from "@/components/journal/daily-log-photo-field";
import { DailyLogPhotoGallery } from "@/components/journal/daily-log-photo-gallery";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { preventImplicitFormSubmitOnEnter } from "@/lib/forms/prevent-enter-submit";
import { useDailyLogFormWithPhotos } from "@/lib/hooks/use-daily-log-form-with-photos";
import { dailyLogActionInitialState } from "@/lib/journal/daily-log-action-state";
import { formatMetricValue } from "@/lib/journal/journal-metric-deltas";
import type { JournalTimelineEntry } from "@/lib/journal/journal-types";
import { toTitleCase } from "@/lib/ui/format-mission-labels";

type JournalTimelineEntryCardProps = {
  entry: JournalTimelineEntry;
};

const initialState = dailyLogActionInitialState;

function resolveDisplayDate(entry: JournalTimelineEntry) {
  return entry.log.log_date ?? new Date(entry.log.logged_at).toISOString().slice(0, 10);
}

export function JournalTimelineEntryCard({ entry }: JournalTimelineEntryCardProps) {
  const router = useRouter();
  const tTimeline = useTranslations("journal.timeline");
  const tForm = useTranslations("journal.form");
  const [isEditing, setIsEditing] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const { state: updateState, photoError, pending: updatePending, handleSubmit } =
    useDailyLogFormWithPhotos(updateDailyLogAction, initialState, {
      onSuccess: () => setIsEditing(false),
    });
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteDailyLogAction,
    initialState,
  );
  const lastDeleteHandledRef = useRef(initialState);
  const logDate = resolveDisplayDate(entry);

  useEffect(() => {
    if (!deleteState?.success || deleteState === lastDeleteHandledRef.current) {
      return;
    }
    lastDeleteHandledRef.current = deleteState;
    router.refresh();
  }, [deleteState, router]);

  if (isEditing) {
    return (
      <li>
        <GlassPanel padding="md" glow="magenta">
          <form
            key={`edit-journal-${entry.log.id}-${editSession}`}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            onKeyDown={preventImplicitFormSubmitOnEnter}
            className="grid gap-3 md:grid-cols-2"
          >
            <input type="hidden" name="log_id" value={entry.log.id} />
            <input type="hidden" name="grow_room_id" value={entry.log.grow_room_id} />
            <DailyLogFields
              idPrefix={`edit-journal-${entry.log.id}`}
              values={{ ...entry.log, log_date: logDate }}
            />
            <DailyLogPhotoField idPrefix={`edit-journal-${entry.log.id}`} />

            {updateState?.error || photoError ? (
              <p className="md:col-span-2 text-sm text-red-400" role="alert">
                {updateState?.error ?? photoError}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                type="submit"
                disabled={updatePending}
                className="rounded-md bg-fuchsia-600 px-3 py-1.5 text-sm text-white hover:bg-fuchsia-500 disabled:bg-fuchsia-900"
              >
                {updatePending ? tForm("saving") : tForm("saveChanges")}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={updatePending}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-500 disabled:opacity-60"
              >
                {tForm("cancel")}
              </button>
            </div>
          </form>
        </GlassPanel>
      </li>
    );
  }

  const filledMetrics = entry.metricDeltas.filter((metric) => metric.current != null);

  return (
    <li>
      <GlassPanel padding="md" className="relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-fuchsia-500/70 via-cyan-500/40 to-transparent" />
        <div className="pl-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-fuchsia-300/90">
                  {logDate}
                </p>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-0.5 text-xs text-zinc-300">
                  <DoorOpen className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
                  {toTitleCase(entry.log.roomName)}
                </span>
              </div>
              <p className="text-sm text-zinc-500">{tTimeline("diaryEntry")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditSession((current) => current + 1);
                  setIsEditing(true);
                }}
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm hover:border-fuchsia-500 hover:text-fuchsia-300"
              >
                {tTimeline("edit")}
              </button>
              <form
                action={deleteAction}
                onSubmit={(event) => {
                  if (!window.confirm(tTimeline("deleteConfirm"))) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="log_id" value={entry.log.id} />
                <input type="hidden" name="grow_room_id" value={entry.log.grow_room_id} />
                <button
                  type="submit"
                  disabled={deletePending}
                  className="rounded-md border border-red-900/60 px-3 py-1.5 text-sm text-red-300 hover:border-red-500 disabled:opacity-60"
                >
                  {deletePending ? tTimeline("deleting") : tTimeline("delete")}
                </button>
              </form>
              <Link
                href={`/rooms/${entry.log.grow_room_id}`}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-sm text-cyan-300 hover:border-cyan-500/35"
              >
                {tTimeline("room")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          {filledMetrics.length ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filledMetrics.map((metric) => (
                <div
                  key={metric.key}
                  className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {metric.label}
                  </p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-base font-semibold tabular-nums text-white">
                      {formatMetricValue(metric.current, metric.unit)}
                    </span>
                    {metric.deltaLabel ? (
                      <span
                        className={`text-xs font-medium tabular-nums ${
                          (metric.delta ?? 0) > 0 ? "text-amber-300" : "text-cyan-300"
                        }`}
                      >
                        {metric.deltaLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">{tTimeline("noMetrics")}</p>
          )}

          {entry.log.notes ? (
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {tTimeline("notes")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-300">{entry.log.notes}</p>
            </div>
          ) : null}

          {entry.photos.length ? (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                {tTimeline("photos")}
              </p>
              <DailyLogPhotoGallery photos={entry.photos} />
            </div>
          ) : null}

          {deleteState?.error ? (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {deleteState.error}
            </p>
          ) : null}
        </div>
      </GlassPanel>
    </li>
  );
}
