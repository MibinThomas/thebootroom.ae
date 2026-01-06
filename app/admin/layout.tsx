export const metadata = {
  title: 'Admin Dashboard | The Bootroom',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <nav className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-heading uppercase text-primary">Admin Dashboard</h1>
      </nav>
      <main>{children}</main>
    </div>
  );
}