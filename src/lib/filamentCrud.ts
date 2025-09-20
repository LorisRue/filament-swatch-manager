import { filament } from "@/types/filament";

export const getAllFilaments = async (): Promise<filament[]> => {
    const res = await fetch('/api/filament');

    const data = await res.json();
    return data.filaments;
}