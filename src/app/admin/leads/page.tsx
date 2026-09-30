import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }});
  const waitlist = await prisma.waitlistEntry.findMany({ orderBy: { createdAt: 'desc' }});

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-text mb-8">Leads & Waitlist</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Últimos Leads (Orçamentos)
          </h3>
          <div className="bg-surface border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,138,31,0.05)]">
            <table className="w-full text-left text-sm text-text-muted">
              <thead className="bg-primary/5 border-b border-primary/20 text-text">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center">Nenhum lead encontrado.</td></tr>
                ) : leads.map(l => (
                  <tr key={l.id} className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <td className="p-4 font-medium text-text">{l.nome}</td>
                    <td className="p-4">{l.email}</td>
                    <td className="p-4">{l.telefone || '-'}</td>
                    <td className="p-4"><span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider">{l.status}</span></td>
                    <td className="p-4">{new Date(l.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Inscritos na Waitlist
          </h3>
          <div className="bg-surface border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(96,165,250,0.05)]">
            <table className="w-full text-left text-sm text-text-muted">
              <thead className="bg-blue-500/5 border-b border-blue-500/20 text-text">
                <tr>
                  <th className="p-4">Projeto</th>
                  <th className="p-4">Nome</th>
                  <th className="p-4">E-mail</th>
                  <th className="p-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center">Ninguém na waitlist ainda.</td></tr>
                ) : waitlist.map(w => (
                  <tr key={w.id} className="border-b border-primary/10 hover:bg-blue-500/5 transition-colors">
                    <td className="p-4 font-bold text-blue-400 uppercase tracking-wider text-xs">{w.projectSlug}</td>
                    <td className="p-4 text-text">{w.nome || '-'}</td>
                    <td className="p-4">{w.email}</td>
                    <td className="p-4">{new Date(w.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
