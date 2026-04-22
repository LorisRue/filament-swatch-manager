import { filament } from "@/types/filament";

export const getAllFilaments = async (): Promise<filament[]> => {
  const res = await fetch("/api/filament");

  if (!res.ok) {
    throw new Error(`Failed to fetch filaments: ${res.status}`);
  }

  const data = await res.json();
  return data.filaments;
};
