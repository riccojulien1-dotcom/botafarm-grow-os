import {
  Droplets,
  FlaskConical,
  Leaf,
  Thermometer,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";

type EnvironmentMetricIconProps = {
  metricKey: EnvironmentMetricKey;
  size?: "card" | "detail" | "alert";
};

type MetricIconConfig = {
  Icon: LucideIcon;
  color: string;
  bg: string;
};

const METRIC_ICON_CONFIG: Record<EnvironmentMetricKey, MetricIconConfig> = {
  temperature: {
    Icon: Thermometer,
    color: "text-orange-400",
    bg: "bg-orange-500/15 border-orange-500/25",
  },
  humidity: {
    Icon: Droplets,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15 border-cyan-500/25",
  },
  vpd: {
    Icon: Leaf,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/25",
  },
  ec_in: {
    Icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/25",
  },
  ec_runoff: {
    Icon: Zap,
    color: "text-yellow-300",
    bg: "bg-yellow-500/15 border-yellow-500/25",
  },
  ph_in: {
    Icon: FlaskConical,
    color: "text-violet-400",
    bg: "bg-violet-500/15 border-violet-500/25",
  },
  ph_runoff: {
    Icon: FlaskConical,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/15 border-fuchsia-500/25",
  },
};

const sizeClasses = {
  card: { box: "h-12 w-12", icon: 24 },
  detail: { box: "h-16 w-16", icon: 32 },
  alert: { box: "h-8 w-8", icon: 16 },
};

export function EnvironmentMetricIcon({ metricKey, size = "card" }: EnvironmentMetricIconProps) {
  const config = METRIC_ICON_CONFIG[metricKey];
  const { Icon } = config;
  const dimensions = sizeClasses[size];

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl border ${config.bg} ${dimensions.box}`}
      aria-hidden
    >
      <Icon className={config.color} size={dimensions.icon} strokeWidth={2.25} />
    </span>
  );
}
