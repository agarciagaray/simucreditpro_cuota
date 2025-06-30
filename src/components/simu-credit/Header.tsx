import { LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
    role: 'USER' | 'ADMIN';
    toggleRole: () => void;
};

export function Header({ role, toggleRole }: HeaderProps) {
    const username = "Juan Pérez";

    return (
        <header className="bg-primary text-primary-foreground shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <LineChart className="h-7 w-7 mr-3" />
                    <h1 className="text-xl font-bold">SimuCredit Pro</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm">Bienvenido, <span className="font-semibold">{username}</span></p>
                      <p className="text-xs text-primary-foreground/80">Rol Actual: {role}</p>
                    </div>
                    <Button onClick={toggleRole} className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground">
                        Cambiar Rol
                    </Button>
                </div>
            </div>
        </header>
    );
}
