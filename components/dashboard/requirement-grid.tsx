"use client";

import { RequirementCard } from "@/components/dashboard/requirement-card";
import type { RequirementWithMonitoring } from "@/types/pbb";

type RequirementGridProps = {
  requirements: RequirementWithMonitoring[];
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
};

export function RequirementGrid({
  requirements,
  disabled,
  onRequestUpdater,
  onUpdated,
}: RequirementGridProps) {
  if (requirements.length === 0) {
    return (
      <section className="glass-card rounded-3xl p-8 text-center text-slate-600 dark:text-slate-300">
        No requirements match the current filters.
      </section>
    );
  }

  return (
    <section
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      aria-label="Requirement grid"
    >
      {requirements.map((requirement) => (
        <RequirementCard
          key={requirement.id}
          requirement={requirement}
          disabled={disabled}
          onRequestUpdater={onRequestUpdater}
          onUpdated={onUpdated}
        />
      ))}
    </section>
  );
}
