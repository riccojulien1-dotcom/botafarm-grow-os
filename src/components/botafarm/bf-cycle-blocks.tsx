type BfCycleBlocksProps = {
  percent: number;
  segments?: number;
};

export function BfCycleBlocks({ percent, segments = 12 }: BfCycleBlocksProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const filled = Math.round((clamped / 100) * segments);

  return (
    <div
      className="font-mono text-base tracking-[0.12em] sm:text-lg"
      aria-label={`${Math.round(clamped)} percent complete`}
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={index < filled ? "text-fuchsia-400" : "text-zinc-700"}
        >
          {index < filled ? "█" : "░"}
        </span>
      ))}
    </div>
  );
}
