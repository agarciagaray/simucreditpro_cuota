'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, ShieldAlert } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function UsersPage() {
    const { role } = useAppContext();
    
    if (role === 'USER') {
        return (
            <Card className="m-auto max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <ShieldAlert />
                        Acceso Denegado
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No tiene permisos para acceder a esta sección.</p>
                    <Button asChild className="mt-4">
                        <Link href="/">Volver al Simulador</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="m-auto max-w-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users />
                    Gestión de Usuarios
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>Esta sección está en construcción.</p>
                <p className="text-muted-foreground text-sm mt-2">Aquí podrá gestionar los usuarios de la aplicación en el futuro.</p>
                 <Button asChild className="mt-4">
                    <Link href="/">Volver al Simulador</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
