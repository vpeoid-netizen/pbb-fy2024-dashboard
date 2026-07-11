import type { PbbRequirementSeed } from "@/types/pbb";

const mfoDocuments = [
  "FY 2024 accomplishment report",
  "Supporting evidence prescribed for SUCs",
  "Applicable APR or BFAR extracts",
  "Proof of submission",
  "Validation or assessment results",
  "Explanations for deficiencies, where applicable",
];

const mfoDeadline =
  "Applicable FY 2024 APR timelines and SUC submission requirements under the Guidelines";

const mfoAgency = "CHED and DBM";

export const pbbRequirements: PbbRequirementSeed[] = [
  {
    id: "performance-mfo-1-higher-education",
    category: "performance",
    title: "MFO 1: Higher Education Program",
    shortTitle: "MFO 1: Higher Education",
    description:
      "Evidence supporting the accomplishment of the Congress-approved FY 2024 PREXC performance indicators for the Higher Education Program.",
    documents: mfoDocuments,
    validatingAgency: mfoAgency,
    deadline: mfoDeadline,
    folderUrl:
      "https://drive.google.com/drive/folders/1gwE0wy8rUjHQsHZcK3abt071iko9Nr7s?usp=drive_link",
    keywords: ["MFO 1", "Higher Education", "PREXC", "performance", "APR"],
    displayOrder: 1,
  },
  {
    id: "performance-mfo-2-advanced-education",
    category: "performance",
    title: "MFO 2: Advanced Education Program",
    shortTitle: "MFO 2: Advanced Education",
    description:
      "Evidence supporting the accomplishment of the Congress-approved FY 2024 PREXC performance indicators for the Advanced Education Program.",
    documents: mfoDocuments,
    validatingAgency: mfoAgency,
    deadline: mfoDeadline,
    folderUrl:
      "https://drive.google.com/drive/folders/1Ai_9WJbNzf2JIDCscWwT3yEeS0Nqo17r?usp=drive_link",
    keywords: ["MFO 2", "Advanced Education", "PREXC", "performance"],
    displayOrder: 2,
  },
  {
    id: "performance-mfo-3-research",
    category: "performance",
    title: "MFO 3: Research Program",
    shortTitle: "MFO 3: Research",
    description:
      "Evidence supporting the accomplishment of the Congress-approved FY 2024 PREXC performance indicators for the Research Program.",
    documents: mfoDocuments,
    validatingAgency: mfoAgency,
    deadline: mfoDeadline,
    folderUrl:
      "https://drive.google.com/drive/folders/1T4kRua9mC1SMGe5QsK0kpaCUtyNPfaCh?usp=drive_link",
    keywords: ["MFO 3", "Research", "PREXC", "performance"],
    displayOrder: 3,
  },
  {
    id: "performance-mfo-4-technical-advisory-extension",
    category: "performance",
    title: "MFO 4: Technical Advisory Extension Program",
    shortTitle: "MFO 4: TA Extension",
    description:
      "Evidence supporting the accomplishment of the Congress-approved FY 2024 PREXC performance indicators for the Technical Advisory Extension Program.",
    documents: mfoDocuments,
    validatingAgency: mfoAgency,
    deadline: mfoDeadline,
    folderUrl:
      "https://drive.google.com/drive/folders/1n0Zwpt98KhBnlrBY4SeF84zgmiHZFT7u?usp=drive_link",
    keywords: ["MFO 4", "Extension", "TAEP", "PREXC", "performance"],
    displayOrder: 4,
  },
  {
    id: "process-results",
    category: "process",
    title: "Process Results",
    shortTitle: "Process Results",
    description:
      "Evidence of substantial improvement in the ease of transaction for one nominated critical service declared in the University's FY 2023 or FY 2024 Citizen's Charter.",
    documents: [
      "Duly accomplished Online Modified Form A",
      "Description of the nominated critical service",
      "Baseline and improved process data",
      "Evidence of processing-time, step, requirement, cost, or other measurable improvement",
      "Supporting means of verification",
      "Proof of submission to ARTA",
      "Validation result",
      "Explanations or justifications for deficiencies",
    ],
    validatingAgency: "Anti-Red Tape Authority",
    deadline:
      "Within twenty calendar days from the effectivity of the applicable Memorandum Circular",
    folderUrl:
      "https://drive.google.com/drive/folders/1VNpzWak9XyvacE644kAwUNixTb_aHMFE?usp=drive_link",
    keywords: ["process", "ARTA", "Citizen's Charter", "Form A"],
    displayOrder: 5,
  },
  {
    id: "financial-results",
    category: "financial",
    title: "Financial Results",
    shortTitle: "Financial Results",
    description:
      "Documents supporting the University's FY 2024 Disbursement Budget Utilization Rate.",
    documents: [
      "FY 2024 FAR No. 4",
      "Applicable Notice of Cash Allocation records",
      "Relevant BFARs",
      "Annual APR",
      "SUC Performance Report templates under Annexes 3, 3.1, and 3.2",
      "Proof of timely submission",
      "DBM assessment or validation",
      "Supporting explanation for deficiencies",
    ],
    validatingAgency: "Department of Budget and Management",
    deadline:
      "Fourth-quarter FY 2024 BFAR: January 30, 2025; Annual APR for SUCs: February 16, 2025; other requirements as prescribed",
    folderUrl:
      "https://drive.google.com/drive/folders/1TsOrUvJetQbOnjbYgk6GYpIgIELX8hr9?usp=drive_link",
    keywords: ["financial", "BUR", "DBUR", "FAR", "BFAR", "DBM"],
    displayOrder: 6,
  },
  {
    id: "citizen-client-satisfaction-results",
    category: "citizen-client",
    title: "Citizen/Client Satisfaction Results",
    shortTitle: "Citizen/Client Satisfaction",
    description:
      "Evidence supporting the resolution and compliance rates for complaints received through Hotline #8888 and the Contact Center ng Bayan.",
    documents: [
      "Summary of Hotline #8888 complaints received in FY 2024",
      "Summary of Contact Center ng Bayan complaints received in FY 2024",
      "Number of resolved and pending tickets",
      "Evidence of compliance with the prescribed action period",
      "Supporting communications or closure records",
      "Proof of submission",
      "Validation reports",
    ],
    validatingAgency: "Relevant oversight and complaints-handling agencies",
    deadline: "As prescribed in the FY 2024 PBB Guidelines",
    folderUrl:
      "https://drive.google.com/drive/folders/1tpuYkxm-t5DM6OPeu_fmVjSPF2MUeWSK?usp=drive_link",
    keywords: ["8888", "CCB", "complaints", "satisfaction", "hotline"],
    displayOrder: 7,
  },
  {
    id: "accountability-transparency-seal",
    category: "agency-accountability",
    title: "Updating of the Agency's Transparency Seal",
    shortTitle: "Transparency Seal",
    description:
      "Evidence of updating the Agency's Transparency Seal with required FY 2024 disclosures.",
    documents: [
      "Updated Transparency Seal webpage",
      "Required FY 2024 disclosures",
      "Screenshots or archived pages",
      "Accessible webpage URL",
      "Certification or proof of posting",
      "Validation result",
    ],
    validatingAgency: "DBM – Office of the Chief Information Officer",
    deadline:
      "Twenty calendar days from the effectivity of the Memorandum Circular",
    folderUrl:
      "https://drive.google.com/drive/folders/1TyDf_bR1RsC4k3B9IWa_s6IYsL1YMF6l?usp=drive_link",
    keywords: ["transparency seal", "accountability", "DBM OCIO"],
    displayOrder: 8,
  },
  {
    id: "accountability-audit-findings",
    category: "agency-accountability",
    title: "Sustained Compliance with Audit Findings",
    shortTitle: "Audit Findings Compliance",
    description:
      "Evidence of sustained compliance with prior audit findings and recommendations.",
    documents: [
      "Report on the Status of Implementation of Prior Years' Recommendations",
      "Evidence supporting implementation of audit recommendations",
      "Relevant COA communications",
      "Proof of submission",
      "Validation result",
    ],
    validatingAgency: "Commission on Audit",
    deadline:
      "Twenty calendar days from the effectivity of the Memorandum Circular",
    folderUrl:
      "https://drive.google.com/drive/folders/1i3dnv-cwLLdoG0WozU7XVJ2rjB_f_bvA?usp=drive_link",
    keywords: ["audit", "COA", "recommendations", "accountability"],
    displayOrder: 9,
  },
  {
    id: "accountability-foi",
    category: "agency-accountability",
    title: "Compliance with the Freedom of Information Program",
    shortTitle: "FOI Program Compliance",
    description:
      "Evidence of compliance with the Freedom of Information Program requirements.",
    documents: [
      "Updated People's FOI Manual",
      "Updated One-Page FOI Manual in English",
      "One-Page FOI Manual in Filipino",
      "Agency Information Inventory",
      "2024 FOI Registry",
      "2024 FOI Summary Report",
      "Proof of onboarding to the eFOI portal",
      "Certification of no overdue pending FOI requests as of December 31, 2024",
      "Proof of submission",
      "Validation result",
    ],
    validatingAgency: "Presidential Communications Office",
    deadline: "January 31, 2025",
    folderUrl:
      "https://drive.google.com/drive/folders/1J-IrC6EBhcvU4Bu1nJJ4VzcL4kORYp8T?usp=drive_link",
    keywords: ["FOI", "freedom of information", "accountability"],
    displayOrder: 10,
  },
  {
    id: "accountability-saln-review",
    category: "agency-accountability",
    title:
      "Establishment and Conduct of the Agency Review and Compliance of the Statement of Assets, Liabilities, and Net Worth",
    shortTitle: "SALN Review and Compliance",
    description:
      "Evidence of establishment and conduct of the Agency Review and Compliance of SALN.",
    documents: [
      "Approved Agency Review and Compliance Procedure",
      "Issuance establishing the Review and Compliance Committee",
      "Transparency Seal posting evidence",
      "Screenshots and accessible URL",
      "Proof of submission",
      "Validation result",
    ],
    validatingAgency: "Civil Service Commission",
    deadline:
      "Twenty calendar days from the effectivity of the Memorandum Circular",
    folderUrl:
      "https://drive.google.com/drive/folders/1PVR7RAlwVh0ExuyCWps3En5_HGBrDXUN?usp=drive_link",
    keywords: ["SALN", "CSC", "accountability"],
    displayOrder: 11,
  },
  {
    id: "accountability-philgeps-posting",
    category: "agency-accountability",
    title:
      "Posting of Invitations to Bid and Awarded Contracts for Public Bidding Transactions Above ₱1,000,000",
    shortTitle: "PhilGEPS Posting",
    description:
      "Evidence of posting invitations to bid and awarded contracts for public bidding transactions above ₱1,000,000.",
    documents: [
      "Invitations to bid",
      "Notices of award or bid results",
      "Approved or awarded contracts",
      "Notices to proceed",
      "Purchase orders",
      "PhilGEPS posting evidence",
      "Self-Assessment Report",
      "Proof of submission",
      "Validation result",
    ],
    validatingAgency: "Procurement Service – PhilGEPS",
    deadline:
      "Twenty calendar days from the effectivity of the Memorandum Circular",
    folderUrl:
      "https://drive.google.com/drive/folders/15xLZXmlomGoQBbbRvRZSdqqZGMj_QxPa?usp=drive_link",
    keywords: ["PhilGEPS", "procurement", "bidding", "accountability"],
    displayOrder: 12,
  },
  {
    id: "accountability-app-non-cse-2024",
    category: "agency-accountability",
    title: "FY 2024 APP for Non-Common Use Supplies and Equipment",
    shortTitle: "FY 2024 APP Non-CSE",
    description:
      "Submission of FY 2024 Annual Procurement Plan for non-common use supplies and equipment.",
    documents: [
      "FY 2024 APP non-CSE in PDF",
      "FY 2024 APP non-CSE in Excel",
      "Approval and signature of the Head of the Procuring Entity or authorized official",
      "Posting Certification",
      "Proof of email submission",
      "Validation result",
    ],
    validatingAgency:
      "Government Procurement Policy Board – Technical Support Office",
    deadline: "January 31, 2024",
    folderUrl:
      "https://drive.google.com/drive/folders/1L61dARaGqB6N6QVHa-2Gwy4wM3NZwT6m?usp=drive_link",
    keywords: ["APP", "non-CSE", "procurement", "GPPB"],
    displayOrder: 13,
  },
  {
    id: "accountability-app-cse-2025",
    category: "agency-accountability",
    title: "FY 2025 APP for Common Use Supplies and Equipment",
    shortTitle: "FY 2025 APP-CSE",
    description:
      "Submission of FY 2025 Annual Procurement Plan for common use supplies and equipment.",
    documents: [
      "FY 2025 APP-CSE",
      "Proof of submission through the PS-DBM Virtual Store or MPhilGEPS",
      "Submission confirmation",
      "Validation result",
    ],
    validatingAgency: "Procurement Service – Department of Budget and Management",
    deadline: "September 16, 2024",
    folderUrl:
      "https://drive.google.com/drive/folders/1JUeGYp_I2SNcl6GwsLj-bgQce8cnV5HI?usp=drive_link",
    keywords: ["APP-CSE", "CSE", "procurement", "PS-DBM"],
    displayOrder: 14,
  },
  {
    id: "accountability-apcpi-2023",
    category: "agency-accountability",
    title:
      "Results of the FY 2023 Agency Procurement Compliance and Performance Indicators Report",
    shortTitle: "FY 2023 APCPI Report",
    description:
      "Submission of the FY 2023 Agency Procurement Compliance and Performance Indicators Report.",
    documents: [
      "FY 2023 APCPI Report",
      "Complete annexes",
      "PDF version",
      "Excel version",
      "Proof of email submission",
      "Validation result",
    ],
    validatingAgency:
      "Government Procurement Policy Board – Technical Support Office",
    deadline: "March 31, 2024",
    folderUrl:
      "https://drive.google.com/drive/folders/14KWysxQdKUe3yQeLz2KiuKLDsV3JF3V1?usp=drive_link",
    keywords: ["APCPI", "procurement compliance", "GPPB"],
    displayOrder: 15,
  },
  {
    id: "accountability-early-procurement-activities",
    category: "agency-accountability",
    title:
      "Submission of Certification of Early Procurement Activities for FY 2025 Procurement Projects through REGINA",
    shortTitle: "Early Procurement Activities",
    description:
      "Submission of Certification of Early Procurement Activities for FY 2025 procurement projects through REGINA.",
    documents: [
      "Duly notarized Early Procurement Activities Certification",
      "Supporting procurement records",
      "REGINA upload confirmation",
      "Proof of submission",
      "Validation result",
    ],
    validatingAgency:
      "Government Procurement Policy Board – Technical Support Office",
    deadline: "January 31, 2025",
    folderUrl:
      "https://drive.google.com/drive/folders/16340AncozvBdtLmGQmWnLe2u7Mz2jjHZ?usp=drive_link",
    keywords: ["early procurement", "REGINA", "GPPB"],
    displayOrder: 16,
  },
  {
    id: "accountability-cart",
    category: "agency-accountability",
    title: "Designation of the Committee on Anti-Red Tape",
    shortTitle: "CART Designation",
    description:
      "Evidence of designation of the Committee on Anti-Red Tape (CART).",
    documents: [
      "CART designation issuance",
      "Updated CART membership",
      "CART directory",
      "Proof of publication on the official University website",
      "Screenshots and webpage URL",
      "Validation result",
    ],
    validatingAgency: "Anti-Red Tape Authority",
    deadline: "February 15, 2024",
    folderUrl:
      "https://drive.google.com/drive/folders/1eqGuKA6uIQdwRsiaD4CFib9HLgqqhzjf?usp=drive_link",
    keywords: ["CART", "ARTA", "anti-red tape"],
    displayOrder: 17,
  },
  {
    id: "accountability-client-satisfaction-measurement",
    category: "agency-accountability",
    title: "Implementation of the Harmonized Client Satisfaction Measurement",
    shortTitle: "Client Satisfaction Measurement",
    description:
      "Evidence of implementation of the Harmonized Client Satisfaction Measurement.",
    documents: [
      "Annual Client Satisfaction Measurement Report",
      "Supporting survey data",
      "Prescribed report attachments",
      "Proof of submission",
      "Validation result",
    ],
    validatingAgency: "Anti-Red Tape Authority",
    deadline: "Last working day of April 2025",
    folderUrl:
      "https://drive.google.com/drive/folders/1DH1eTO7H_HanzdrdkGxi3CgZj9RbUg64?usp=drive_link",
    keywords: ["HCSM", "client satisfaction", "ARTA"],
    displayOrder: 18,
  },
];

export const TOTAL_REQUIREMENTS = pbbRequirements.length;
