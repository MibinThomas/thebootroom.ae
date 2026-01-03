import AdminLoginForm from "@/components/admin/AdminLoginForm";
export const metadata = { title: "Admin Login | The Bootroom" };
export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="max-w-md w-full bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-black/10 p-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-bootred/10 border border-bootred/20 flex items-center justify-center overflow-hidden">
            <img src="/bootroom-logo.png" alt="Bootroom" className="h-full w-full object-contain p-2" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-bootred">Admin Login</h1>
            <p className="text-xs text-black/60">Secure access to registrations</p>
          </div>
        </div>
        <div className="mt-6"><AdminLoginForm /></div>
      </div>
    </main>
  );
}
