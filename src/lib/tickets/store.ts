import type { TeamPayload } from "@/lib/tickets/types";
import { verifyTeamToken } from "@/lib/utils/security";
const g = globalThis as any;
const store: Map<number, TeamPayload> = g.__BOOTROOM_STORE__ ?? new Map();
g.__BOOTROOM_STORE__ = store;
export function putTeamPayload(team: TeamPayload){ store.set(team.teamNumber, team); }
export function getTeamPayloadFromToken(teamToken: string){ const payload = verifyTeamToken(teamToken); if(!payload) return null; return store.get(payload.teamNumber) ?? null; }
export function getTeamPayloadByNumber(teamNumber:number){ return store.get(teamNumber) ?? null; }
export function listTeams(){ return Array.from(store.values()).sort((a,b)=>b.teamNumber-a.teamNumber); }
