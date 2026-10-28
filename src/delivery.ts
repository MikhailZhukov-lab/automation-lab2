export interface DeliveryOptions { express?: boolean; }
const FREE_TOTAL = 1000;
const BASE_WEIGHT = 5;
const BASE_FEE = 50;
const EXTRA_KG_FEE = 10;
const MAX_FEE = 300;
export function calcDeliveryFee(orderTotal: number, weightKg: number, options: DeliveryOptions = {}): number {
  if (orderTotal >= FREE_TOTAL) return 0;
  const fee = Math.min(BASE_FEE + Math.ceil(Math.max(0, weightKg - BASE_WEIGHT)) * EXTRA_KG_FEE, MAX_FEE);
  return options.express ? fee * 2 : fee;
}
