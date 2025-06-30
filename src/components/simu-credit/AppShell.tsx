'use client'

import { useAppContext } from "@/context/AppContext";
import { Header } from "@/components/simu-credit/Header";
import { Footer } from "@/components/simu-credit/Footer";
import { LoginPage } from "./LoginPage";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
