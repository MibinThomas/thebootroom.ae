import Link from "next/link";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-black/10 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/admin/teams" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-bootred/10 border border-bootred/20 flex items-center justify-center overflow-hidden">
              <img src="/bootroom-logo.png" alt="Bootroom" className="h-full w-full object-contain p-1.5" />
            </div>
            <div>
              <div className="font-display text-xl text-bootred leading-none">Admin</div>
              <div className="text-xs text-black/60">The Bootroom</div>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/admin/teams" className="text-sm font-semibold text-bootred hover:opacity-80">Teams</Link>
            <a href="/api/admin/logout" className="text-sm font-semibold text-black/70 hover:text-black">Logout</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 md:px-8 py-6">{children}</main>
    </div>
  );
}
