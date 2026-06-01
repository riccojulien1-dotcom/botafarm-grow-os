import Link from "next/link";

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
  if (!hasLog) {
    return <p className="text-xs text-zinc-500">Recommendations: add a journal log</p>;
  }

  if (activeCount === 0) {
    return null;
  }

  return (
    <p className="text-xs text-zinc-400">
      {activeCount} active recommendation{activeCount === 1 ? "" : "s"}
      {" · "}
      <Link
        href={`/rooms/${roomId}`}
        className="text-fuchsia-300 hover:text-fuchsia-200"
      >
        Learn more
      </Link>
    </p>
  );
}
