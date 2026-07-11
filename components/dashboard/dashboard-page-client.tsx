"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import { AccountabilityChecklist } from "@/components/dashboard/accountability-checklist";
import { DashboardControls } from "@/components/dashboard/dashboard-controls";
import { DashboardFooter } from "@/components/dashboard/footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EligibilityCalculator } from "@/components/dashboard/eligibility-calculator";
import { MonitoringSummaryCard } from "@/components/dashboard/monitoring-summary";
import { PrintReport } from "@/components/dashboard/print-report";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RequirementsSections } from "@/components/dashboard/requirements-sections";
import {
  UpdaterNameDialog,
  useUpdaterGate,
} from "@/components/dashboard/updater-name-dialog";
import { useDashboard } from "@/hooks/use-dashboard";
import type { RequirementWithMonitoring } from "@/types/pbb";

export function DashboardPageClient() {
  const { data, error, isLoading, isValidating, connectionStatus, isOnline, refresh, mutate } =
    useDashboard();
  const { dialogOpen, setDialogOpen, requestUpdater, handleConfirm } = useUpdaterGate();
  const [filteredRequirements, setFilteredRequirements] = useState<
    RequirementWithMonitoring[] | null
  >(null);

  const handleUpdated = useCallback(() => {
    void mutate();
  }, [mutate]);

  const handleFilteredChange = useCallback((filtered: RequirementWithMonitoring[]) => {
    setFilteredRequirements(filtered);
  }, []);

  if (isLoading && !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-center text-slate-600">
        Loading centralized monitoring dashboard…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="glass-card rounded-3xl p-8 text-center">
          <h2 className="text-xl font-semibold text-danger">
            Unable to connect to the monitoring database
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Verify that DATABASE_URL is configured and that migrations and seed scripts have
            been run.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const requirementsForGrid = filteredRequirements ?? data.requirements;

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:py-8">
        <DashboardHeader />

        <MonitoringSummaryCard
          summary={data.summary}
          serverTimestamp={data.serverTimestamp}
          connectionStatus={connectionStatus}
        />

        <RecentActivity activity={data.recentActivity} />

        <DashboardControls
          requirements={data.requirements}
          onRefresh={() => void refresh()}
          isRefreshing={isValidating}
          onFilteredChange={handleFilteredChange}
        />

        <RequirementsSections
          requirements={requirementsForGrid}
          disabled={!isOnline}
          onRequestUpdater={requestUpdater}
          onUpdated={handleUpdated}
        />

        <EligibilityCalculator
          assessment={data.eligibilityAssessment}
          result={data.eligibilityResult}
          disabled={!isOnline}
          onRequestUpdater={requestUpdater}
          onUpdated={handleUpdated}
        />

        <AccountabilityChecklist
          accountabilities={data.accountabilities}
          requirements={data.requirements}
          disabled={!isOnline}
          onRequestUpdater={requestUpdater}
          onUpdated={handleUpdated}
        />

        <DashboardFooter />
      </div>

      <PrintReport data={data} />
      <UpdaterNameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirm}
      />
      <Toaster richColors position="top-right" />
    </>
  );
}
