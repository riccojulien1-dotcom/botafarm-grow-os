"use client";

import { useTranslations } from "next-intl";

import { MAX_LOG_PHOTOS_PER_UPLOAD } from "@/lib/journal/log-photos-shared";
import type { PhotoUploadErrorKey } from "@/lib/journal/photo-upload-errors";

export function useTranslatePhotoUploadError() {
  const t = useTranslations("journal.photos");

  return (errorKey: PhotoUploadErrorKey) => {
    switch (errorKey) {
      case "tooMany":
        return t("tooMany", { max: MAX_LOG_PHOTOS_PER_UPLOAD });
      case "tooLarge":
        return t("tooLarge");
      case "invalidType":
        return t("invalidType");
      case "storageNotConfigured":
        return t("storageNotConfigured");
      case "tableNotConfigured":
        return t("tableNotConfigured");
      case "uploadFailed":
        return t("uploadFailed");
      default:
        return t("uploadFailed");
    }
  };
}
