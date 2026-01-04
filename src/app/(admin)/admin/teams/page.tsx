import Link from "next/link";
import { listTeams } from "@/lib/tickets/store";
import TeamsTableClient from "@/components/admin/TeamsTableClient";
import AutoRefresh from "@/components/admin/AutoRefresh";

export const metadata = { title: "Teams | Admin | The Bootroom" };
export const runtime = "nodejs";

// ✅ Make sure this page is always fresh (no caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTeamsPage() {
  const teams = await listTeams();

  const total = teams.length;
  const checkedInCount = teams.filter((t: any) => t.checkedIn).length;
  const pending = total - checkedInCount;

  return (
    <div className="space-y-5">
      {/* ✅ auto refresh every 5 seconds */}
      <AutoRefresh intervalMs={5000} />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-bootred">Teams</h1>
          <p className="text-sm text-black/60">
            Live registrations & check-ins (auto refresh every 5s).
          </p>

          {/* ✅ quick stats */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1 border border-black/10">
              Total: <b>{total}</b>
            </span>
            <span className="rounded-full bg-white px-3 py-1 border border-black/10">
              Checked-in: <b>{checkedInCount}</b>
            </span>
            <span className="rounded-full bg-white px-3 py-1 border border-black/10">
              Pending: <b>{pending}</b>
            </span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <a
            href="/api/admin/teams.csv"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-bootred font-semibold border border-bootred/30 hover:bg-white/80"
          >
            Export CSV
          </a>

          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-bootred px-4 py-2.5 text-white font-semibold shadow-soft hover:opacity-95"
          >
            New Registration
          </Link>
        </div>
      </div>

      <TeamsTableClient teams={teams} />
    </div>
  );
}
