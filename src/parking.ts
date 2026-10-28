export interface ParkingOptions { night?: boolean; weekend?: boolean; }
const FREE_MINUTES = 15;
const HOUR = 60;
const FIRST_FEE = 30;
const EXTRA_FEE = 20;
const DAILY_CAP = 200;
const NIGHT_RATE = 0.5;
const WEEKEND_RATE = 0.8;

function assertValidDuration(minutes: number): void {
  if (!Number.isInteger(minutes) || minutes < 0) throw new Error('INVALID_DURATION');
}
function calcBaseFee(minutes: number): number {
  if (minutes <= FREE_MINUTES) return 0;
  const extraHours = Math.max(0, Math.ceil((minutes - HOUR) / HOUR));
  return Math.min(FIRST_FEE + extraHours * EXTRA_FEE, DAILY_CAP);
}
function applyRates(fee: number, options: ParkingOptions): number {
  if (options.night) fee *= NIGHT_RATE;
  if (options.weekend) fee *= WEEKEND_RATE;
  return fee;
}
export function calcParkingFee(minutes: number, options: ParkingOptions = {}): number {
  assertValidDuration(minutes);
  return Math.round(applyRates(calcBaseFee(minutes), options) * 100) / 100;
}
