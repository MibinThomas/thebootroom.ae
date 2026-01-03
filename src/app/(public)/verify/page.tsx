"use client";

import { useEffect, useMemo, useState } from "react";

type VerifyResult =
  | { ok: true; team: any }
  | { ok: false; message: string };

function normalizeCode(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  // If someone scans a URL, try to extract ?code=... or last segment
  try {
    const u = new URL(v);
    const code = u.searchParams.get("code") || "";
    return code || v;
  } catch {
    return v;
  }
}

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<VerifyResult | null>(null);

  async function verify(input: string) {
    const c = normalizeCode(input);
    if (!c) return;

    setLoading(true);
    setRes(null);
    try {
      const r = await fetch(`/api/verify?code=${encodeURIComponent(c)}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) {
        setRes({ ok: false, message: j?.error || "Invalid code" });
      } else {
        setRes({ ok: true, team: j.team });
      }
    } catch {
      setRes({ ok: false, message: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-black/10 p-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-bootred/10 border border-bootred/20 flex items-center justify-center overflow-hidden">
            <img src="/bootroom-logo.png" alt="Bootroom" className="h-full w-full object-contain p-2" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-bootred">QR Verification</h1>
            <p className="text-xs text-black/60">Paste scanned QR payload and verify team + players.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="text-sm font-semibold text-black/80">QR Code Text</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Example: bootroom:team:1001"
            rows={3}
            className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm outline-none focus:border-bootred/50 focus:ring-2 focus:ring-bootred/10"
          />
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => verify(code)}
              disabled={loading || !code.trim()}
              className="inline-flex items-center justify-center rounded-2xl bg-bootred px-5 py-3 text-white font-semibold shadow-soft disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => { setCode(""); setRes(null); }}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-bootred font-semibold border border-bootred/30 hover:bg-white/80"
            >
              Clear
            </button>
          </div>
        </div>

        {res ? (
          <div className="mt-6">
            {res.ok ? (
              <div className="rounded-2xl border border-black/10 bg-cream p-5 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs text-black/60">Team</div>
                    <div className="text-xl font-semibold text-bootbrown">
                      #{res.team.teamNumber} — {res.team.companyName}
                    </div>
                    <div className="text-sm text-black/70">
                      Manager: {res.team.managerName} ({res.team.phone})
                    </div>
                    <div className="text-sm text-black/70">
                      Captain: {res.team.captainName} ({res.team.captainPhone})
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 border border-black/10">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-sm font-semibold text-black/70">VALID</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-black/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-black/10 text-sm font-semibold text-black/70">
                    Players ({res.team.players.length})
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-[700px] w-full text-sm">
                      <thead className="bg-white/60 border-b border-black/10">
                        <tr className="text-left">
                          <th className="px-4 py-2 text-black/60 font-semibold">No</th>
                          <th className="px-4 py-2 text-black/60 font-semibold">Name</th>
                          <th className="px-4 py-2 text-black/60 font-semibold">Phone</th>
                          <th className="px-4 py-2 text-black/60 font-semibold">Jersey</th>
                          <th className="px-4 py-2 text-black/60 font-semibold">Position</th>
                          <th className="px-4 py-2 text-black/60 font-semibold">Size</th>
                        </tr>
                      </thead>
                      <tbody>
                        {res.team.players.map((p: any, idx: number) => (
                          <tr key={idx} className="border-t border-black/5">
                            <td className="px-4 py-2">{idx + 1}</td>
                            <td className="px-4 py-2 font-semibold">{p.fullName}</td>
                            <td className="px-4 py-2">{p.phone}</td>
                            <td className="px-4 py-2">#{p.jerseyNumber}</td>
                            <td className="px-4 py-2">{p.position}</td>
                            <td className="px-4 py-2">{p.jerseySize}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="text-sm font-semibold text-red-700">INVALID</div>
                <div className="mt-1 text-sm text-red-700/80">{res.message}</div>
              </div>
            )}
          </div>
        ) : null}

        <p className="mt-6 text-xs text-black/50">
          Expected QR payload format: <code>bootroom:team:1001</code>.
        </p>
      </div>
    </main>
  );
}
