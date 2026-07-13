"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import { DashboardControls } from "@/components/dashboard/dashboard-controls";
import { DashboardFooter } from "@/components/dashboard/footer";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EligibilityCalculator } from "@/components/dashboard/eligibility-calculator";
import { MonitoringSummaryCard } from "@/components/dashboard/monitoring-summary";
import { UploadDeadlineReminder } from "@/components/dashboard/upload-deadline-reminder";
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
  const { data, error, isValidating, connectionStatus, isOnline, refresh, mutate } =
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

  if (!data) {
    return null;
  }

  const requirementsForGrid = filteredRequirements ?? data.requirements;

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-4 sm:py-6 md:py-8">
        <DashboardHeader />

        <MonitoringSummaryCard
          summary={data.summary}
          serverTimestamp={data.serverTimestamp}
          connectionStatus={connectionStatus}
        />

        <UploadDeadlineReminder />

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

        {error && (
          <div className="glass-card rounded-3xl border border-danger/30 p-4 text-sm text-danger">
            Unable to refresh the latest monitoring data. Showing the most recent available
            information.
          </div>
        )}

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
