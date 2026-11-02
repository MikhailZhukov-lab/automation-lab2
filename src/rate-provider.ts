import type { RateProvider } from './order-service';
export class HttpRateProvider implements RateProvider {
  constructor(private baseUrl: string) {}
  async getRate(from: string, to: string): Promise<number> {
    const query = new URLSearchParams({ from, to });
    const response = await fetch(`${this.baseUrl}/rate?${query}`);
    if (!response.ok) throw new Error('RATE_UNAVAILABLE');
    const data = await response.json();
    if (!data || typeof data.rate !== 'number' || !Number.isFinite(data.rate) || data.rate <= 0)
      throw new Error('INVALID_RATE_FORMAT');
    return data.rate;
  }
}
