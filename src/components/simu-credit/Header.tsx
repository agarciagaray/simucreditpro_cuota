import { useAppContext } from "@/context/AppContext";
import { LineChart, LogOut } from "lucide-react";
import Link from "next/link";

export function Header() {
  const { currentUser, logout } = useAppContext();

  if (!currentUser) return null;

  const { name, role } = currentUser;

  return (
    <header className="bg-skote-dark text-white shadow-md border-b border-skote-secondary/20">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center min-h-[56px]">
        <div className="flex items-center gap-3">
          <LineChart className="h-8 w-8 text-skote-primary" />
          <span className="text-xl font-bold tracking-tight font-poppins">
            SimuCredit Pro
          </span>
        </div>
        <nav className="flex-1 flex justify-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold hover:text-skote-primary transition"
          >
            Simulador
          </Link>
          {role === "ADMIN" && (
            <>
              <Link
                href="/profiles"
                className="text-sm font-semibold hover:text-skote-primary transition"
              >
                Perfiles
              </Link>
              <Link
                href="/users"
                className="text-sm font-semibold hover:text-skote-primary transition"
              >
                Usuarios
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-tight">{name}</p>
            <p className="text-[11px] text-skote-secondary">{role}</p>
          </div>
          <button
            onClick={logout}
            className="bg-skote-danger hover:bg-skote-danger/90 text-white rounded-md px-4 py-2 font-semibold shadow transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
