const UPDATER_NAME_ALIASES: Record<string, string> = {
  IPDO: "IPDO_Kier",
};

export function normalizeUpdaterName(name: string): string {
  const trimmed = name.trim();
  return UPDATER_NAME_ALIASES[trimmed] ?? trimmed;
}
