import { describe, it, expect } from 'vitest';
import {
  applyLoyaltyPoints,
  calcOrderTotal,
  MAX_LOYALTY_SHARE,
  type OrderItem,
} from '../src/order';

const item = (price: number, qty = 1): OrderItem => ({
  sku: 'SKU-1',
  price,
  qty,
});

describe('applyLoyaltyPoints', () => {

  it('списує 1 бал як 1 гривню, якщо балів менше за ліміт', () => {
    // Arrange
    const total = 1000;
    const points = 100;

    // Act
    const result = applyLoyaltyPoints(total, points);

    // Assert
    expect(result).toBeCloseTo(900, 2);
  });

  it('не змінює суму, якщо клієнт не має балів', () => {
    expect(applyLoyaltyPoints(1000, 0)).toBeCloseTo(1000, 2);
  });

  it.each([
    { points: 1,   expected: 999 },
    { points: 50,  expected: 950 },
    { points: 200, expected: 800 },
  ])('списує всі $points балів, якщо це менше за 30 % суми', ({ points, expected }) => {
    expect(applyLoyaltyPoints(1000, points)).toBeCloseTo(expected, 2);
  });

  // Межа: ліміт = 1000 * 0.3 = 300 балів (правило «межа мінус один, межа, межа плюс один»).
  it.each([
    { points: 299, expected: 701 },
    { points: 300, expected: 700 },
    { points: 301, expected: 700 },
  ])('обмежує списання 30 % суми: $points балів дає $expected', ({ points, expected }) => {
    expect(applyLoyaltyPoints(1000, points)).toBeCloseTo(expected, 2);
  });

  // Межа для дробової суми: ліміт = 100.5 * 0.3 = 30.15 балів.
  it.each([
    { points: 30.14, expected: 70.36 },
    { points: 30.15, expected: 70.35 },
    { points: 30.16, expected: 70.35 },
  ])('обмежує списання 30 % дробової суми: $points балів дає $expected', ({ points, expected }) => {
    expect(applyLoyaltyPoints(100.5, points)).toBeCloseTo(expected, 2);
  });

  it('не списує більше ніж 30 % суми, навіть якщо балів надлишок', () => {
    expect(applyLoyaltyPoints(1000, 5000)).toBeCloseTo(700, 2);
  });

  it('списує рівно 30 % від суми 250 грн (ліміт 75 балів)', () => {
    expect(applyLoyaltyPoints(250, 75)).toBeCloseTo(175, 2);
  });

  it('повертає нульову суму для нульового замовлення', () => {
    expect(applyLoyaltyPoints(0, 100)).toBeCloseTo(0, 2);
  });

  it('експортує ліміт списання 30 %', () => {
    expect(MAX_LOYALTY_SHARE).toBe(0.3);
  });

  it.each([-1, -0.01, -100, -1000])('відхиляє від’ємну кількість балів %s', (points) => {
    expect(() => applyLoyaltyPoints(1000, points)).toThrow('INVALID_POINTS');
  });

  it('відхиляє кількість балів, яка не є скінченним числом', () => {
    expect(() => applyLoyaltyPoints(1000, NaN)).toThrow('INVALID_POINTS');
    expect(() => applyLoyaltyPoints(1000, Infinity)).toThrow('INVALID_POINTS');
  });

  it('відхиляє від’ємну суму замовлення', () => {
    expect(() => applyLoyaltyPoints(-100, 10)).toThrow('INVALID_TOTAL');
  });

  it.each([NaN, Infinity, -Infinity])('відхиляє некоректну суму замовлення %s', (total) => {
    expect(() => applyLoyaltyPoints(total, 10)).toThrow('INVALID_TOTAL');
  });

  it('списує бали від підсумкової суми замовлення', () => {
    // 1000 грн, рівень basic (0 %) → безкоштовна доставка, усього 1000 грн
    const total = calcOrderTotal([item(1000)], 'basic');
    expect(applyLoyaltyPoints(total, 100)).toBeCloseTo(900, 2);
  });

  it('обмежує списання 30 % і для суми замовлення після знижки', () => {
    // 1200 − 10 % = 1080 грн, ліміт списання = 324 бали
    const total = calcOrderTotal([item(1200)], 'gold');
    expect(applyLoyaltyPoints(total, 324)).toBeCloseTo(756, 2);
    expect(applyLoyaltyPoints(total, 325)).toBeCloseTo(756, 2);
  });
});
