import Link from "next/link";
export default async function SuccessPage({ searchParams }:{ searchParams: Promise<{ token?: string }> }){
  const sp = await searchParams;
  const token = sp.token;
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white/80 backdrop-blur rounded-2xl shadow-soft border border-black/10 p-8">
        <h1 className="font-display text-3xl text-bootred">Registration Received</h1>
        <p className="mt-3 text-sm text-black/70">Your ticket PDF is ready. Download it and keep it for entry verification.</p>
        {token ? (
          <div className="mt-5 rounded-2xl border border-black/10 bg-cream p-4">
            <div className="text-xs text-black/60">Ticket Download</div>
            <a className="mt-2 inline-flex items-center justify-center rounded-2xl bg-bootred px-5 py-3 text-white font-semibold shadow-soft hover:opacity-95" href={`/api/ticket/${token}`} target="_blank" rel="noreferrer">
              Download Ticket PDF
            </a>
          </div>
        ) : <p className="mt-5 text-sm text-bootbrown">Missing token. Please submit the form again.</p>}
        <div className="mt-6 flex gap-3">
          <Link href="/register" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-bootred font-semibold border border-bootred/30 hover:bg-white/80">Back to Registration</Link>
        </div>
      </div>
    </main>
  );
}
