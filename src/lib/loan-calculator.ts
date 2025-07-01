import type { CreditProfile, AmortizationRow, SimulationResult } from '@/types';

function calculateFixedMonthlyInsurance(
  valorActual: number,
  tasaSeguroMensual: number
): number {
  const tasaSeguroDecimal = tasaSeguroMensual / 100;
  return valorActual * tasaSeguroDecimal;
}

function calculateTotalInsuranceOnBalance(
    valorActual: number,
    plazo: number,
    cuotaPI: number,
    tasaInteres: number,
    tasaSeguroMensual: number
): number {
    const tasaSeguroDecimal = tasaSeguroMensual / 100;
    let totalSeguro = 0;
    let saldoTemporal = valorActual;

    for (let i = 0; i < plazo; i++) {
        totalSeguro += saldoTemporal * tasaSeguroDecimal;
        const interes = saldoTemporal * tasaInteres;
        const amortizacion = cuotaPI - interes;
        saldoTemporal -= amortizacion;
    }
    return totalSeguro;
}


function generateAmortization(
  valorActual: number,
  plazo: number,
  cuotaPI: number,
  tasaInteres: number,
  seguroMensualFijo: number
): AmortizationRow[] {
  const amortizationData: AmortizationRow[] = [];
  let saldoInicial = valorActual;

  for (let i = 1; i <= plazo; i++) {
    const interes = saldoInicial * tasaInteres;
    let amortizacion = cuotaPI - interes;

    // Ajuste para la última cuota para que el saldo sea exactamente 0
    if (i === plazo) {
      amortizacion = saldoInicial;
    }

    const saldoFinal = saldoInicial - amortizacion;
    const cuotaCapitalInteres = amortizacion + interes;
    const cuotaTotal = cuotaCapitalInteres + seguroMensualFijo;

    amortizationData.push({
      periodo: i,
      saldoInicial,
      cuotaPI: cuotaCapitalInteres,
      amortizacion,
      interes,
      seguroPeriodo: seguroMensualFijo,
      cuotaTotal,
      saldoFinal: saldoFinal < 0.01 ? 0 : saldoFinal,
    });

    saldoInicial = saldoFinal;
  }
  return amortizationData;
}

export function calculateLoan(
  profile: CreditProfile,
  cuotaCapitalInteres: number,
  plazoMeses: number,
  tipoSeguro: 'inicial' | 'saldo'
): SimulationResult {
  const tasaMensualDecimal = profile.tasa / 100;
  const IVA_RATE = 0.19;

  let valorActual = 0;
  if (tasaMensualDecimal > 0) {
    valorActual = cuotaCapitalInteres * (1 - Math.pow(1 + tasaMensualDecimal, -plazoMeses)) / tasaMensualDecimal;
  } else {
    valorActual = cuotaCapitalInteres * plazoMeses;
  }

  // A Tasa de seguro en el perfil es mensual.
  const tasaSeguroMensual = profile.seguro;
  let seguroMensualFijo = 0;
  let totalSeguro = 0;

  if (tipoSeguro === 'inicial') {
      seguroMensualFijo = calculateFixedMonthlyInsurance(valorActual, tasaSeguroMensual);
      totalSeguro = seguroMensualFijo * plazoMeses;
  } else { // tipoSeguro === 'saldo'
      totalSeguro = calculateTotalInsuranceOnBalance(valorActual, plazoMeses, cuotaCapitalInteres, tasaMensualDecimal, tasaSeguroMensual);
      seguroMensualFijo = totalSeguro / plazoMeses;
  }

  const afianzamientoValor = valorActual * (profile.afianzamiento / 100);
  const ivaAfianzamientoValor = afianzamientoValor * IVA_RATE;
  const interesCarenciaValor = valorActual * (tasaMensualDecimal / 30) * profile.diasCarencia;
  const corredorValor = valorActual * (profile.corredor / 100);

  const totalAdicionalesNoSeguro = afianzamientoValor + ivaAfianzamientoValor + interesCarenciaValor + corredorValor;
  const valorAEntregar = valorActual - totalAdicionalesNoSeguro;

  const amortization = generateAmortization(valorActual, plazoMeses, cuotaCapitalInteres, tasaMensualDecimal, seguroMensualFijo);
  
  const cuotaTotalFija = cuotaCapitalInteres + seguroMensualFijo;

  return {
    valorActual,
    cuotaTotalFija,
    valorAEntregar,
    perfil: profile,
    plazoMeses,
    afianzamientoValor,
    ivaAfianzamientoValor,
    interesCarenciaValor,
    seguroValor: totalSeguro,
    corredorValor,
    amortization,
    tipoSeguro,
    seguroMensualFijo,
  };
}
