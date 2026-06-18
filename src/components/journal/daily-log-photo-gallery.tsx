import type { JournalLogPhoto } from "@/lib/journal/journal-types";

type DailyLogPhotoGalleryProps = {
  photos: JournalLogPhoto[];
  compact?: boolean;
};

export function DailyLogPhotoGallery({ photos, compact = false }: DailyLogPhotoGalleryProps) {
  if (!photos.length) {
    return null;
  }

  return (
    <div
      className={`grid gap-2 ${compact ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}
    >
      {photos.map((photo) =>
        photo.url ? (
          <a
            key={photo.id}
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-lg border border-white/[0.08] bg-black/30"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.caption ?? "Journal photo"}
              width={compact ? 120 : 200}
              height={compact ? 120 : 200}
              className="aspect-square h-full w-full object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
            />
          </a>
        ) : null,
      )}
    </div>
  );
}
