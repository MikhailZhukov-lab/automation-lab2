import { expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server, BASE_URL } from './msw/server';
import { HttpRateProvider } from '../src/rate-provider';
const provider = new HttpRateProvider(BASE_URL);
it('reads successful rate', async () => { await expect(provider.getRate('USD', 'UAH')).resolves.toBe(41.25); });
it('rejects HTTP 503', async () => {
  server.use(http.get(`${BASE_URL}/rate`, () => new HttpResponse(null, { status: 503 })));
  await expect(provider.getRate('USD', 'UAH')).rejects.toThrow('RATE_UNAVAILABLE');
});
it.each([{ rate: '41' }, {}, null, { rate: 0 }, { rate: -1 }])('rejects invalid rate %j', async data => {
  server.use(http.get(`${BASE_URL}/rate`, () => HttpResponse.json(data)));
  await expect(provider.getRate('USD', 'UAH')).rejects.toThrow('INVALID_RATE_FORMAT');
});
it('encodes currency parameters', async () => {
  let captured: URL | undefined;
  server.use(http.get(`${BASE_URL}/rate`, ({ request }) => { captured = new URL(request.url); return HttpResponse.json({ rate: 1 }); }));
  await provider.getRate('EUR', 'PLN'); expect(captured?.searchParams.get('from')).toBe('EUR'); expect(captured?.searchParams.get('to')).toBe('PLN');
});
it('rejects network failure', async () => {
  server.use(http.get(`${BASE_URL}/rate`, () => HttpResponse.error())); await expect(provider.getRate('USD', 'UAH')).rejects.toThrow();
});
