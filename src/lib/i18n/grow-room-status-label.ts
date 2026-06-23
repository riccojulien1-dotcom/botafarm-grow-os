import type { useTranslations } from "next-intl";

import { cultivationTerm } from "@/i18n/glossary";
import type { GrowRoomStatus } from "@/lib/grow-rooms/constants";

type StatusTranslator = ReturnType<typeof useTranslations<"growRooms.status">>;

export function growRoomStatusLabel(
  t: StatusTranslator,
  status: GrowRoomStatus | string,
): string {
  switch (status) {
    case "Clone":
      return cultivationTerm("clone");
    case "Mother":
      return cultivationTerm("mother");
    case "Vegetative":
      return cultivationTerm("veg");
    case "Pre-Flower":
      return t("preFlower");
    case "Flower":
      return t("flower");
    case "Drying":
      return t("drying");
    case "Cure":
      return t("cure");
    default:
      return status;
  }
}
