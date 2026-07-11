"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
        onUpdated();
      } catch {
        setSaveState("failed");
        toast.error("Unable to save remarks.");
      }
    },
    [requirement.id, requirement.version, onUpdated],
  );

  const scheduleSave = useCallback(
    (nextValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (nextValue === latestServerRemarks.current) {
        setSaveState("saved");
        return;
      }

      setSaveState("unsaved");
      debounceRef.current = setTimeout(() => {
        onRequestUpdater((updaterName) => {
          void saveRemarks(nextValue, updaterName);
        });
      }, 1000);
    },
    [onRequestUpdater, saveRemarks],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const remaining = 1000 - value.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={`remarks-${requirement.id}`}>Remarks</Label>
        <span className="text-xs text-slate-500" aria-live="polite">
          {saveState === "unsaved" && "Unsaved Changes"}
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved"}
          {saveState === "failed" && "Save Failed"}
        </span>
      </div>
      <Textarea
        id={`remarks-${requirement.id}`}
        value={value}
        onChange={(event) => {
          const next = event.target.value.slice(0, 1000);
          setValue(next);
          scheduleSave(next);
        }}
        placeholder="Add submission details, deficiencies, follow-up actions, proof-of-submission information, or validation status."
        disabled={disabled}
        rows={4}
      />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Changes are shared with all dashboard users. Do not enter confidential, personal,
          or sensitive information in the remarks.
        </p>
        <span aria-live="polite">{remaining} characters remaining</span>
      </div>
    </div>
  );
}
