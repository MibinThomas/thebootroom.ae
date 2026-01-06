import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHome({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q || "").trim();

  const teams = await prisma.team.findMany({
    where: q
      ? {
          OR: [
            { teamName: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
            { captainName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { players: true },
  });

  const total = teams.length;
  const attended = teams.filter((t) => t.attendance).length;

  return (
    <main className="min-h-screen bg-primary p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-secondary font-heading text-4xl uppercase">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-panel border-2 border-secondary rounded p-4">
            <div className="text-secondary font-heading uppercase">Total Teams</div>
            <div className="text-primary text-3xl mt-2">{total}</div>
          </div>
          <div className="bg-panel border-2 border-secondary rounded p-4">
            <div className="text-secondary font-heading uppercase">
              Attendance Marked
            </div>
            <div className="text-primary text-3xl mt-2">{attended}</div>
          </div>
          <div className="bg-panel border-2 border-secondary rounded p-4">
            <div className="text-secondary font-heading uppercase">
              Pending Attendance
            </div>
            <div className="text-primary text-3xl mt-2">{total - attended}</div>
          </div>
        </div>

        <form className="mt-8">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by team, company, captain…"
            className="w-full"
          />
        </form>

        <div className="mt-6 bg-panel border-4 border-secondary rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-primary text-secondary font-heading uppercase px-4 py-3">
            <div className="col-span-3">Team</div>
            <div className="col-span-3">Company</div>
            <div className="col-span-2">Captain</div>
            <div className="col-span-2">Attendance</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {teams.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-12 px-4 py-3 border-t border-secondary/30 bg-panel text-primary items-center"
            >
              <div className="col-span-3 font-medium">{t.teamName}</div>
              <div className="col-span-3">{t.companyName}</div>
              <div className="col-span-2">{t.captainName}</div>

              <div className="col-span-2">
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-heading uppercase border ${
                    t.attendance
                      ? "bg-secondary text-primary border-secondary"
                      : "bg-white/40 text-primary border-secondary/50"
                  }`}
                >
                  {t.attendance ? "Marked" : "Pending"}
                </span>
              </div>

              {/* ✅ Separate buttons */}
              <div className="col-span-2 flex justify-end gap-2 flex-wrap">
                <Link
                  className="bg-secondary text-primary font-heading uppercase px-3 py-2 rounded shadow"
                  href={`/admin/teams/${t.id}`}
                >
                  View
                </Link>

                <a
                  className={`border border-secondary font-heading uppercase px-3 py-2 rounded shadow ${
                    t.logoUrl
                      ? "bg-panel text-primary hover:brightness-95"
                      : "bg-panel text-primary/40 cursor-not-allowed pointer-events-none"
                  }`}
                  href={t.logoUrl || "#"}
                  download
                >
                  Logo
                </a>

                <a
                  className={`border border-secondary font-heading uppercase px-3 py-2 rounded shadow ${
                    t.brandGuideUrl
                      ? "bg-panel text-primary hover:brightness-95"
                      : "bg-panel text-primary/40 cursor-not-allowed pointer-events-none"
                  }`}
                  href={t.brandGuideUrl || "#"}
                  download
                >
                  Guide
                </a>
              </div>
            </div>
          ))}

          {teams.length === 0 && (
            <div className="p-6 text-primary/80">No teams found.</div>
          )}
        </div>
      </div>
    </main>
  );
}
