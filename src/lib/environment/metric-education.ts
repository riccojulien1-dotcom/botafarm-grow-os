import type { EnvironmentMetricKey } from "@/lib/environment/build-environment-metrics";

export type MetricEducation = {
  title: string;
  summary: string;
  detail: string;
};

export const METRIC_EDUCATION: Record<EnvironmentMetricKey, MetricEducation> = {
  temperature: {
    title: "Temperature",
    summary: "Air temperature in the room affects growth speed, transpiration, and stress.",
    detail:
      "Cannabis prefers stable temperatures. Too hot slows growth and raises VPD. Too cold slows metabolism. Log daily so you can spot swings before plants show stress.",
  },
  humidity: {
    title: "Humidity",
    summary: "Relative humidity controls how much moisture the air holds around your plants.",
    detail:
      "High humidity in flower increases mold risk. Low humidity pulls water through the plant too fast. Match humidity to your room phase and keep it steady.",
  },
  vpd: {
    title: "VPD",
    summary: "Vapor Pressure Deficit — the drying power of the air on your leaves.",
    detail:
      "VPD combines temperature and humidity into one number growers use to balance transpiration. Too low = slow uptake. Too high = leaf stress. It is one of the most useful climate metrics.",
  },
  ec_in: {
    title: "EC In",
    summary: "Electrical conductivity of nutrient solution going into the medium.",
    detail:
      "EC In tells you how strong your feed is. Rising EC In without matching plant demand can build salts. Compare EC In to EC Out to understand what the plant is taking up or leaving behind.",
  },
  ec_runoff: {
    title: "EC Out",
    summary: "EC of runoff water leaving the bottom of the pot after irrigation.",
    detail:
      "EC Out shows what the root zone is shedding. Climbing runoff EC often means salt buildup or the plant is drinking more water than nutrients. Track it every feed to stay ahead of lockout.",
  },
  ph_in: {
    title: "pH In",
    summary: "Acidity of nutrient solution going into the medium.",
    detail:
      "pH controls which nutrients are available to roots. Most cultivars prefer slightly acidic feed. Log pH In every irrigation so you catch drift before deficiency symptoms appear.",
  },
  ph_runoff: {
    title: "pH Out",
    summary: "pH of runoff water leaving the pot after irrigation.",
    detail:
      "Runoff pH reveals what is happening in the root zone. A gap between pH In and pH Out can signal medium buffering or salt issues. Stable runoff pH usually means healthy nutrient uptake.",
  },
};
