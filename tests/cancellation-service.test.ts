import type { Notifier } from '../src/order-service';
import { beforeEach, expect, it, vi, type Mocked } from 'vitest';
import { http, HttpResponse } from 'msw';
import { CancellationService, type PaidOrder, type PaymentGateway } from '../src/cancellation-service';
import { HttpPaymentGateway } from '../src/payment-gateway';
import { InMemoryOrderStore } from './fakes/in-memory-repository';
import { server, BASE_URL } from './msw/server';
let store: InMemoryOrderStore;
let payments: Mocked<PaymentGateway>;
let notifier: Mocked<Notifier>;
let service: CancellationService;
const order: PaidOrder = { id: 'O-1', paymentId: 'P-1', amount: 1250, email: 'mykhailo@example.com', status: 'paid' };
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-03-15T10:00:00Z'));
  store = new InMemoryOrderStore(); await store.save(order);
  payments = { refund: vi.fn().mockResolvedValue('R-1') }; notifier = { send: vi.fn().mockResolvedValue(undefined) };
  service = new CancellationService(store, payments, notifier);
});
it('persists cancelled state and fixed timestamp', async () => {
  await service.cancel('O-1'); expect(await store.findById('O-1')).toEqual({ ...order, status: 'cancelled', refundId: 'R-1', cancelledAt: '2026-03-15T10:00:00.000Z' });
});
it('refunds correct payment and sends exact mail once', async () => {
  await service.cancel('O-1'); expect(payments.refund).toHaveBeenCalledExactlyOnceWith('P-1', 1250);
  expect(notifier.send).toHaveBeenCalledExactlyOnceWith(order.email, 'Order O-1 cancelled; refunded 1250 UAH');
  expect(payments.refund.mock.invocationCallOrder[0]).toBeLessThan(notifier.send.mock.invocationCallOrder[0]);
});
it('refund rejection preserves paid state and suppresses mail', async () => {
  payments.refund.mockRejectedValue(new Error('REFUND_FAILED'));
  await expect(service.cancel('O-1')).rejects.toThrow('REFUND_FAILED');
  expect(await store.findById('O-1')).toEqual(order); expect(notifier.send).not.toHaveBeenCalled();
});
it('notifier rejection preserves completed refund and cancellation', async () => {
  notifier.send.mockRejectedValue(new Error('MAIL_UNAVAILABLE'));
  await expect(service.cancel('O-1')).rejects.toThrow('MAIL_UNAVAILABLE');
  expect((await store.findById('O-1'))?.status).toBe('cancelled'); expect(payments.refund).toHaveBeenCalledTimes(1);
});
it('unknown order makes no external calls', async () => {
  await expect(service.cancel('missing')).rejects.toThrow('ORDER_NOT_FOUND');
  expect(payments.refund).not.toHaveBeenCalled(); expect(notifier.send).not.toHaveBeenCalled();
});
it('repeated cancellation does not refund twice', async () => {
  const first = await service.cancel('O-1'); expect(await service.cancel('O-1')).toEqual(first);
  expect(payments.refund).toHaveBeenCalledTimes(1); expect(notifier.send).toHaveBeenCalledTimes(1);
});
it.each([0, -1, NaN, Infinity])('rejects invalid amount %s', async amount => {
  await store.save({ ...order, amount }); await expect(service.cancel('O-1')).rejects.toThrow('INVALID_AMOUNT');
  expect(payments.refund).not.toHaveBeenCalled(); expect(notifier.send).not.toHaveBeenCalled();
});
it('repository read failure prevents refund', async () => {
  vi.spyOn(store, 'findById').mockRejectedValue(new Error('READ_FAILED'));
  await expect(service.cancel('O-1')).rejects.toThrow('READ_FAILED'); expect(payments.refund).not.toHaveBeenCalled();
});
it('repository write failure prevents mail after refund', async () => {
  vi.spyOn(store, 'save').mockRejectedValue(new Error('WRITE_FAILED'));
  await expect(service.cancel('O-1')).rejects.toThrow('WRITE_FAILED');
  expect(payments.refund).toHaveBeenCalledTimes(1); expect(notifier.send).not.toHaveBeenCalled(); expect(await store.findById('O-1')).toEqual(order);
});
it('integrates real HTTP gateway with fake repository', async () => {
  service = new CancellationService(store, new HttpPaymentGateway(BASE_URL), notifier);
  await service.cancel('O-1'); expect((await store.findById('O-1'))?.refundId).toBe('R-1'); expect(notifier.send).toHaveBeenCalledTimes(1);
});
it('HTTP 502 keeps order paid and sends no mail', async () => {
  server.use(http.post(`${BASE_URL}/refunds`, () => new HttpResponse(null, { status: 502 })));
  service = new CancellationService(store, new HttpPaymentGateway(BASE_URL), notifier);
  await expect(service.cancel('O-1')).rejects.toThrow('REFUND_FAILED'); expect(await store.findById('O-1')).toEqual(order); expect(notifier.send).not.toHaveBeenCalled();
});
