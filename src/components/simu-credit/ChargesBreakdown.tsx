import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { SimulationResult } from "@/types";

type ChargesBreakdownProps = {
  results: SimulationResult;
};

export function ChargesBreakdown({ results }: ChargesBreakdownProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">
        Desglose de Cargos Adicionales (Admin View)
      </h3>
      <div className="overflow-x-auto bg-muted/50 p-4 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Detalle</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Afianzamiento</TableCell>
              <TableCell>{results.perfil.afianzamiento.toFixed(2)}%</TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.afianzamientoValor)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IVA sobre Afianzamiento</TableCell>
              <TableCell>19%</TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.ivaAfianzamientoValor)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Interés de Carencia</TableCell>
              <TableCell>{results.perfil.diasCarencia} días</TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.interesCarenciaValor)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seguro de Vida</TableCell>
              <TableCell>
                {results.tipoSeguro === "inicial"
                  ? "Sobre Valor Inicial"
                  : "Sobre Saldo Capital"}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.seguroValor)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Corredor Autorizado</TableCell>
              <TableCell>{results.perfil.corredor.toFixed(2)}%</TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.corredorValor)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Afiliación Cooperativa</TableCell>
              <TableCell>Valor fijo</TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.afiliacionCooperativaValor)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Aportes Mensuales Cooperativa</TableCell>
              <TableCell>
                {results.plazoMeses} meses x{" "}
                {formatCurrency(results.perfil.aportesMensualesCooperativa)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(results.aportesMensualesCooperativaValor)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
