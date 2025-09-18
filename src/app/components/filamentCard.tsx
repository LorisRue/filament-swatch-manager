import { filament } from '@/types/filament'
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props { filament: filament }

function FilamentCard(props: Props) {
    const { filament } = props

    return (
        <Link href={`/filament/${filament.identifier}`}>
            <Card className="hover:shadow-xl drop-shadow-xl transition-shadow cursor-pointer border-2 border-border/50 bg-card">
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
                            {filament.cost &&
                                <span className="text-sm font-medium">{filament.cost}CHF</span>
                            }
                            <span className="text-sm font-medium">{filament.dateAdded}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default FilamentCard
