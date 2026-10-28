export interface DeliveryOptions { express?: boolean; }
export function calcDeliveryFee(orderTotal: number, weightKg: number, options: DeliveryOptions = {}): number {
  return 0;
}
