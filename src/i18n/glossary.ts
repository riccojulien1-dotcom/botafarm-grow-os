/**
 * Canonical cultivation terminology.
 * These terms stay identical in every locale UI (not translated).
 * Use `cultivationTerm()` in components and `{term}` placeholders in message files.
 */
export const cultivationGlossary = {
  dryback: {
    term: "Dryback",
    definition: "Substrate moisture drop between irrigation events.",
  },
  runoff: {
    term: "Runoff",
    definition: "Drainage volume leaving the container after irrigation.",
  },
  flip: {
    term: "Flip",
    definition: "Switching a room from vegetative to flowering photoperiod.",
  },
  stretch: {
    term: "Stretch",
    definition: "Vertical internode expansion during early flower.",
  },
  veg: {
    term: "Veg",
    definition: "Vegetative growth phase.",
  },
  flower: {
    term: "Flower",
    definition: "Flowering growth phase.",
  },
  ec: {
    term: "EC",
    definition: "Electrical conductivity of nutrient solution.",
  },
  vpd: {
    term: "VPD",
    definition: "Vapor pressure deficit.",
  },
  ppfd: {
    term: "PPFD",
    definition: "Photosynthetic photon flux density.",
  },
  dli: {
    term: "DLI",
    definition: "Daily light integral.",
  },
  clone: {
    term: "Clone",
    definition: "Vegetative cutting propagated from a mother plant.",
  },
  cultivar: {
    term: "Cultivar",
    definition: "Named genetic variety under cultivation.",
  },
  defoliation: {
    term: "Defoliation",
    definition: "Selective leaf removal to manage canopy airflow and light.",
  },
} as const;

export type CultivationGlossaryKey = keyof typeof cultivationGlossary;

export const cultivationGlossaryKeys = Object.keys(cultivationGlossary) as CultivationGlossaryKey[];

export function cultivationTerm(key: CultivationGlossaryKey): string {
  return cultivationGlossary[key].term;
}

export function isCultivationTerm(value: string): value is (typeof cultivationGlossary)[CultivationGlossaryKey]["term"] {
  return cultivationGlossaryKeys.some((key) => cultivationGlossary[key].term === value);
}
