type DailyLogPhotoFieldProps = {
  idPrefix: string;
};

export function DailyLogPhotoField({ idPrefix }: DailyLogPhotoFieldProps) {
  return (
    <div className="md:col-span-2">
      <label htmlFor={`${idPrefix}-photos`} className="text-sm text-zinc-200">
        Photos
      </label>
      <input
        id={`${idPrefix}-photos`}
        name="photos"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        multiple
        className="mt-1 block w-full text-sm text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-fuchsia-950/60 file:px-3 file:py-2 file:text-sm file:font-medium file:text-fuchsia-200 hover:file:bg-fuchsia-900/60"
      />
      <p className="mt-1 text-xs text-zinc-500">
        Up to 5 photos per entry · JPEG, PNG, or WebP · 5 MB max each
      </p>
    </div>
  );
}
