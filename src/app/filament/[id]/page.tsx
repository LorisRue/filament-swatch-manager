"use client"

import { filament } from '@/types/filament';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react'
import { ArrowLeft, Gauge, Thermometer, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';


const getFilament = async (id: string): Promise<filament> => {
    const res = await fetch(`/api/filament/${id}`);

    const data = await res.json();
    return data.filament;
}

function Page() {
    const params = useParams<{ id: string }>();

    const { data: filament, refetch, error } = useQuery({
        queryKey: ["filament", params.id],
        queryFn: () => getFilament(params.id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 10 // 10 minutes
    });

    if (error) {
        alert("Error loading filaments");
    }


    const stockPercentage = filament && filament.weightLeft ? (filament.weightLeft / filament.weight) * 100 : 0;

    return (
        <>
            <header className='mb-8'>
                <Link href="/">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Collection
                    </Button>
                </Link>

                <div className="flex items-center gap-4 mb-4">
                    {filament ?
                        <>
                            <div
                                className="w-12 h-12 rounded-lg border-2 border-gray-300"
                                style={{ backgroundColor: filament.colorHex }}
                            />
                            <div>
                                <h1 className="text-4xl font-bold text-balance">{filament.identifier}</h1>
                                <p className="text-xl text-muted-foreground">{filament.type}</p>
                            </div>
                            <Badge variant={filament.inStock ? "default" : "destructive"} className="ml-auto">
                                {filament.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                        </>
                        : <h1 className="text-4xl font-bold text-balance">loading...</h1>}
                </div>
            </header>
            <main>
                {filament ?
                    <div className="grid grid-cols-1 grid-rows-5 lg:grid-cols-3 lg:grid-rows-3 gap-8 grid-flow-col">
                        {/* Basic Information */}
                        <Card className="border-2 border-border/50 bg-card col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Brand</label>
                                        <p className="text-lg">{filament.brand}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Material</label>
                                        <p className="text-lg">
                                            {filament.material}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                                        <p className="text-lg">{filament.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Color</label>
                                        <p className="text-lg">{filament.color}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Diameter</label>
                                        <p className="text-lg">{filament.diameter}mm</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Date Added</label>
                                        {/* TODO:Export Date format to somewhere else */}
                                        <p className="text-lg">{new Date(filament.dateAdded).toLocaleDateString("de-DE", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                        {/* Printing Settings */}
                        <Card className="border-2 border-border/50 bg-card col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Printing Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="flex items-center gap-3">
                                        <Image src="/images/orcaSlicerIcons/nozzle_temp.svg" alt="Nozzle Temperature" width={24} height={24} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Nozzle Temp</p>
                                            <p className="text-lg font-semibold">{filament.printSettings.nozzleTemp ? `${filament.printSettings.nozzleTemp} °C` : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Image src="/images/orcaSlicerIcons/bed_temp.svg" alt="Bed Temperature" width={24} height={24} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Bed Temp</p>
                                            <p className="text-lg font-semibold">{filament.printSettings.bedTemp ? `${filament.printSettings.bedTemp} °C` : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Image src="/images/orcaSlicerIcons/flow_ratio_and_pressure_advance.svg" alt="Flow Ratio and Pressure Advance" width={24} height={24} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Flow Ratio</p>
                                            <p className="text-lg font-semibold">{filament.printSettings.flowRatio ? filament.printSettings.flowRatio : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Image src="/images/orcaSlicerIcons/flow_ratio_and_pressure_advance.svg" alt="Flow Ratio and Pressure Advance" width={24} height={24} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Pressure Advance</p>
                                            <p className="text-lg font-semibold">{filament.printSettings.pressureAdvance ? filament.printSettings.pressureAdvance : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Image src="/images/orcaSlicerIcons/retraction.svg" alt="Retraction Distance" width={24} height={24} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Retraction Distance</p>
                                            <p className="text-lg font-semibold">{filament.printSettings.retractionDistance ? `${filament.printSettings.retractionDistance} mm` : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Image src="/images/orcaSlicerIcons/volumetric_speed.svg" alt="Max Volumetric Speed" width={24} height={24} />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Max Volumetric Speed</p>
                                            <p className="text-lg font-semibold">{filament.printSettings.maxVolumetricSpeed ? `${filament.printSettings.maxVolumetricSpeed} mm³/s` : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {filament.notes && (
                            <Card className="border-2 border-border/50 bg-card col-span-1 lg:col-span-3">
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">{filament.notes}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Sidebar */}
                        {/* Stock Information */}
                        <Card className="border-2 border-border/50 bg-card">
                            <CardHeader>
                                <CardTitle>Stock Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Original Weight</label>
                                    <p className="text-2xl font-bold">{filament.weight}g</p>
                                </div>

                                {filament.inStock && filament.weightLeft && (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Remaining</label>
                                            <p className="text-2xl font-bold text-green-600">{filament.weightLeft}g</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Usage</span>
                                                <span>{stockPercentage.toFixed(1)}% remaining</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-primary h-3 rounded-full transition-all"
                                                    style={{ width: `${stockPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Purchase Information */}
                        <Card className="border-2 border-border/50 bg-card">
                            <CardHeader>
                                <CardTitle>Purchase Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {filament.cost &&
                                    <>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Cost</label>
                                            <p className="text-2xl font-bold">${filament.cost}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Cost per kg</label>
                                            <p className="text-lg">${(filament.cost / (filament.weight / 1000)).toFixed(2)}</p>
                                        </div>$
                                    </>
                                }

                                <div>
                                    {/* TODO: format Date and get formatting from somewhere else*/}
                                    <label className="text-sm font-medium text-muted-foreground">Date Added</label>
                                    <p className="text-lg">{new Date(filament.dateAdded).toLocaleDateString()}</p>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    : null}
            </main >
        </>
    )
}

export default Page
