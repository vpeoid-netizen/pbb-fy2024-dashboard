"use client";

import { Building2, ClipboardList, Landmark, LineChart, Users } from "lucide-react";
import { RequirementCard } from "@/components/dashboard/requirement-card";
import { cn } from "@/lib/utils";
import type { RequirementCategory, RequirementWithMonitoring } from "@/types/pbb";

type RequirementsSectionsProps = {
  requirements: RequirementWithMonitoring[];
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
};

const OTHER_DIMENSIONS: {
  category: RequirementCategory;
  label: string;
  description: string;
  icon: typeof LineChart;
}[] = [
  {
    category: "process",
    label: "Process Results",
    description:
      "Substantial improvement in ease of transaction for a nominated critical service.",
    icon: ClipboardList,
  },
  {
    category: "financial",
    label: "Financial Results",
    description: "FY 2024 Disbursement Budget Utilization Rate and supporting documents.",
    icon: Landmark,
  },
  {
    category: "citizen-client",
    label: "Citizen/Client Satisfaction Results",
    description:
      "Resolution and compliance rates for Hotline #8888 and Contact Center ng Bayan.",
    icon: Users,
  },
];

function AlignedRequirementGrid({
  items,
  disabled,
  onRequestUpdater,
  onUpdated,
  compact = false,
  columns = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
}: {
  items: RequirementWithMonitoring[];
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
  compact?: boolean;
  columns?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("grid items-stretch gap-4", columns)}>
      {items.map((requirement) => (
        <RequirementCard
          key={requirement.id}
          requirement={requirement}
          disabled={disabled}
          onRequestUpdater={onRequestUpdater}
          onUpdated={onUpdated}
          hideCategoryBadge
          compact={compact}
        />
      ))}
    </div>
  );
}

export function RequirementsSections({
  requirements,
  disabled,
  onRequestUpdater,
  onUpdated,
}: RequirementsSectionsProps) {
  if (requirements.length === 0) {
    return (
      <section className="glass-card rounded-3xl p-8 text-center text-slate-600 dark:text-slate-300">
        No requirements match the current filters.
      </section>
    );
  }

  const performanceItems = requirements.filter((req) => req.category === "performance");
  const otherDimensionItems = OTHER_DIMENSIONS.map((dimension) => ({
    ...dimension,
    items: requirements.filter((req) => req.category === dimension.category),
  })).filter((dimension) => dimension.items.length > 0);
  const agencyRequirements = requirements.filter(
    (req) => req.category === "agency-accountability",
  );

  const hasDimensions = performanceItems.length > 0 || otherDimensionItems.length > 0;

  return (
    <div className="space-y-8">
      {hasDimensions && (
        <section aria-labelledby="dimensions-heading">
          <div className="glass-card rounded-3xl border-2 border-royal-blue/25 p-5 md:p-6">
            <div className="border-b border-royal-blue/15 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-royal-blue">
                Primary Monitoring Area
              </p>
              <h2
                id="dimensions-heading"
                className="mt-2 text-2xl font-bold text-navy dark:text-white"
              >
                Dimensions of Accountability (Results Areas)
              </h2>
            </div>

            <div className="mt-6 space-y-6">
              {performanceItems.length > 0 && (
                <div className="rounded-2xl border-2 border-royal-blue/30 bg-royal-blue/5 p-4 md:p-5">
                  <div className="mb-4 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-blue/15 text-royal-blue">
                      <LineChart className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-navy dark:text-white">
                        Performance Results
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        Four Major Final Outputs (MFOs) supporting FY 2024 PREXC performance
                        indicators.
                      </p>
                    </div>
                  </div>
                  <AlignedRequirementGrid
                    items={performanceItems}
                    disabled={disabled}
                    onRequestUpdater={onRequestUpdater}
                    onUpdated={onUpdated}
                    compact
                    columns="grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
                  />
                </div>
              )}

              {otherDimensionItems.length > 0 && (
                <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
                  {otherDimensionItems.map((dimension) => {
                    const Icon = dimension.icon;
                    return (
                      <div
                        key={dimension.category}
                        className="flex min-w-0 flex-col rounded-2xl border-2 border-royal-blue/30 bg-royal-blue/5 p-4"
                      >
                        <div className="mb-4 flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-blue/15 text-royal-blue">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <h3 className="break-words text-base font-semibold leading-snug text-navy dark:text-white">
                              {dimension.label}
                            </h3>
                            <p className="mt-1 break-words text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                              {dimension.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                          {dimension.items.map((requirement) => (
                            <RequirementCard
                              key={requirement.id}
                              requirement={requirement}
                              disabled={disabled}
                              onRequestUpdater={onRequestUpdater}
                              onUpdated={onUpdated}
                              hideCategoryBadge
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {agencyRequirements.length > 0 && (
        <section aria-labelledby="agency-heading">
          <div className="glass-card rounded-3xl border border-slate-300/60 p-5 md:p-6 dark:border-slate-600/60">
            <div className="border-b border-slate-200/80 pb-5 dark:border-slate-700/80">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Supporting Compliance Area
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Building2 className="h-5 w-5 shrink-0 text-slate-600" aria-hidden="true" />
                <h2
                  id="agency-heading"
                  className="text-xl font-semibold text-navy dark:text-white"
                >
                  Agency Accountabilities
                </h2>
              </div>
              <p className="mt-2 max-w-4xl text-sm text-slate-600 dark:text-slate-300">
                Documentary submissions for agency accountability requirements, monitored
                separately from the primary results areas above.
              </p>
            </div>

            <div className="mt-6">
              <AlignedRequirementGrid
                items={agencyRequirements}
                disabled={disabled}
                onRequestUpdater={onRequestUpdater}
                onUpdated={onUpdated}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
