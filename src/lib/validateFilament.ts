import { filament, printSettings } from "@/types/filament";

export type ValidationError = {
  field: keyof Omit<filament, "printSettings"> | `printSettings.${keyof printSettings}`;
  message: string;
};

export function validateFilament(f: filament): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!/^#[0-9a-fA-F]{6}$/.test(f.colorHex)) {
    errors.push({ field: "colorHex", message: "must be a valid hex color (#RRGGBB)" });
  }

  if (f.weight <= 0) {
    errors.push({ field: "weight", message: "must be greater than 0" });
  }

  if (f.diameter !== 1.75 && f.diameter !== 2.85) {
    errors.push({ field: "diameter", message: "must be 1.75 or 2.85" });
  }

  const { nozzleTemp, bedTemp } = f.printSettings;

  if (nozzleTemp !== undefined && (nozzleTemp < 150 || nozzleTemp > 350)) {
    errors.push({ field: "printSettings.nozzleTemp", message: "must be between 150 and 350°C" });
  }

  if (bedTemp !== undefined && (bedTemp < 0 || bedTemp > 150)) {
    errors.push({ field: "printSettings.bedTemp", message: "must be between 0 and 150°C" });
  }

  return errors;
}
