import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../src/app";
import { login, makeOrderPayload } from "./helpers";
import { expectSchema } from "./schema";
import { errorSchema, orderSchema, transitionErrorSchema } from "./schemas";
type Status = "new" | "paid" | "shipped";
describe("Variant 1: status transitions", () => {
  let app: ReturnType<typeof createApp>, token: string, id: string;
  const patch = (body: object, auth = token, orderId = id) =>
    request(app)
      .patch(`/orders/${orderId}/status`)
      .auth(auth, { type: "bearer" })
      .send(body);
  const get = () =>
    request(app).get(`/orders/${id}`).auth(token, { type: "bearer" });
  beforeEach(async () => {
    app = createApp();
    token = await login(app, "bob@example.com");
    const created = await request(app)
      .post("/orders")
      .auth(token, { type: "bearer" })
      .send(makeOrderPayload());
    expect(created.status).toBe(201);
    id = created.body.id;
  });
  async function moveTo(target: Status) {
    if (target !== "new")
      expect((await patch({ status: "paid" })).status).toBe(200);
    if (target === "shipped")
      expect((await patch({ status: "shipped" })).status).toBe(200);
  }
  it("initial status is new", async () => {
    const res = await get();
    expectSchema(res.body, orderSchema);
    expect(res.body.status).toBe("new");
  });
  it.each([
    ["new", "paid", 200],
    ["paid", "shipped", 200],
    ["new", "new", 409],
    ["new", "shipped", 409],
    ["paid", "new", 409],
    ["paid", "paid", 409],
    ["shipped", "new", 409],
    ["shipped", "paid", 409],
    ["shipped", "shipped", 409],
  ] as [Status, Status, number][])(
    "%s -> %s returns %i",
    async (from, to, code) => {
      await moveTo(from);
      const before = (await get()).body;
      const res = await patch({ status: to });
      expect(res.status).toBe(code);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
      expectSchema(
        res.body,
        code === 200 ? orderSchema : transitionErrorSchema,
      );
      if (code === 200) expect(res.body).toEqual({ ...before, status: to });
      else expect(res.body).toEqual({ code: "INVALID_TRANSITION", from, to });
      const after = await get();
      expect(after.status).toBe(200);
      expect(after.body).toEqual({
        ...before,
        status: code === 200 ? to : from,
      });
    },
  );
  it.each([
    {},
    { status: "cancelled" },
    { status: "" },
    { status: 1 },
    { status: "PAID" },
    { status: null },
    { status: [] },
    { status: {} },
  ])("invalid body %j: 400 and unchanged order", async (body) => {
    const before = (await get()).body;
    const res = await patch(body);
    expect(res.status).toBe(400);
    expectSchema(res.body, errorSchema);
    expect(res.body).toEqual({ code: "INVALID_STATUS" });
    expect((await get()).body).toEqual(before);
  });
  it.each(["missing", "forged", "bare", "basic"])(
    "%s authentication: 401",
    async (kind) => {
      const before = (await get()).body;
      const req = request(app)
        .patch(`/orders/${id}/status`)
        .send({ status: "paid" });
      const headers: Record<string, string> = {
        forged: "Bearer fake",
        bare: token,
        basic: `Basic ${token}`,
      };
      if (headers[kind]) req.set("Authorization", headers[kind]);
      const res = await req;
      expect(res.status).toBe(401);
      expectSchema(res.body, errorSchema);
      expect(res.body.code).toBe("UNAUTHORIZED");
      expect((await get()).body).toEqual(before);
    },
  );
  it.each([{ status: "paid" }, { status: "invalid" }])(
    "foreign resource %j: 404",
    async (body) => {
      const before = (await get()).body;
      const alice = await login(app, "alice@example.com");
      const res = await patch(body, alice);
      expect(res.status).toBe(404);
      expectSchema(res.body, errorSchema);
      expect(res.body.code).toBe("NOT_FOUND");
      expect((await get()).body).toEqual(before);
    },
  );
  it("missing resource: 404", async () => {
    const res = await patch({ status: "paid" }, token, "missing");
    expect(res.status).toBe(404);
    expectSchema(res.body, errorSchema);
    expect(res.body.code).toBe("NOT_FOUND");
  });
  it("list reflects status change", async () => {
    await patch({ status: "paid" });
    const res = await request(app)
      .get("/orders")
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expectSchema(res.body[0], orderSchema);
    expect(res.body[0]).toMatchObject({ id, status: "paid" });
  });
});
