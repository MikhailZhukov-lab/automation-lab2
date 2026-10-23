import { describe, it } from 'vitest';
import {
  applyLoyaltyPoints,
  calcOrderTotal,
  type OrderItem,
} from '../../src/order';

const item = (price: number, qty = 1): OrderItem => ({
  sku: 'SKU-1',
  price,
  qty,
});

// Службовий набір для Кроку 6 лабораторної роботи.
// Тести навмисно НЕ мають жодного твердження: вони лише виконують код.
// Звичайний прогін (npm test) цей каталог не включає - див. vitest.config.ts.
describe('Експеримент із покриттям (Крок 6)', () => {

  it('виклик без перевірки результату', () => {
    calcOrderTotal([item(100)], 'silver');
  });

  it('виконання всіх гілок без жодного твердження', () => {
    try {
      applyLoyaltyPoints(1000, 100);
    } catch {
      // помилку ігноруємо: тверджень у тесті немає
    }
    try {
      applyLoyaltyPoints(1000, -10);
    } catch {
      // помилку ігноруємо: тверджень у тесті немає
    }
    try {
      applyLoyaltyPoints(-100, 10);
    } catch {
      // помилку ігноруємо: тверджень у тесті немає
    }
    try {
      applyLoyaltyPoints(NaN, 10);
    } catch {
      // помилку ігноруємо: тверджень у тесті немає
    }
    try {
      applyLoyaltyPoints(1000, Infinity);
    } catch {
      // помилку ігноруємо: тверджень у тесті немає
    }
  });
});
