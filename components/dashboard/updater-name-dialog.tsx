"use client";

import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getStoredUpdaterName, setStoredUpdaterName } from "@/lib/utils";

type UpdaterNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
};

export function UpdaterNameDialog({
  open,
  onOpenChange,
  onConfirm,
}: UpdaterNameDialogProps) {
  const [name, setName] = useState(getStoredUpdaterName());

  const handleConfirm = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    setStoredUpdaterName(trimmed);
    onConfirm(trimmed);
    onOpenChange(false);
  }, [name, onConfirm, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Your Name or Office</DialogTitle>
          <DialogDescription>
            Enter your name or office before making changes. Your update will be
            visible to all dashboard users.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="updater-name">Name or Office</Label>
            <Input
              id="updater-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g., PBB Secretariat"
              maxLength={150}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleConfirm();
                }
              }}
            />
          </div>
          <Button onClick={handleConfirm} disabled={!name.trim()} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useUpdaterGate() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    ((updaterName: string) => void) | null
  >(null);

  const requestUpdater = useCallback((action: (updaterName: string) => void) => {
    const stored = getStoredUpdaterName().trim();
    if (stored) {
      action(stored);
      return;
    }
    setPendingAction(() => action);
    setDialogOpen(true);
  }, []);

  const handleConfirm = useCallback(
    (name: string) => {
      pendingAction?.(name);
      setPendingAction(null);
    },
    [pendingAction],
  );

  return {
    dialogOpen,
    setDialogOpen,
    requestUpdater,
    handleConfirm,
  };
}
