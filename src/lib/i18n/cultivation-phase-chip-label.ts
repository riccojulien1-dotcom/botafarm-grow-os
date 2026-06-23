import type { useTranslations } from "next-intl";

import { cultivationTerm } from "@/i18n/glossary";

type GrowRoomsTranslator = ReturnType<typeof useTranslations<"growRooms">>;

export function cultivationPhaseChipLabel(
  t: GrowRoomsTranslator,
  rawLabel: string,
): string {
  const normalized = rawLabel.trim().toUpperCase().replace(/-/g, " ");

  switch (normalized) {
    case "EARLY FLOWER":
      return t("phases.earlyFlower");
    case "MID FLOWER":
      return t("phases.midFlower");
    case "LATE FLOWER":
      return t("phases.lateFlower");
    case "VEGETATIVE":
      return cultivationTerm("veg");
    case "PRE FLOWER":
      return t("status.preFlower");
    case "FLOWER":
      return t("status.flower");
    case "CLONE":
      return cultivationTerm("clone");
    case "MOTHER":
      return cultivationTerm("mother");
    case "DRYING":
      return t("status.drying");
    case "CURE":
      return t("status.cure");
    default:
      return rawLabel
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
}
