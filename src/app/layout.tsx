import { AppShell } from "@/components/simu-credit/AppShell";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/AppContext";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimuCredit Pro",
  description: "Simulador de créditos y cálculo de amortización",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
        />
      </head>
      <body className="font-body bg-background antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
