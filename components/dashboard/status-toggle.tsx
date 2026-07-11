"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { generateBrowserSessionId } from "@/lib/utils";
import type { RequirementWithMonitoring } from "@/types/pbb";

type StatusToggleProps = {
  requirement: RequirementWithMonitoring;
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
};

export function StatusToggle({
  requirement,
  disabled,
  onRequestUpdater,
  onUpdated,
}: StatusToggleProps) {
  const [checked, setChecked] = useState(requirement.submitted);
  const [pendingUncheck, setPendingUncheck] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setChecked(requirement.submitted);
  }, [requirement.submitted]);

  const saveStatus = useCallback(
    async (nextSubmitted: boolean, updaterName: string) => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/requirements/${requirement.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submitted: nextSubmitted,
            updatedBy: updaterName,
            browserSessionId: generateBrowserSessionId(),
            expectedVersion: requirement.version,
          }),
        });

        if (response.status === 409) {
          toast.error(
            "This requirement was updated by another user. The latest information has been loaded. Review it before saving again.",
          );
          onUpdated();
          return;
        }

        if (!response.ok) {
          throw new Error("Save failed");
        }

        if (nextSubmitted) {
          toast.success(
            "Requirement marked as submitted. The centralized monitoring progress has been updated.",
          );
        } else {
          toast.success("Requirement marked as pending.");
        }

        onUpdated();
      } catch {
        setChecked(requirement.submitted);
        toast.error("Unable to save submission status.");
      } finally {
        setIsSaving(false);
      }
    },
    [requirement.id, requirement.submitted, requirement.version, onUpdated],
  );

  const handleToggle = (nextChecked: boolean) => {
    if (disabled || isSaving) {
      return;
    }

    if (!nextChecked && checked) {
      setPendingUncheck(true);
      return;
    }

    onRequestUpdater((updaterName) => {
      setChecked(nextChecked);
      void saveStatus(nextChecked, updaterName);
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/40">
        <div>
          <Label htmlFor={`submitted-${requirement.id}`} className="font-medium">
            Submitted
          </Label>
          {isSaving && (
            <p className="text-xs text-royal-blue" aria-live="polite">
              Saving…
            </p>
          )}
        </div>
        <Switch
          id={`submitted-${requirement.id}`}
          checked={checked}
          onCheckedChange={handleToggle}
          disabled={disabled || isSaving}
          aria-label={`Mark ${requirement.title} as submitted`}
        />
      </div>

      <AlertDialog open={pendingUncheck} onOpenChange={setPendingUncheck}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as pending again?</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this requirement as pending again? This change will be visible to all
              dashboard users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onRequestUpdater((updaterName) => {
                  setChecked(false);
                  void saveStatus(false, updaterName);
                });
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
