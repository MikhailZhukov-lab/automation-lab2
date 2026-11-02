import type { Notifier } from './order-service';
export interface PaidOrder {
  id: string; paymentId: string; amount: number; email: string;
  status: 'paid' | 'cancelled'; cancelledAt?: string; refundId?: string;
}
export interface OrderStore {
  findById(id: string): Promise<PaidOrder | undefined>;
  save(order: PaidOrder): Promise<void>;
}
export interface PaymentGateway { refund(paymentId: string, amount: number): Promise<string> }
export class CancellationService {
  constructor(private store: OrderStore, private payments: PaymentGateway, private notifier: Notifier) {}
  async cancel(id: string): Promise<PaidOrder> {
    const order = await this.store.findById(id);
    if (!order) throw new Error('ORDER_NOT_FOUND');
    if (order.status === 'cancelled') return order;
    if (!Number.isFinite(order.amount) || order.amount <= 0) throw new Error('INVALID_AMOUNT');
    const refundId = await this.payments.refund(order.paymentId, order.amount);
    const cancelled: PaidOrder = { ...order, status: 'cancelled', refundId,
      cancelledAt: new Date().toISOString() };
    await this.store.save(cancelled);
    await this.notifier.send(order.email, `Order ${order.id} cancelled; refunded ${order.amount} UAH`);
    return cancelled;
  }
}
