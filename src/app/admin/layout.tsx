"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, FolderArchive, LogOut, Palette, Plug } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-surface border-r border-primary/20 flex flex-col">
        <div className="p-6 border-b border-primary/10">
          <h1 className="font-title text-2xl font-bold text-text italic">
            Conecta <span className="text-primary drop-shadow-[0_0_10px_rgba(245,138,31,0.5)]">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Dashboard
          </Link>
          <Link href="/admin/personalizacao" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <Palette className="w-5 h-5 text-orange-400" /> Personalização
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <Users className="w-5 h-5 text-blue-400" /> Leads & Waitlist
          </Link>
          <Link href="/admin/vendas" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <CreditCard className="w-5 h-5 text-green-400" /> Vendas (Asaas)
          </Link>
          <Link href="/admin/conteudo" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <FolderArchive className="w-5 h-5 text-purple-400" /> Biblioteca
          </Link>
          <Link href="/admin/integracoes" className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <Plug className="w-5 h-5 text-pink-400" /> Integrações
          </Link>
        </nav>
        <div className="p-4 border-t border-primary/10">
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
