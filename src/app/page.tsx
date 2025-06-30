"use client";

import React from 'react';
import type { SimulationResult } from '@/types';
import { calculateLoan } from '@/lib/loan-calculator';
import { SimulatorForm, type FormData as SimulatorFormData } from '@/components/simu-credit/SimulatorForm';
import { ResultsSection } from '@/components/simu-credit/ResultsSection';
import { useAppContext } from '@/context/AppContext';
import { useCreditProfiles } from '@/hooks/use-credit-profiles';
import { Loader2 } from 'lucide-react';

export default function SimulatorPage() {
    const { currentUser } = useAppContext();
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

    if (!isLoaded || !currentUser) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <SimulatorForm profiles={profiles} onSubmit={handleCalculate} isLoading={isLoading} />
            
            <div ref={resultsRef}>
                {simulationResult && (
                    <ResultsSection results={simulationResult} role={currentUser.role} />
                )}
            </div>
        </>
    );
}
