// Calculadora de financiamento — Tabela Price.
// Fórmula: P = PV * (i * (1+i)^n) / ((1+i)^n - 1)
export type FinancingInput = {
  vehiclePrice: number;
  downPayment: number;
  installments: number;
  /** taxa mensal em % (ex.: 1.49 = 1.49% a.m.) */
  monthlyRate: number;
};

export type FinancingResult = {
  financed: number;
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
};

export function computeFinancing(input: FinancingInput): FinancingResult {
  const financed = Math.max(0, input.vehiclePrice - input.downPayment);
  const i = input.monthlyRate / 100;
  const n = input.installments;
  let monthly: number;
  if (i === 0) {
    monthly = financed / n;
  } else {
    const factor = Math.pow(1 + i, n);
    monthly = (financed * (i * factor)) / (factor - 1);
  }
  const totalAmount = monthly * n + input.downPayment;
  return {
    financed,
    monthlyPayment: monthly,
    totalAmount,
    totalInterest: monthly * n - financed,
  };
}

/** Taxa média de mercado para veículos usados (jul/2025) — configurável depois. */
export const DEFAULT_RATE = 1.79;
export const RATE_RANGE = { min: 1.29, max: 2.49 };
export const INSTALLMENT_OPTIONS = [12, 24, 36, 48, 60];
