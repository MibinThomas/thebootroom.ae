"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function VerifyClient({ code }: { code: string }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function checkIn() {
    if (!code) {
      setErr("Missing code. Scan QR again.");
      return;
    }
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Verification failed");

      setData(json);
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Auto check-in when page opens (fast gate workflow)
  useEffect(() => {
    if (code) checkIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const team = data?.team;

  return (
    <div className="rounded-2xl bg-white/90 shadow-soft border border-black/10 p-6">
      <h1 className="font-display text-3xl text-bootred">QR Verification</h1>
      <p className="mt-1 text-sm text-black/60">Admin-only gate check-in</p>

      {!code ? (
        <div className="mt-6 rounded-xl border border-black/10 bg-cream p-4 text-sm text-black/70">
          Scan a ticket QR — it will open this page with a code.
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-xl border border-black/10 bg-cream p-4 text-sm">
          Checking in…
        </div>
      ) : null}

      {err ? (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      {team ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-xs text-black/50">TEAM</div>
            <div className="text-xl font-semibold">{team.companyName}</div>
            <div className="mt-1 text-sm text-black/70">
              Team No: <b>{team.teamNumber}</b>
            </div>

            <div className="mt-2 text-sm">
              Status:{" "}
              <span className="font-semibold text-green-700">
                {data.checkedIn ? "CHECKED-IN ✅" : "NOT CHECKED-IN"}
              </span>
            </div>
            {data.checkedInAt ? (
              <div className="text-xs text-black/60 mt-1">
                Checked-in at: {new Date(data.checkedInAt).toLocaleString()}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-black/10 p-4">
            <div className="text-sm font-semibold mb-2">Players</div>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {team.players?.map((p: any, idx: number) => (
                <li key={idx}>
                  {p.fullName} — #{p.jerseyNumber} — {p.position} — {p.jerseySize}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-3">
            <Button type="button" onClick={checkIn} disabled={loading}>
              {loading ? "Checking…" : "Re-check / Refresh"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setData(null);
                setErr(null);
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
