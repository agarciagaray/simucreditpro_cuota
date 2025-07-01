import type { SimulationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type AmortizationTableProps = {
    results: SimulationResult;
};

export function AmortizationTable({ results }: AmortizationTableProps) {
    const { toast } = useToast();
    const { amortization } = results;

    const downloadCsv = () => {
        if (amortization.length === 0) {
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
            ...amortization.map(row => [
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
        if (!results || amortization.length === 0) {
            toast({ title: "No hay datos para exportar", variant: 'destructive' });
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        const formatForPdf = (value: number) => Math.round(value).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const formatCurrencyPdf = (value: number) => `$ ${formatForPdf(value)}`;

        // --- HEADER ---
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#3B82F6'); // theme.colors.primary
        doc.text('SimuCredit Pro', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Reporte de Simulación de Crédito', pageWidth / 2, 28, { align: 'center' });
        const generationDate = new Date().toLocaleString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
        doc.text(`Generado el: ${generationDate}`, pageWidth / 2, 33, { align: 'center' });
        doc.setDrawColor('#3B82F6');
        doc.setLineWidth(0.5);
        doc.line(14, 38, pageWidth - 14, 38);

        // --- SUMMARY CARDS ---
        autoTable(doc, {
            startY: 45,
            theme: 'grid',
            body: [
                [
                    { content: 'TOTAL PRÉSTAMO', styles: { halign: 'center', fontSize: 8, textColor: '#3B82F6', fontStyle: 'bold' } },
                    { content: 'CUOTA FIJA MENSUAL', styles: { halign: 'center', fontSize: 8, textColor: '#3B82F6', fontStyle: 'bold' } },
                    { content: 'VALOR SEGURO MENSUAL', styles: { halign: 'center', fontSize: 8, textColor: '#3B82F6', fontStyle: 'bold' } },
                    { content: 'VALOR A ENTREGAR', styles: { halign: 'center', fontSize: 8, textColor: '#3B82F6', fontStyle: 'bold' } },
                ],
                [
                    { content: formatCurrencyPdf(results.valorActual), styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' } },
                    { content: formatCurrencyPdf(results.cuotaTotalFija), styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' } },
                    { content: formatCurrencyPdf(results.seguroMensualFijo), styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' } },
                    { content: formatCurrencyPdf(results.valorAEntregar), styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' } },
                ],
            ],
            styles: { cellPadding: 5, lineWidth: 0.2, lineColor: [226, 232, 240] },
            margin: { left: 14, right: 14 },
        });

        let finalY = (doc as any).lastAutoTable.finalY + 10;

        // --- DETAILS TITLE ---
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#3B82F6');
        doc.text('Detalles de la Simulación', 14, finalY);
        finalY += 6;

        // --- DETAILS TABLE ---
        autoTable(doc, {
            startY: finalY,
            body: [
                ['Perfil de Crédito', results.perfil.name],
                ['Monto Solicitado', formatCurrencyPdf(results.valorActual)],
                ['Plazo', `${results.plazoMeses} meses`],
                ['Tasa Interés N.M.V.', `${results.perfil.tasa.toFixed(2)}%`],
            ],
            theme: 'plain',
            styles: {
                cellPadding: { top: 1.5, right: 4, bottom: 1.5, left: 4 },
                fontSize: 9,
            },
            columnStyles: {
                0: { halign: 'left', textColor: [64, 64, 64] },
                1: { halign: 'right', textColor: [0,0,0], fontStyle: 'bold' },
            },
            alternateRowStyles: { fillColor: [241, 245, 249] }, // slate-100
            margin: { left: 14, right: 14 },
        });

        finalY = (doc as any).lastAutoTable.finalY + 10;

        // --- CHARGES TITLE ---
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#3B82F6');
        doc.text('Desglose de Cargos Adicionales', 14, finalY);
        finalY += 6;

        // --- CHARGES TABLE ---
        autoTable(doc, {
            startY: finalY,
            body: [
                [`Afianzamiento (${results.perfil.afianzamiento.toFixed(2)}%)`, formatCurrencyPdf(results.afianzamientoValor)],
                [`IVA del Afianzamiento (19.00%)`, formatCurrencyPdf(results.ivaAfianzamientoValor)],
                [`Interés de Carencia (${results.perfil.diasCarencia} días)`, formatCurrencyPdf(results.interesCarenciaValor)],
                [`Seguro (${results.perfil.seguro.toFixed(2)}%)`, formatCurrencyPdf(results.seguroValor)],
                [`Corredor Autorizado (${results.perfil.corredor.toFixed(2)}%)`, formatCurrencyPdf(results.corredorValor)],
            ],
            theme: 'plain',
            styles: {
                cellPadding: { top: 1.5, right: 4, bottom: 1.5, left: 4 },
                fontSize: 9,
            },
            columnStyles: {
                0: { halign: 'left', textColor: [64, 64, 64] },
                1: { halign: 'right', textColor: [0,0,0], fontStyle: 'bold' },
            },
            alternateRowStyles: { fillColor: [241, 245, 249] },
            margin: { left: 14, right: 14 },
        });

        finalY = (doc as any).lastAutoTable.finalY + 10;

        // --- AMORTIZATION TABLE (PDF Version) ---
        const amortizationBodyPdf = amortization.map(row => [
            row.periodo,
            formatForPdf(row.saldoInicial),
            formatForPdf(row.cuotaPI),
            formatForPdf(row.amortizacion),
            formatForPdf(row.interes),
            formatForPdf(row.seguroPeriodo),
            formatForPdf(row.cuotaTotal),
            formatForPdf(row.saldoFinal)
        ]);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#3B82F6');
        doc.text('Tabla de Amortización', 14, finalY);

        autoTable(doc, {
            startY: finalY + 5,
            head: [['#', 'S. Inicial', 'Cap+Int', 'Amort.', 'Interés', 'Seguro', 'Cuota T.', 'S. Final']],
            body: amortizationBodyPdf,
            theme: 'grid',
            headStyles: { fillColor: '#3B82F6', textColor: '#FFFFFF', fontStyle: 'bold', halign: 'center', fontSize: 8 },
            styles: { fontSize: 8, cellPadding: 2 },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'right' },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
                7: { halign: 'right' },
            },
            margin: { left: 14, right: 14 },
        });

        doc.save('reporte_simulacion_credito.pdf');
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
                        {amortization.map((row) => (
                            <TableRow key={row.periodo}>
                                <TableCell className="font-medium text-center">{row.periodo}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.saldoInicial)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.cuotaPI)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.amortizacion)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(row.interes)}</TableCell>
                                <TableCell className="text-right text-destructive">{formatCurrency(row.seguroPeriodo)}</TableCell>
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
