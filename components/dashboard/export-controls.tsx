"use client";

import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportControls() {
  return (
    <section className="glass-card no-print rounded-3xl p-5 md:p-6">
      <h2 className="text-lg font-semibold text-navy dark:text-white">Export and Print</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Export the latest centralized monitoring data or print a consolidated report.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <a href="/api/export?format=json" download>
            <Download className="h-4 w-4" />
            Export Current Monitoring Data as JSON
          </a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="/api/export?format=csv" download>
            <Download className="h-4 w-4" />
            Export Current Monitoring Data as CSV
          </a>
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print Consolidated Monitoring Report
        </Button>
      </div>
    </section>
  );
}
