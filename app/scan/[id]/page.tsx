"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

/**
 * This page is loaded when a QR code on a ticket is scanned. It calls the
 * attendance endpoint to mark the team as present and provides feedback to
 * the user. The team ID is extracted from the dynamic route parameter.
 */
export default function ScanPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState('Updating attendance…');

  useEffect(() => {
    const markAttendance = async () => {
      try {
        const res = await fetch('/api/admin/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId: id }),
        });
        if (res.ok) {
          setStatus('Attendance marked successfully!');
        } else {
          setStatus('Failed to mark attendance.');
        }
      } catch (error) {
        console.error(error);
        setStatus('An error occurred while marking attendance.');
      }
    };
    if (id) markAttendance();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl font-heading">{status}</h1>
    </div>
  );
}