import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBrowserSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const storageKey = "pbb-browser-session-id";
  const existing = localStorage.getItem(storageKey);
  if (existing) {
    return existing;
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(storageKey, id);
  return id;
}

export function getStoredUpdaterName(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem("pbb-updater-name") ?? "";
}

export function setStoredUpdaterName(name: string): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem("pbb-updater-name", name);
}

export function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error("Clipboard not available"));
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    performance: "Performance Results",
    process: "Process Results",
    financial: "Financial Results",
    "citizen-client": "Citizen/Client Satisfaction",
    "agency-accountability": "Agency Accountabilities",
  };
  return labels[category] ?? category;
}

export function getAuditActionLabel(action: string): string {
  const labels: Record<string, string> = {
    submission_marked_complete: "marked as submitted",
    submission_marked_pending: "marked as pending",
    remarks_updated: "updated remarks for",
    eligibility_updated: "updated eligibility assessment",
    accountability_updated: "updated accountability assessment",
  };
  return labels[action] ?? action;
}
