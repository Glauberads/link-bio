"use client";

import { useState } from "react";
import { Download, Trash2, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa?: string | null;
  interesse?: string | null;
  mensagem?: string | null;
  origem?: string | null;
  status: string;
  createdAt: string | Date;
}

interface WaitlistEntry {
  id: string;
  projectSlug: string;
  email: string;
  nome?: string | null;
  createdAt: string | Date;
}

export function LeadsClient({
  initialLeads,
  initialWaitlist,
}: {
  initialLeads: Lead[];
  initialWaitlist: WaitlistEntry[];
}) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [waitlist] = useState<WaitlistEntry[]>(initialWaitlist);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Função para exportar a lista em CSV (formato Excel Brasil com UTF-8 BOM e ponto-e-vírgula)
  const exportToCSV = () => {
    if (leads.length === 0) {
      alert("Nenhum lead para exportar.");
      return;
    }

    const headers = ["Nome", "E-mail", "WhatsApp", "Status", "Origem", "Interesse", "Mensagem", "Data"];
    const rows = leads.map((l) => [
      `"${(l.nome || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.telefone || "").replace(/"/g, '""')}"`,
      `"${(l.status || "").replace(/"/g, '""')}"`,
      `"${(l.origem || "").replace(/"/g, '""')}"`,
      `"${(l.interesse || "").replace(/"/g, '""')}"`,
      `"${(l.mensagem || "").replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString("pt-BR")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_gads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback("Lista exportada em CSV com sucesso!");
    setTimeout(() => setFeedback(null), 4000);
  };

  // Função para limpar todos os leads
  const handleClearAll = async () => {
    if (leads.length === 0) {
      alert("A lista já está vazia.");
      return;
    }

    const confirmed = window.confirm(
      `ATENÇÃO: Deseja realmente excluir TODOS os ${leads.length} leads cadastrados?\n\nEsta ação apagará os registros de teste e não poderá ser desfeita.`
    );

    if (!confirmed) return;

    setIsDeletingAll(true);
    try {
      const res = await fetch("/api/leads?all=true", { method: "DELETE" });
      if (res.ok) {
        setLeads([]);
        setFeedback("Todos os leads foram removidos com sucesso!");
        setTimeout(() => setFeedback(null), 4000);
      } else {
        alert("Erro ao limpar lista de leads.");
      }
    } catch (err) {
      alert("Erro de conexão ao tentar limpar os leads.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Função para excluir um lead individual
  const handleDeleteOne = async (id: string, nome: string) => {
    if (!window.confirm(`Excluir o lead "${nome}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        alert("Erro ao excluir lead.");
      }
    } catch {
      alert("Erro ao se conectar com o servidor.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {feedback && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Seção de Leads */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Últimos Leads (Orçamentos)
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-normal">
              {leads.length} {leads.length === 1 ? "lead" : "leads"}
            </span>
          </h3>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={leads.length === 0}
              className="px-4 py-2 bg-surface hover:bg-primary/20 text-text hover:text-primary border border-primary/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,138,31,0.1)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Exportar Lista
            </button>

            <button
              onClick={handleClearAll}
              disabled={leads.length === 0 || isDeletingAll}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeletingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Limpar Lista
            </button>
          </div>
        </div>

        <div className="bg-surface border border-primary/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(245,138,31,0.05)]">
          <table className="w-full text-left text-sm text-text-muted">
            <thead className="bg-primary/5 border-b border-primary/20 text-text">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-muted">
                    Nenhum lead encontrado. A lista está vazia.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-primary/10 hover:bg-primary/5 transition-colors group"
                  >
                    <td className="p-4 font-medium text-text">{l.nome}</td>
                    <td className="p-4">{l.email}</td>
                    <td className="p-4">{l.telefone || "-"}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-wider">
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(l.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteOne(l.id, l.nome)}
                        disabled={deletingId === l.id}
                        title="Excluir este lead"
                        className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        {deletingId === l.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção Waitlist */}
      <div>
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Inscritos na Waitlist
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-300 font-normal">
            {waitlist.length} {waitlist.length === 1 ? "inscrito" : "inscritos"}
          </span>
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
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Ninguém na waitlist ainda.
                  </td>
                </tr>
              ) : (
                waitlist.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b border-primary/10 hover:bg-blue-500/5 transition-colors"
                  >
                    <td className="p-4 font-bold text-blue-400 uppercase tracking-wider text-xs">
                      {w.projectSlug}
                    </td>
                    <td className="p-4 text-text">{w.nome || "-"}</td>
                    <td className="p-4">{w.email}</td>
                    <td className="p-4">{new Date(w.createdAt).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
