import { formatInTimeZone } from "date-fns-tz";

const MANILA_TZ = "Asia/Manila";

export function formatManilaDateTime(isoString: string | null | undefined): string {
  if (!isoString) {
    return "—";
  }

  try {
    return formatInTimeZone(new Date(isoString), MANILA_TZ, "MMMM d, yyyy, h:mm a");
  } catch {
    return "—";
  }
}

export function toIsoString(value: unknown): string | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  return null;
}
