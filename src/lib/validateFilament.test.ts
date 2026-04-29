import { validateFilament, ValidationError } from "@/lib/validateFilament";
import { filament } from "@/types/filament";

const validFilament: filament = {
  identifier: "PL-101",
  type: "Matte PLA",
  color: "Red",
  colorHex: "#FF0000",
  material: "PLA",
  brand: "Prusa",
  diameter: 1.75,
  weight: 1000,
  inStock: true,
  dateAdded: "2026-01-01T00:00:00.000Z",
  printSettings: {},
};

const errorsFor = (field: ValidationError["field"], errors: ValidationError[]) =>
  errors.filter((e) => e.field === field);

// ─── valid filament ───────────────────────────────────────────────────────────

describe("validateFilament — valid input", () => {
  it("returns no errors for a fully valid filament", () => {
    expect(validateFilament(validFilament)).toEqual([]);
  });

  it("returns no errors when all optional print settings are within range", () => {
    const f: filament = {
      ...validFilament,
      printSettings: {
        nozzleTemp: 215,
        bedTemp: 60,
        flowRatio: 1.0,
        pressureAdvance: 0.04,
        retractionDistance: 0.5,
        maxVolumetricSpeed: 15,
      },
    };
    expect(validateFilament(f)).toEqual([]);
  });

  it("accepts diameter 2.85", () => {
    expect(validateFilament({ ...validFilament, diameter: 2.85 })).toEqual([]);
  });

  it("accepts lowercase hex digits", () => {
    expect(validateFilament({ ...validFilament, colorHex: "#ff0000" })).toEqual([]);
  });

  it("accepts mixed-case hex digits", () => {
    expect(validateFilament({ ...validFilament, colorHex: "#aAbBcC" })).toEqual([]);
  });
});

// ─── colorHex ────────────────────────────────────────────────────────────────

describe("validateFilament — colorHex", () => {
  it("returns an error when colorHex is missing the leading #", () => {
    const errors = validateFilament({ ...validFilament, colorHex: "FF0000" });
    expect(errorsFor("colorHex", errors)).toHaveLength(1);
  });

  it("returns an error for shorthand hex (#RGB)", () => {
    const errors = validateFilament({ ...validFilament, colorHex: "#F00" });
    expect(errorsFor("colorHex", errors)).toHaveLength(1);
  });

  it("returns an error for 8-digit hex (#RRGGBBAA)", () => {
    const errors = validateFilament({ ...validFilament, colorHex: "#FF0000FF" });
    expect(errorsFor("colorHex", errors)).toHaveLength(1);
  });

  it("returns an error when colorHex contains non-hex characters", () => {
    const errors = validateFilament({ ...validFilament, colorHex: "#GGGGGG" });
    expect(errorsFor("colorHex", errors)).toHaveLength(1);
  });

  it("returns an error for an empty string", () => {
    const errors = validateFilament({ ...validFilament, colorHex: "" });
    expect(errorsFor("colorHex", errors)).toHaveLength(1);
  });
});

// ─── weight ──────────────────────────────────────────────────────────────────

describe("validateFilament — weight", () => {
  it("returns an error when weight is 0", () => {
    const errors = validateFilament({ ...validFilament, weight: 0 });
    expect(errorsFor("weight", errors)).toHaveLength(1);
  });

  it("returns an error when weight is negative", () => {
    const errors = validateFilament({ ...validFilament, weight: -100 });
    expect(errorsFor("weight", errors)).toHaveLength(1);
  });

  it("accepts weight of 1", () => {
    expect(validateFilament({ ...validFilament, weight: 1 })).toEqual([]);
  });
});

// ─── diameter ────────────────────────────────────────────────────────────────

describe("validateFilament — diameter", () => {
  it("returns an error for diameter 3.0", () => {
    const errors = validateFilament({ ...validFilament, diameter: 3.0 });
    expect(errorsFor("diameter", errors)).toHaveLength(1);
  });

  it("returns an error for diameter 1.0", () => {
    const errors = validateFilament({ ...validFilament, diameter: 1.0 });
    expect(errorsFor("diameter", errors)).toHaveLength(1);
  });

  it("accepts diameter 1.75", () => {
    expect(validateFilament({ ...validFilament, diameter: 1.75 })).toEqual([]);
  });

  it("accepts diameter 2.85", () => {
    expect(validateFilament({ ...validFilament, diameter: 2.85 })).toEqual([]);
  });
});

// ─── nozzleTemp ──────────────────────────────────────────────────────────────

describe("validateFilament — printSettings.nozzleTemp", () => {
  it("returns no error when nozzleTemp is undefined", () => {
    const errors = validateFilament({ ...validFilament, printSettings: {} });
    expect(errorsFor("printSettings.nozzleTemp", errors)).toHaveLength(0);
  });

  it("returns an error when nozzleTemp is below 150", () => {
    const errors = validateFilament({ ...validFilament, printSettings: { nozzleTemp: 149 } });
    expect(errorsFor("printSettings.nozzleTemp", errors)).toHaveLength(1);
  });

  it("returns an error when nozzleTemp is above 350", () => {
    const errors = validateFilament({ ...validFilament, printSettings: { nozzleTemp: 351 } });
    expect(errorsFor("printSettings.nozzleTemp", errors)).toHaveLength(1);
  });

  it("accepts nozzleTemp at the lower boundary (150)", () => {
    expect(validateFilament({ ...validFilament, printSettings: { nozzleTemp: 150 } })).toEqual([]);
  });

  it("accepts nozzleTemp at the upper boundary (350)", () => {
    expect(validateFilament({ ...validFilament, printSettings: { nozzleTemp: 350 } })).toEqual([]);
  });
});

// ─── bedTemp ─────────────────────────────────────────────────────────────────

describe("validateFilament — printSettings.bedTemp", () => {
  it("returns no error when bedTemp is undefined", () => {
    const errors = validateFilament({ ...validFilament, printSettings: {} });
    expect(errorsFor("printSettings.bedTemp", errors)).toHaveLength(0);
  });

  it("returns an error when bedTemp is below 0", () => {
    const errors = validateFilament({ ...validFilament, printSettings: { bedTemp: -1 } });
    expect(errorsFor("printSettings.bedTemp", errors)).toHaveLength(1);
  });

  it("returns an error when bedTemp is above 150", () => {
    const errors = validateFilament({ ...validFilament, printSettings: { bedTemp: 151 } });
    expect(errorsFor("printSettings.bedTemp", errors)).toHaveLength(1);
  });

  it("accepts bedTemp at the lower boundary (0)", () => {
    expect(validateFilament({ ...validFilament, printSettings: { bedTemp: 0 } })).toEqual([]);
  });

  it("accepts bedTemp at the upper boundary (150)", () => {
    expect(validateFilament({ ...validFilament, printSettings: { bedTemp: 150 } })).toEqual([]);
  });
});

// ─── multiple errors ──────────────────────────────────────────────────────────

describe("validateFilament — multiple violations", () => {
  it("collects errors from multiple invalid fields at once", () => {
    const f: filament = {
      ...validFilament,
      colorHex: "bad",
      weight: 0,
      diameter: 3.0,
      printSettings: { nozzleTemp: 400, bedTemp: -10 },
    };
    const errors = validateFilament(f);

    expect(errorsFor("colorHex", errors)).toHaveLength(1);
    expect(errorsFor("weight", errors)).toHaveLength(1);
    expect(errorsFor("diameter", errors)).toHaveLength(1);
    expect(errorsFor("printSettings.nozzleTemp", errors)).toHaveLength(1);
    expect(errorsFor("printSettings.bedTemp", errors)).toHaveLength(1);
    expect(errors).toHaveLength(5);
  });
});
