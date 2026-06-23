"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";

import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";
import type { SupervisionMetricPoint } from "@/lib/environment/build-supervision-metrics";
import { formatMetricReading } from "@/lib/environment/format-metric-display";
import { formatMetricValue } from "@/lib/environment/metric-stats";

type EnvironmentMetricChartProps = {
  points: SupervisionMetricPoint[];
  metricKey: EnvironmentMetricKey;
  accent?: "cyan" | "magenta";
  compact?: boolean;
  min?: number | null;
  max?: number | null;
  decimals?: number;
};

const strokeColors = {
  cyan: "#22d3ee",
  magenta: "#e879f9",
};

export function EnvironmentMetricChart({
  points,
  metricKey,
  accent = "cyan",
  compact = false,
  min = null,
  max = null,
  decimals = 2,
}: EnvironmentMetricChartProps) {
  const t = useTranslations("environment");
  const stroke = strokeColors[accent];
  const chartData = points.map((point) => ({
    date: point.date,
    label: point.dateLabel,
    value: point.value,
  }));

  if (!chartData.length) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-white/10 text-center text-xs text-zinc-500 ${
          compact ? "h-20" : "h-48"
        }`}
      >
        {t("metrics.trends.notEnoughReadings")}
      </div>
    );
  }

  const height = compact ? 80 : 220;

  return (
    <div className="space-y-2">
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#3f3f46" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#a1a1aa", fontSize: compact ? 8 : 11 }}
              axisLine={{ stroke: "#52525b" }}
              tickLine={{ stroke: "#52525b" }}
              interval="preserveStartEnd"
              minTickGap={compact ? 12 : 24}
            />
            <YAxis
              tick={{ fill: "#a1a1aa", fontSize: compact ? 8 : 11 }}
              axisLine={{ stroke: "#52525b" }}
              tickLine={{ stroke: "#52525b" }}
              width={compact ? 28 : 40}
              domain={["auto", "auto"]}
              tickFormatter={(value) => formatMetricValue(Number(value), decimals)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "0.5rem",
                color: "#f4f4f5",
              }}
              labelStyle={{ color: "#d4d4d8" }}
              formatter={(value) => [
                formatMetricReading(Number(value), metricKey, decimals),
                t("metrics.detail.reading"),
              ]}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload as { date?: string; label?: string } | undefined;
                return point?.date ?? point?.label ?? "";
              }}
            />
            {min != null ? (
              <ReferenceLine
                y={min}
                stroke="#71717a"
                strokeDasharray="4 4"
                label={
                  compact
                    ? undefined
                    : {
                        value: t("metrics.chart.min", {
                          value: formatMetricReading(min, metricKey, decimals),
                        }),
                        position: "insideBottomLeft",
                        fill: "#a1a1aa",
                        fontSize: 10,
                      }
                }
              />
            ) : null}
            {max != null ? (
              <ReferenceLine
                y={max}
                stroke="#71717a"
                strokeDasharray="4 4"
                label={
                  compact
                    ? undefined
                    : {
                        value: t("metrics.chart.max", {
                          value: formatMetricReading(max, metricKey, decimals),
                        }),
                        position: "insideTopLeft",
                        fill: "#a1a1aa",
                        fontSize: 10,
                      }
                }
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={compact ? 1.75 : 2.5}
              dot={{ r: compact ? 2 : 3.5, fill: stroke, strokeWidth: 0 }}
              activeDot={{ r: compact ? 3.5 : 5, fill: stroke, stroke: "#18181b", strokeWidth: 2 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!compact && min != null && max != null ? (
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          <span>
            {t("metrics.chart.min", {
              value: formatMetricReading(min, metricKey, decimals),
            })}
          </span>
          <span>
            {t("metrics.chart.max", {
              value: formatMetricReading(max, metricKey, decimals),
            })}
          </span>
        </div>
      ) : null}
    </div>
  );
}
