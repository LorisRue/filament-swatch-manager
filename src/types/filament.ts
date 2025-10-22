export const arrMaterial = [
  "PLA",
  "PETG",
  "TPU",
  "ABS",
  "NYLON",
  "ASA",
] as const;
export type material = (typeof arrMaterial)[number];

export type printSettings = {
  nozzleTemp?: number;
  bedTemp?: number;
  flowRatio?: number;
  pressureAdvance?: number;
  retractionDistance?: number;
  maxVolumetricSpeed?: number;
};

export type filament = {
  identifier: string;
  type: string; // e.g. "Matte PLA", "Silk PLA", "PLA+"...
  color: string;
  colorHex: string;
  material: material;
  brand: string;
  diameter: number;
  cost?: number; // in CHF
  supplier?: string;
  weight: number; // in grams
  weightLeft?: number; // in grams
  inStock: boolean;
  dateAdded: string; // ISO date string
  printSettings: printSettings;
  notes?: string;
};

export type dbFilament = {
  identifier: string;
  type: string;
  color: string;
  colorHex: string;
  material: material;
  brand: string;
  diameter: number;
  cost: number | null;
  supplier: string | null;
  weight: number;
  weightLeft: number | null;
  inStock: boolean;
  dateAdded: string;
  notes: string | null;
  nozzleTemp: number | null;
  bedTemp: number | null;
  flowRatio: number | null;
  pressureAdvance: number | null;
  retractionDistance: number | null;
  maxVolumetricSpeed: number | null;
};

export const SORTABLE_FIELDS: { [K in keyof filament]?: string } = {
  identifier: "Identifier",
  cost: "Cost",
  weightLeft: "Weight Left",
  dateAdded: "Date Added",
} as const;

export type SortableFilamentFields = keyof typeof SORTABLE_FIELDS;
