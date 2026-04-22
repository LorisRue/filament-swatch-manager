import { getAllFilaments } from "@/lib/filamentCrud";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("http://localhost/api/filament", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        filaments: [{ identifier: "PL-101", material: "PLA" }],
      }),
    );
  }),
);

describe("getAllFilaments integration", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("loads filament list from API", async () => {
    const result = await getAllFilaments();

    expect(result).toEqual([{ identifier: "PL-101", material: "PLA" }]);
  });

  it("throws on API error", async () => {
    server.use(
      rest.get("http://localhost/api/filament", (_req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    await expect(getAllFilaments()).rejects.toThrow(
      "Failed to fetch filaments: 500",
    );
  });
});
