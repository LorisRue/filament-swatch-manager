"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { filament } from "@/types/filament";
import FilamentCard from "@/components/FilamentCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCw } from "lucide-react";

const getFilaments = async (): Promise<filament[]> => {
  const res = await fetch('/api/filament');

  const data = await res.json();
  return data.filaments;
}

export default function Home() {
  const { data: filaments, isPending, refetch, error } = useQuery({
    queryKey: ["filaments"],
    queryFn: getFilaments,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10 // 10 minutes
  });

  if (error) {
    alert("Error loading filaments");
  }

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Your Filaments</h1>
      </header>
      <main className="py-4">
        <Button onClick={() => refetch()}><RotateCw /></Button>
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
                  {filaments && Object.entries(filaments.reduce((acc, filament) => {
                    acc[filament.material] = (acc[filament.material] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)).map(([material, count]) => (
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
