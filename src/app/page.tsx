import Link from "next/link";
export default function Home(){
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/70 backdrop-blur rounded-2xl shadow-soft border border-black/10 p-8">
        <h1 className="font-display text-3xl text-bootred">The Bootroom</h1>
        <p className="mt-3 text-sm text-black/70">Step 3: Admin Panel.</p>
        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href="/register" className="rounded-2xl bg-bootred px-5 py-3 text-white font-semibold shadow-soft">Registration</Link>
          <Link href="/admin/login" className="rounded-2xl bg-white px-5 py-3 text-bootred font-semibold border border-bootred/30">Admin Login</Link>
        </div>
      </div>
    </main>
  );
}
