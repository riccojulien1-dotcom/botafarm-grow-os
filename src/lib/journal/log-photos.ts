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

const ALLOWED_PHOTO_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);

export function extractPhotoFiles(formData: FormData): File[] {
  const files: File[] = [];

  for (const entry of formData.getAll("photos")) {
    if (entry instanceof File && entry.size > 0) {
      files.push(entry);
      continue;
    }

    if (
      typeof entry === "object" &&
      entry !== null &&
      "arrayBuffer" in entry &&
      typeof entry.arrayBuffer === "function" &&
      "size" in entry &&
      typeof entry.size === "number" &&
      entry.size > 0
    ) {
      files.push(entry as File);
    }
  }

  return files;
}

function fileExtension(file: File): string {
  return file.name?.split(".").pop()?.toLowerCase() ?? "";
}

export function validatePhotoFiles(files: File[]): string | null {
  if (files.length > MAX_LOG_PHOTOS_PER_UPLOAD) {
    return `You can upload up to ${MAX_LOG_PHOTOS_PER_UPLOAD} photos per log.`;
  }

  for (const file of files) {
    if (file.size > MAX_LOG_PHOTO_BYTES) {
      return "Each photo must be 5 MB or smaller.";
    }

    const extension = fileExtension(file);
    const typeAllowed = file.type ? ALLOWED_PHOTO_TYPES.has(file.type) : false;
    const extensionAllowed = extension ? ALLOWED_PHOTO_EXTENSIONS.has(extension) : false;

    if (!typeAllowed && !extensionAllowed) {
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
  if (files.length === 0) {
    return null;
  }

  const validationError = validatePhotoFiles(files);
  if (validationError) {
    return validationError;
  }

  try {
    for (const file of files) {
      const extension = fileExtension(file) || "jpg";
      const storagePath = `${userId}/${logId}/${crypto.randomUUID()}.${extension}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("log-photos")
        .upload(storagePath, buffer, {
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
      const { data, error } = await supabase.storage
        .from("log-photos")
        .createSignedUrl(photo.storage_path, 60 * 60);

      if (error) {
        return {
          ...photo,
          url: null,
        };
      }

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

  const { data: photos, error } = await supabase
    .from("log_photos")
    .select("id,daily_log_id,storage_path,caption")
    .in("daily_log_id", logIds)
    .order("created_at", { ascending: true });

  if (error) {
    return map;
  }

  const withUrls = await attachSignedPhotoUrls(supabase, photos ?? []);

  for (const photo of withUrls) {
    const list = map.get(photo.daily_log_id) ?? [];
    list.push(photo);
    map.set(photo.daily_log_id, list);
  }

  return map;
}
