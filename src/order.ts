export type Tier = 'basic' | 'silver' | 'gold';

export interface OrderItem {
  sku: string;
  price: number;
  qty: number;
}

export const TIER_DISCOUNT: Record<Tier, number> = {
  basic: 0,
  silver: 0.05,
  gold: 0.1,
};

export const BIG_ORDER_FROM = 2000;
export const BIG_ORDER_BONUS = 0.05;
export const MAX_DISCOUNT = 0.25;
export const FREE_SHIPPING_FROM = 1000;
export const SHIPPING_FEE = 60;

// ---------- Варіант 1: списання бонусних балів ----------
// Максимальна частка суми замовлення, яку можна списати балами (30 %).
export const MAX_LOYALTY_SHARE = 0.3;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcSubtotal(items: OrderItem[]): number {
  if (items.length === 0) throw new Error('EMPTY_ORDER');
  return items.reduce((sum, item) => {
    if (item.price < 0) throw new Error('NEGATIVE_PRICE');
    if (!Number.isInteger(item.qty) || item.qty <= 0) {
      throw new Error('INVALID_QTY');
    }
    return sum + item.price * item.qty;
  }, 0);
}

export function calcDiscountRate(
  tier: Tier,
  subtotal: number,
  promoRate = 0,
): number {
  if (promoRate < 0) throw new Error('INVALID_PROMO');
  let rate = TIER_DISCOUNT[tier];
  if (subtotal >= BIG_ORDER_FROM) rate += BIG_ORDER_BONUS;
  return Math.min(rate + promoRate, MAX_DISCOUNT);
}

export function calcShipping(amount: number): number {
  return amount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}

export function calcOrderTotal(
  items: OrderItem[],
  tier: Tier,
  promoRate = 0,
): number {
  const subtotal = calcSubtotal(items);
  const rate = calcDiscountRate(tier, subtotal, promoRate);
  const afterDiscount = round2(subtotal * (1 - rate));
  return round2(afterDiscount + calcShipping(afterDiscount));
}

/**
 * Списує бонусні бали із суми замовлення.
 *
 * Правила:
 * - 1 бал = 1 грн;
 * - списати можна не більше ніж 30 % суми замовлення (MAX_LOYALTY_SHARE);
 * - бали, що перевищують ліміт, не зникають — вони просто не списуються.
 *
 * Повертає суму замовлення після списання балів.
 *
 * @throws Error('INVALID_TOTAL')  — сума замовлення від'ємна або не є скінченним числом.
 * @throws Error('INVALID_POINTS') — кількість балів від'ємна або не є скінченним числом.
 */
export function applyLoyaltyPoints(total: number, points: number): number {
  if (!Number.isFinite(total) || total < 0) {
    throw new Error('INVALID_TOTAL');
  }
  if (!Number.isFinite(points)) {
    throw new Error('INVALID_POINTS');
  }
  if (points < 0) {
    throw new Error('INVALID_POINTS');
  }
  const maxApplied = round2(total * MAX_LOYALTY_SHARE);
  const applied = Math.min(points, maxApplied);
  return round2(total - applied);
}
