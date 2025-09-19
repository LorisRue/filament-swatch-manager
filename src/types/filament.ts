export type material = 'PLA' | 'PETG' | 'TPU' | 'ABS' | 'NYLON' | 'ASA';

export type printSettings = {
    nozzleTemp?: number;
    bedTemp?: number;
    flowRatio?: number;
    pressureAdvance?: number;
    retractionDistance?: number;
    maxVolumetricSpeed?: number;

}

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
}

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
}