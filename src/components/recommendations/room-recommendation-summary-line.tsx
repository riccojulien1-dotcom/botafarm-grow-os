"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

type RoomRecommendationSummaryLineProps = {
  activeCount: number;
  roomId: string;
  hasLog: boolean;
};

export function RoomRecommendationSummaryLine({
  activeCount,
  roomId,
  hasLog,
}: RoomRecommendationSummaryLineProps) {
  const t = useTranslations("growRooms.recommendations");

  if (!hasLog) {
    return <p className="text-xs text-zinc-500">{t("addLog")}</p>;
  }

  if (activeCount === 0) {
    return null;
  }

  return (
    <p className="text-xs text-zinc-400">
      {t("activeCount", { count: activeCount })}
      {" · "}
      <Link
        href={`/rooms/${roomId}`}
        className="text-fuchsia-300 hover:text-fuchsia-200"
      >
        {t("learnMore")}
      </Link>
    </p>
  );
}
