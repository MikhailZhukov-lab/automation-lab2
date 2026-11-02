import type { PaymentGateway } from './cancellation-service';
export class HttpPaymentGateway implements PaymentGateway {
  constructor(private baseUrl: string) {}
  async refund(paymentId: string, amount: number): Promise<string> {
    const response = await fetch(`${this.baseUrl}/refunds`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `refund-${paymentId}` },
      body: JSON.stringify({ paymentId, amount }),
    });
    if (!response.ok) throw new Error('REFUND_FAILED');
    const data = await response.json();
    if (!data || data.status !== 'refunded' || typeof data.refundId !== 'string' || !data.refundId.trim())
      throw new Error('INVALID_REFUND_FORMAT');
    return data.refundId;
  }
}
