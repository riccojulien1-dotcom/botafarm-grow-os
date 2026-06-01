type BfAreaChartProps = {
  data: number[];
  width?: number;
  height?: number;
  accent?: "cyan" | "magenta";
  labels?: string[];
  unit?: string;
  latestValue?: string | number | null;
};

function smoothPath(
  data: number[],
  width: number,
  height: number,
  padding: number,
): { line: string; area: string } {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const coords = data.map((value, index) => ({
    x: padding + (index / Math.max(data.length - 1, 1)) * innerW,
    y: padding + innerH - ((value - min) / range) * innerH,
  }));

  if (coords.length < 2) {
    const point = coords[0];
    const line = point ? `M ${point.x} ${point.y}` : "";
    const area = point
      ? `M ${padding} ${height - padding} L ${point.x} ${point.y} L ${width - padding} ${height - padding} Z`
      : "";
    return { line, area };
  }

  let line = `M ${coords[0].x} ${coords[0].y}`;
  for (let index = 0; index < coords.length - 1; index += 1) {
    const current = coords[index];
    const next = coords[index + 1];
    const controlX = (current.x + next.x) / 2;
    line += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  const last = coords[coords.length - 1];
  const first = coords[0];
  const area = `${line} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;

  return { line, area };
}

export function BfAreaChart({
  data,
  width = 280,
  height = 88,
  accent = "cyan",
  labels,
  unit,
  latestValue,
}: BfAreaChartProps) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-zinc-600"
        style={{ width, height }}
      >
        Awaiting logs
      </div>
    );
  }

  const padding = 6;
  const stroke = accent === "cyan" ? "#22d3ee" : "#e879f9";
  const strokeDim = accent === "cyan" ? "#0891b2" : "#c026d3";
  const fillId = `bf-chart-${accent}-${width}-${height}`;
  const glowId = `bf-glow-${accent}-${width}`;

  const { line, area } = smoothPath(data, width, height, padding);

  return (
    <div className="space-y-2">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.45} />
              <stop offset="55%" stopColor={strokeDim} stopOpacity={0.12} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
            <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={area} fill={`url(#${fillId})`} />
          <path
            d={line}
            fill="none"
            stroke={stroke}
            strokeWidth={2.5}
            strokeLinecap="round"
            filter={`url(#${glowId})`}
            style={{ filter: `drop-shadow(0 0 8px ${stroke})` }}
          />
        </svg>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          {latestValue != null && latestValue !== "" ? (
            <p
              className={`font-bold tabular-nums tracking-tight ${
                accent === "cyan" ? "text-cyan-300" : "text-fuchsia-300"
              } text-2xl sm:text-3xl`}
            >
              {latestValue}
              {unit ? (
                <span className="ml-1 text-sm font-normal text-zinc-500">{unit}</span>
              ) : null}
            </p>
          ) : null}
        </div>
        {labels?.length ? (
          <div className="flex justify-between gap-4 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            <span>{labels[0]}</span>
            <span>{labels[labels.length - 1]}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
