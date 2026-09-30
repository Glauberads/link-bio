import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await auth();
  
  const leadsCount = await prisma.lead.count();
  const waitlistCount = await prisma.waitlistEntry.count();
  const clickCount = await prisma.clickEvent.count();

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text mb-2">Visão Geral</h2>
        <p className="text-text-muted">Bem-vindo, {session?.user?.email}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(245,138,31,0.05)] hover:border-primary/40 transition-colors">
          <h3 className="text-text-muted font-medium mb-1">Total de Leads</h3>
          <p className="text-4xl font-bold text-text drop-shadow-[0_0_10px_rgba(245,138,31,0.3)]">{leadsCount}</p>
        </div>
        <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(245,138,31,0.05)] hover:border-primary/40 transition-colors">
          <h3 className="text-text-muted font-medium mb-1">Inscritos Waitlist</h3>
          <p className="text-4xl font-bold text-text drop-shadow-[0_0_10px_rgba(245,138,31,0.3)]">{waitlistCount}</p>
        </div>
        <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(245,138,31,0.05)] hover:border-primary/40 transition-colors">
          <h3 className="text-text-muted font-medium mb-1">Eventos Capturados</h3>
          <p className="text-4xl font-bold text-text drop-shadow-[0_0_10px_rgba(245,138,31,0.3)]">{clickCount}</p>
        </div>
      </div>
    </div>
  );
}
