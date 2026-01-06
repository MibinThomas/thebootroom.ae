"use client";

import { useEffect, useState } from "react";

export default function ScanPage({ params }: { params: { teamId: string } }) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/attendance/${params.teamId}`, { method: "POST" });
        setStatus(res.ok ? "ok" : "error");
      } catch {
        setStatus("error");
      }
    })();
  }, [params.teamId]);

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center text-center px-6">
      {status === "loading" && <p className="text-white text-lg">Marking attendance…</p>}
      {status === "ok" && (
        <div>
          <h1 className="text-secondary font-heading text-4xl">Attendance Marked ✅</h1>
          <p className="text-white mt-3">Team entry verified successfully.</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <h1 className="text-secondary font-heading text-4xl">Error</h1>
          <p className="text-white mt-3">Could not mark attendance. Please try again.</p>
        </div>
      )}
    </main>
  );
}
