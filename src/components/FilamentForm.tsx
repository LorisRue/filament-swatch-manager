import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus } from 'lucide-react'
import { arrMaterial, filamentAbbreviations, material, type filament } from '@/types/filament'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldContent } from './ui/field'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import SuggestiveTextInput from './SuggestiveTextInput'
import { Checkbox } from './ui/checkbox'

const keyValueFromArr = (arr?: string[]) => {
    if (!arr) return []
    return arr.map((item) => ({ label: item, value: item }))
}

const generateIdentifier = (material: material, filaments: filament[]) => {
    const abbreviation = filamentAbbreviations[material as keyof typeof filamentAbbreviations];
    let randomNumber = Math.floor(100 + Math.random() * 900);
    let identifier = `${abbreviation}-${randomNumber}`;

    // Ensure uniqueness
    while (filaments.some(f => f.identifier === identifier)) {
        randomNumber = Math.floor(100 + Math.random() * 900);
        identifier = `${abbreviation}-${randomNumber}`;
    }

    return identifier;
}

type FilamentFormProps = {
    filament?: filament;
    filaments?: filament[];
    onSubmit: (filamentData: filament) => void;
}

function FilamentForm({ filament, filaments, onSubmit }: FilamentFormProps) {
    const [knownBrands, setKnownBrands] = useState<string[]>([]);
    const [knownColors, setKnownColors] = useState<string[]>([]);
    const [knownTypes, setKnownTypes] = useState<string[]>([]);
    const [knownSuppliers, setKnownSuppliers] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        reset,
        formState: { errors }
    } = useForm<filament>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    })

    const material = watch('material');

    useEffect(() => {
        if (open && !filament && filaments) {
            setValue('identifier', generateIdentifier('PLA' as material, filaments));
        }
    }, [open])

    useEffect(() => {
        if (material && filaments) {
            const abbreviation = filamentAbbreviations[material as keyof typeof filamentAbbreviations];
            const currentIdentifier = watch('identifier');

            // If editing and identifier matches current material prefix, keep it
            if (filament && currentIdentifier && currentIdentifier.startsWith(`${abbreviation}-`)) {
                return;
            }

            // Only generate new identifier if it doesn't match the material prefix
            if (!currentIdentifier || !currentIdentifier.startsWith(`${abbreviation}-`)) {
                const newIdentifier = generateIdentifier(material, filaments);
                setValue('identifier', newIdentifier);
            }
        }
    }, [material, filaments, filament, setValue, watch])

    useEffect(() => {
        if (filaments) {
            // Get known brands
            const brandSet = new Set<string>();
            filaments.forEach(f => {
                if (f.brand) {
                    brandSet.add(f.brand);
                }
            });
            setKnownBrands(Array.from(brandSet).sort());

            // Get known colors
            const colorSet = new Set<string>();
            filaments.forEach(f => {
                if (f.color) {
                    colorSet.add(f.color);
                }
            });
            setKnownColors(Array.from(colorSet).sort());

            // Get known types
            const typeSet = new Set<string>();
            filaments.forEach(f => {
                if (f.type) {
                    typeSet.add(f.type);
                }
            });
            setKnownTypes(Array.from(typeSet).sort());

            // Get known suppliers
            const supplierSet = new Set<string>();
            filaments.forEach(f => {
                if (f.supplier) {
                    supplierSet.add(f.supplier);
                }
            });
            setKnownSuppliers(Array.from(supplierSet).sort());
        }
    }, [filaments]);

    const submitForm: SubmitHandler<filament> = (data) => {
        // Ensure colorHex is never null/undefined (DB requires non-null)
        if (!data.colorHex) {
            data.colorHex = '#000000'
        }

        // Normalize color to lowercase 7-char hex like #rrggbb
        const c = (data.colorHex || '').trim()
        // If user entered shorthand like #fff expand it
        const normalized = c.length === 4 && /^#?[0-9a-fA-F]{3}$/.test(c)
            ? '#' + c.replace(/^#?/, '').split('').map(ch => ch + ch).join('').toLowerCase()
            : (c.startsWith('#') ? c.toLowerCase() : '#' + c.toLowerCase())
        data.colorHex = normalized

        // Strip NaN (empty number inputs) and empty strings from optional fields
        if (isNaN(data.cost as number)) delete data.cost;
        if (isNaN(data.weightLeft as number)) delete data.weightLeft;
        if (!data.supplier) delete data.supplier;
        if (!data.notes) delete data.notes;

        const ps = data.printSettings;
        if (ps) {
            ((['nozzleTemp', 'bedTemp', 'flowRatio', 'pressureAdvance', 'retractionDistance', 'maxVolumetricSpeed'] as const)).forEach(key => {
                if (ps[key] === undefined || isNaN(ps[key] as number)) delete ps[key];
            });
        }

        onSubmit(data)
        setOpen(false) // Close dialog on successful submit
        reset() // Reset form
    }

    // Register the color field and keep color picker and hex text input in sync
    const color = watch('colorHex')
    useEffect(() => {
        // Register programmatically so we can control the input pair
        register('colorHex', { required: true })
        // Ensure a non-null default is set so the DB non-null constraint isn't violated
        // If editing an existing filament use its colorHex, otherwise default to '#000000'
        setValue('colorHex', filament?.colorHex || '#000000')
    }, [filament, register, setValue])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Plus />Add new Filament</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-3xl max-h-screen md:max-h-3/4 overflow-scroll'>
                <form onSubmit={handleSubmit(submitForm)} className='flex flex-col gap-4'>
                    <DialogHeader>
                        <DialogTitle>{filament ? 'Edit' : 'Add'} Filament</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        {/* Basic Info FieldSet */}
                        <FieldSet>
                            <FieldLegend>Basic Info</FieldLegend>
                            <FieldDescription>Enter the basic information about the filament.</FieldDescription>
                            <FieldGroup className='grid grid-cols-1 md:grid-cols-2'>
                                <Field>
                                    <FieldLabel htmlFor='filament-identifier' className={errors.identifier ? 'text-red-500' : ''}>Identifier *</FieldLabel>
                                    <Controller
                                        name='identifier'
                                        control={control}
                                        defaultValue={filament?.identifier || ''}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <>
                                                <Input
                                                    id='filament-identifier'
                                                    {...field}
                                                    placeholder='PL-287'
                                                    className={errors.identifier ? 'border-red-500' : ''}
                                                />
                                                {errors.identifier && <span className="text-red-500 text-sm">This field is required</span>}
                                            </>
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-type' className={errors.type ? 'text-red-500' : ''}>Type *</FieldLabel>
                                    <Controller
                                        name='type'
                                        control={control}
                                        defaultValue={filament?.type || ''}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <SuggestiveTextInput
                                                {...field}
                                                options={keyValueFromArr(knownTypes)}
                                                label="Select Type"
                                                buttonLabel='Select Type'
                                                id='filament-type'
                                            />
                                        )}
                                    />
                                    {errors.type && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-color' className={errors.colorHex ? 'text-red-500' : ''}>Color *</FieldLabel>
                                    <div className="grid grid-cols-4 gap-2">
                                        <Input
                                            type='text'
                                            className={`col-span-3 ${errors.colorHex ? 'border-red-500' : ''}`}
                                            id='filament-color-hex'
                                            placeholder="#rrggbb"
                                            value={color || '#000000'}
                                            onChange={(e) => setValue('colorHex', e.target.value)}
                                        />
                                        <Input
                                            type='color'
                                            id='filament-color'
                                            value={color || '#000000'}
                                            onChange={(e) => setValue('colorHex', e.target.value)}
                                        />
                                    </div>
                                    {errors.colorHex && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-color-name' className={errors.color ? 'text-red-500' : ''}>Color Name *</FieldLabel>
                                    <Controller
                                        name='color'
                                        control={control}
                                        defaultValue={filament?.color || ''}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <SuggestiveTextInput
                                                {...field}
                                                options={keyValueFromArr(knownColors)}
                                                label="Select Color"
                                                buttonLabel='Select Color'
                                                id='filament-color-name'
                                            />
                                        )}
                                    />
                                    {errors.color && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-color-material' className={errors.material ? 'text-red-500' : ''}>Material *</FieldLabel>
                                    <Controller
                                        name='material'
                                        control={control}
                                        defaultValue={filament?.material || 'PLA'}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger id='filament-color-material' className={errors.material ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select Material" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {arrMaterial.map((material) => (
                                                        <SelectItem key={material} value={material}>{material}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.material && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-brand' className={errors.brand ? 'text-red-500' : ''}>Brand *</FieldLabel>
                                    <Controller
                                        name='brand'
                                        control={control}
                                        defaultValue={filament?.brand || ''}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <SuggestiveTextInput
                                                {...field}
                                                options={keyValueFromArr(knownBrands)}
                                                id='filament-brand'
                                                buttonLabel='Select Brand'
                                                label='Select Brand'
                                            />
                                        )}
                                    />
                                    {errors.brand && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-diameter' className={errors.diameter ? 'text-red-500' : ''}>Diameter (mm) *</FieldLabel>
                                    <Input
                                        type='number'
                                        {...register('diameter', { required: true, valueAsNumber: true })}
                                        defaultValue={filament?.diameter || 1.75}
                                        min={0}
                                        step={0.01}
                                        className={errors.diameter ? 'border-red-500' : ''}
                                    />
                                    {errors.diameter && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-cost'>Cost</FieldLabel>
                                    <Input
                                        type='number'
                                        {...register('cost', { valueAsNumber: true })}
                                        defaultValue={filament?.cost || ''}
                                        min={0}
                                        step={0.01}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-supplier'>Supplier</FieldLabel>
                                    <Controller
                                        name='supplier'
                                        control={control}
                                        defaultValue={filament?.supplier || ''}
                                        render={({ field }) => (
                                            <SuggestiveTextInput
                                                {...field}
                                                id='filament-supplier'
                                                buttonLabel='Select Supplier'
                                                label='Select Supplier'
                                                options={keyValueFromArr(knownSuppliers)}
                                            />
                                        )}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-weight' className={errors.weight ? 'text-red-500' : ''}>Weight (g) *</FieldLabel>
                                    <Input
                                        type='number'
                                        {...register('weight', { required: true, valueAsNumber: true })}
                                        defaultValue={filament?.weight || 1000}
                                        min={0}
                                        step={5}
                                        className={errors.weight ? 'border-red-500' : ''}
                                    />
                                    {errors.weight && <span className="text-red-500 text-sm">This field is required</span>}
                                </Field>
                                <div className='flex gap-2'>
                                    <div>
                                        <Field className='h-full flex-shrink-0 flex items-center justify-center'>
                                            <FieldLabel htmlFor='filament-in-stock'>In Stock</FieldLabel>
                                            <FieldContent className='h-full flex justify-center items-center'>
                                                <Controller
                                                    name='inStock'
                                                    control={control}
                                                    defaultValue={filament?.inStock || false}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            checked={!!field.value}
                                                            onCheckedChange={(v) => field.onChange(v)}
                                                            aria-checked={!!field.value}
                                                        />
                                                    )}
                                                />
                                            </FieldContent>
                                        </Field>
                                    </div>
                                    <div className='flex-1'>
                                        <Field>
                                            <FieldLabel htmlFor='filament-weight-left' className={errors.weightLeft ? 'text-red-500' : ''}>Weight Left (g)</FieldLabel>
                                            {(() => {
                                                const inStock = watch('inStock')
                                                return (
                                                    <>
                                                        <Input
                                                            type='number'
                                                            {...register('weightLeft', { required: true, valueAsNumber: true })}
                                                            defaultValue={filament?.weightLeft || 1000}
                                                            min={0}
                                                            step={5}
                                                            disabled={!inStock}
                                                            aria-disabled={!inStock}
                                                            className={errors.weightLeft ? 'border-red-500' : ''}
                                                        />
                                                        {errors.weightLeft && <span className="text-red-500 text-sm">This field is required</span>}
                                                    </>
                                                )
                                            })()}
                                        </Field>
                                    </div>
                                </div>
                            </FieldGroup>
                        </FieldSet>
                        {/* Print Settings FieldSet */}
                        <FieldSet>
                            <FieldLegend>Print Settings</FieldLegend>
                            <FieldDescription>Configure the print settings for the filament.</FieldDescription>
                            <FieldGroup className='grid grid-cols-1 md:grid-cols-2'>
                                <Field>
                                    <FieldLabel htmlFor='filament-nozzle-temp' className={errors.printSettings?.nozzleTemp ? 'text-red-500' : ''}>Nozzle Temperature (°C)</FieldLabel>
                                    <Input
                                        type='number'
                                        id='filament-nozzle-temp'
                                        min={0} max={500} step={1}
                                        className={errors.printSettings?.nozzleTemp ? 'border-red-500' : ''}
                                        {...register('printSettings.nozzleTemp', { valueAsNumber: true, validate: v => v === undefined || isNaN(v) || (v >= 0 && v <= 500) || 'Must be 0–500' })}
                                    />
                                    {errors.printSettings?.nozzleTemp && <span className="text-red-500 text-sm">{errors.printSettings.nozzleTemp.message}</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-bed-temp' className={errors.printSettings?.bedTemp ? 'text-red-500' : ''}>Bed Temperature (°C)</FieldLabel>
                                    <Input
                                        type='number'
                                        id='filament-bed-temp'
                                        min={0} max={200} step={1}
                                        className={errors.printSettings?.bedTemp ? 'border-red-500' : ''}
                                        {...register('printSettings.bedTemp', { valueAsNumber: true, validate: v => v === undefined || isNaN(v) || (v >= 0 && v <= 200) || 'Must be 0–200' })}
                                    />
                                    {errors.printSettings?.bedTemp && <span className="text-red-500 text-sm">{errors.printSettings.bedTemp.message}</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-flow-ratio' className={errors.printSettings?.flowRatio ? 'text-red-500' : ''}>Flow Ratio</FieldLabel>
                                    <Input
                                        type='number'
                                        id='filament-flow-ratio'
                                        min={0} max={3} step={0.01}
                                        className={errors.printSettings?.flowRatio ? 'border-red-500' : ''}
                                        {...register('printSettings.flowRatio', { valueAsNumber: true, validate: v => v === undefined || isNaN(v) || (v >= 0 && v <= 3) || 'Must be 0–3' })}
                                    />
                                    {errors.printSettings?.flowRatio && <span className="text-red-500 text-sm">{errors.printSettings.flowRatio.message}</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-pressure-advance' className={errors.printSettings?.pressureAdvance ? 'text-red-500' : ''}>Pressure Advance</FieldLabel>
                                    <Input
                                        type='number'
                                        id='filament-pressure-advance'
                                        min={0} max={2} step={0.001}
                                        className={errors.printSettings?.pressureAdvance ? 'border-red-500' : ''}
                                        {...register('printSettings.pressureAdvance', { valueAsNumber: true, validate: v => v === undefined || isNaN(v) || (v >= 0 && v <= 2) || 'Must be 0–2' })}
                                    />
                                    {errors.printSettings?.pressureAdvance && <span className="text-red-500 text-sm">{errors.printSettings.pressureAdvance.message}</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-retraction-distance' className={errors.printSettings?.retractionDistance ? 'text-red-500' : ''}>Retraction Distance (mm)</FieldLabel>
                                    <Input
                                        type='number'
                                        id='filament-retraction-distance'
                                        min={0} max={20} step={0.1}
                                        className={errors.printSettings?.retractionDistance ? 'border-red-500' : ''}
                                        {...register('printSettings.retractionDistance', { valueAsNumber: true, validate: v => v === undefined || isNaN(v) || (v >= 0 && v <= 20) || 'Must be 0–20' })}
                                    />
                                    {errors.printSettings?.retractionDistance && <span className="text-red-500 text-sm">{errors.printSettings.retractionDistance.message}</span>}
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-max-volumetric-speed' className={errors.printSettings?.maxVolumetricSpeed ? 'text-red-500' : ''}>Max Volumetric Speed (mm³/s)</FieldLabel>
                                    <Input
                                        type='number'
                                        id='filament-max-volumetric-speed'
                                        min={0} max={100} step={0.1}
                                        className={errors.printSettings?.maxVolumetricSpeed ? 'border-red-500' : ''}
                                        {...register('printSettings.maxVolumetricSpeed', { valueAsNumber: true, validate: v => v === undefined || isNaN(v) || (v >= 0 && v <= 100) || 'Must be 0–100' })}
                                    />
                                    {errors.printSettings?.maxVolumetricSpeed && <span className="text-red-500 text-sm">{errors.printSettings.maxVolumetricSpeed.message}</span>}
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        {/* Notes FieldSet */}
                        <FieldSet>
                            <FieldLegend>Notes</FieldLegend>
                            <FieldDescription>Add any additional notes or comments about the filament.</FieldDescription>
                            <Field>
                                <textarea
                                    id='filament-notes'
                                    {...register('notes')}
                                    defaultValue={filament?.notes || ''}
                                    className='w-full p-2 border border-gray-300 rounded-md'
                                    rows={4}
                                />
                            </Field>
                        </FieldSet>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form >
            </DialogContent>
        </Dialog >
    )
}

export default FilamentForm