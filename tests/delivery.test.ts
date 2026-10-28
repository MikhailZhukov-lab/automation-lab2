import { it, expect } from 'vitest';
import { calcDeliveryFee } from '../src/delivery';

it.each([1000,1000.01,1500])('free total %s', t => { expect(calcDeliveryFee(t,6)).toBe(0); });

it.each([[0,0.001],[500,4.999],[999.99,5]])('base total %s weight %s', (t,w) => { expect(calcDeliveryFee(t,w)).toBe(50); });
