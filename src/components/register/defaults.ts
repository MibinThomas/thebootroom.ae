export const DEFAULT_PLAYERS = Array.from({ length: 10 }).map((_, i) => ({ fullName: "", jerseyNumber: i + 1, position: "", jerseySize: "M" as const, phone: "" }));
