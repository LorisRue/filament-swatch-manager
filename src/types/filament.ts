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
    material: material;
    type: string; // e.g. "Matte PLA", "Silk PLA", "PLA+"...
    brand: string;
    color: string;
    colorHex: string;
    diameter: number;
    cost?: number; // in CHF
    weight: number; // in grams
    weightLeft?: number; // in grams
    inStock: boolean;
    dateAdded: string; // ISO date string
    printSettings: printSettings;
}