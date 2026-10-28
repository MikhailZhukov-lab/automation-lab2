import { it, expect } from 'vitest';
import { calcParkingFee } from '../src/parking';

it.each([-1, -60, 10.5, NaN, Infinity])('reject duration %s', m => { expect(() => calcParkingFee(m)).toThrow('INVALID_DURATION'); });

it.each([0, 1, 14, 15])('free %s', m => { expect(calcParkingFee(m)).toBe(0); });

it.each([16, 59, 60])('first hour %s', m => { expect(calcParkingFee(m)).toBe(30); });
