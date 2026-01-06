// app/admin/team/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminTeamView({
  params,
}: {
  params: { id: string };
}) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: { players: true },
  });

  if (!team) return notFound();

  const ticketUrl = team.ticketPdfUrl || team.ticketUrl || null; // keep compatible
  const logoUrl = team.logoUrl || null;
  const guideUrl = team.brandGuideUrl || null;

  return (
    <main className="min-h-screen bg-primary px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin"
            className="bg-panel border-2 border-secondary text-primary font-heading uppercase px-4 py-2 rounded shadow"
          >
            ← Back
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-sm font-heading uppercase ${
                team.attendance
                  ? "bg-secondary text-primary"
                  : "bg-panel text-primary border border-secondary"
              }`}
            >
              {team.attendance ? "Attendance: Marked" : "Attendance: Pending"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-secondary font-heading text-4xl uppercase">
          {team.teamName}
        </h1>
        <p className="text-white/90 mt-1">
          Company: <span className="text-secondary">{team.companyName}</span>
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {ticketUrl ? (
            <a
              className="bg-secondary text-primary font-heading uppercase px-4 py-3 rounded shadow"
              href={ticketUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download Ticket
            </a>
          ) : (
            <span className="bg-secondary/40 text-primary font-heading uppercase px-4 py-3 rounded shadow opacity-60">
              Ticket not available
            </span>
          )}

          {logoUrl ? (
            <a
              className="bg-panel border-2 border-secondary text-primary font-heading uppercase px-4 py-3 rounded shadow"
              href={logoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download Logo
            </a>
          ) : (
            <span className="bg-panel border-2 border-secondary text-primary font-heading uppercase px-4 py-3 rounded shadow opacity-60">
              No Logo
            </span>
          )}

          {guideUrl ? (
            <a
              className="bg-panel border-2 border-secondary text-primary font-heading uppercase px-4 py-3 rounded shadow"
              href={guideUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download Brand Guide
            </a>
          ) : (
            <span className="bg-panel border-2 border-secondary text-primary font-heading uppercase px-4 py-3 rounded shadow opacity-60">
              No Brand Guide
            </span>
          )}
        </div>

        {/* Team details panel */}
        <div className="mt-6 bg-panel border-4 border-secondary rounded-xl p-6">
          <h2 className="text-primary font-heading uppercase text-2xl">
            Team Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-primary">
            <Info label="Team Name" value={team.teamName} />
            <Info label="Company Name" value={team.companyName} />
            <Info label="Company Sector" value={team.companySector} />
            <Info label="Company Address" value={team.companyAddress} />
            <Info label="Manager Name" value={team.managerName} />
            <Info label="Manager Email" value={team.managerEmail} />
            <Info label="Manager Phone" value={team.managerPhone} />
            <Info label="Captain Name" value={team.captainName} />
            <Info label="Captain Email" value={team.captainEmail} />
            <Info label="Captain Phone" value={team.captainPhone} />
          </div>
        </div>

        {/* Players table */}
        <div className="mt-6 bg-panel border-4 border-secondary rounded-xl overflow-hidden">
          <div className="bg-primary text-secondary font-heading uppercase px-4 py-3 grid grid-cols-12">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Position</div>
            <div className="col-span-1 text-center">Size</div>
            <div className="col-span-2 text-right">Jersey No</div>
          </div>

          {team.players.map((p, idx) => (
            <div
              key={p.id}
              className="px-4 py-3 border-t border-secondary/30 grid grid-cols-12 text-primary"
            >
              <div className="col-span-1 font-heading">{idx + 1}</div>
              <div className="col-span-5">{p.name}</div>
              <div className="col-span-3">{p.preferredPosition}</div>
              <div className="col-span-1 text-center font-heading">
                {p.jerseySize}
              </div>
              <div className="col-span-2 text-right font-heading">
                {p.jerseyNumber || "-"}
              </div>
            </div>
          ))}

          {team.players.length === 0 && (
            <div className="p-6 text-primary/80">No players found.</div>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-white/40 rounded-lg border border-secondary/40 p-4">
      <div className="text-xs font-heading uppercase text-secondary">
        {label}
      </div>
      <div className="mt-1">{value || "-"}</div>
    </div>
  );
}
