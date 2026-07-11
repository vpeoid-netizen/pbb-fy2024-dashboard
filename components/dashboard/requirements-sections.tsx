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

const DIMENSION_CATEGORIES: RequirementCategory[] = [
  "performance",
  "process",
  "financial",
  "citizen-client",
];

const DIMENSION_CONFIG: {
  category: RequirementCategory;
  label: string;
  shortLabel: string;
  description: string;
  icon: typeof LineChart;
  accent: string;
}[] = [
  {
    category: "performance",
    label: "Performance Results",
    shortLabel: "Performance",
    description: "Congress-approved FY 2024 PREXC performance indicators across MFOs.",
    icon: LineChart,
    accent: "border-royal-blue/40 bg-royal-blue/5",
  },
  {
    category: "process",
    label: "Process Results",
    shortLabel: "Process",
    description: "Substantial improvement in ease of transaction for a nominated critical service.",
    icon: ClipboardList,
    accent: "border-royal-blue/40 bg-royal-blue/5",
  },
  {
    category: "financial",
    label: "Financial Results",
    shortLabel: "Financial",
    description: "FY 2024 Disbursement Budget Utilization Rate and supporting documents.",
    icon: Landmark,
    accent: "border-royal-blue/40 bg-royal-blue/5",
  },
  {
    category: "citizen-client",
    label: "Citizen/Client Satisfaction Results",
    shortLabel: "Citizen/Client Satisfaction",
    description: "Resolution and compliance rates for Hotline #8888 and Contact Center ng Bayan.",
    icon: Users,
    accent: "border-royal-blue/40 bg-royal-blue/5",
  },
];

function RequirementCardsGrid({
  items,
  disabled,
  onRequestUpdater,
  onUpdated,
  compact = false,
}: {
  items: RequirementWithMonitoring[];
  disabled?: boolean;
  onRequestUpdater: (action: (updaterName: string) => void) => void;
  onUpdated: () => void;
  compact?: boolean;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {items.map((requirement) => (
        <RequirementCard
          key={requirement.id}
          requirement={requirement}
          disabled={disabled}
          onRequestUpdater={onRequestUpdater}
          onUpdated={onUpdated}
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

  const dimensionRequirements = requirements.filter((req) =>
    DIMENSION_CATEGORIES.includes(req.category),
  );
  const agencyRequirements = requirements.filter(
    (req) => req.category === "agency-accountability",
  );

  const visibleDimensions = DIMENSION_CONFIG.map((dimension) => ({
    ...dimension,
    items: dimensionRequirements.filter((req) => req.category === dimension.category),
  })).filter((dimension) => dimension.items.length > 0);

  return (
    <div className="space-y-8">
      {visibleDimensions.length > 0 && (
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
              <p className="mt-2 max-w-4xl text-sm text-slate-600 dark:text-slate-300">
                The four results areas below carry equal weight in FY 2024 PBB eligibility
                monitoring. Each dimension is presented with the same visual priority.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-4">
              {visibleDimensions.map((dimension) => {
                const Icon = dimension.icon;
                return (
                  <div
                    key={dimension.category}
                    className={cn(
                      "flex min-h-[280px] flex-col rounded-2xl border-2 p-4",
                      dimension.accent,
                    )}
                  >
                    <div className="mb-4 min-w-0">
                      <div className="flex items-start gap-2">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-royal-blue/15 text-royal-blue">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-base font-semibold leading-snug text-navy dark:text-white">
                            {dimension.label}
                          </h3>
                          <p className="mt-1 break-words text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            {dimension.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      {dimension.items.map((requirement) => (
                        <RequirementCard
                          key={requirement.id}
                          requirement={requirement}
                          disabled={disabled}
                          onRequestUpdater={onRequestUpdater}
                          onUpdated={onUpdated}
                          hideCategoryBadge
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
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
                Documentary submissions for agency accountability requirements. These are
                monitored separately from the four primary results areas above.
              </p>
            </div>

            <div className="mt-6">
              <RequirementCardsGrid
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
