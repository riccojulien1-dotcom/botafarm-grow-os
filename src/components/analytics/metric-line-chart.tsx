"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/lib/journal/build-chart-series";

type MetricLineChartProps = {
  title: string;
  unit?: string;
  color: string;
  data: ChartPoint[];
};

function formatTooltipValue(value: number, unit?: string) {
  return unit ? `${value} ${unit}` : String(value);
}

export function MetricLineChart({ title, unit, color, data }: MetricLineChartProps) {
  if (!data.length) {
    return (
      <article className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
        <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
        <p className="mt-6 text-sm text-zinc-500">No data logged yet for this metric.</p>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
      <h3 className="text-sm font-medium text-zinc-200">
        {title}
        {unit ? <span className="text-zinc-500"> ({unit})</span> : null}
      </h3>
      <div className="mt-3 h-56 w-full min-w-0 sm:h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              axisLine={{ stroke: "#52525b" }}
              tickLine={{ stroke: "#52525b" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              axisLine={{ stroke: "#52525b" }}
              tickLine={{ stroke: "#52525b" }}
              width={40}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "0.5rem",
                color: "#f4f4f5",
              }}
              labelStyle={{ color: "#d4d4d8" }}
              formatter={(value) => formatTooltipValue(Number(value), unit)}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload as ChartPoint | undefined;
                return point?.date ?? "";
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: color, stroke: "#18181b", strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
