import RegisterForm from "@/components/register/RegisterForm";
export const metadata = { title: "The Bootroom | Team Registration", description: "Register your team for The Bootroom event (10 players required)." };
export default function RegisterPage(){
  return (
    <main className="min-h-screen p-4 md:p-10 bg-cream">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-2xl border border-bootred/20 bg-bootred shadow-soft p-5 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-xl bg-white/10 border border-white/15 shadow-soft flex items-center justify-center overflow-hidden shrink-0">
                <img src="/bootroom-logo.png" alt="The Bootroom Logo" className="h-full w-full object-contain p-2" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white leading-tight">Team Registration</h1>
                <p className="mt-1 text-sm sm:text-base text-white/80">Complete the form below to register your team. 10 players are required.</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-cream border border-bootgold/30 px-4 py-2 self-start md:self-auto">
              <span className="h-2 w-2 rounded-full bg-bootgold" />
              <span className="text-xs md:text-sm text-bootbrown">Retro • Premium • Responsive</span>
            </div>
          </div>
        </header>
        <section className="mt-6"><RegisterForm /></section>
        <footer className="mt-10 pb-8 text-center text-xs text-black/50">© {new Date().getFullYear()} The Bootroom. All rights reserved.</footer>
      </div>
    </main>
  );
}
