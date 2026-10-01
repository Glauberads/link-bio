"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, FolderArchive, LogOut, Palette, Plug, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-primary/20 bg-surface z-50">
        <h1 className="font-title text-xl font-bold text-text italic">
          Conecta <span className="text-primary drop-shadow-[0_0_10px_rgba(245,138,31,0.5)]">Admin</span>
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-text">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`
        ${menuOpen ? 'flex' : 'hidden'} 
        md:flex w-full md:w-64 bg-surface md:border-r border-b md:border-b-0 border-primary/20 flex-col shrink-0
        absolute md:static top-[73px] bottom-0 left-0 right-0 z-40
      `}>
        <div className="hidden md:block p-6 border-b border-primary/10">
          <h1 className="font-title text-2xl font-bold text-text italic">
            Conecta <span className="text-primary drop-shadow-[0_0_10px_rgba(245,138,31,0.5)]">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <LayoutDashboard className="w-5 h-5 text-primary" /> Dashboard
          </Link>
          <Link href="/admin/personalizacao" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <Palette className="w-5 h-5 text-orange-400" /> Personalização
          </Link>
          <Link href="/admin/leads" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <Users className="w-5 h-5 text-blue-400" /> Leads & Waitlist
          </Link>
          <Link href="/admin/vendas" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <CreditCard className="w-5 h-5 text-green-400" /> Vendas (Asaas)
          </Link>
          <Link href="/admin/conteudo" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <FolderArchive className="w-5 h-5 text-purple-400" /> Biblioteca
          </Link>
          <Link href="/admin/integracoes" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all font-medium">
            <Plug className="w-5 h-5 text-pink-400" /> Integrações
          </Link>
        </nav>
        <div className="p-4 border-t border-primary/10 mt-auto">
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto md:w-[calc(100%-16rem)] relative">
        {children}
      </main>
    </div>
  );
}
