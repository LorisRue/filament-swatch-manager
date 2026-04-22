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

describe("filterData", () => {
  it("filters by material, color, brand and stock status", () => {
    const result = filterData(data, "PLA", "Red", "Prusa", "inStock", "");

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("PL-101");
  });

  it("supports excludeFilter for cross-filter dropdown counts", () => {
    const result = filterData(data, "PLA", "all", "all", "all", "material");

    expect(result).toHaveLength(3);
  });

  it("filters out of stock entries", () => {
    const result = filterData(data, "all", "all", "all", "outOfStock", "");

    expect(result).toHaveLength(1);
    expect(result[0].identifier).toBe("PT-202");
  });
});

describe("sortFilaments", () => {
  it("sorts numeric values ascending", () => {
    const result = sortFilaments(data, "cost", "asc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PT-202",
      "PL-101",
      "PL-303",
    ]);
  });

  it("sorts date values descending", () => {
    const result = sortFilaments(data, "dateAdded", "desc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PT-202",
      "PL-101",
      "PL-303",
    ]);
  });

  it("sorts string values ascending", () => {
    const result = sortFilaments(data, "identifier", "asc");

    expect(result.map((f) => f.identifier)).toEqual([
      "PL-101",
      "PL-303",
      "PT-202",
    ]);
  });

  it("pushes nullish values to the end", () => {
    const result = sortFilaments(data, "cost", "desc");

    expect(result[result.length - 1].identifier).toBe("PL-303");
  });
});
