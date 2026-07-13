import { CalendarClock } from "lucide-react";

export function UploadDeadlineReminder() {
  return (
    <div
      className="glass-card no-print rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3.5 md:px-5 md:py-4"
      role="note"
      aria-label="Upload deadline reminder"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/25 text-gold-dark dark:text-gold">
          <CalendarClock className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-navy dark:text-slate-100 md:text-base">
          <strong>Reminder:</strong> The deadline for uploading FY 2024 PBB documentary
          requirements is <strong>July 16, 2026 (Thursday)</strong>.
        </p>
      </div>
    </div>
  );
}
