import { it, expect } from 'vitest';
import { calcParkingFee } from '../src/parking';

it.each([-1, -60, 10.5, NaN, Infinity])('reject duration %s', m => { expect(() => calcParkingFee(m)).toThrow('INVALID_DURATION'); });
