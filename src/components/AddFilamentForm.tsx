"use client";

import React, { useState, useEffect } from "react";
import { filament, material, MATERIAL_SHORTHAND } from "@/types/filament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "./ui/checkbox";

type Props = {
  onClose: () => void;
  onAdded?: () => Promise<void> | void;
  existingIdentifiers?: string[];
}

const defaultFilamentPartial: Partial<filament> = {
  identifier: '',
  type: '',
  color: '',
  colorHex: '#ffffff',
  material: 'PLA' as material,
  brand: '',
  diameter: 1.75,
  weight: 1000,
  inStock: true,
  dateAdded: new Date().toISOString(),
  printSettings: {}
}

export default function AddFilamentForm({ onClose, onAdded, existingIdentifiers }: Props) {
  const [form, setForm] = useState<Partial<filament>>(defaultFilamentPartial);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // generate initial id for default material
    (async () => {
      if (form.material) await generateIdForMaterial(form.material);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const change = <K extends keyof filament>(k: K, v: filament[K] | undefined) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  // existingIdentifiers should be passed from the parent for efficiency

  const generateIdForMaterial = async (m: material) => {
    setGenerating(true);
    const shorthand = MATERIAL_SHORTHAND[m] ?? 'XX';
    const existing = new Set<string>(existingIdentifiers ?? []);
    let candidate = '';
    let attempts = 0;
    do {
      const rand = Math.floor(100 + Math.random() * 900); // 3-digit
      candidate = `${shorthand}-${rand}`;
      attempts++;
      if (attempts > 20) break; // safety
    } while (existing.has(candidate));
    setForm(prev => ({ ...prev, identifier: candidate }));
    setGenerating(false);
    return candidate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier || !form.type) {
      alert('Please provide identifier and type');
      return;
    }

    // double-check uniqueness and regenerate if necessary (using parent's list)
    const existing = new Set<string>(existingIdentifiers ?? []);
    if (existing.has(String(form.identifier))) {
      // regenerate
      if (form.material) {
        await generateIdForMaterial(form.material);
      }
    }

    const payload: filament = {
      identifier: String(form.identifier),
      type: String(form.type),
      color: String(form.color ?? ''),
      colorHex: String(form.colorHex ?? '#ffffff'),
      material: (form.material ?? 'PLA') as material,
      brand: String(form.brand ?? ''),
      diameter: Number(form.diameter ?? 1.75),
      cost: form.cost !== undefined ? Number(form.cost) : undefined,
      supplier: form.supplier ?? undefined,
      weight: Number(form.weight ?? 1000),
      weightLeft: form.weightLeft ? Number(form.weightLeft) : undefined,
      inStock: Boolean(form.inStock),
      dateAdded: form.dateAdded ?? new Date().toISOString(),
      printSettings: form.printSettings ?? {},
      notes: form.notes ?? undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/filament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add filament');
      if (onAdded) await onAdded();
      setForm(defaultFilamentPartial);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error adding filament');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold">Add New Filament</h2>
          <button aria-label="close" onClick={onClose} className="text-muted-foreground">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">Enter the details for your new filament swatch</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>ID *</Label>
              <Input required disabled value={form.identifier} placeholder="Auto-generated" />
            </div>
            <div className="space-y-1">
              <Label>Brand *</Label>
              <Input required value={form.brand} onChange={e => change('brand', e.target.value)} placeholder="e.g., Hatchbox" />
            </div>

            <div className="space-y-1">
              <Label>Material *</Label>
              <select value={form.material} onChange={async e => { const m = e.target.value as material; change('material', m); await generateIdForMaterial(m); }} className="w-full rounded-md border px-3 py-2 text-sm">
                <option>PLA</option>
                <option>PETG</option>
                <option>TPU</option>
                <option>ABS</option>
                <option>NYLON</option>
                <option>ASA</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Type *</Label>
              <Input required value={form.type} onChange={e => change('type', e.target.value)} placeholder="e.g., Matte PLA" />
            </div>

            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.color} onChange={e => change('color', e.target.value)} placeholder="e.g., True Red" />
            </div>
            <div className="space-y-1">
              <Label>Color Hex</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={form.colorHex}
                  onChange={e => {
                    // normalize to ensure leading # when user types
                    const v = e.target.value;
                    const normalized = v && v[0] !== '#' ? `#${v}` : v;
                    change('colorHex', normalized);
                  }}
                  placeholder="#RRGGBB"
                />
                {/* native color picker synced with hex input */}
                <input
                  aria-label="color-picker"
                  type="color"
                  value={form.colorHex ?? '#ffffff'}
                  onChange={e => change('colorHex', e.target.value)}
                  className="w-10 h-10 rounded-md border-0 p-0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Cost ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.cost !== undefined ? String(form.cost) : ''}
                onChange={e => {
                  const v = e.target.value;
                  change('cost', v === '' ? undefined : Number(v));
                }}
              />
            </div>
            <div className="space-y-1">
              <Label>Purchase Date</Label>
              <Input type="date" value={form.dateAdded?.slice(0,10) ?? ''} onChange={e => change('dateAdded', e.target.value ? new Date(e.target.value).toISOString() : undefined)} />
            </div>

            <label className="flex items-center gap-2 col-span-2">
              <Checkbox id="inStock" checked={Boolean(form.inStock)} onCheckedChange={v => change('inStock', Boolean(v))} />
              <div className="text-sm">In Stock</div>
            </label>

            <div className="col-span-2 space-y-1">
              <Label>Notes</Label>
              <Textarea value={form.notes ?? ''} onChange={e => change('notes', e.target.value)} placeholder="Any additional notes about this filament..." />
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium">Print Settings</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="space-y-1">
                <div className="text-sm">Print Temperature (°C)</div>
                <Input
                  type="number"
                  value={form.printSettings?.nozzleTemp !== undefined ? String(form.printSettings.nozzleTemp) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), nozzleTemp: v === '' ? undefined : Number(v) });
                  }}
                />
              </label>
              <label className="space-y-1">
                <div className="text-sm">Bed Temperature (°C)</div>
                <Input
                  type="number"
                  value={form.printSettings?.bedTemp !== undefined ? String(form.printSettings.bedTemp) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), bedTemp: v === '' ? undefined : Number(v) });
                  }}
                />
              </label>
              <label className="space-y-1">
                <div className="text-sm">Print Speed (mm/s)</div>
                <Input
                  type="number"
                  value={form.printSettings?.maxVolumetricSpeed !== undefined ? String(form.printSettings.maxVolumetricSpeed) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), maxVolumetricSpeed: v === '' ? undefined : Number(v) });
                  }}
                />
              </label>
              <label className="space-y-1">
                <div className="text-sm">Retraction (mm)</div>
                <Input
                  type="number"
                  step="0.1"
                  value={form.printSettings?.retractionDistance !== undefined ? String(form.printSettings.retractionDistance) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), retractionDistance: v === '' ? undefined : Number(v) });
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Filament'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
