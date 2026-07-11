"use client";

import Link from "next/link";
import { BookOpen, FileText, FolderOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { UniversityLogo } from "@/components/dashboard/university-logo";
import { REPORTING_FORMS } from "@/types/pbb";

const headerActionClassName =
  "h-9 shrink-0 px-2.5 text-xs sm:h-10 sm:px-3 sm:text-sm md:px-4";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="glass-card no-print rounded-3xl p-5 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <UniversityLogo />
          <div className="min-w-0">
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

        <div className="flex w-full flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2 xl:w-auto xl:shrink-0 xl:justify-end xl:overflow-visible [&::-webkit-scrollbar]:hidden">
          <Button variant="secondary" size="sm" className={headerActionClassName} asChild>
            <Link href="/docs/user-manual.html" target="_blank" rel="noopener noreferrer">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">User Manual & FAQs</span>
            </Link>
          </Button>
          <Button variant="secondary" size="sm" className={headerActionClassName} asChild>
            <Link href="/documents/Guidelines.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">View Guidelines</span>
            </Link>
          </Button>
          <Button variant="gold" size="sm" className={headerActionClassName} asChild>
            <a href={REPORTING_FORMS.url} target="_blank" rel="noopener noreferrer">
              <FolderOpen className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Open Reporting Forms</span>
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
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
