"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { BfButton } from "@/components/botafarm/bf-button";
import { GlassPanel } from "@/components/botafarm/glass-panel";
import { OverviewRoomCard } from "@/components/dashboard/overview-room-card";
import { OverviewRoomEnvironmentCard } from "@/components/dashboard/overview-room-environment-card";
import type { CommandCenterPriority } from "@/lib/dashboard/command-center-priorities";
import type { CommandCenterData } from "@/lib/dashboard/get-command-center-data";

type CommandCenterOverviewProps = {
  data: CommandCenterData;
};

export function CommandCenterOverview({ data }: CommandCenterOverviewProps) {
  const t = useTranslations("dashboard");

  function priorityTone(item: CommandCenterPriority) {
    if (item.severity === "action") {
      return {
        label: t("priorities.urgent"),
        rowClass: "border-red-500/25 bg-red-950/20 hover:border-red-400/40",
        labelClass: "border-red-500/30 bg-red-950/40 text-red-200/90",
      };
    }
    return {
      label: t("priorities.review"),
      rowClass: "border-white/[0.06] bg-black/20 hover:border-amber-500/25",
      labelClass: "border-amber-500/25 bg-amber-950/35 text-amber-100/90",
    };
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="bf-mission-hero bf-atmosphere-deep px-5 py-7 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_0%_0%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(ellipse_65%_45%_at_100%_100%,rgba(232,121,249,0.1),transparent_50%)]" />
        <div className="relative space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="bf-section-eyebrow text-cyan-500/80">{t("hero.brand")}</p>
              <h1 className="bf-hero-display bf-gradient-text text-[clamp(2.5rem,8vw,5.5rem)]">
                {t("hero.title")}
              </h1>
              <p className="font-mono text-sm uppercase tracking-[0.38em] text-zinc-400">
                {t("hero.subtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <BfButton href="/dashboard/grow-rooms" variant="primary">
                {t("hero.growRooms")}
              </BfButton>
              <BfButton href="/dashboard/environment" variant="secondary">
                {t("hero.environment")}
              </BfButton>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader
          title={t("sections.growRooms")}
          subtitle={t("sections.activeZones", { count: data.rooms.length })}
          compact
        />
        {data.rooms.length ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {data.rooms.map((room) => (
              <OverviewRoomCard key={room.id} room={room} />
            ))}
          </ul>
        ) : (
          <GlassPanel padding="md">
            <p className="text-sm text-zinc-500">{t("sections.deployFirst")}</p>
            <BfButton href="/dashboard/grow-rooms" variant="primary" className="mt-3">
              {t("sections.openGrowRooms")}
            </BfButton>
          </GlassPanel>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeader
            title={t("sections.environmentScan")}
            subtitle={t("sections.roomCount", { count: data.roomEnvironments.length })}
            compact
          />
          {data.roomEnvironments.length ? (
            <Link
              href="/dashboard/environment"
              className="text-xs font-medium text-cyan-400/90 transition hover:text-cyan-300"
            >
              {t("sections.fullClimateAnalysis")}
            </Link>
          ) : null}
        </div>
        {data.roomEnvironments.length ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {data.roomEnvironments.map((environment) => (
              <OverviewRoomEnvironmentCard key={environment.roomId} environment={environment} />
            ))}
          </ul>
        ) : (
          <GlassPanel padding="md">
            <p className="text-sm text-zinc-500">{t("sections.addRoomsForClimate")}</p>
          </GlassPanel>
        )}
      </section>

      <section className="space-y-3">
        <SectionHeader title={t("sections.tasksToday")} compact />
        <GlassPanel
          padding="md"
          glow={data.priorities.some((priority) => priority.severity === "action") ? "red" : "none"}
        >
          {data.priorities.length ? (
            <ul className="divide-y divide-white/[0.06]">
              {data.priorities.map((item) => {
                const tone = priorityTone(item);
                return (
                  <li key={item.id}>
                    <Link
                      href={`/rooms/${item.roomId}`}
                      className={`bf-interactive -mx-1 block rounded-xl border px-4 py-3.5 transition ${tone.rowClass}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone.labelClass}`}
                        >
                          {tone.label}
                        </span>
                        <span className="text-xs text-zinc-500">{item.roomName}</span>
                      </div>
                      <p className="mt-2 text-base font-semibold leading-snug text-zinc-100">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-4 text-center text-sm text-emerald-300/90">
              {t("sections.noOpenTasks")}
            </p>
          )}
        </GlassPanel>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  compact,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2
        className={`font-bold uppercase tracking-tight text-white ${
          compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {title}
      </h2>
      {subtitle ? <span className="bf-section-eyebrow">{subtitle}</span> : null}
    </div>
  );
}
