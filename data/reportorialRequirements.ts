import { pbbRequirements } from "@/data/pbbRequirements";

export type ReportorialTimelineItem = {
  id: string;
  title: string;
  shortTitle: string;
  deadline: string;
};

const TIMELINE_IDS = [
  "reportorial-bfar-q4-fy2024",
  "reportorial-annual-apr-dbm-regional",
  "accountability-app-non-cse-2024",
  "accountability-cart",
  "accountability-apcpi-2023",
  "accountability-app-cse-2025",
  "accountability-early-procurement-activities",
  "accountability-foi",
  "accountability-client-satisfaction-measurement",
  "accountability-transparency-seal",
  "accountability-philgeps-posting",
  "accountability-audit-findings",
  "accountability-saln-review",
] as const;

const TIMELINE_LABELS: Record<(typeof TIMELINE_IDS)[number], string> = {
  "reportorial-bfar-q4-fy2024":
    "BFAR for the fourth quarter of FY 2024, through the DBM Unified Reporting System",
  "reportorial-annual-apr-dbm-regional":
    "Submission of Annual APR to DBM Regional Office",
  "accountability-app-non-cse-2024":
    "FY 2024 Annual Procurement Plan for Non-Common Use Supplies and Equipment (APP non-CSE)",
  "accountability-cart":
    "Designation of the agency's Committee on Anti-Red Tape (CART)",
  "accountability-apcpi-2023":
    "Results of the FY 2023 Annual Procurement Compliance and Performance Indicators (APCPI)",
  "accountability-app-cse-2025":
    "FY 2025 APP-Common Use Supplies and Equipment (CSE)",
  "accountability-early-procurement-activities":
    "Certification of Early Procurement Activities for procurement projects in FY 2025",
  "accountability-foi": "Compliance with the Freedom of Information (FOI) Program",
  "accountability-client-satisfaction-measurement":
    "Implementation of the Harmonized Client Satisfaction Measurement (CSM)",
  "accountability-transparency-seal":
    "Updating of the agency's Transparency Seal (TS)",
  "accountability-philgeps-posting": "PhilGEPS posting requirements",
  "accountability-audit-findings": "Sustained Compliance to Audit Findings",
  "accountability-saln-review":
    "Posting of the Agency Review and Compliance Procedure (ARCP) and the Establishment of the Agency Review and Compliance Committee (RCC) for the Statement of Assets, Liabilities, and Net Worth (SALN) in the Agency Transparency Seal",
};

const TIMELINE_DEADLINES: Partial<Record<(typeof TIMELINE_IDS)[number], string>> = {
  "reportorial-bfar-q4-fy2024": "January 30, 2025",
  "reportorial-annual-apr-dbm-regional": "February 16, 2025",
};

export const REPORTORIAL_REQUIREMENT_IDS: string[] = [...TIMELINE_IDS];

export const reportorialRequirements: ReportorialTimelineItem[] = TIMELINE_IDS.map((id) => {
  const requirement = pbbRequirements.find((item) => item.id === id);
  return {
    id,
    title: TIMELINE_LABELS[id],
    shortTitle: requirement?.shortTitle ?? TIMELINE_LABELS[id],
    deadline: TIMELINE_DEADLINES[id] ?? requirement?.deadline ?? "",
  };
});
