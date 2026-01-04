import VerifyClient from "./verify-client";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  await requireAdmin(); // ✅ page requires admin login

  const sp = await searchParams;
  const code = (sp.code || "").trim();

  return (
    <main className="min-h-screen bg-bootred p-4 md:p-10">
      <div className="mx-auto max-w-xl">
        <VerifyClient code={code} />
      </div>
    </main>
  );
}
