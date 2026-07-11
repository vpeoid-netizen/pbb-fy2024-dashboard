import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPORTING_FORMS } from "@/types/pbb";

export function ReportingFormsCard() {
  return (
    <section className="glass-card no-print rounded-3xl border border-gold/30 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
            Resource
          </p>
          <h2 className="mt-1 text-lg font-semibold text-navy dark:text-white">
            {REPORTING_FORMS.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Access reporting forms used for FY 2024 PBB submissions. This resource is not counted
            toward documentary submission progress.
          </p>
        </div>
        <Button variant="gold" asChild className="w-full md:w-auto">
          <a href={REPORTING_FORMS.url} target="_blank" rel="noopener noreferrer">
            <FolderOpen className="h-4 w-4" />
            Open Reporting Forms
          </a>
        </Button>
      </div>
    </section>
  );
}
