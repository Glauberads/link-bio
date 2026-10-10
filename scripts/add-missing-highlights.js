const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_HIGHLIGHTS = [
    { id: "tiktok", iconName: 'Music2', label: "TikTok", color: "text-primary", bg: "bg-surface", border: "border-primary/20" },
    { id: "instagram", iconName: 'Camera', label: "Instagram", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10", border: "border-[#E1306C]/20" },
    { id: "whatsapp", iconName: 'MessageCircle', label: "WhatsApp", color: "text-[#25D366]", bg: "bg-[#25D366]/10", border: "border-[#25D366]/20" },
    { id: "youtube", iconName: 'Play', label: "YouTube", color: "text-[#FF0000]", bg: "bg-[#FF0000]/10", border: "border-[#FF0000]/20" },
    { id: "orcamento", iconName: 'Laptop', label: "Orçamento", color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
    { id: "siteOficial", iconName: 'Globe', label: "Site Oficial", color: "text-[#00A859]", bg: "bg-[#00A859]/10", border: "border-[#00A859]/20" },
    { id: "sistemas", iconName: 'Briefcase', label: "Sistemas", color: "text-[#8D6E63]", bg: "bg-[#8D6E63]/10", border: "border-[#8D6E63]/20" },
    { id: "siteGenClone", iconName: 'Code', label: "SiteGenClone", color: "text-[#E91E63]", bg: "bg-[#E91E63]/10", border: "border-[#E91E63]/20" },
    { id: "projetos", iconName: 'FolderOpen', label: "Projetos", color: "text-[#4CAF50]", bg: "bg-[#4CAF50]/10", border: "border-[#4CAF50]/20" },
    { id: "github", iconName: 'Code', label: "GitHub", color: "text-[#9E9E9E]", bg: "bg-[#9E9E9E]/10", border: "border-[#9E9E9E]/20" },
    { id: "dicas", iconName: 'Diamond', label: "Dicas IA", color: "text-[#2196F3]", bg: "bg-[#2196F3]/10", border: "border-[#2196F3]/20" },
];

async function main() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  if (config && config.fixedLinksConfig) {
    const fixedLinks = config.fixedLinksConfig;
    const currentHighlights = fixedLinks.highlights || [];
    const currentIds = currentHighlights.map(h => h.id);
    
    let added = false;
    for (const h of DEFAULT_HIGHLIGHTS) {
      if (!currentIds.includes(h.id)) {
        currentHighlights.push({ ...h, visible: false }); // Add as hidden by default
        added = true;
      }
    }

    if (added) {
      fixedLinks.highlights = currentHighlights;
      await prisma.siteConfig.update({
        where: { id: 1 },
        data: { fixedLinksConfig: fixedLinks }
      });
      console.log('Missing highlights added to DB successfully.');
    } else {
      console.log('No missing highlights to add.');
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
