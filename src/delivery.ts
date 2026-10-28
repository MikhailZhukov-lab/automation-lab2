export interface DeliveryOptions { express?: boolean; }
export function calcDeliveryFee(orderTotal: number, weightKg: number, options: DeliveryOptions = {}): number {
  if (orderTotal >= 1000) return 0;
  return 50;
}
