import { it, expect } from 'vitest';
import { calcDeliveryFee } from '../src/delivery';

it.each([1000,1000.01,1500])('free total %s', t => { expect(calcDeliveryFee(t,6)).toBe(0); });

it.each([[0,0.001],[500,4.999],[999.99,5]])('base total %s weight %s', (t,w) => { expect(calcDeliveryFee(t,w)).toBe(50); });

it.each([[5.001,60],[5.999,60],[6,60],[6.001,70],[10,100]])('weight %s -> %s', (w,e) => { expect(calcDeliveryFee(500,w)).toBe(e); });

it.each([[29,290],[29.001,300],[30,300],[30.001,300],[100,300]])('cap weight %s -> %s', (w,e) => { expect(calcDeliveryFee(500,w)).toBe(e); });

it.each([[999.99,1,100],[500,6,120],[500,100,600],[1000,100,0],[1000.01,6,0]])('express %s %s -> %s', (t,w,e) => { expect(calcDeliveryFee(t,w,{express:true})).toBe(e); });

it.each([0,-1,NaN,Infinity,-Infinity])('invalid weight %s', w => { expect(() => calcDeliveryFee(1000,w)).toThrow('INVALID_WEIGHT'); });

it.each([-0.01,NaN,Infinity,-Infinity])('invalid total %s', t => { expect(() => calcDeliveryFee(t,1)).toThrow('INVALID_TOTAL'); });
