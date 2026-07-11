"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CategoryFilter,
  RequirementWithMonitoring,
  SortOption,
  StatusFilter,
} from "@/types/pbb";
import { getCategoryLabel } from "@/lib/utils";

type DashboardControlsProps = {
  onRefresh: () => void;
  isRefreshing: boolean;
  requirements: RequirementWithMonitoring[];
  onFilteredChange: (filtered: RequirementWithMonitoring[]) => void;
};

const FILTER_STORAGE_KEY = "pbb-filter-preferences";

type StoredFilters = {
  search: string;
  category: CategoryFilter;
  status: StatusFilter;
  sort: SortOption;
};

function loadStoredFilters(): StoredFilters {
  if (typeof window === "undefined") {
    return { search: "", category: "all", status: "all", sort: "default" };
  }
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!raw) {
      return { search: "", category: "all", status: "all", sort: "default" };
    }
    return JSON.parse(raw) as StoredFilters;
  } catch {
    return { search: "", category: "all", status: "all", sort: "default" };
  }
}

function filterAndSortRequirements(
  requirements: RequirementWithMonitoring[],
  search: string,
  category: CategoryFilter,
  status: StatusFilter,
  sort: SortOption,
): RequirementWithMonitoring[] {
  const query = search.trim().toLowerCase();

  let filtered = requirements.filter((req) => {
    if (category !== "all" && req.category !== category) {
      return false;
    }
    if (status === "pending" && req.submitted) {
      return false;
    }
    if (status === "submitted" && !req.submitted) {
      return false;
    }
    if (!query) {
      return true;
    }

    const haystack = [
      req.title,
      req.description,
      req.validatingAgency,
      req.deadline,
      ...req.documents,
      ...req.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "pending-first":
        return Number(a.submitted) - Number(b.submitted) || a.displayOrder - b.displayOrder;
      case "submitted-first":
        return Number(b.submitted) - Number(a.submitted) || a.displayOrder - b.displayOrder;
      case "name":
        return a.title.localeCompare(b.title);
      case "deadline":
        return a.deadline.localeCompare(b.deadline);
      case "recently-updated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "default":
      default:
        return a.displayOrder - b.displayOrder;
    }
  });

  return filtered;
}

export function DashboardControls({
  onRefresh,
  isRefreshing,
  requirements,
  onFilteredChange,
}: DashboardControlsProps) {
  const [stored] = useState(loadStoredFilters);
  const [search, setSearch] = useState(stored.search);
  const [category, setCategory] = useState<CategoryFilter>(stored.category);
  const [status, setStatus] = useState<StatusFilter>(stored.status);
  const [sort, setSort] = useState<SortOption>(stored.sort);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(
    () => filterAndSortRequirements(requirements, search, category, status, sort),
    [requirements, search, category, status, sort],
  );

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered, onFilteredChange]);

  useEffect(() => {
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({ search, category, status, sort }),
    );
  }, [search, category, status, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setSort("default");
  };

  return (
    <section className="glass-card no-print rounded-3xl p-5 md:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requirements, agencies, deadlines, keywords..."
              className="pl-10"
              aria-label="Search requirements"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="md:hidden"
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className={`grid gap-3 md:grid-cols-4 ${filtersOpen ? "grid" : "hidden md:grid"}`}>
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requirements</SelectItem>
              <SelectItem value="performance">Performance Results</SelectItem>
              <SelectItem value="process">Process Results</SelectItem>
              <SelectItem value="financial">Financial Results</SelectItem>
              <SelectItem value="citizen-client">Citizen/Client Satisfaction</SelectItem>
              <SelectItem value="agency-accountability">Agency Accountabilities</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger aria-label="Sort requirements">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Official order</SelectItem>
              <SelectItem value="pending-first">Pending first</SelectItem>
              <SelectItem value="submitted-first">Submitted first</SelectItem>
              <SelectItem value="name">Requirement name</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="recently-updated">Recently updated</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Showing {filtered.length} of {requirements.length} requirements
          {category !== "all" ? ` in ${getCategoryLabel(category)}` : ""}.
        </p>
      </div>
    </section>
  );
}
