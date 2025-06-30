'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { UsersPanel } from '@/components/simu-credit/UsersPanel';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    
    return <UsersPanel />;
}
