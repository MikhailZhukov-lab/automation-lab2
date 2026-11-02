import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
export const BASE_URL = 'https://api.example.com';
export const server = setupServer(
  http.get(`${BASE_URL}/rate`, () => HttpResponse.json({ rate: 41.25 })),
  http.post(`${BASE_URL}/refunds`, () => HttpResponse.json({ status: 'refunded', refundId: 'R-1' })),
);
