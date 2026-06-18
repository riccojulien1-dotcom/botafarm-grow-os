import type { SupabaseClient } from "@supabase/supabase-js";

import type { JournalLogPhoto } from "@/lib/journal/journal-types";

export const MAX_LOG_PHOTOS_PER_UPLOAD = 5;
export const MAX_LOG_PHOTO_BYTES = 5 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export function extractPhotoFiles(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export function validatePhotoFiles(files: File[]): string | null {
  if (files.length > MAX_LOG_PHOTOS_PER_UPLOAD) {
    return `You can upload up to ${MAX_LOG_PHOTOS_PER_UPLOAD} photos per log.`;
  }

  for (const file of files) {
    if (file.size > MAX_LOG_PHOTO_BYTES) {
      return "Each photo must be 5 MB or smaller.";
    }
    if (file.type && !ALLOWED_PHOTO_TYPES.has(file.type)) {
      return "Photos must be JPEG, PNG, or WebP.";
    }
  }

  return null;
}

export async function uploadDailyLogPhotos(
  supabase: SupabaseClient,
  userId: string,
  logId: string,
  files: File[],
): Promise<string | null> {
  const validationError = validatePhotoFiles(files);
  if (validationError) {
    return validationError;
  }

  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${userId}/${logId}/${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("log-photos")
      .upload(storagePath, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return uploadError.message;
    }

    const { error: insertError } = await supabase.from("log_photos").insert({
      daily_log_id: logId,
      storage_path: storagePath,
      caption: null,
    });

    if (insertError) {
      await supabase.storage.from("log-photos").remove([storagePath]);
      return insertError.message;
    }
  }

  return null;
}

export async function attachSignedPhotoUrls(
  supabase: SupabaseClient,
  photos: Array<{
    id: string;
    daily_log_id: string;
    storage_path: string;
    caption: string | null;
  }>,
): Promise<JournalLogPhoto[]> {
  return Promise.all(
    photos.map(async (photo) => {
      const { data } = await supabase.storage
        .from("log-photos")
        .createSignedUrl(photo.storage_path, 60 * 60);

      return {
        ...photo,
        url: data?.signedUrl ?? null,
      };
    }),
  );
}

export async function fetchPhotosByLogIds(
  supabase: SupabaseClient,
  logIds: string[],
): Promise<Map<string, JournalLogPhoto[]>> {
  const map = new Map<string, JournalLogPhoto[]>();
  if (logIds.length === 0) {
    return map;
  }

  const { data: photos } = await supabase
    .from("log_photos")
    .select("id,daily_log_id,storage_path,caption")
    .in("daily_log_id", logIds)
    .order("created_at", { ascending: true });

  const withUrls = await attachSignedPhotoUrls(supabase, photos ?? []);

  for (const photo of withUrls) {
    const list = map.get(photo.daily_log_id) ?? [];
    list.push(photo);
    map.set(photo.daily_log_id, list);
  }

  return map;
}
