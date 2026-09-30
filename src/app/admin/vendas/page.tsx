import { prisma } from "@/lib/prisma";

export default async function VendasPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }});

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-text mb-8">Vendas (Asaas)</h2>
      
      <div className="bg-surface border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.05)]">
        <table className="w-full text-left text-sm text-text-muted">
          <thead className="bg-green-500/5 border-b border-green-500/20 text-text">
            <tr>
              <th className="p-4">ID Transação</th>
              <th className="p-4">E-mail Cliente</th>
              <th className="p-4">Valor</th>
              <th className="p-4">Status</th>
              <th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">Nenhuma venda encontrada.</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="border-b border-primary/10 hover:bg-green-500/5 transition-colors">
                <td className="p-4 font-medium text-text">{o.externalId}</td>
                <td className="p-4">{o.email}</td>
                <td className="p-4 text-green-400 font-bold">R$ {o.valor.toFixed(2).replace('.',',')}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${o.status === 'pago' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-primary/10 text-primary border-primary/30'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
