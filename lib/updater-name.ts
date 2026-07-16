const UPDATER_NAME_ALIASES: Record<string, string> = {
  IPDO: "PBB Focal Person",
  IPDO_Kier: "PBB Focal Person",
};

export function normalizeUpdaterName(name: string): string {
  const trimmed = name.trim();
  return UPDATER_NAME_ALIASES[trimmed] ?? trimmed;
}
