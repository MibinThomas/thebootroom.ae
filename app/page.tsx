import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-12 text-center space-y-8">
      <p className="text-2xl md:text-3xl font-heading uppercase text-primary">
        Join Dubai’s premier corporate football tournament
      </p>
      <p className="text-lg md:text-xl">
        Register your team now and showcase your company’s sporting prowess on the pitch!
      </p>
      <Link href="/register">
        <button className="bg-secondary hover:bg-accent text-background font-heading py-3 px-8 rounded shadow transition-colors">
          Register Now
        </button>
      </Link>
    </div>
  );
}