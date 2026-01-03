import Link from "next/link";
import { listTeams } from "@/lib/tickets/store";
import TeamsTableClient from "@/components/admin/TeamsTableClient";

export const metadata = { title: "Teams | Admin | The Bootroom" };
export const runtime = "nodejs";

export default async function AdminTeamsPage() {
  const teams = await listTeams();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-bootred">Teams</h1>
          <p className="text-sm text-black/60">Search, filter and manage registrations (MongoDB).</p>
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
          <Link
            href="/verify"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-black/70 font-semibold border border-black/10 hover:bg-white/80"
          >
            QR Verify Screen
          </Link>
        </div>
      </div>

      <TeamsTableClient teams={teams} />
    </div>
  );
}
