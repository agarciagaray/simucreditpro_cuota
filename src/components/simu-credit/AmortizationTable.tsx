import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import type { SimulationResult } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";

type AmortizationTableProps = {
  results: SimulationResult;
  showUserPdfButton?: boolean;
};

export function AmortizationTable({
  results,
  showUserPdfButton,
}: AmortizationTableProps) {
  const { toast } = useToast();
  const { amortization } = results;

  const downloadExcel = () => {
    if (amortization.length === 0) {
      toast({
        title: "No hay datos para descargar",
        description: "Realice un cálculo primero.",
        variant: "destructive",
      });
      return;
    }

    // Sheet 1: ResumenCredito
    const summaryData = [
      ["Concepto", "Valor"],
      ["Monto Desembolsado", results.valorAEntregar],
      ["Monto Total del Préstamo", results.valorActual],
      ["Cuota Fija Mensual", results.cuotaTotalFija],
      ["---", "---"],
      ["Desglose de Cargos Adicionales", null],
      [
        `Afianzamiento (${results.perfil.afianzamiento.toFixed(2)}%)`,
        results.afianzamientoValor,
      ],
      [`IVA del Afianzamiento (19.00%)`, results.ivaAfianzamientoValor],
      [
        `Interés de Carencia (${results.perfil.diasCarencia} días)`,
        results.interesCarenciaValor,
      ],
      [
        `Seguro Total (${results.perfil.seguro.toFixed(2)}%)`,
        results.seguroValor,
      ],
      [
        `Comisión del Corredor (${results.perfil.corredor.toFixed(2)}%)`,
        results.corredorValor,
      ],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    summarySheet["!cols"] = [{ wch: 40 }, { wch: 20 }];

    summaryData.forEach((row, index) => {
      if (index > 0 && typeof row[1] === "number") {
        const cellRef = XLSX.utils.encode_cell({ c: 1, r: index });
        if (summarySheet[cellRef]) {
          summarySheet[cellRef].t = "n";
          summarySheet[cellRef].z = "$#,##0";
        }
      }
    });

    // Sheet 2: TablaAmortizacion
    const amortizationHeaders = [
      "#",
      "Saldo Inicial",
      "Capital+Int.",
      "Amortización",
      "Interés",
      "Seguro",
      "Cuota Total",
      "Saldo Final",
    ];
    const amortizationBody = results.amortization.map((row) => [
      row.periodo,
      row.saldoInicial,
      row.cuotaPI,
      row.amortizacion,
      row.interes,
      row.seguroPeriodo,
      row.cuotaTotal,
      row.saldoFinal,
    ]);

    const amortizationSheet = XLSX.utils.aoa_to_sheet([
      amortizationHeaders,
      ...amortizationBody,
    ]);

    amortizationSheet["!cols"] = amortizationHeaders.map(() => ({ wch: 15 }));

    amortizationBody.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cIndex > 0) {
          const cellRef = XLSX.utils.encode_cell({ c: cIndex, r: rIndex + 1 });
          if (amortizationSheet[cellRef]) {
            amortizationSheet[cellRef].t = "n";
            amortizationSheet[cellRef].z = "$#,##0";
          }
        }
      });
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summarySheet, "ResumenCredito");
    XLSX.utils.book_append_sheet(wb, amortizationSheet, "TablaAmortizacion");

    XLSX.writeFile(wb, "reporte_simulacion_credito.xlsx");
  };

  const downloadExcelUser = () => {
    if (amortization.length === 0) {
      toast({
        title: "No hay datos para descargar",
        description: "Realice un cálculo primero.",
        variant: "destructive",
      });
      return;
    }
    // Sheet 1: ResumenCredito (sin desglose de cargos adicionales)
    const summaryData = [
      ["Concepto", "Valor"],
      ["Monto Desembolsado", results.valorAEntregar],
      ["Monto Total del Préstamo", results.valorActual],
      ["Cuota Fija Mensual", results.cuotaTotalFija],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet["!cols"] = [{ wch: 40 }, { wch: 20 }];
    summaryData.forEach((row, index) => {
      if (index > 0 && typeof row[1] === "number") {
        const cellRef = XLSX.utils.encode_cell({ c: 1, r: index });
        if (summarySheet[cellRef]) {
          summarySheet[cellRef].t = "n";
          summarySheet[cellRef].z = "$#,##0";
        }
      }
    });
    // Sheet 2: TablaAmortizacion
    const amortizationHeaders = [
      "#",
      "Saldo Inicial",
      "Capital+Int.",
      "Amortización",
      "Interés",
      "Seguro",
      "Cuota Total",
      "Saldo Final",
    ];
    const amortizationBody = results.amortization.map((row) => [
      row.periodo,
      row.saldoInicial,
      row.cuotaPI,
      row.amortizacion,
      row.interes,
      row.seguroPeriodo,
      row.cuotaTotal,
      row.saldoFinal,
    ]);
    const amortizationSheet = XLSX.utils.aoa_to_sheet([
      amortizationHeaders,
      ...amortizationBody,
    ]);
    amortizationSheet["!cols"] = amortizationHeaders.map(() => ({ wch: 15 }));
    amortizationBody.forEach((row, rIndex) => {
      row.forEach((cell, cIndex) => {
        if (cIndex > 0) {
          const cellRef = XLSX.utils.encode_cell({ c: cIndex, r: rIndex + 1 });
          if (amortizationSheet[cellRef]) {
            amortizationSheet[cellRef].t = "n";
            amortizationSheet[cellRef].z = "$#,##0";
          }
        }
      });
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, summarySheet, "ResumenCredito");
    XLSX.utils.book_append_sheet(wb, amortizationSheet, "TablaAmortizacion");
    XLSX.writeFile(wb, "reporte_simulacion_credito.xlsx");
  };

  const exportPdf = () => {
    if (!results || amortization.length === 0) {
      toast({ title: "No hay datos para exportar", variant: "destructive" });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const formatForPdf = (value: number) =>
      Math.round(value).toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    const formatCurrencyPdf = (value: number) => `$ ${formatForPdf(value)}`;

    // --- HEADER ---
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6"); // theme.colors.primary
    doc.text("SimuCredit Pro", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Reporte de Simulación de Crédito", pageWidth / 2, 28, {
      align: "center",
    });
    const generationDate = new Date().toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Generado el: ${generationDate}`, pageWidth / 2, 33, {
      align: "center",
    });
    doc.setDrawColor("#3B82F6");
    doc.setLineWidth(0.5);
    doc.line(14, 38, pageWidth - 14, 38);

    // --- SUMMARY CARDS ---
    autoTable(doc, {
      startY: 45,
      theme: "grid",
      body: [
        [
          {
            content: "TOTAL PRÉSTAMO",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
          {
            content: "CUOTA FIJA MENSUAL",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
          {
            content: "VALOR SEGURO MENSUAL",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
          {
            content: "VALOR A ENTREGAR",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
        ],
        [
          {
            content: formatCurrencyPdf(results.valorActual),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
          {
            content: formatCurrencyPdf(results.cuotaTotalFija),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
          {
            content: formatCurrencyPdf(results.seguroMensualFijo),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
          {
            content: formatCurrencyPdf(results.valorAEntregar),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
        ],
      ],
      styles: { cellPadding: 5, lineWidth: 0.2, lineColor: [226, 232, 240] },
      margin: { left: 14, right: 14 },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;

    // --- DETAILS TITLE ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6");
    doc.text("Detalles de la Simulación", 14, finalY);
    finalY += 6;

    // --- DETAILS TABLE ---
    autoTable(doc, {
      startY: finalY,
      body: [
        ["Perfil de Crédito", results.perfil.name],
        ["Monto Solicitado", formatCurrencyPdf(results.valorActual)],
        ["Plazo", `${results.plazoMeses} meses`],
        ["Tasa Interés N.M.V.", `${results.perfil.tasa.toFixed(2)}%`],
      ],
      theme: "plain",
      styles: {
        cellPadding: { top: 1.5, right: 4, bottom: 1.5, left: 4 },
        fontSize: 9,
      },
      columnStyles: {
        0: { halign: "left", textColor: [64, 64, 64] },
        1: { halign: "right", textColor: [0, 0, 0], fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: [241, 245, 249] }, // slate-100
      margin: { left: 14, right: 14 },
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // --- CHARGES TITLE ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6");
    doc.text("Desglose de Cargos Adicionales", 14, finalY);
    finalY += 6;

    // --- CHARGES TABLE ---
    autoTable(doc, {
      startY: finalY,
      body: [
        [
          `Afianzamiento (${results.perfil.afianzamiento.toFixed(2)}%)`,
          formatCurrencyPdf(results.afianzamientoValor),
        ],
        [
          `IVA del Afianzamiento (19.00%)`,
          formatCurrencyPdf(results.ivaAfianzamientoValor),
        ],
        [
          `Interés de Carencia (${results.perfil.diasCarencia} días)`,
          formatCurrencyPdf(results.interesCarenciaValor),
        ],
        [
          `Seguro (${results.perfil.seguro.toFixed(2)}%)`,
          formatCurrencyPdf(results.seguroValor),
        ],
        [
          `Corredor Autorizado (${results.perfil.corredor.toFixed(2)}%)`,
          formatCurrencyPdf(results.corredorValor),
        ],
      ],
      theme: "plain",
      styles: {
        cellPadding: { top: 1.5, right: 4, bottom: 1.5, left: 4 },
        fontSize: 9,
      },
      columnStyles: {
        0: { halign: "left", textColor: [64, 64, 64] },
        1: { halign: "right", textColor: [0, 0, 0], fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      margin: { left: 14, right: 14 },
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // --- AMORTIZATION TABLE (PDF Version) ---
    const amortizationBodyPdf = amortization.map((row) => [
      row.periodo,
      formatForPdf(row.saldoInicial),
      formatForPdf(row.cuotaPI),
      formatForPdf(row.amortizacion),
      formatForPdf(row.interes),
      formatForPdf(row.seguroPeriodo),
      formatForPdf(row.cuotaTotal),
      formatForPdf(row.saldoFinal),
    ]);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6");
    doc.text("Tabla de Amortización", 14, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [
        [
          "#",
          "S. Inicial",
          "Cap+Int",
          "Amort.",
          "Interés",
          "Seguro",
          "Cuota T.",
          "S. Final",
        ],
      ],
      body: amortizationBodyPdf,
      theme: "grid",
      headStyles: {
        fillColor: "#3B82F6",
        textColor: "#FFFFFF",
        fontStyle: "bold",
        halign: "center",
        fontSize: 8,
      },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    // --- FOOTER ON ALL PAGES ---
    const finalPageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i);

      // Draw line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.2);
      doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

      // Add informational text (left aligned)
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text(
        "Este es un documento informativo y no representa una obligación contractual. Los valores son aproximados.",
        14,
        pageHeight - 10,
        { align: "left" }
      );

      // Add page number (right aligned)
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150);
      doc.text(
        `Pág. ${i} de ${finalPageCount}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
    }

    doc.save("reporte_simulacion_credito.pdf");
  };

  const exportPdfUser = () => {
    if (!results || amortization.length === 0) {
      toast({ title: "No hay datos para exportar", variant: "destructive" });
      return;
    }
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const formatForPdf = (value: number) =>
      Math.round(value).toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    const formatCurrencyPdf = (value: number) => `$ ${formatForPdf(value)}`;
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6");
    doc.text("SimuCredit Pro", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Reporte de Simulación de Crédito", pageWidth / 2, 28, {
      align: "center",
    });
    const generationDate = new Date().toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Generado el: ${generationDate}`, pageWidth / 2, 33, {
      align: "center",
    });
    doc.setDrawColor("#3B82F6");
    doc.setLineWidth(0.5);
    doc.line(14, 38, pageWidth - 14, 38);
    autoTable(doc, {
      startY: 45,
      theme: "grid",
      body: [
        [
          {
            content: "TOTAL PRÉSTAMO",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
          {
            content: "CUOTA FIJA MENSUAL",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
          {
            content: "VALOR SEGURO MENSUAL",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
          {
            content: "VALOR A ENTREGAR",
            styles: {
              halign: "center",
              fontSize: 8,
              textColor: "#3B82F6",
              fontStyle: "bold",
            },
          },
        ],
        [
          {
            content: formatCurrencyPdf(results.valorActual),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
          {
            content: formatCurrencyPdf(results.cuotaTotalFija),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
          {
            content: formatCurrencyPdf(results.seguroMensualFijo),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
          {
            content: formatCurrencyPdf(results.valorAEntregar),
            styles: { halign: "center", fontSize: 14, fontStyle: "bold" },
          },
        ],
      ],
      styles: { cellPadding: 5, lineWidth: 0.2, lineColor: [226, 232, 240] },
      margin: { left: 14, right: 14 },
    });
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6");
    doc.text("Detalles de la Simulación", 14, finalY);
    finalY += 6;
    autoTable(doc, {
      startY: finalY,
      body: [
        ["Perfil de Crédito", results.perfil.name],
        ["Monto Solicitado", formatCurrencyPdf(results.valorActual)],
        ["Plazo", `${results.plazoMeses} meses`],
        ["Tasa Interés N.M.V.", `${results.perfil.tasa.toFixed(2)}%`],
      ],
      theme: "plain",
      styles: {
        cellPadding: { top: 1.5, right: 4, bottom: 1.5, left: 4 },
        fontSize: 9,
      },
      columnStyles: {
        0: { halign: "left", textColor: [64, 64, 64] },
        1: { halign: "right", textColor: [0, 0, 0], fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      margin: { left: 14, right: 14 },
    });
    finalY = doc.lastAutoTable.finalY + 10;
    // OMITIMOS EL DESGLOSE DE CARGOS ADICIONALES
    // --- AMORTIZATION TABLE (PDF Version) ---
    const amortizationBodyPdf = amortization.map((row) => [
      row.periodo,
      formatForPdf(row.saldoInicial),
      formatForPdf(row.cuotaPI),
      formatForPdf(row.amortizacion),
      formatForPdf(row.interes),
      formatForPdf(row.seguroPeriodo),
      formatForPdf(row.cuotaTotal),
      formatForPdf(row.saldoFinal),
    ]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#3B82F6");
    doc.text("Tabla de Amortización", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [
        [
          "#",
          "S. Inicial",
          "Cap+Int",
          "Amort.",
          "Interés",
          "Seguro",
          "Cuota T.",
          "S. Final",
        ],
      ],
      body: amortizationBodyPdf,
      theme: "grid",
      headStyles: {
        fillColor: "#3B82F6",
        textColor: "#FFFFFF",
        fontStyle: "bold",
        halign: "center",
        fontSize: 8,
      },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });
    // --- FOOTER ON ALL PAGES ---
    const finalPageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(150);
      doc.text(
        "Este es un documento informativo y no representa una obligación contractual. Los valores son aproximados.",
        14,
        pageHeight - 10,
        { align: "left" }
      );
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150);
      doc.text(
        `Pág. ${i} de ${finalPageCount}`,
        pageWidth - 14,
        pageHeight - 10,
        { align: "right" }
      );
    }
    doc.save("reporte_simulacion_credito.pdf");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Tabla de Amortización</h3>
        <div className="flex gap-2">
          {showUserPdfButton ? (
            <>
              <Button
                onClick={downloadExcelUser}
                variant="outline"
                size="sm"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Descargar Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPdfUser}
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={downloadExcel}
                variant="outline"
                size="sm"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Descargar Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportPdf}
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar PDF
              </Button>
            </>
          )}
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
                <TableCell className="font-medium text-center">
                  {row.periodo}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.saldoInicial)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.cuotaPI)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.amortizacion)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.interes)}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  {formatCurrency(row.seguroPeriodo)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(row.cuotaTotal)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(row.saldoFinal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
