type RelativeTimeTranslator = {
  (key: "relativeTime.today"): string;
  (key: "relativeTime.justNow"): string;
  (key: "relativeTime.minutesAgo", values: { count: number }): string;
  (key: "relativeTime.hoursAgo", values: { count: number }): string;
  (key: "relativeTime.daysAgo", values: { count: number }): string;
};

export function localizeRelativeTimeString(
  t: RelativeTimeTranslator,
  value: string | null,
): string | null {
  if (!value) {
    return value;
  }

  if (value === "today") {
    return t("relativeTime.today");
  }

  if (value === "Just now") {
    return t("relativeTime.justNow");
  }

  const minutesMatch = /^(\d+) minute(s)? ago$/.exec(value);
  if (minutesMatch) {
    return t("relativeTime.minutesAgo", { count: Number(minutesMatch[1]) });
  }

  const hoursMatch = /^(\d+) hour(s)? ago$/.exec(value);
  if (hoursMatch) {
    return t("relativeTime.hoursAgo", { count: Number(hoursMatch[1]) });
  }

  const daysMatch = /^(\d+) day(s)? ago$/.exec(value);
  if (daysMatch) {
    return t("relativeTime.daysAgo", { count: Number(daysMatch[1]) });
  }

  return value;
}
