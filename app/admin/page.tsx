import dynamic from 'next/dynamic';

// Lazy-load the team list on the client only since it uses hooks
const AdminTeamList = dynamic(() => import('../../components/AdminTeamList'), { ssr: false });

export const metadata = {
  title: 'Admin Teams | The Bootroom',
};

export default function AdminPage() {
  return (
    <div>
      <h2 className="text-2xl font-heading mb-4">Registered Teams</h2>
      <AdminTeamList />
    </div>
  );
}