"use client";

import React from 'react';
import type { SimulationResult } from '@/types';
import { calculateLoan } from '@/lib/loan-calculator';
import { SimulatorForm, type FormData as SimulatorFormData } from '@/components/simu-credit/SimulatorForm';
import { ResultsSection } from '@/components/simu-credit/ResultsSection';
import { useAppContext } from '@/context/AppContext';
import { useCreditProfiles } from '@/hooks/use-credit-profiles';
import { Loader2, UserCog } from 'lucide-react';

export default function SimulatorPage() {
    const { role } = useAppContext();
    const { profiles, isLoaded } = useCreditProfiles();
    const [simulationResult, setSimulationResult] = React.useState<SimulationResult | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const resultsRef = React.useRef<HTMLDivElement>(null);

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

    if (!isLoaded) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="bg-card p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center border">
                <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <UserCog className="text-primary" />
                        Modo {role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {role === 'ADMIN'
                            ? 'Simule y navegue a otras secciones desde el menú.'
                            : 'Simule y calcule sus préstamos de forma sencilla.'}
                    </p>
                </div>
                {isLoading && <Loader2 className="animate-spin text-primary" />}
            </div>

            <SimulatorForm profiles={profiles} onSubmit={handleCalculate} isLoading={isLoading} />
            
            <div ref={resultsRef}>
                {simulationResult && (
                    <ResultsSection results={simulationResult} role={role} />
                )}
            </div>
        </>
    );
}
