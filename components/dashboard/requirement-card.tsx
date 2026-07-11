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
};

export function RequirementCard({
  requirement,
  disabled,
  onRequestUpdater,
  onUpdated,
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
    <article className="glass-card flex h-full flex-col rounded-3xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-light-blue/70 px-3 py-1 text-xs font-medium text-navy dark:bg-slate-800 dark:text-blue-100">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {getCategoryLabel(requirement.category)}
          </span>
          <h3 className="text-lg font-semibold text-navy dark:text-white">
            {requirement.title}
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            requirement.submitted
              ? "bg-success/15 text-success"
              : "bg-warning/15 text-warning",
          )}
        >
          {requirement.submitted ? "Submitted" : "Pending"}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
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
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
            {requirement.documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>
        )}
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-medium text-navy dark:text-white">Validating agency</dt>
          <dd className="text-slate-600 dark:text-slate-300">
            {requirement.validatingAgency}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-navy dark:text-white">Deadline</dt>
          <dd className="text-slate-600 dark:text-slate-300">{requirement.deadline}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button variant="default" className="flex-1" asChild>
          <a
            href={requirement.folderUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FolderOpen className="h-4 w-4" />
            Open Submission Folder
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
        </Button>
        <Button variant="secondary" onClick={() => void handleCopyLink()}>
          <Copy className="h-4 w-4" />
          Copy Folder Link
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
        <p className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Submitted: {formatManilaDateTime(requirement.submittedAt)}
        </p>
        <p>Last updated: {formatManilaDateTime(requirement.updatedAt)}</p>
        <p>Updated by: {requirement.updatedBy ?? "—"}</p>
      </div>

      <div className="mt-4 border-t border-white/50 pt-4 dark:border-slate-700">
        <AuditHistory requirementId={requirement.id} />
      </div>
    </article>
  );
}
