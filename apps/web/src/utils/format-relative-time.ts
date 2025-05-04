import { DateTime } from "luxon";

export function formatRelativeTime(dateString: string): string {
  const date = DateTime.fromISO(dateString);
  return date.toRelative() || "";
}
