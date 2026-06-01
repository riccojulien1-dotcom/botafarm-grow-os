type BfSparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  accent?: "cyan" | "magenta";
  labels?: string[];
};

export function BfSparkline({
  data,
  width = 200,
  height = 48,
  accent = "cyan",
  labels,
}: BfSparklineProps) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-zinc-600"
        style={{ width, height }}
      >
        No trend
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = data
    .map((value, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * innerW;
      const y = padding + innerH - ((value - min) / range) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  const stroke = accent === "cyan" ? "#22d3ee" : "#e879f9";
  const fillId = `spark-fill-${accent}-${width}`;

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="space-y-1">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${fillId})`} />
        <polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
        />
      </svg>
      {labels?.length ? (
        <div className="flex justify-between font-mono text-[9px] text-zinc-600">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      ) : null}
    </div>
  );
}
