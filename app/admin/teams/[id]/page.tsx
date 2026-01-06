"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Player {
  name: string;
  jerseySize: string;
  preferredPosition: string;
}

interface Team {
  id: string;
  teamName: string;
  companyName: string;
  companySector: string;
  companyAddress: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  players: Player[];
  attendance: boolean;
  logoUrl?: string | null;
  brandGuidelinesUrl?: string | null;
  ticketUrl?: string | null;
}

/**
 * Detailed view for a single team. Fetches the team record from the API using
 * the dynamic route parameter and displays all associated data and files.
 */
export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`/api/admin/teams/${id}`);
        const data = await res.json();
        setTeam(data.team);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTeam();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!team) return <p>Team not found.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-heading">{team.teamName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-heading mb-2">Company Details</h3>
          <p>
            <strong>Company Name:</strong> {team.companyName}
          </p>
          <p>
            <strong>Sector:</strong> {team.companySector}
          </p>
          <p>
            <strong>Address:</strong> {team.companyAddress}
          </p>
          <h3 className="text-xl font-heading mt-4 mb-2">Contacts</h3>
          <p>
            <strong>Manager:</strong> {team.managerName} ({team.managerEmail}, {team.managerPhone})
          </p>
          <p>
            <strong>Captain:</strong> {team.captainName} ({team.captainEmail}, {team.captainPhone})
          </p>
        </div>
        <div>
          <h3 className="text-xl font-heading mb-2">Players</h3>
          <ul className="list-disc list-inside space-y-1">
            {team.players.map((p, idx) => (
              <li key={idx}>
                {p.name} - Size {p.jerseySize}
                {p.preferredPosition && ` (${p.preferredPosition})`}
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-heading mt-4 mb-2">Files</h3>
          <ul className="list-disc list-inside space-y-1">
            {team.logoUrl && (
              <li>
                <a href={team.logoUrl} download className="text-primary underline">
                  Company Logo
                </a>
              </li>
            )}
            {team.brandGuidelinesUrl && (
              <li>
                <a href={team.brandGuidelinesUrl} download className="text-primary underline">
                  Brand Guidelines
                </a>
              </li>
            )}
            {team.ticketUrl && (
              <li>
                <a href={team.ticketUrl} download className="text-primary underline">
                  Ticket
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}