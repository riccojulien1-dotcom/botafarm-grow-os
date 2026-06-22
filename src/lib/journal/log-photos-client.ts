"use client";

import { createClient } from "@/lib/supabase/client";
import {
  buildLogPhotoStoragePath,
  validatePhotoFiles,
} from "@/lib/journal/log-photos-shared";

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
): Promise<string | null> {
  if (files.length === 0) {
    return null;
  }

  const validationError = validatePhotoFiles(files);
  if (validationError) {
    return validationError;
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
          return "Photo storage is not configured. Run the log-photos Supabase migration.";
        }
        return uploadError.message;
      }

      const { error: insertError } = await supabase.from("log_photos").insert({
        daily_log_id: logId,
        storage_path: storagePath,
        caption: null,
      });

      if (insertError) {
        await supabase.storage.from("log-photos").remove([storagePath]);
        if (insertError.message.toLowerCase().includes("log_photos")) {
          return "Journal photo table is not configured. Run the log_photos Supabase migration.";
        }
        return insertError.message;
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Photo upload failed.";
    return message;
  }

  return null;
}
