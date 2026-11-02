import { beforeEach, expect, it, vi, type Mocked } from 'vitest';
import { OrderService, type RateProvider, type Notifier } from '../src/order-service';
import { InMemoryOrderRepository } from './fakes/in-memory-repository';
let repo: InMemoryOrderRepository;
let rates: Mocked<RateProvider>;
let notifier: Mocked<Notifier>;
let service: OrderService;
const input = { id: 'A-1', amountUsd: 100, email: 'client@example.com' };
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-03-15T10:00:00Z'));
  repo = new InMemoryOrderRepository(); rates = { getRate: vi.fn().mockResolvedValue(41) };
  notifier = { send: vi.fn().mockResolvedValue(undefined) }; service = new OrderService(rates, repo, notifier);
});
it('converts USD to UAH', async () => { expect((await service.placeOrder(input)).amountUah).toBe(4100); });
it('sends one notification', async () => {
  await service.placeOrder(input); expect(notifier.send).toHaveBeenCalledExactlyOnceWith(input.email, 'Order A-1: 4100 UAH');
});
it.each([0, -1, NaN, Infinity])('rejects invalid amount %s without dependencies', async amountUsd => {
  await expect(service.placeOrder({ ...input, amountUsd })).rejects.toThrow('INVALID_AMOUNT');
  expect(rates.getRate).not.toHaveBeenCalled(); expect(repo.size).toBe(0); expect(notifier.send).not.toHaveBeenCalled();
});
it('state remains correct after refactoring', async () => {
  const record = await service.placeOrder(input);
  expect(await repo.findById(input.id)).toEqual(record); expect(repo.size).toBe(1);
});
it('interaction expects one save', async () => {
  const save = vi.spyOn(repo, 'save'); await service.placeOrder(input); expect(save).toHaveBeenCalledTimes(1);
});
it('rate failure leaves repository empty and sends no mail', async () => {
  rates.getRate.mockRejectedValue(new Error('RATE_UNAVAILABLE'));
  await expect(service.placeOrder(input)).rejects.toThrow('RATE_UNAVAILABLE');
  expect(repo.size).toBe(0); expect(notifier.send).not.toHaveBeenCalled();
});
it('records fixed creation time', async () => {
  expect((await service.placeOrder(input)).createdAt).toBe('2026-03-15T10:00:00.000Z');
});
it('rounds to cents', async () => {
  rates.getRate.mockResolvedValue(41.255); expect((await service.placeOrder({ ...input, amountUsd: 1 })).amountUah).toBe(41.26);
});
