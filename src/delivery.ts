export interface DeliveryOptions { express?: boolean; }
const FREE_TOTAL = 1000;
export function calcDeliveryFee(orderTotal: number, weightKg: number, options: DeliveryOptions = {}): number {
  if (orderTotal >= FREE_TOTAL) return 0;
  return 50;
}
