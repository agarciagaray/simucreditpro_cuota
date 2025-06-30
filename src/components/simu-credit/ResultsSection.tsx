import type { SimulationResult } from '@/types';
import { ResultsDisplay } from './ResultsDisplay';
import { ChargesBreakdown } from './ChargesBreakdown';
import { AmortizationTable } from './AmortizationTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

type ResultsSectionProps = {
    results: SimulationResult;
    role: 'USER' | 'ADMIN';
};

export function ResultsSection({ results, role }: ResultsSectionProps) {
    return (
        <Card className="bg-card p-6 rounded-lg shadow-md mb-6 fade-in">
             <CardHeader className="p-0 pb-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <PieChart className="h-6 w-6" />
                    Resultados del Crédito
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <ResultsDisplay results={results} />
                
                {role === 'ADMIN' && (
                    <>
                        <ChargesBreakdown results={results} />
                        <AmortizationTable amortizationData={results.amortization} />
                    </>
                )}
            </CardContent>
        </Card>
    );
}
