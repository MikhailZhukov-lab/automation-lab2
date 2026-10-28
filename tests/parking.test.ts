import { it, expect } from 'vitest';
import { calcParkingFee } from '../src/parking';

it.each([-1, -60, 10.5, NaN, Infinity])('reject duration %s', m => { expect(() => calcParkingFee(m)).toThrow('INVALID_DURATION'); });

it.each([0, 1, 14, 15])('free %s', m => { expect(calcParkingFee(m)).toBe(0); });

it.each([16, 59, 60])('first hour %s', m => { expect(calcParkingFee(m)).toBe(30); });

it.each([[61,50],[119,50],[120,50],[121,70],[180,70]])('hours %s -> %s', (m,e) => { expect(calcParkingFee(m)).toBe(e); });

it.each([[540,190],[541,200],[600,200],[1440,200]])('cap %s -> %s', (m,e) => { expect(calcParkingFee(m)).toBe(e); });

it.each([[15,0],[60,15],[121,35],[600,100]])('night %s -> %s', (m,e) => { expect(calcParkingFee(m,{night:true})).toBe(e); });
