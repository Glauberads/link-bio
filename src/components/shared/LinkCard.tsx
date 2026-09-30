import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface LinkCardProps {
  href: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  highlight?: boolean;
  primaryCta?: boolean;
  className?: string;
}

export function LinkCard({ href, icon, title, subtitle, highlight, primaryCta, className }: LinkCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center w-full rounded-full border p-2 pr-6 transition-all duration-300 hover:-translate-y-1",
        primaryCta 
          ? "bg-primary border-primary shadow-[0_0_15px_rgba(245,138,31,0.4)]"
          : highlight 
            ? "bg-surface border-primary shadow-[0_0_15px_rgba(245,138,31,0.2)]" 
            : "bg-surface border-primary/35 hover:bg-primary/10",
        className
      )}
    >
      <div className="relative z-10 flex w-full items-center">
        {icon && (
          <div className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors",
            primaryCta 
              ? "bg-[#0A0806]/10 text-[#0A0806]" 
              : highlight 
                ? "bg-primary text-[#0A0806]" 
                : "bg-background border border-primary/30 text-primary"
          )}>
            {icon}
          </div>
        )}
        <div className="ml-4 flex flex-col items-start flex-1 text-left">
          <span className={cn(
            "text-sm font-bold",
            primaryCta ? "text-[#0A0806]" : "text-text"
          )}>{title}</span>
          
          {subtitle && (
            <span className={cn(
              "mt-0.5 text-xs flex items-center border-l-2 pl-2",
              primaryCta ? "text-[#0A0806]/80 border-[#0A0806]/40" : "text-text-muted border-primary"
            )}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
