import Link from "next/link";
import { getTeamPayloadByNumber } from "@/lib/tickets/store";

export const runtime = "nodejs";

export default async function AdminTeamDetailsPage({
  params,
}: {
  params: Promise<{ teamNumber: string }>;
}) {
  const { teamNumber } = await params;
  const num = Number(teamNumber);
  const team = Number.isFinite(num) ? getTeamPayloadByNumber(num) : null;

  if (!team) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-soft p-6">
        <h1 className="font-display text-2xl text-bootred">Team Not Found</h1>
        <p className="mt-2 text-sm text-black/60">Team number is invalid or not in the dev store.</p>
        <div className="mt-5">
          <Link href="/admin/teams" className="text-bootred font-semibold hover:underline">
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-bootred">Team #{team.teamNumber}</h1>
          <p className="text-sm text-black/60">{team.companyName}</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <a
            href={`/api/admin/ticket/${team.teamNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl bg-bootred px-4 py-2.5 text-white font-semibold shadow-soft hover:opacity-95"
          >
            Download Ticket PDF
          </a>
          <Link
            href="/admin/teams"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-bootred font-semibold border border-bootred/30 hover:bg-white/80"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-soft p-6 space-y-4">
        <h2 className="font-semibold text-black/80">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs text-black/50">Manager</div>
            <div className="font-semibold">{team.managerName}</div>
            <div className="text-black/70">{team.phone}</div>
            <div className="text-black/70">{team.email}</div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs text-black/50">Captain</div>
            <div className="font-semibold">{team.captainName}</div>
            <div className="text-black/70">{team.captainPhone}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-black/10">
          <h2 className="font-semibold text-black/80">Players ({team.players.length})</h2>
        </div>
        <div className="overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-cream border-b border-black/10">
              <tr className="text-left">
                <th className="px-6 py-3 font-semibold text-black/70">No</th>
                <th className="px-6 py-3 font-semibold text-black/70">Name</th>
                <th className="px-6 py-3 font-semibold text-black/70">Phone</th>
                <th className="px-6 py-3 font-semibold text-black/70">Jersey</th>
                <th className="px-6 py-3 font-semibold text-black/70">Position</th>
                <th className="px-6 py-3 font-semibold text-black/70">Size</th>
              </tr>
            </thead>
            <tbody>
              {team.players.map((p, idx) => (
                <tr key={idx} className="border-b border-black/5">
                  <td className="px-6 py-3">{idx + 1}</td>
                  <td className="px-6 py-3 font-semibold">{p.fullName}</td>
                  <td className="px-6 py-3">{p.phone}</td>
                  <td className="px-6 py-3">#{p.jerseyNumber}</td>
                  <td className="px-6 py-3">{p.position}</td>
                  <td className="px-6 py-3">{p.jerseySize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
