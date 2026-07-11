export type AccountabilitySeed = {
  accountabilityId: string;
  title: string;
  linkedRequirementId?: string;
  isApplicableByDefault: boolean;
};

export const accountabilitySeeds: AccountabilitySeed[] = [
  {
    accountabilityId: "transparency-seal",
    title: "Transparency Seal",
    linkedRequirementId: "accountability-transparency-seal",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "audit-findings",
    title: "Sustained Compliance with Audit Findings",
    linkedRequirementId: "accountability-audit-findings",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "foi-program",
    title: "Freedom of Information Program",
    linkedRequirementId: "accountability-foi",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "saln-review",
    title: "SALN Review and Compliance Procedure",
    linkedRequirementId: "accountability-saln-review",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "philgeps-posting",
    title: "PhilGEPS Posting Requirements",
    linkedRequirementId: "accountability-philgeps-posting",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "app-non-cse-2024",
    title: "FY 2024 APP Non-CSE",
    linkedRequirementId: "accountability-app-non-cse-2024",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "app-cse-2025",
    title: "FY 2025 APP-CSE",
    linkedRequirementId: "accountability-app-cse-2025",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "apcpi-2023",
    title: "FY 2023 APCPI",
    linkedRequirementId: "accountability-apcpi-2023",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "early-procurement",
    title: "Early Procurement Activities Certification",
    linkedRequirementId: "accountability-early-procurement-activities",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "cart",
    title: "Committee on Anti-Red Tape",
    linkedRequirementId: "accountability-cart",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "client-satisfaction-measurement",
    title: "Harmonized Client Satisfaction Measurement",
    linkedRequirementId: "accountability-client-satisfaction-measurement",
    isApplicableByDefault: true,
  },
  {
    accountabilityId: "national-competition-policy",
    title: "National Competition Policy",
    isApplicableByDefault: false,
  },
];

export const requirementToAccountabilityMap: Record<string, string> =
  Object.fromEntries(
    accountabilitySeeds
      .filter((item) => item.linkedRequirementId)
      .map((item) => [item.linkedRequirementId!, item.accountabilityId]),
  );
