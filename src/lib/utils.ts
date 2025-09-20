import { dbFilament, filament } from "@/types/filament"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertDbToFilament(data: dbFilament): filament {
  return {
    identifier: data.identifier,
    type: data.type,
    color: data.color,
    colorHex: data.colorHex,
    material: data.material,
    brand: data.brand,
    diameter: data.diameter,
    cost: data.cost || undefined,
    supplier: data.supplier || undefined,
    weight: data.weight,
    weightLeft: data.weightLeft || undefined,
    inStock: data.inStock,
    dateAdded: data.dateAdded,
    printSettings: {
      nozzleTemp: data.nozzleTemp || undefined,
      bedTemp: data.bedTemp || undefined,
      flowRatio: data.flowRatio || undefined,
      pressureAdvance: data.pressureAdvance || undefined,
      retractionDistance: data.retractionDistance || undefined,
      maxVolumetricSpeed: data.maxVolumetricSpeed || undefined
    },
    notes: data.notes || undefined
  }
}

export function convertFilamentToDb(filament: filament): dbFilament {
  return {
    identifier: filament.identifier,
    type: filament.type,
    color: filament.color,
    colorHex: filament.colorHex,
    material: filament.material,
    brand: filament.brand,
    diameter: filament.diameter,
    cost: filament.cost || null,
    supplier: filament.supplier || null,
    weight: filament.weight,
    weightLeft: filament.weightLeft || null,
    inStock: filament.inStock,
    dateAdded: filament.dateAdded,
    nozzleTemp: filament.printSettings.nozzleTemp || null,
    bedTemp: filament.printSettings.bedTemp || null,
    flowRatio: filament.printSettings.flowRatio || null,
    pressureAdvance: filament.printSettings.pressureAdvance || null,
    retractionDistance: filament.printSettings.retractionDistance || null,
    maxVolumetricSpeed: filament.printSettings.maxVolumetricSpeed || null,
    notes: filament.notes || null
  }
}

export const generateKeyCountPairs = (data: string[], filteredData?: string[]): [string, number][] => {
  if (!filteredData) {
    filteredData = data;
  }
  const countMap = new Map<string, number>();
  data.forEach((item) => {
    countMap.set(item, 0);
  });

  filteredData.forEach((item) => {
    countMap.set(item, (countMap.get(item) || 0) + 1);
  });

  return Array.from(countMap.entries()).sort((a, b) => b[1] - a[1]);
}