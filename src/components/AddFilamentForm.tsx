"use client";

import React, { useState } from "react";
import { filament, material } from "@/types/filament";
import { Button } from "@/components/ui/button";

type Props = {
  onClose: () => void;
  onAdded?: () => Promise<void> | void;
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

export default function AddFilamentForm({ onClose, onAdded }: Props) {
  const [form, setForm] = useState<Partial<filament>>(defaultFilamentPartial);
  const [submitting, setSubmitting] = useState(false);

  const change = <K extends keyof filament>(k: K, v: filament[K] | undefined) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.identifier || !form.type) {
      alert('Please provide identifier and type');
      return;
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
            <label className="space-y-1">
              <div className="text-sm">ID *</div>
              <input required value={form.identifier} onChange={e => change('identifier', e.target.value)} className="input input-bordered w-full" placeholder="e.g., PLA-001" />
            </label>
            <label className="space-y-1">
              <div className="text-sm">Brand *</div>
              <input required value={form.brand} onChange={e => change('brand', e.target.value)} className="input input-bordered w-full" placeholder="e.g., Hatchbox" />
            </label>

            <label className="space-y-1">
              <div className="text-sm">Material *</div>
              <select value={form.material} onChange={e => change('material', e.target.value as material)} className="input input-bordered w-full">
                <option>PLA</option>
                <option>PETG</option>
                <option>TPU</option>
                <option>ABS</option>
                <option>NYLON</option>
                <option>ASA</option>
              </select>
            </label>
            <label className="space-y-1">
              <div className="text-sm">Type *</div>
              <input required value={form.type} onChange={e => change('type', e.target.value)} className="input input-bordered w-full" placeholder="e.g., Matte PLA" />
            </label>

            <label className="space-y-1">
              <div className="text-sm">Name</div>
              <input value={form.color} onChange={e => change('color', e.target.value)} className="input input-bordered w-full" placeholder="e.g., True Red" />
            </label>
            <label className="space-y-1">
              <div className="text-sm">Color Hex</div>
              <input value={form.colorHex} onChange={e => change('colorHex', e.target.value)} className="input input-bordered w-full" placeholder="#RRGGBB" />
            </label>

            <label className="space-y-1">
              <div className="text-sm">Cost ($)</div>
              <input
                type="number"
                step="0.01"
                value={form.cost !== undefined ? String(form.cost) : ''}
                onChange={e => {
                  const v = e.target.value;
                  change('cost', v === '' ? undefined : Number(v));
                }}
                className="input input-bordered w-full"
              />
            </label>
            <label className="space-y-1">
              <div className="text-sm">Purchase Date</div>
              <input type="date" value={form.dateAdded?.slice(0,10) ?? ''} onChange={e => change('dateAdded', e.target.value ? new Date(e.target.value).toISOString() : undefined)} className="input input-bordered w-full" />
            </label>

            <label className="flex items-center gap-2 col-span-2">
              <input id="inStock" type="checkbox" checked={Boolean(form.inStock)} onChange={e => change('inStock', e.target.checked)} />
              <div className="text-sm">In Stock</div>
            </label>

            <label className="col-span-2 space-y-1">
              <div className="text-sm">Notes</div>
              <textarea value={form.notes ?? ''} onChange={e => change('notes', e.target.value)} className="textarea textarea-bordered w-full" placeholder="Any additional notes about this filament..." />
            </label>
          </div>

          <div>
            <h3 className="text-md font-medium">Print Settings</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <label className="space-y-1">
                <div className="text-sm">Print Temperature (°C)</div>
                <input
                  type="number"
                  value={form.printSettings?.nozzleTemp !== undefined ? String(form.printSettings.nozzleTemp) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), nozzleTemp: v === '' ? undefined : Number(v) });
                  }}
                  className="input input-bordered w-full"
                />
              </label>
              <label className="space-y-1">
                <div className="text-sm">Bed Temperature (°C)</div>
                <input
                  type="number"
                  value={form.printSettings?.bedTemp !== undefined ? String(form.printSettings.bedTemp) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), bedTemp: v === '' ? undefined : Number(v) });
                  }}
                  className="input input-bordered w-full"
                />
              </label>
              <label className="space-y-1">
                <div className="text-sm">Print Speed (mm/s)</div>
                <input
                  type="number"
                  value={form.printSettings?.maxVolumetricSpeed !== undefined ? String(form.printSettings.maxVolumetricSpeed) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), maxVolumetricSpeed: v === '' ? undefined : Number(v) });
                  }}
                  className="input input-bordered w-full"
                />
              </label>
              <label className="space-y-1">
                <div className="text-sm">Retraction (mm)</div>
                <input
                  type="number"
                  step="0.1"
                  value={form.printSettings?.retractionDistance !== undefined ? String(form.printSettings.retractionDistance) : ''}
                  onChange={e => {
                    const v = e.target.value;
                    change('printSettings', { ...(form.printSettings ?? {}), retractionDistance: v === '' ? undefined : Number(v) });
                  }}
                  className="input input-bordered w-full"
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
