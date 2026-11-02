import { expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { login } from "./helpers";
import { expectSchema } from "./schema";
import { orderSchema } from "./schemas";
it.each([
  ["bob", 0, 60],
  ["bob", 999.99, 1059.99],
  ["bob", 1000, 1000],
  ["bob", 1999.99, 1999.99],
  ["bob", 2000, 1900],
  ["alice", 500, 510],
  ["alice", 2000, 1700],
])("pricing %s: %s -> %s", async (name, price, total) => {
  const app = createApp();
  const token = await login(app, `${name}@example.com`);
  const res = await request(app)
    .post("/orders")
    .auth(token, { type: "bearer" })
    .send({ items: [{ sku: "SKU-A", price, qty: 1 }] });
  expect(res.status).toBe(201);
  expectSchema(res.body, orderSchema);
  expect(res.body.total).toBe(total);
});
it("wrong password: 401", async () => {
  const res = await request(createApp())
    .post("/auth/login")
    .send({ email: "bob@example.com", password: "wrong" });
  expect(res.status).toBe(401);
  expect(res.body).toEqual({ code: "INVALID_CREDENTIALS" });
});
it("foreign DELETE cannot delete owner order", async () => {
  const app = createApp();
  const bob = await login(app, "bob@example.com");
  const alice = await login(app, "alice@example.com");
  const created = await request(app)
    .post("/orders")
    .auth(bob, { type: "bearer" })
    .send({ items: [{ sku: "SKU-A", price: 500, qty: 1 }] });
  expect(created.status).toBe(201);
  const url = `/orders/${created.body.id}`;
  expect(
    (await request(app).delete(url).auth(alice, { type: "bearer" })).status,
  ).toBe(404);
  expect(
    (await request(app).get(url).auth(bob, { type: "bearer" })).body,
  ).toEqual(created.body);
});
