import { generateKeyCountPairs, convertDbToFilament, convertFilamentToDb } from "@/lib/utils";
import { dbFilament, filament } from "@/types/filament";

// ─── generateKeyCountPairs ───────────────────────────────────────────────────

describe("generateKeyCountPairs", () => {
  it("counts all entries when filteredData is not provided", () => {
    const input = ["PLA", "PETG", "PLA", "ABS", "PLA", "PETG"];

    const result = generateKeyCountPairs(input);

    expect(result).toEqual([
      ["PLA", 3],
      ["PETG", 2],
      ["ABS", 1],
    ]);
  });

  it("keeps keys from full set and applies counts from filtered data", () => {
    const allColors = ["Red", "Blue", "Black", "Blue"];
    const filtered = ["Blue", "Blue"];

    const result = generateKeyCountPairs(allColors, filtered);

    expect(result).toEqual([
      ["Blue", 2],
      ["Red", 0],
      ["Black", 0],
    ]);
  });

  it("returns zero counts for all keys if filtered data is empty", () => {
    const input = ["A", "B", "A"];

    const result = generateKeyCountPairs(input, []);

    expect(result).toEqual([
      ["A", 0],
      ["B", 0],
    ]);
  });

  it("handles an empty input array", () => {
    expect(generateKeyCountPairs([])).toEqual([]);
  });

  it("handles a single unique entry", () => {
    expect(generateKeyCountPairs(["PLA"])).toEqual([["PLA", 1]]);
  });

  it("uses filteredData itself when no filteredData argument is passed", () => {
    const input = ["X", "X", "Y"];
    const result = generateKeyCountPairs(input);
    const xEntry = result.find(([k]) => k === "X");
    expect(xEntry?.[1]).toBe(2);
  });
});

// ─── convertDbToFilament ─────────────────────────────────────────────────────

const fullDbFilament: dbFilament = {
  identifier: "PL-101",
  type: "Matte PLA",
  color: "Red",
  colorHex: "#ff0000",
  material: "PLA",
  brand: "Prusa",
  diameter: 1.75,
  cost: 40,
  supplier: "Amazon",
  weight: 1000,
  weightLeft: 700,
  inStock: true,
  dateAdded: "2026-01-01T00:00:00.000Z",
  notes: "Test note",
  nozzleTemp: 215,
  bedTemp: 60,
  flowRatio: 1.0,
  pressureAdvance: 0.04,
  retractionDistance: 0.5,
  maxVolumetricSpeed: 15,
};

describe("convertDbToFilament", () => {
  it("maps all scalar fields correctly", () => {
    const result = convertDbToFilament(fullDbFilament);

    expect(result.identifier).toBe("PL-101");
    expect(result.type).toBe("Matte PLA");
    expect(result.color).toBe("Red");
    expect(result.colorHex).toBe("#ff0000");
    expect(result.material).toBe("PLA");
    expect(result.brand).toBe("Prusa");
    expect(result.diameter).toBe(1.75);
    expect(result.weight).toBe(1000);
    expect(result.inStock).toBe(true);
    expect(result.dateAdded).toBe("2026-01-01T00:00:00.000Z");
  });

  it("maps optional scalar fields when present", () => {
    const result = convertDbToFilament(fullDbFilament);

    expect(result.cost).toBe(40);
    expect(result.supplier).toBe("Amazon");
    expect(result.weightLeft).toBe(700);
    expect(result.notes).toBe("Test note");
  });

  it("maps print settings when present", () => {
    const result = convertDbToFilament(fullDbFilament);

    expect(result.printSettings.nozzleTemp).toBe(215);
    expect(result.printSettings.bedTemp).toBe(60);
    expect(result.printSettings.flowRatio).toBe(1.0);
    expect(result.printSettings.pressureAdvance).toBe(0.04);
    expect(result.printSettings.retractionDistance).toBe(0.5);
    expect(result.printSettings.maxVolumetricSpeed).toBe(15);
  });

  it("converts null optional fields to undefined", () => {
    const dbRow: dbFilament = {
      ...fullDbFilament,
      cost: null,
      supplier: null,
      weightLeft: null,
      notes: null,
    };
    const result = convertDbToFilament(dbRow);

    expect(result.cost).toBeUndefined();
    expect(result.supplier).toBeUndefined();
    expect(result.weightLeft).toBeUndefined();
    expect(result.notes).toBeUndefined();
  });

  it("converts null print-setting fields to undefined", () => {
    const dbRow: dbFilament = {
      ...fullDbFilament,
      nozzleTemp: null,
      bedTemp: null,
      flowRatio: null,
      pressureAdvance: null,
      retractionDistance: null,
      maxVolumetricSpeed: null,
    };
    const result = convertDbToFilament(dbRow);

    expect(result.printSettings.nozzleTemp).toBeUndefined();
    expect(result.printSettings.bedTemp).toBeUndefined();
    expect(result.printSettings.flowRatio).toBeUndefined();
    expect(result.printSettings.pressureAdvance).toBeUndefined();
    expect(result.printSettings.retractionDistance).toBeUndefined();
    expect(result.printSettings.maxVolumetricSpeed).toBeUndefined();
  });
});

// ─── convertFilamentToDb ─────────────────────────────────────────────────────

const fullFilament: filament = {
  identifier: "PL-101",
  type: "Matte PLA",
  color: "Red",
  colorHex: "#ff0000",
  material: "PLA",
  brand: "Prusa",
  diameter: 1.75,
  cost: 40,
  supplier: "Amazon",
  weight: 1000,
  weightLeft: 700,
  inStock: true,
  dateAdded: "2026-01-01T00:00:00.000Z",
  notes: "Test note",
  printSettings: {
    nozzleTemp: 215,
    bedTemp: 60,
    flowRatio: 1.0,
    pressureAdvance: 0.04,
    retractionDistance: 0.5,
    maxVolumetricSpeed: 15,
  },
};

describe("convertFilamentToDb", () => {
  it("maps all scalar fields correctly", () => {
    const result = convertFilamentToDb(fullFilament);

    expect(result.identifier).toBe("PL-101");
    expect(result.type).toBe("Matte PLA");
    expect(result.color).toBe("Red");
    expect(result.colorHex).toBe("#ff0000");
    expect(result.material).toBe("PLA");
    expect(result.brand).toBe("Prusa");
    expect(result.diameter).toBe(1.75);
    expect(result.weight).toBe(1000);
    expect(result.inStock).toBe(true);
    expect(result.dateAdded).toBe("2026-01-01T00:00:00.000Z");
  });

  it("maps optional scalar fields when present", () => {
    const result = convertFilamentToDb(fullFilament);

    expect(result.cost).toBe(40);
    expect(result.supplier).toBe("Amazon");
    expect(result.weightLeft).toBe(700);
    expect(result.notes).toBe("Test note");
  });

  it("maps print settings when present", () => {
    const result = convertFilamentToDb(fullFilament);

    expect(result.nozzleTemp).toBe(215);
    expect(result.bedTemp).toBe(60);
    expect(result.flowRatio).toBe(1.0);
    expect(result.pressureAdvance).toBe(0.04);
    expect(result.retractionDistance).toBe(0.5);
    expect(result.maxVolumetricSpeed).toBe(15);
  });

  it("converts undefined optional fields to null", () => {
    const f: filament = {
      ...fullFilament,
      cost: undefined,
      supplier: undefined,
      weightLeft: undefined,
      notes: undefined,
      printSettings: {},
    };
    const result = convertFilamentToDb(f);

    expect(result.cost).toBeNull();
    expect(result.supplier).toBeNull();
    expect(result.weightLeft).toBeNull();
    expect(result.notes).toBeNull();
  });

  it("converts undefined print-setting fields to null", () => {
    const f: filament = { ...fullFilament, printSettings: {} };
    const result = convertFilamentToDb(f);

    expect(result.nozzleTemp).toBeNull();
    expect(result.bedTemp).toBeNull();
    expect(result.flowRatio).toBeNull();
    expect(result.pressureAdvance).toBeNull();
    expect(result.retractionDistance).toBeNull();
    expect(result.maxVolumetricSpeed).toBeNull();
  });
});
