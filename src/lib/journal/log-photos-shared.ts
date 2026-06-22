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

function fileExtension(file: Pick<File, "name">): string {
  return file.name?.split(".").pop()?.toLowerCase() ?? "";
}

export function buildLogPhotoStoragePath(
  userId: string,
  logId: string,
  file: Pick<File, "name">,
): string {
  const extension = fileExtension(file) || "jpg";
  return `${userId}/${logId}/${crypto.randomUUID()}.${extension}`;
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
