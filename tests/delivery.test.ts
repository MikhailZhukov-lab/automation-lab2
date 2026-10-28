import { it, expect } from 'vitest';
import { calcDeliveryFee } from '../src/delivery';

it.each([1000,1000.01,1500])('free total %s', t => { expect(calcDeliveryFee(t,6)).toBe(0); });
