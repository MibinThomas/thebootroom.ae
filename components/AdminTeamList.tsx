"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Team {
  id: string;
  teamName: string;
  companyName: string;
  attendance: boolean;
  ticketUrl?: string | null;
  brandGuidelinesUrl?: string | null;
  logoUrl?: string | null;
}

/**
 * A table component listing all registered teams. Provides controls to toggle
 * attendance and links to view and download associated files. Data is
 * retrieved on the client via the admin API.
 */
export default function AdminTeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch('/api/admin/teams');
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const toggleAttendance = async (teamId: string, current: boolean) => {
    try {
      await fetch(`/api/admin/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: !current }),
      });
      setTeams((prev) =>
        prev.map((team) =>
          team.id === teamId ? { ...team, attendance: !current } : team
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Loading teams…</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr className="bg-[#1e1e2e]">
            <th className="px-3 py-2 text-left">Team Name</th>
            <th className="px-3 py-2 text-left">Company</th>
            <th className="px-3 py-2 text-center">Attendance</th>
            <th className="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {teams.map((team) => (
            <tr key={team.id}>
              <td className="px-3 py-2">{team.teamName}</td>
              <td className="px-3 py-2">{team.companyName}</td>
              <td className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={team.attendance}
                  onChange={() => toggleAttendance(team.id, team.attendance)}
                  className="h-4 w-4"
                />
              </td>
              <td className="px-3 py-2 text-center space-x-2">
                <Link href={`/admin/teams/${team.id}`} className="text-primary underline">
                  View
                </Link>
                {team.ticketUrl && (
                  <a
                    href={team.ticketUrl}
                    download
                    className="text-secondary underline"
                  >
                    Ticket
                  </a>
                )}
                {team.brandGuidelinesUrl && (
                  <a
                    href={team.brandGuidelinesUrl}
                    download
                    className="text-secondary underline"
                  >
                    Guidelines
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}