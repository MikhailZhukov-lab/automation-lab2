import type { OrderRecord, OrderRepository } from '../../src/order-service';
import type { OrderStore, PaidOrder } from '../../src/cancellation-service';
export class InMemoryOrderRepository implements OrderRepository {
  private items = new Map<string, OrderRecord>();
  async save(record: OrderRecord) { this.items.set(record.id, { ...record }); }
  async findById(id: string) { const item = this.items.get(id); return item && { ...item }; }
  get size() { return this.items.size; }
}
export class InMemoryOrderStore implements OrderStore {
  private items = new Map<string, PaidOrder>();
  async save(record: PaidOrder) { this.items.set(record.id, { ...record }); }
  async findById(id: string) { const item = this.items.get(id); return item && { ...item }; }
}
