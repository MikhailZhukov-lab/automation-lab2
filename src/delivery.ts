export interface DeliveryOptions {
  express?: boolean;
}
const FREE_TOTAL = 1000;
const BASE_WEIGHT = 5;
const BASE_FEE = 50;
const EXTRA_KG_FEE = 10;
const MAX_FEE = 300;
const EXPRESS_RATE = 2;
function assertValidInput(orderTotal: number, weightKg: number): void {
  if (!Number.isFinite(orderTotal) || orderTotal < 0)
    throw new Error("INVALID_TOTAL");
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error("INVALID_WEIGHT");
}
function calcWeightFee(weightKg: number): number {
  const extraKg = Math.ceil(Math.max(0, weightKg - BASE_WEIGHT));
  return Math.min(BASE_FEE + extraKg * EXTRA_KG_FEE, MAX_FEE);
}
export function calcDeliveryFee(
  orderTotal: number,
  weightKg: number,
  options: DeliveryOptions = {},
): number {
  assertValidInput(orderTotal, weightKg);
  if (orderTotal >= FREE_TOTAL) return 0;
  const fee = calcWeightFee(weightKg);
  return options.express ? fee * EXPRESS_RATE : fee;
}
