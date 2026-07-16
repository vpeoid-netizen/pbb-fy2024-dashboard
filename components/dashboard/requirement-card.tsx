"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Copy,
  ExternalLink,
  FolderOpen,
  Landmark,
  LineChart,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuditHistory } from "@/components/dashboard/audit-history";
import { RemarksField } from "@/components/dashboard/remarks-field";
import { StatusToggle } from "@/components/dashboard/status-toggle";
import { formatManilaDateTime } from "@/lib/date-time";
import { cn, copyToClipboard, getCategoryLabel } from "@/lib/utils";
import type { RequirementWithMonitoring } from "@/types/pbb";

const categoryIcons = {
  performance: LineChart,
  process: ClipboardList,
  financial: Landmark,
  "citizen-client": Users,
  "agency-accountability": Building2,
};

type RequirementCardProps = {
  requirement: RequirementWithMonitoring;
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
  hideCategoryBadge?: boolean;
  compact?: boolean;
};

export function RequirementCard({
  requirement,
  disabled,
  onRequestUpdater,
  onUpdated,
  hideCategoryBadge = false,
  compact = false,
}: RequirementCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = categoryIcons[requirement.category];

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(requirement.folderUrl);
      toast.success("Folder link copied to clipboard.");
    } catch {
      toast.error("Unable to copy folder link.");
    }
  };

  return (
    <article
      className={cn(
        "glass-card flex h-full min-w-0 flex-col overflow-hidden rounded-3xl transition-colors",
        compact ? "p-4" : "p-5",
        requirement.submitted && "requirement-card-submitted",
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            {!hideCategoryBadge && (
              <span className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full bg-light-blue/70 px-3 py-1 text-xs font-medium text-navy dark:bg-slate-800 dark:text-blue-100">
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{getCategoryLabel(requirement.category)}</span>
              </span>
            )}
            <h3
              className={cn(
                "break-words font-semibold leading-snug text-navy dark:text-white",
                compact ? "text-base" : "text-lg",
              )}
            >
              {requirement.title}
            </h3>
          </div>
          <span
            className={cn(
              "inline-flex max-w-full shrink-0 self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
              requirement.submitted
                ? "bg-success/15 text-success"
                : "bg-warning/15 text-warning",
            )}
          >
            {requirement.submitted ? "Submitted" : "Pending"}
          </span>
        </div>

        <p
          className={cn(
            "mt-3 break-words text-slate-600 dark:text-slate-300",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {requirement.description}
        </p>

        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            Documentary checklist
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {expanded && (
            <ul className="mt-2 list-disc space-y-1 break-words pl-5 text-sm text-slate-600 dark:text-slate-300">
              {requirement.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          )}
        </div>

        <dl className={cn("mt-4 space-y-2", compact ? "text-xs" : "text-sm")}>
          <div>
            <dt className="font-medium text-navy dark:text-white">Validating agency</dt>
            <dd className="break-words text-slate-600 dark:text-slate-300">
              {requirement.validatingAgency}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-navy dark:text-white">Deadline</dt>
            <dd className="break-words text-slate-600 dark:text-slate-300">
              {requirement.deadline}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-auto flex w-full flex-col gap-2 pt-4">
        <Button variant="default" className="h-10 w-full min-w-0 justify-center px-3 text-sm" asChild>
          <a href={requirement.folderUrl} target="_blank" rel="noopener noreferrer">
            <FolderOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">Open Submission Folder</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
          </a>
        </Button>
        <Button
          variant="secondary"
          className="h-10 w-full min-w-0 justify-center px-3 text-sm"
          onClick={() => void handleCopyLink()}
        >
          <Copy className="h-4 w-4 shrink-0" />
          <span className="truncate">Copy Folder Link</span>
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        <StatusToggle
          requirement={requirement}
          disabled={disabled}
          onRequestUpdater={onRequestUpdater}
          onUpdated={onUpdated}
        />
        <RemarksField
          requirement={requirement}
          disabled={disabled}
          onRequestUpdater={onRequestUpdater}
          onUpdated={onUpdated}
        />
      </div>

      <div className="mt-4 space-y-1 text-xs text-slate-500">
        <p className="flex items-center gap-1 break-words">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          Submitted: {formatManilaDateTime(requirement.submittedAt)}
        </p>
        <p className="break-words">Last updated: {formatManilaDateTime(requirement.updatedAt)}</p>
        <p className="break-words">Updated by: {requirement.updatedBy ?? "—"}</p>
      </div>

      <div className="mt-4 border-t border-white/50 pt-4 dark:border-slate-700">
        <AuditHistory requirementId={requirement.id} />
      </div>
    </article>
  );
}
