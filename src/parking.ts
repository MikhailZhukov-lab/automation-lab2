export interface ParkingOptions { night?: boolean; weekend?: boolean; }
const FREE_MINUTES = 15;
const HOUR = 60;
const FIRST_FEE = 30;
const EXTRA_FEE = 20;
export function calcParkingFee(minutes: number, options: ParkingOptions = {}): number {
  if (!Number.isInteger(minutes) || minutes < 0) throw new Error('INVALID_DURATION');
  if (minutes <= FREE_MINUTES) return 0;
  const hours = Math.max(0, Math.ceil((minutes - HOUR) / HOUR));
  let fee = Math.min(FIRST_FEE + hours * EXTRA_FEE, 200);
  if (options.night) fee /= 2;
  return fee;
}
