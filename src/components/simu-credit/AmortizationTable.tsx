import type { AmortizationRow } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type AmortizationTableProps = {
    amortizationData: AmortizationRow[];
};

export function AmortizationTable({ amortizationData }: AmortizationTableProps) {
    const { toast } = useToast();

    const downloadCsv = () => {
        if (amortizationData.length === 0) {
            toast({
                title: "No hay datos para descargar",
                description: "Realice un cálculo primero.",
                variant: 'destructive',
            });
            return;
        }

        const headers = ["Periodo", "Saldo Inicial", "Capital + Interes", "Amortizacion", "Interes", "Seguro", "Cuota Total", "Saldo Final"];
        const csvContent = [
            headers.join(','),
            ...amortizationData.map(row => [
                row.periodo,
                Math.round(row.saldoInicial),
                Math.round(row.cuotaPI),
                Math.round(row.amortizacion),
                Math.round(row.interes),
                Math.round(row.seguroPeriodo),
                Math.round(row.cuotaTotal),
                Math.round(row.saldoFinal)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "tabla_amortizacion.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const exportPdf = () => {
        if (amortizationData.length === 0) {
            toast({
                title: "No hay datos para exportar",
                description: "Realice un cálculo primero.",
                variant: 'destructive',
            });
            return;
        }

        const doc = new jsPDF();
        
        const tableColumns = ['Periodo', 'Saldo Inicial', 'Interés', 'Cuota', 'Amortización', 'Saldo Final'];
        
        const formatForPdf = (value: number) => value.toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        
        const tableRows = amortizationData.map(row => [
            row.periodo.toString(),
            formatForPdf(row.saldoInicial),
            formatForPdf(row.interes),
            formatForPdf(row.cuotaPI),
            formatForPdf(row.amortizacion),
            formatForPdf(row.saldoFinal),
        ]);

        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            theme: 'grid',
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'right' },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
            },
            didDrawPage: (data) => {
                const pageHeight = doc.internal.pageSize.getHeight();
                const pageWidth = doc.internal.pageSize.getWidth();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    'Este es un documento informativo y no representa una obligación contractual. Los valores son aproximados.',
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }
        });
        
        doc.save('tabla_amortizacion.pdf');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Tabla de Amortización</h3>
                <div className="flex gap-2">
                    <Button onClick={downloadCsv} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />Descargar CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportPdf}>
                        <FileText className="mr-2 h-4 w-4" />Exportar PDF
                    </Button>
                </div>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                    <TableHeader className="sticky top-0 bg-muted/50 z-10 backdrop-blur-sm">
                        <TableRow>
                            <TableHead className="text-center">#</TableHead>
                            <TableHead className="text-right">Saldo Inicial</TableHead>
                            <TableHead className="text-right">Capital+Int.</TableHead>
                            <TableHead className="text-right">Amortización</TableHead>
                            <TableHead className="text-right">Interés</TableHead>
                            <TableHead className="text-right">Seguro</TableHead>
                            <TableHead className="text-right">Cuota Total</TableHead>
                            <TableHead className="text-right">Saldo Final</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {amortizationData.map((row) => (
                            <TableRow key={row.periodo}>
                                <TableCell className="font-medium text-center">{row.periodo}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.saldoInicial)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.cuotaPI)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.amortizacion)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.interes)}</TableCell>
                                <TableCell className="text-right text-red-600">{formatCurrency(row.seguroPeriodo)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(row.cuotaTotal)}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(row.saldoFinal)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
