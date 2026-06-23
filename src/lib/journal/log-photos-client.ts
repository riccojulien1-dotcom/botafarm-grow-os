"use client";

import { createClient } from "@/lib/supabase/client";
import {
  buildLogPhotoStoragePath,
  validatePhotoFiles,
} from "@/lib/journal/log-photos-shared";
import type { PhotoUploadErrorKey } from "@/lib/journal/photo-upload-errors";

export function extractPhotoFilesFromForm(form: HTMLFormElement): File[] {
  const input = form.querySelector<HTMLInputElement>('input[type="file"][name="photos"]');
  if (!input?.files?.length) {
    return [];
  }

  return Array.from(input.files).filter((file) => file.size > 0);
}

export function removePhotosFromFormData(formData: FormData) {
  while (formData.has("photos")) {
    formData.delete("photos");
  }
}

export async function uploadDailyLogPhotosFromBrowser(
  userId: string,
  logId: string,
  files: File[],
): Promise<PhotoUploadErrorKey | null> {
  if (files.length === 0) {
    return null;
  }

  const validation = validatePhotoFiles(files);
  if (!validation.ok) {
    return validation.errorKey;
  }

  const supabase = createClient();

  try {
    for (const file of files) {
      const storagePath = buildLogPhotoStoragePath(userId, logId, file);

      const { error: uploadError } = await supabase.storage
        .from("log-photos")
        .upload(storagePath, file, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        if (uploadError.message.toLowerCase().includes("bucket")) {
          return "storageNotConfigured";
        }
        return "uploadFailed";
      }

      const { error: insertError } = await supabase.from("log_photos").insert({
        daily_log_id: logId,
        storage_path: storagePath,
        caption: null,
      });

      if (insertError) {
        await supabase.storage.from("log-photos").remove([storagePath]);
        if (insertError.message.toLowerCase().includes("log_photos")) {
          return "tableNotConfigured";
        }
        return "uploadFailed";
      }
    }
  } catch {
    return "uploadFailed";
  }

  return null;
}
