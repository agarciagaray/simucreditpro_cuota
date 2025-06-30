"use client";

import React from 'react';
import type { CreditProfiles, SimulationResult } from '@/types';
import { calculateLoan } from '@/lib/loan-calculator';
import { Header } from '@/components/simu-credit/Header';
import { Footer } from '@/components/simu-credit/Footer';
import { AdminPanel } from '@/components/simu-credit/AdminPanel';
import { SimulatorForm, type FormData as SimulatorFormData } from '@/components/simu-credit/SimulatorForm';
import { ResultsSection } from '@/components/simu-credit/ResultsSection';
import { UserCog, Loader2 } from 'lucide-react';

const initialCreditProfiles: CreditProfiles = {
    A: { tasa: 1.91, afianzamiento: 16.00, diasCarencia: 60, seguro: 0.45, corredor: 7.00 },
    B: { tasa: 1.91, afianzamiento: 20.00, diasCarencia: 60, seguro: 0.45, corredor: 7.00 },
    C: { tasa: 1.91, afianzamiento: 24.00, diasCarencia: 60, seguro: 1.40, corredor: 7.00 }
};

export default function Home() {
    const [role, setRole] = React.useState<'USER' | 'ADMIN'>('USER');
    const [profiles, setProfiles] = React.useState<CreditProfiles>(initialCreditProfiles);
    const [simulationResult, setSimulationResult] = React.useState<SimulationResult | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);
    const resultsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setIsClient(true);
        try {
            const savedProfiles = localStorage.getItem('creditProfiles');
            if (savedProfiles) {
                setProfiles(JSON.parse(savedProfiles));
            }
        } catch (error) {
            console.error("Failed to parse profiles from localStorage", error);
            localStorage.removeItem('creditProfiles');
        }
    }, []);

    const toggleRole = () => setRole(prev => (prev === 'USER' ? 'ADMIN' : 'USER'));

    const handleProfilesChange = (newProfiles: CreditProfiles) => {
        setProfiles(newProfiles);
    };

    const handleCalculate = (data: SimulatorFormData) => {
        setIsLoading(true);
        setSimulationResult(null);

        setTimeout(() => {
            try {
                const profile = profiles[data.profile];
                if (!profile) throw new Error("Profile not found");

                const result = calculateLoan(
                    profile,
                    parseFloat(data.paymentValue),
                    parseInt(data.termMonths),
                    data.insuranceType
                );
                setSimulationResult(result);
                setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }, 500);
    };

    if (!isClient) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header role={role} toggleRole={toggleRole} />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="bg-card p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center border">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <UserCog className="text-primary" />
                            Modo {role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {role === 'ADMIN'
                                ? 'Configure perfiles y vea detalles avanzados de simulación.'
                                : 'Simule y calcule sus préstamos de forma sencilla.'}
                        </p>
                    </div>
                    {isLoading && <Loader2 className="animate-spin text-primary" />}
                </div>

                {role === 'ADMIN' && <AdminPanel profiles={profiles} onProfilesChange={handleProfilesChange} />}

                <SimulatorForm profiles={profiles} onSubmit={handleCalculate} isLoading={isLoading} />
                
                <div ref={resultsRef}>
                    {simulationResult && (
                        <ResultsSection results={simulationResult} role={role} />
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
