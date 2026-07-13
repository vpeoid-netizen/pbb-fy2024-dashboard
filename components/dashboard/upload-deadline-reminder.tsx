import { CalendarClock } from "lucide-react";

export function UploadDeadlineReminder() {
  return (
    <div
      className="glass-card no-print rounded-2xl border border-gold/40 bg-gold/10 px-4 py-4 md:px-6 md:py-5"
      role="note"
      aria-label="Upload deadline reminder"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/25 text-gold-dark dark:text-gold">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-navy dark:text-slate-100 md:text-base">
          <span className="block font-semibold">Reminder</span>
          <span className="mt-1 block">
            The deadline for uploading FY 2024 PBB documentary requirements is{" "}
            <strong>July 16, 2026 (Thursday)</strong>.
          </span>
        </p>
      </div>
    </div>
  );
}
