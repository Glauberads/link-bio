import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  style: ["normal"],
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  let config = null;
  try { config = await prisma.siteConfig.findFirst({ where: { id: 1 } }); } catch {}
  
  return {
    title: config?.seoTitle || "FFR Conecta | G-ADS",
    description: config?.seoDescription || "Tecnologia, marketing e automação para escalar negócios.",
    icons: {
      icon: config?.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title: config?.seoTitle || "FFR Conecta | G-ADS",
      description: config?.seoDescription || "Tecnologia, marketing e automação para escalar negócios.",
      images: config?.seoImageUrl ? [config.seoImageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: config?.seoTitle || "FFR Conecta | G-ADS",
      description: config?.seoDescription || "Tecnologia, marketing e automação para escalar negócios.",
      images: config?.seoImageUrl ? [config.seoImageUrl] : [],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let config = null;
  try { config = await prisma.siteConfig.findFirst({ where: { id: 1 } }); } catch {}
  
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${oswald.variable} h-full antialiased dark`}>
      <head>
        {config?.metaPixelId && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${config.metaPixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${config.metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
