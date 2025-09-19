import { filament } from '@/types/filament'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props { filament: filament }

function FilamentCard(props: Props) {
    const { filament } = props

    const stockPercentage = filament.weightLeft && filament.weight ?
        (filament.weightLeft / filament.weight) * 100 : 0

    return (
        <Link href={`/filament/${filament.identifier}`}>
            <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full informationCard">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">{filament.identifier}</CardTitle>
                        <Badge variant={filament.inStock ? "default" : "destructive"}>
                            {filament.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: filament.colorHex }}
                        />
                        <span className="text-sm text-muted-foreground">{filament.color}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {filament.brand} • {filament.type}
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-2">

                            <span className="text-sm font-medium">{filament.cost && `${filament.cost}CHF`}</span>

                            <span className="text-sm font-medium">{new Date(filament.dateAdded).toLocaleDateString("de-DE")}</span>
                        </div>
                        {filament.inStock && filament.weightLeft && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Remaining</span>
                                    <span>
                                        {filament.weightLeft}g / {filament.weight}g
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${stockPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default FilamentCard
