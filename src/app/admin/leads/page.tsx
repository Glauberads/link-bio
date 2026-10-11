import { prisma } from "@/lib/prisma";
import { LeadsClient } from "./LeadsClient";

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }});
  const waitlist = await prisma.waitlistEntry.findMany({ orderBy: { createdAt: 'desc' }});

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-text mb-8">Leads & Waitlist</h2>
      
      <LeadsClient initialLeads={leads} initialWaitlist={waitlist} />
    </div>
  );
}
