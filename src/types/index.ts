export interface CreditProfile {
  id: string;
  name: string;
  tasa: number;
  afianzamiento: number;
  diasCarencia: number;
  seguro: number;
  corredor: number;
  afiliacionCooperativa: number;
  aportesMensualesCooperativa: number;
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
  plazoMeses: number;
  afianzamientoValor: number;
  ivaAfianzamientoValor: number;
  interesCarenciaValor: number;
  seguroValor: number;
  seguroMensualFijo: number;
  corredorValor: number;
  amortization: AmortizationRow[];
  tipoSeguro: 'inicial' | 'saldo';
  afiliacionCooperativaValor: number;
  aportesMensualesCooperativaValor: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export interface Users {
  [key: string]: User;
}
