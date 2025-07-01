import type { SimulationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type ResultsDisplayProps = {
    results: SimulationResult;
};

export function ResultsDisplay({ results }: ResultsDisplayProps) {
    const monthlyInsurance = results.amortization?.[0]?.seguroPeriodo;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 dark:bg-blue-900/20 p-4 border-blue-200 dark:border-blue-800">
                <h3 className="text-sm text-blue-600 dark:text-blue-400 font-medium uppercase">Valor Total del Crédito</h3>
                <p className="text-2xl font-bold">{formatCurrency(results.valorActual)}</p>
                <p className="text-xs text-muted-foreground">Monto base financiado</p>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 p-4 border-green-200 dark:border-green-800">
                <h3 className="text-sm text-green-600 dark:text-green-400 font-medium uppercase">Cuota Total Mensual Fija</h3>
                <p className="text-2xl font-bold">{formatCurrency(results.cuotaTotalFija)}</p>
                <p className="text-xs text-muted-foreground">Capital + Interés + Seguro</p>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 p-4 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-sm text-yellow-600 dark:text-yellow-400 font-medium uppercase">Valor Seguro Mensual</h3>
                <p className="text-2xl font-bold">{formatCurrency(monthlyInsurance)}</p>
                <p className="text-xs text-muted-foreground">Valor fijo durante el crédito</p>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/20 p-4 border-purple-200 dark:border-purple-800">
                <h3 className="text-sm text-purple-600 dark:text-purple-400 font-medium uppercase">Valor a Entregar al Cliente</h3>
                <p className="text-2xl font-bold">{formatCurrency(results.valorAEntregar)}</p>
                <p className="text-xs text-muted-foreground">Monto neto a recibir</p>
            </Card>
        </div>
    );
}
