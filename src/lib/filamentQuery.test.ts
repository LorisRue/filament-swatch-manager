import { filterData, sortFilaments } from "@/lib/filamentQuery";
import { filament } from "@/types/filament";

const basePrintSettings = {};

const data: filament[] = [
  {
    identifier: "PL-101",
    type: "Matte PLA",
    color: "Red",
    colorHex: "#ff0000",
    material: "PLA",
    brand: "Prusa",
    diameter: 1.75,
    weight: 1000,
    weightLeft: 700,
    inStock: true,
    dateAdded: "2026-01-01T00:00:00.000Z",
    printSettings: basePrintSettings,
    cost: 40,
  },
  {
    identifier: "PT-202",
    type: "PETG",
    color: "Blue",
    colorHex: "#0000ff",
    material: "PETG",
    brand: "Sunlu",
    diameter: 1.75,
    weight: 1000,
    weightLeft: 0,
    inStock: false,
    dateAdded: "2026-03-01T00:00:00.000Z",
    printSettings: basePrintSettings,
    cost: 28,
  },
  {
    identifier: "PL-303",
    type: "Silk PLA",
    color: "Black",
    colorHex: "#000000",
    material: "PLA",
    brand: "Sunlu",
    diameter: 1.75,
    weight: 1000,
    inStock: true,
    dateAdded: "2025-12-01T00:00:00.000Z",
    printSettings: basePrintSettings,
  },
];

// ─── filterData ──────────────────────────────────────────────────────────────

describe("filterData", () => {
  it("returns all items when all filters are 'all'", () => {
    expect(filterData(data, "all", "all", "all", "all", "")).toHaveLength(3);
  });

  it("filters by material, color, brand and stock status", () => {
    const result = filterData(data, "PLA", "Red", "Prusa", "inStock", "");

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("PL-101");
  });

  it("filters by material only", () => {
    const result = filterData(data, "PLA", "all", "all", "all", "");

    expect(result).toHaveLength(2);
    result.forEach((f) => expect(f.material).toBe("PLA"));
  });

  it("filters by color only", () => {
    const result = filterData(data, "all", "Blue", "all", "all", "");

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("PT-202");
  });

  it("filters by brand only", () => {
    const result = filterData(data, "all", "all", "Sunlu", "all", "");

    expect(result).toHaveLength(2);
    result.forEach((f) => expect(f.brand).toBe("Sunlu"));
  });

  it("filters in-stock entries", () => {
    const result = filterData(data, "all", "all", "all", "inStock", "");

    expect(result.every((f) => f.inStock)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("filters out of stock entries", () => {
    const result = filterData(data, "all", "all", "all", "outOfStock", "");

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("PT-202");
  });

  it("returns empty array when no items match", () => {
    const result = filterData(data, "ABS", "all", "all", "all", "");
    expect(result).toHaveLength(0);
  });

  it("handles empty input", () => {
    expect(filterData([], "PLA", "all", "all", "all", "")).toHaveLength(0);
  });

  it("supports excludeFilter for cross-filter dropdown counts", () => {
    const result = filterData(data, "PLA", "all", "all", "all", "material");

    expect(result).toHaveLength(3);
  });

  it("excludes color filter when excludeFilter is 'color'", () => {
    const result = filterData(data, "all", "Red", "all", "all", "color");
    expect(result).toHaveLength(3);
  });

  it("excludes brand filter when excludeFilter is 'brand'", () => {
    const result = filterData(data, "all", "all", "Prusa", "all", "brand");
    expect(result).toHaveLength(3);
  });

  it("excludes inStock filter when excludeFilter is 'inStock'", () => {
    const result = filterData(data, "all", "all", "all", "inStock", "inStock");
    expect(result).toHaveLength(3);
  });
});

// ─── sortFilaments ───────────────────────────────────────────────────────────

describe("sortFilaments", () => {
  it("sorts numeric values ascending", () => {
    const result = sortFilaments(data, "cost", "asc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PT-202",
      "PL-101",
      "PL-303",
    ]);
  });

  it("sorts numeric values descending", () => {
    const result = sortFilaments(data, "cost", "desc");

    // PL-303 has no cost → pushed to end
    expect(result[0].identifier).toBe("PL-101");
    expect(result[result.length - 1].identifier).toBe("PL-303");
  });

  it("sorts date values descending", () => {
    const result = sortFilaments(data, "dateAdded", "desc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PT-202",
      "PL-101",
      "PL-303",
    ]);
  });

  it("sorts date values ascending", () => {
    const result = sortFilaments(data, "dateAdded", "asc");

    expect(result[0].identifier).toBe("PL-303");
    expect(result[result.length - 1].identifier).toBe("PT-202");
  });

  it("sorts string values ascending", () => {
    const result = sortFilaments(data, "identifier", "asc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PL-101",
      "PL-303",
      "PT-202",
    ]);
  });

  it("sorts string values descending", () => {
    const result = sortFilaments(data, "identifier", "desc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PT-202",
      "PL-303",
      "PL-101",
    ]);
  });

  it("pushes nullish values to the end (asc)", () => {
    const result = sortFilaments(data, "cost", "asc");

    expect(result[result.length - 1].identifier).toBe("PL-303");
  });

  it("pushes nullish values to the end (desc)", () => {
    const result = sortFilaments(data, "cost", "desc");

    expect(result[result.length - 1].identifier).toBe("PL-303");
  });

  it("handles two nullish values equally", () => {
    const withTwoNull: filament[] = [
      { ...data[0], cost: undefined },
      { ...data[1], cost: undefined },
    ];
    const result = sortFilaments(withTwoNull, "cost", "asc");
    // Both are null → relative order is preserved (stable)
    expect(result).toHaveLength(2);
  });

  it("does not mutate the original array", () => {
    const original = [...data];
    sortFilaments(data, "identifier", "desc");
    expect(data.map((f) => f.identifier)).toEqual(
      original.map((f) => f.identifier),
    );
  });

  it("handles an empty array", () => {
    expect(sortFilaments([], "identifier", "asc")).toEqual([]);
  });

  it("handles a single-element array", () => {
    const result = sortFilaments([data[0]], "identifier", "asc");
    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("PL-101");
  });
});
