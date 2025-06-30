export interface CreditProfile {
  tasa: number;
  afianzamiento: number;
  diasCarencia: number;
  seguro: number;
  corredor: number;
}

export interface CreditProfiles {
  [key: string]: CreditProfile;
}

export interface AmortizationRow {
  periodo: number;
  saldoInicial: number;
  cuotaPI: number;
  amortizacion: number;
  interes: number;
  seguroPeriodo: number;
  cuotaTotal: number;
  saldoFinal: number;
}

export interface SimulationResult {
  valorActual: number;
  cuotaTotalFija: number;
  valorAEntregar: number;
  perfil: CreditProfile;
  afianzamientoValor: number;
  ivaAfianzamientoValor: number;
  interesCarenciaValor: number;
  seguroValor: number;
  corredorValor: number;
  amortization: AmortizationRow[];
  tipoSeguro: 'inicial' | 'saldo';
}
