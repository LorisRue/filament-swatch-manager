import { GET, POST } from "@/app/api/filament/route";
import { supabase } from "@/lib/supabaseClient";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockedSupabase = supabase as unknown as {
  from: jest.Mock;
};

const validPayload = {
  identifier: "PL-101",
  type: "Matte PLA",
  color: "Red",
  colorHex: "#ff0000",
  material: "PLA",
  brand: "Prusa",
  diameter: 1.75,
  weight: 1000,
  inStock: true,
  dateAdded: "2026-01-01T00:00:00.000Z",
  printSettings: {},
};

describe("GET /api/filament", () => {
  beforeEach(() => {
    mockedSupabase.from.mockReset();
  });

  it("returns filament list", async () => {
    const select = jest
      .fn()
      .mockResolvedValue({ data: [{ identifier: "PL-101" }], error: null });
    mockedSupabase.from.mockReturnValue({ select });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ filaments: [{ identifier: "PL-101" }] });
  });

  it("returns 500 on supabase failure", async () => {
    const select = jest
      .fn()
      .mockResolvedValue({ data: null, error: { message: "db down" } });
    mockedSupabase.from.mockReturnValue({ select });

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Error fetching filaments");
  });
});

describe("POST /api/filament", () => {
  beforeEach(() => {
    mockedSupabase.from.mockReset();
  });

  it("creates a filament and returns 201", async () => {
    const insert = jest.fn().mockResolvedValue({ error: null });
    mockedSupabase.from.mockReturnValue({ insert });

    const request = new Request("http://localhost/api/filament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      message: "Filament added successfully",
    });
  });

  it("returns 400 when required fields are missing", async () => {
    const invalid = { ...validPayload, brand: "" };

    const request = new Request("http://localhost/api/filament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalid),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Missing or invalid field: brand");
  });

  it("returns 400 when value types are invalid", async () => {
    const invalid = { ...validPayload, diameter: -1 };

    const request = new Request("http://localhost/api/filament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalid),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid diameter value");
  });

  it("returns 409 on duplicate identifier", async () => {
    const insert = jest.fn().mockResolvedValue({ error: { code: "23505" } });
    mockedSupabase.from.mockReturnValue({ insert });

    const request = new Request("http://localhost/api/filament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);

    expect(response.status).toBe(409);
    expect(await response.text()).toBe("Filament already exists");
  });

  it("returns 500 on generic database errors", async () => {
    const insert = jest
      .fn()
      .mockResolvedValue({ error: { code: "XX000", message: "db error" } });
    mockedSupabase.from.mockReturnValue({ insert });

    const request = new Request("http://localhost/api/filament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Error inserting filament");
  });
});
