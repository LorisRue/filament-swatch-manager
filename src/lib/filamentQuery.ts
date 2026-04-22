import { filament, SortableFilamentFields } from "@/types/filament";

export const filterData = (
  data: filament[],
  materialFilter: string,
  colorFilter: string,
  brandFilter: string,
  inStockFilter: string,
  excludeFilter: string,
) => {
  let filtered = data;

  if (excludeFilter !== "material" && materialFilter !== "all") {
    filtered = filtered.filter((f) => f.material === materialFilter);
  }

  if (excludeFilter !== "color" && colorFilter !== "all") {
    filtered = filtered.filter((f) => f.color === colorFilter);
  }

  if (excludeFilter !== "brand" && brandFilter !== "all") {
    filtered = filtered.filter((f) => f.brand === brandFilter);
  }

  if (excludeFilter !== "inStock" && inStockFilter === "inStock") {
    filtered = filtered.filter((f) => f.inStock === true);
  }

  if (excludeFilter !== "inStock" && inStockFilter === "outOfStock") {
    filtered = filtered.filter((f) => f.inStock === false);
  }

  return filtered;
};

export const sortFilaments = (
  data: filament[],
  sortBy: SortableFilamentFields,
  sortOrder: "asc" | "desc",
) => {
  return [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let comparison = 0;

    if (sortBy === "dateAdded") {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      comparison = aDate.getTime() - bDate.getTime();
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
};
