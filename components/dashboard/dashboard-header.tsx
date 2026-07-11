"use client";

import Link from "next/link";
import { FileText, FolderOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/dashboard/university-logo";
import { REPORTING_FORMS } from "@/types/pbb";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="glass-card no-print rounded-3xl p-5 md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <UniversityLogo />
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-royal-blue">
              Partido State University
            </p>
            <h1 className="mt-1 text-2xl font-bold text-navy dark:text-white md:text-3xl">
              FY 2024 Performance-Based Bonus
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
              Document Submission and Monitoring Dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href="/documents/Guidelines.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" />
              View Guidelines
            </Link>
          </Button>
          <Button variant="gold" asChild>
            <a
              href={REPORTING_FORMS.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FolderOpen className="h-4 w-4" />
              Open Reporting Forms
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>
        </div>
      </div>
    </header>
  );
}
