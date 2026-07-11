import { pbbRequirements } from "@/data/pbbRequirements";

export const REPORTORIAL_REQUIREMENT_IDS = pbbRequirements
  .filter((req) =>
    ["performance", "process", "financial", "citizen-client"].includes(req.category),
  )
  .map((req) => req.id);

export const reportorialRequirements = pbbRequirements.filter((req) =>
  REPORTORIAL_REQUIREMENT_IDS.includes(req.id),
);
