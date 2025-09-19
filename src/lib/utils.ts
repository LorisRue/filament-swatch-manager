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