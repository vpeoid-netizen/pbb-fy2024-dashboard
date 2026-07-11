import { cn } from "@/lib/utils";
import type { ConnectionStatus } from "@/types/pbb";

const statusStyles: Record<ConnectionStatus, string> = {
  Live: "bg-success/15 text-success border-success/20",
  Updating: "bg-royal-blue/15 text-royal-blue border-royal-blue/20",
  Offline: "bg-warning/15 text-warning border-warning/20",
  Reconnecting: "bg-gold/20 text-gold-dark border-gold/30",
  "Synchronization Error": "bg-danger/15 text-danger border-danger/20",
};

export function ConnectionStatusBadge({
  status,
}: {
  status: ConnectionStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
      )}
      aria-live="polite"
    >
      <span
        className={cn(
          "mr-2 h-2 w-2 rounded-full",
          status === "Live" && "bg-success",
          status === "Updating" && "bg-royal-blue animate-pulse",
          status === "Offline" && "bg-warning",
          status === "Reconnecting" && "bg-gold animate-pulse",
          status === "Synchronization Error" && "bg-danger",
        )}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}
