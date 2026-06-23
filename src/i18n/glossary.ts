/**
 * Official Botafarm cultivation glossary.
 * These terms stay identical in every locale UI (not translated).
 * Use `cultivationTerm()` in components and `{term}` placeholders in message files.
 *
 * Interface copy (buttons, navigation, sentences) is translated; these terms are not.
 */
export const cultivationGlossary = {
  log: {
    term: "Log",
    definition: "Daily cultivation record for a grow room.",
  },
  timeline: {
    term: "Timeline",
    definition: "Chronological view of cultivation logs.",
  },
  dryback: {
    term: "Dryback",
    definition: "Substrate moisture drop between irrigation events.",
  },
  runoff: {
    term: "Runoff",
    definition: "Drainage volume leaving the container after irrigation.",
  },
  flush: {
    term: "Flush",
    definition: "Clear-water or low-EC irrigation to reduce salt buildup.",
  },
  veg: {
    term: "Veg",
    definition: "Vegetative growth phase.",
  },
  stretch: {
    term: "Stretch",
    definition: "Vertical internode expansion during early flower.",
  },
  flip: {
    term: "Flip",
    definition: "Switching a room from vegetative to flowering photoperiod.",
  },
  clone: {
    term: "Clone",
    definition: "Vegetative cutting propagated from a mother plant.",
  },
  mother: {
    term: "Mother",
    definition: "Stock plant kept for taking cuttings.",
  },
  cultivar: {
    term: "Cultivar",
    definition: "Named genetic variety under cultivation.",
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
} as const;

/** Brand labels — never translated. */
export const brandTerms = {
  missionControl: "Mission Control",
} as const;

export type CultivationGlossaryKey = keyof typeof cultivationGlossary;

export const cultivationGlossaryKeys = Object.keys(
  cultivationGlossary,
) as CultivationGlossaryKey[];

export function cultivationTerm(key: CultivationGlossaryKey): string {
  return cultivationGlossary[key].term;
}

export function isCultivationTerm(
  value: string,
): value is (typeof cultivationGlossary)[CultivationGlossaryKey]["term"] {
  return cultivationGlossaryKeys.some((key) => cultivationGlossary[key].term === value);
}
