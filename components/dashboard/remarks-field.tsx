"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateBrowserSessionId } from "@/lib/utils";
import type { RequirementWithMonitoring } from "@/types/pbb";

type SaveState = "idle" | "unsaved" | "saving" | "saved" | "failed";

type RemarksFieldProps = {
  requirement: RequirementWithMonitoring;
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
};

export function RemarksField({
  requirement,
  disabled,
  onRequestUpdater,
  onUpdated,
}: RemarksFieldProps) {
  const [value, setValue] = useState(requirement.remarks);
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const latestServerRemarks = useRef(requirement.remarks);

  useEffect(() => {
    latestServerRemarks.current = requirement.remarks;
    setValue(requirement.remarks);
    setSaveState("saved");
  }, [requirement.remarks, requirement.version]);

  const saveRemarks = useCallback(
    async (remarks: string, updaterName: string) => {
      if (remarks === latestServerRemarks.current) {
        setSaveState("saved");
        return;
      }

      setSaveState("saving");
      try {
        const response = await fetch(`/api/requirements/${requirement.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            remarks,
            updatedBy: updaterName,
            browserSessionId: generateBrowserSessionId(),
            expectedVersion: requirement.version,
          }),
        });

        if (response.status === 409) {
          setSaveState("failed");
          toast.error(
            "This requirement was updated by another user. The latest information has been loaded. Review it before saving again.",
          );
          onUpdated();
          return;
        }

        if (!response.ok) {
          throw new Error("Save failed");
        }

        setSaveState("saved");
        toast.success("Remarks saved.");
        onUpdated();
      } catch {
        setSaveState("failed");
        toast.error("Unable to save remarks.");
      }
    },
    [requirement.id, requirement.version, onUpdated],
  );

  const handleSave = () => {
    onRequestUpdater((updaterName) => {
      void saveRemarks(value, updaterName);
    });
  };

  const remaining = 1000 - value.length;
  const hasUnsavedChanges = value !== latestServerRemarks.current;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={`remarks-${requirement.id}`}>Remarks</Label>
        <span className="text-xs text-slate-500" aria-live="polite">
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && !hasUnsavedChanges && "Saved"}
          {hasUnsavedChanges && saveState !== "saving" && "Unsaved Changes"}
          {saveState === "failed" && "Save Failed"}
        </span>
      </div>
      <Textarea
        id={`remarks-${requirement.id}`}
        value={value}
        onChange={(event) => {
          const next = event.target.value.slice(0, 1000);
          setValue(next);
          if (next !== latestServerRemarks.current) {
            setSaveState("unsaved");
          } else {
            setSaveState("saved");
          }
        }}
        placeholder="Add submission details, deficiencies, follow-up actions, proof-of-submission information, or validation status."
        disabled={disabled}
        rows={4}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Changes are shared with all dashboard users. Do not enter confidential, personal,
          or sensitive information in the remarks.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500" aria-live="polite">
            {remaining} characters remaining
          </span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleSave}
            disabled={disabled || saveState === "saving" || !hasUnsavedChanges}
          >
            {saveState === "saving" ? "Saving…" : "Save Remarks"}
          </Button>
        </div>
      </div>
    </div>
  );
}
