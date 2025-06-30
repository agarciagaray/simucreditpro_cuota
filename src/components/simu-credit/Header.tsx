import Link from 'next/link';
import { LineChart, Settings, Users, Calculator, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppContext } from '@/context/AppContext';

export function Header() {
    const { currentUser, logout } = useAppContext();

    if (!currentUser) return null;

    const { name, role } = currentUser;

    return (
        <header className="bg-primary text-primary-foreground shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <LineChart className="h-7 w-7 mr-3" />
                    <h1 className="text-xl font-bold">SimuCredit Pro</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm">Bienvenido, <span className="font-semibold">{name}</span></p>
                      <p className="text-xs text-primary-foreground/80">Rol Actual: {role}</p>
                    </div>

                    {role === 'ADMIN' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20">
                                    Menú Admin
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background text-foreground">
                                <DropdownMenuItem asChild>
                                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                                      <Calculator className="h-4 w-4" /> Simulador
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profiles" className="flex items-center gap-2 cursor-pointer">
                                        <Settings className="h-4 w-4" /> Perfiles de Crédito
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/users" className="flex items-center gap-2 cursor-pointer">
                                        <Users className="h-4 w-4" /> Usuarios
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    
                    <Button onClick={logout} variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </header>
    );
}
