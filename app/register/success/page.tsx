"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");

  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        const data = await res.json();

        if (res.ok) {
          setTicketUrl(data.ticketPdfUrl ?? null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [teamId]);

  return (
    <main className="min-h-screen bg-primary flex flex-col items-center justify-center text-center px-6">
      <img src="/logo.png" alt="The BootRoom" className="h-20 w-auto mb-10" />

      <p className="text-white text-lg max-w-xl">
        Thank you for registering your team! We look forward to seeing you at the event.
      </p>

      <div className="mt-8">
        {!teamId && (
          <p className="text-white/80 text-sm">
            Ticket link not found. Please contact the organizer.
          </p>
        )}

        {loading && <p className="text-white/80 text-sm">Preparing your ticket…</p>}

        {!loading && ticketUrl && (
          <a
            href={ticketUrl}
            className="inline-block bg-secondary text-primary font-heading uppercase px-10 py-4 rounded shadow hover:brightness-105 transition"
            download
          >
            Download Ticket PDF
          </a>
        )}

        {!loading && teamId && !ticketUrl && (
          <p className="text-white/80 text-sm">
            Ticket is not ready yet. Please refresh in a moment.
          </p>
        )}
      </div>
    </main>
  );
}
