import { it, expect } from 'vitest';
import { calcDeliveryFee } from '../src/delivery';

it.each([1000,1000.01,1500])('free total %s', t => { expect(calcDeliveryFee(t,6)).toBe(0); });

it.each([[0,0.001],[500,4.999],[999.99,5]])('base total %s weight %s', (t,w) => { expect(calcDeliveryFee(t,w)).toBe(50); });

it.each([[5.001,60],[5.999,60],[6,60],[6.001,70],[10,100]])('weight %s -> %s', (w,e) => { expect(calcDeliveryFee(500,w)).toBe(e); });
