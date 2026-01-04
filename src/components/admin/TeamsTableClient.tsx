"use client";

import { useMemo, useState } from "react";

type TeamRow = {
  id: string;
  teamNumber: number;
  companyName: string;
  managerName: string;
  phone: string;
  captainName: string;
  captainPhone: string;
  email: string;

  checkedIn?: boolean;
  checkedInAt?: string | null;

  // files
  logoUrl?: string;
  logoFileName?: string;

  brandGuidelinesUrl?: string;
  brandGuidelinesFileName?: string;
};

function fmt(dt?: string | null) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

function dlName(fallback: string, name?: string) {
  if (!name || !name.trim()) return fallback;
  return name;
}

export default function TeamsTableClient({ teams }: { teams: TeamRow[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "checked" | "pending">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return teams
      .filter((t) => {
        if (filter === "checked") return !!t.checkedIn;
        if (filter === "pending") return !t.checkedIn;
        return true;
      })
      .filter((t) => {
        if (!query) return true;
        return (
          String(t.teamNumber).includes(query) ||
          (t.companyName || "").toLowerCase().includes(query) ||
          (t.managerName || "").toLowerCase().includes(query) ||
          (t.phone || "").toLowerCase().includes(query) ||
          (t.captainName || "").toLowerCase().includes(query) ||
          (t.captainPhone || "").toLowerCase().includes(query)
        );
      });
  }, [teams, q, filter]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 shadow-soft overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-2 rounded-xl text-sm border ${
              filter === "all" ? "bg-bootred text-white border-bootred" : "bg-white border-black/10 text-black/70"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("checked")}
            className={`px-3 py-2 rounded-xl text-sm border ${
              filter === "checked"
                ? "bg-green-600 text-white border-green-600"
                : "bg-white border-black/10 text-black/70"
            }`}
          >
            Checked-in
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-2 rounded-xl text-sm border ${
              filter === "pending"
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white border-black/10 text-black/70"
            }`}
          >
            Pending
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search team no / company / manager / phone..."
          className="w-full md:w-96 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-bootred/50 focus:ring-2 focus:ring-bootred/10"
        />
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-[1400px] w-full text-sm">
          <thead className="bg-cream">
            <tr className="text-left">
              <th className="px-4 py-3">Team #</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Manager</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked-in at</th>
              <th className="px-4 py-3">Downloads</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => {
              const ticketUrl = `/api/admin/ticket/${t.id}`; // ✅ adjust if you use token-based route
              // If your ticket route is /api/ticket/[teamToken], change this to:
              // const ticketUrl = `/api/ticket/${encodeURIComponent(t.teamToken)}`;

              return (
                <tr key={t.id} className="border-t border-black/5 align-top">
                  <td className="px-4 py-3 font-semibold text-bootred">{t.teamNumber}</td>
                  <td className="px-4 py-3">{t.companyName}</td>
                  <td className="px-4 py-3">{t.managerName}</td>
                  <td className="px-4 py-3">{t.phone}</td>

                  <td className="px-4 py-3">
                    {t.checkedIn ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-700 border border-green-200">
                        <span className="h-2 w-2 rounded-full bg-green-600" />
                        Checked-in
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-700 border border-amber-200">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">{fmt(t.checkedInAt)}</td>

                  {/* ✅ Downloads */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {/* Logo */}
                      {t.logoUrl ? (
                        <a
                          href={t.logoUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={dlName(`team-${t.teamNumber}-logo.png`, t.logoFileName)}
                          className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-xs font-semibold border border-black/10 hover:bg-white/80"
                        >
                          Logo
                        </a>
                      ) : (
                        <span className="text-xs text-black/40">Logo —</span>
                      )}

                      {/* Guidelines */}
                      {t.brandGuidelinesUrl ? (
                        <a
                          href={t.brandGuidelinesUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={dlName(`team-${t.teamNumber}-guidelines.pdf`, t.brandGuidelinesFileName)}
                          className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-xs font-semibold border border-black/10 hover:bg-white/80"
                        >
                          Guidelines
                        </a>
                      ) : (
                        <span className="text-xs text-black/40">Guidelines —</span>
                      )}

                      {/* Ticket */}
                      <a
                        href={ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-xl bg-bootred px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
                      >
                        Ticket PDF
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-black/50">
                  No teams found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
