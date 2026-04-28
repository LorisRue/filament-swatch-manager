import { GET } from "@/app/api/filament/[id]/route";
import { supabase } from "@/lib/supabaseClient";
import type { NextRequest } from "next/server";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase = supabase as unknown as { from: jest.Mock };

const dbRow = {
  identifier: "PL-101",
  type: "Matte PLA",
  color: "Red",
  colorHex: "#ff0000",
  material: "PLA",
  brand: "Prusa",
  diameter: 1.75,
  cost: 40,
  supplier: null,
  weight: 1000,
  weightLeft: 700,
  inStock: true,
  dateAdded: "2026-01-01T00:00:00.000Z",
  notes: null,
  nozzleTemp: 215,
  bedTemp: 60,
  flowRatio: null,
  pressureAdvance: null,
  retractionDistance: null,
  maxVolumetricSpeed: null,
};

const makeRequest = () =>
  new Request("http://localhost/api/filament/PL-101") as NextRequest;

const makeParams = (id: string) => Promise.resolve({ id });

describe("GET /api/filament/[id]", () => {
  beforeEach(() => {
    mockedSupabase.from.mockReset();
  });

  it("returns the filament when found", async () => {
    const eq = jest.fn().mockResolvedValue({ data: [dbRow], error: null });
    const select = jest.fn().mockReturnValue({ eq });
    mockedSupabase.from.mockReturnValue({ select });

    const response = await GET(makeRequest(), { params: makeParams("PL-101") });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.filament.identifier).toBe("PL-101");
    expect(body.filament.material).toBe("PLA");
  });

  it("returns 404 when filament is not found", async () => {
    const eq = jest.fn().mockResolvedValue({ data: [], error: null });
    const select = jest.fn().mockReturnValue({ eq });
    mockedSupabase.from.mockReturnValue({ select });

    const response = await GET(makeRequest(), { params: makeParams("XX-999") });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBeDefined();
  });

  it("returns 500 on supabase failure", async () => {
    const eq = jest
      .fn()
      .mockResolvedValue({ data: null, error: { message: "db down" } });
    const select = jest.fn().mockReturnValue({ eq });
    mockedSupabase.from.mockReturnValue({ select });

    const response = await GET(makeRequest(), { params: makeParams("PL-101") });

    expect(response.status).toBe(500);
  });
});
