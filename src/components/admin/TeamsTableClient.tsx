"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { TeamPayload } from "@/lib/tickets/types";

type Props = { teams: TeamPayload[] };

export default function TeamsTableClient({ teams }: Props) {
  const [q, setQ] = useState("");
  const [minPlayers, setMinPlayers] = useState<"all" | "10" | "lt10">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return teams.filter((t) => {
      const matchesQuery =
        !query ||
        String(t.teamNumber).includes(query) ||
        (t.companyName || "").toLowerCase().includes(query) ||
        (t.managerName || "").toLowerCase().includes(query) ||
        (t.captainName || "").toLowerCase().includes(query) ||
        (t.phone || "").toLowerCase().includes(query) ||
        (t.captainPhone || "").toLowerCase().includes(query) ||
        (t.email || "").toLowerCase().includes(query);

      const matchesPlayers =
        minPlayers === "all" ? true : minPlayers === "10" ? t.players.length === 10 : t.players.length < 10;

      return matchesQuery && matchesPlayers;
    });
  }, [teams, q, minPlayers]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-black/10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="text-sm font-semibold text-black/75">Total: {teams.length}</div>
          <div className="text-xs text-black/50">Showing: {filtered.length}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search team no / company / manager / captain / phone / email"
            className="w-full sm:w-[380px] rounded-2xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-bootred/50 focus:ring-2 focus:ring-bootred/10"
          />
          <select
            value={minPlayers}
            onChange={(e) => setMinPlayers(e.target.value as any)}
            className="w-full sm:w-[180px] rounded-2xl border border-black/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-bootred/50 focus:ring-2 focus:ring-bootred/10"
          >
            <option value="all">All teams</option>
            <option value="10">Players = 10</option>
            <option value="lt10">Players &lt; 10</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-cream border-b border-black/10">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold text-black/70">Team No</th>
              <th className="px-5 py-3 font-semibold text-black/70">Company</th>
              <th className="px-5 py-3 font-semibold text-black/70">Manager</th>
              <th className="px-5 py-3 font-semibold text-black/70">Captain</th>
              <th className="px-5 py-3 font-semibold text-black/70">Players</th>
              <th className="px-5 py-3 font-semibold text-black/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.teamNumber} className="border-b border-black/5">
                <td className="px-5 py-3 font-semibold text-bootbrown">{t.teamNumber}</td>
                <td className="px-5 py-3">{t.companyName}</td>
                <td className="px-5 py-3">
                  {t.managerName} <span className="text-xs text-black/50">({t.phone})</span>
                </td>
                <td className="px-5 py-3">
                  {t.captainName} <span className="text-xs text-black/50">({t.captainPhone})</span>
                </td>
                <td className="px-5 py-3">{t.players.length}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-bootred font-semibold border border-bootred/30 hover:bg-white/80"
                      href={`/admin/teams/${t.teamNumber}`}
                    >
                      View
                    </Link>
                    <a
                      className="inline-flex items-center justify-center rounded-2xl bg-bootred px-4 py-2 text-white font-semibold shadow-soft hover:opacity-95"
                      href={`/api/admin/ticket/${t.teamNumber}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ticket PDF
                    </a>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-black/60" colSpan={6}>
                  No matching teams.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
