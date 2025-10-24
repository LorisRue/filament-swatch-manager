"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { filament, SortableFilamentFields, SORTABLE_FIELDS } from "@/types/filament";
import FilamentCard from "@/components/FilamentCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCw, ArrowUp, ArrowDown } from "lucide-react";
import { clientCacheConfig } from "@/lib/config";
import { getAllFilaments } from "@/lib/filamentCrud";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateKeyCountPairs } from "@/lib/utils";
import FilamentForm from "@/components/FilamentForm";




const filterData = (data: filament[], materialFilter: string, colorFilter: string, brandFilter: string, inStockFilter: string, excludeFilter: string) => {
  let filtered = data;

  if (excludeFilter !== 'material' && materialFilter !== "all") {
    filtered = filtered.filter(f => f.material === materialFilter);
  }

  if (excludeFilter !== 'color' && colorFilter !== "all") {
    filtered = filtered.filter(f => f.color === colorFilter);
  }

  if (excludeFilter !== 'brand' && brandFilter !== "all") {
    filtered = filtered.filter(f => f.brand === brandFilter);
  }

  if (excludeFilter !== 'inStock' && inStockFilter === "inStock") {
    filtered = filtered.filter(f => f.inStock === true);
  }
  if (excludeFilter !== 'inStock' && inStockFilter === "outOfStock") {
    filtered = filtered.filter(f => f.inStock === false);
  }
  return filtered;
};

const sortFilaments = (data: filament[], sortBy: SortableFilamentFields, sortOrder: "asc" | "desc") => {
  return [...data].sort((a, b) => { // Create copy to avoid mutation
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle undefined/null values - push to end regardless of sort order
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let comparison = 0;

    // Handle date fields
    if (sortBy === 'dateAdded') {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      comparison = aDate.getTime() - bDate.getTime();
    }
    // Handle numbers
    else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    }
    // Handle strings
    else if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    }
    // Fallback
    else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });
};

const postFilament = async (newFilament: filament) => {
  const response = await fetch('/api/filament', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newFilament),
  });

  if (!response.ok) {
    throw new Error('Failed to add filament');
  }

  const addedFilament = await response.json();
  return addedFilament;
};

//TODO: Add new filament button
//TODO: Add search
export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [materialFilter, setMaterialFilter] = useState<string>(() => searchParams?.get('material') ?? "all");
  const [colorFilter, setColorFilter] = useState<string>(() => searchParams?.get('color') ?? "all");
  const [brandFilter, setBrandFilter] = useState<string>(() => searchParams?.get('brand') ?? "all");
  const [inStockFilter, setInStockFilter] = useState<string>(() => searchParams?.get('inStock') ?? "all");

  const [sortBy, setSortBy] = useState<SortableFilamentFields>(() => (searchParams?.get('sortBy') as SortableFilamentFields) ?? "identifier");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => (searchParams?.get('sortOrder') as "asc" | "desc") ?? "asc");

  const [filaments, setFilaments] = useState<filament[] | undefined>(undefined);

  const { data, isPending, refetch, error } = useQuery({
    queryKey: ["filaments"],
    queryFn: getAllFilaments,
    staleTime: clientCacheConfig.stale,
    refetchInterval: clientCacheConfig.refetch
  });

  if (error) {
    alert("Error loading filaments");
  }

  useEffect(() => {
    if (data) {
      const filteredFilaments = filterData(data, materialFilter, colorFilter, brandFilter, inStockFilter, '');
      const sortedFilaments = sortFilaments(filteredFilaments, sortBy, sortOrder);
      setFilaments(sortedFilaments);
    }
  }, [data, materialFilter, colorFilter, brandFilter, inStockFilter, sortBy, sortOrder]);

  // Helper to update URL search params without adding a history entry (replaceState)
  const updateUrl = (overrides?: Partial<Record<string, string>>) => {
    const params = new URLSearchParams();

    const m = overrides?.material ?? materialFilter;
    const c = overrides?.color ?? colorFilter;
    const b = overrides?.brand ?? brandFilter;
    const s = overrides?.inStock ?? inStockFilter;
    const sb = overrides?.sortBy ?? sortBy;
    const so = overrides?.sortOrder ?? sortOrder;

    if (m && m !== 'all') params.set('material', m);
    if (c && c !== 'all') params.set('color', c);
    if (b && b !== 'all') params.set('brand', b);
    if (s && s !== 'all') params.set('inStock', s);
    if (sb && sb !== 'identifier') params.set('sortBy', String(sb));
    if (so && so !== 'asc') params.set('sortOrder', so);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    // use router.replace to avoid creating new history entries
    router.replace(url);
  };

  const handleAddFilament = (newFilament: filament) => {
    console.log('Adding Filament (TBA)', newFilament);
    postFilament(newFilament).then(() => {
      refetch();
    }).catch((err) => {
      alert("Error adding filament: " + err.message);
    });
  };



  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Your Filaments</h1>
      </header>
      <main className="py-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 my-4">
          <Select value={materialFilter} onValueChange={(v) => { setMaterialFilter(v); updateUrl({ material: v }); }}>
            <SelectTrigger>
              <SelectValue placeholder="Material" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="start" avoidCollisions>
              <SelectItem value="all" className="flex justify-between">All Materials</SelectItem>
              {data && generateKeyCountPairs(
                data.map(f => f.material),
                filterData(data, materialFilter, colorFilter, brandFilter, inStockFilter, 'material').map(f => f.material)
              )
                // filter out empty/blank material keys which would produce empty SelectItem values
                .filter(([material]) => material !== undefined && material !== null && String(material).trim() !== "")
                .map(([material, count]) => (
                  <SelectItem key={material} value={material} disabled={count === 0} className="flex justify-between">{material} ({count})</SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={colorFilter} onValueChange={(v) => { setColorFilter(v); updateUrl({ color: v }); }}>
            <SelectTrigger>
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="start" avoidCollisions>
              <SelectItem value="all" className="flex justify-between">All Colors</SelectItem>
              {data && generateKeyCountPairs(
                data.map(f => f.color),
                filterData(data, materialFilter, colorFilter, brandFilter, inStockFilter, 'color').map(f => f.color)
              )
                // filter out empty/blank color keys
                .filter(([color]) => color !== undefined && color !== null && String(color).trim() !== "")
                .map(([color, count]) => (
                  <SelectItem key={color} value={color} disabled={count === 0} className="flex justify-between">{color} ({count})</SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={brandFilter} onValueChange={(v) => { setBrandFilter(v); updateUrl({ brand: v }); }}>
            <SelectTrigger>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="start" avoidCollisions>
              <SelectItem value="all" className="flex justify-between">All Brands</SelectItem>
              {data && generateKeyCountPairs(
                data.map(f => f.brand),
                filterData(data, materialFilter, colorFilter, brandFilter, inStockFilter, 'brand').map(f => f.brand)
              )
                // filter out empty/blank brand keys
                .filter(([brand]) => brand !== undefined && brand !== null && String(brand).trim() !== "")
                .map(([brand, count]) => (
                  <SelectItem key={brand} value={brand} disabled={count === 0} className="flex justify-between">{brand} ({count})</SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={inStockFilter} onValueChange={(v) => { setInStockFilter(v); updateUrl({ inStock: v }); }}>
            <SelectTrigger>
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom" align="start" avoidCollisions>
              <SelectItem value="all" className="flex justify-between">All Stock Status</SelectItem>
              {data && generateKeyCountPairs(
                data.map(f => f.inStock ? 'inStock' : 'outOfStock'),
                filterData(data, materialFilter, colorFilter, brandFilter, inStockFilter, 'inStock').map(f => f.inStock ? 'inStock' : 'outOfStock')
              )
                // status keys are safe but keep consistent filtering
                .filter(([status]) => status !== undefined && status !== null && String(status).trim() !== "")
                .map(([status, count]) => (
                  <SelectItem key={status} value={status} disabled={count === 0} className="flex justify-between">
                    {status === 'inStock' ? 'In Stock' : 'Out of Stock'} ({count})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => { setMaterialFilter("all"); setColorFilter("all"); setBrandFilter("all"); setInStockFilter("all"); updateUrl({ material: 'all', color: 'all', brand: 'all', inStock: 'all' }); }}>Clear Filters</Button>
        </div>

        <div className="flex justify-between">
          {/* Sort */}
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => { setSortBy(value as keyof filament); updateUrl({ sortBy: value }); }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" avoidCollisions>
                {Object.entries(SORTABLE_FIELDS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="flex justify-between">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center">
              <Button
                variant="outline"
                aria-label={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
                title={sortOrder === "asc" ? "Sort ascending" : "Sort descending"}
                onClick={() => {
                  const next = sortOrder === "asc" ? "desc" : "asc";
                  setSortOrder(next);
                  updateUrl({ sortOrder: next });
                }}
                className="h-10 w-10 p-2"
              >
                {sortOrder === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <FilamentForm onSubmit={handleAddFilament} filaments={data} />
            <Button onClick={() => refetch()}><RotateCw /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          {/* Filament Stock information*/}
          {isPending ? null :
            <>
              <Card className="informationCard">
                <CardHeader className="text-sm font-medium text-muted-foreground">Total Filaments</CardHeader>
                <CardContent className="text-2xl font-bold">
                  {filaments?.length}
                </CardContent>
              </Card>
              <Card className="informationCard">
                <CardHeader className="text-sm font-medium text-muted-foreground">Filament in Stock</CardHeader>
                <CardContent className="text-2xl font-bold">
                  {filaments?.filter(f => f.inStock).length}
                </CardContent>
              </Card>
              <Card className="informationCard">
                <CardHeader className="text-sm font-medium text-muted-foreground">Materials</CardHeader>
                <CardContent className="text-2xl font-bold flex flex-wrap gap-1">
                  {filaments && generateKeyCountPairs(filaments.map(f => f.material))
                    .filter(([material]) => material !== undefined && material !== null && String(material).trim() !== "")
                    .map(([material, count]) => (
                      <Badge variant="outline" className="text-xs" key={material}>
                        {material} {count}
                      </Badge>
                    ))}
                </CardContent>
              </Card>
            </>
          }
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Filament Cards */}
          {isPending ? "Loading..." : filaments?.map((filament) => (
            <FilamentCard key={filament.identifier} filament={filament} />
          ))}
        </div>
      </main>
    </>
  );
}
