import { expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { HttpPaymentGateway } from '../src/payment-gateway';
import { server, BASE_URL } from './msw/server';
const gateway = new HttpPaymentGateway(BASE_URL);
it('reads successful refund', async () => { await expect(gateway.refund('P-1', 1250)).resolves.toBe('R-1'); });
it('sends POST JSON and stable idempotency key', async () => {
  let body: unknown; let contentType: string | null = null; let key: string | null = null;
  server.use(http.post(`${BASE_URL}/refunds`, async ({ request }) => {
    body = await request.json(); contentType = request.headers.get('content-type'); key = request.headers.get('idempotency-key');
    return HttpResponse.json({ status: 'refunded', refundId: 'R-2' });
  }));
  await expect(gateway.refund('P-1', 1250)).resolves.toBe('R-2'); expect(body).toEqual({ paymentId: 'P-1', amount: 1250 });
  expect(contentType).toBe('application/json'); expect(key).toBe('refund-P-1');
});
it.each([400, 502, 503])('rejects status %s', async status => {
  server.use(http.post(`${BASE_URL}/refunds`, () => new HttpResponse(null, { status })));
  await expect(gateway.refund('P-1', 1250)).rejects.toThrow('REFUND_FAILED');
});
it.each([null, {}, { status: 'pending', refundId: 'R' }, { status: 'refunded', refundId: 1 }, { status: 'refunded', refundId: ' ' }])('rejects invalid response %j', async data => {
  server.use(http.post(`${BASE_URL}/refunds`, () => HttpResponse.json(data)));
  await expect(gateway.refund('P-1', 1250)).rejects.toThrow('INVALID_REFUND_FORMAT');
});
it('rejects malformed JSON', async () => {
  server.use(http.post(`${BASE_URL}/refunds`, () => new HttpResponse('{'))); await expect(gateway.refund('P-1', 1250)).rejects.toThrow();
});
it('rejects network failure', async () => {
  server.use(http.post(`${BASE_URL}/refunds`, () => HttpResponse.error())); await expect(gateway.refund('P-1', 1250)).rejects.toThrow();
});
