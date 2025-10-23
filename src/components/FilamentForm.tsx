import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
import { arrMaterial, type filament } from '@/types/filament'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldContent } from './ui/field'
import { Select, SelectItem, SelectContent, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverTrigger } from './ui/popover'
import SuggestiveTextInput from './SuggestiveTextInput'
import { Checkbox } from './ui/checkbox'

const keyValueFromArr = (arr?: string[]) => {
    if (!arr) return []
    return arr.map((item) => ({ label: item, value: item }))
}

type FilamentFormProps = {
    filament?: filament;
    filaments?: filament[];
    onSubmit: (filamentData: filament) => void;
}

function FilamentForm({ filament, filaments, onSubmit }: FilamentFormProps) {
    const [brandSelectOpen, setBrandSelectOpen] = useState(false);
    const [value, setBrandSelectValue] = useState<string>("");
    const [knownBrands, setKnownBrands] = useState<string[]>([]);
    const [knownColors, setKnownColors] = useState<string[]>([]);
    const [knownTypes, setKnownTypes] = useState<string[]>([]);
    const [knownSuppliers, setKnownSuppliers] = useState<string[]>([]);

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

    const {
        register,
        handleSubmit,
        watch,
        setValue,
    } = useForm<filament>()
    const submitForm: SubmitHandler<filament> = (data) => {
        // Normalize color to lowercase 7-char hex like #rrggbb
        if (data.colorHex) {
            const c = data.colorHex.trim()
            // If user entered shorthand like #fff expand it
            const normalized = c.length === 4 && /^#?[0-9a-fA-F]{3}$/.test(c)
                ? '#' + c.replace(/^#?/, '').split('').map(ch => ch + ch).join('').toLowerCase()
                : (c.startsWith('#') ? c.toLowerCase() : '#' + c.toLowerCase())
            data.colorHex = normalized
        }
        onSubmit(data)
    }
    // Register the color field and keep color picker and hex text input in sync
    const color = watch('colorHex')
    useEffect(() => {
        // Register programmatically so we can control the input pair
        register('colorHex', { required: true })
        // When the external filament prop changes, populate the color field
        if (filament?.colorHex) {
            setValue('colorHex', filament.colorHex)
        }
    }, [filament, register, setValue])

    return (
        <Dialog>
            <form onSubmit={handleSubmit(submitForm)} >
                <DialogTrigger asChild>
                    <Button variant="outline"><Plus />Add new Filament</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-3xl'>
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
                                    <FieldLabel htmlFor='filament-identifier'>Identifier</FieldLabel>
                                    <Input
                                        id='filament-identifier'
                                        {...register('identifier', { required: true })}
                                        defaultValue={filament?.identifier || ''}
                                        placeholder='PL-287'
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-type'>Type</FieldLabel>
                                    <SuggestiveTextInput
                                        {...register('type', { required: true })}
                                        defaultValue={filament?.type || ''}
                                        options={keyValueFromArr(knownTypes)}
                                        label="Select Type"
                                        buttonLabel='Select Type'
                                        id='filament-type'
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-color'>Color</FieldLabel>
                                    <div className="grid grid-cols-4 gap-2">
                                        <Input
                                            type='text'
                                            className='col-span-3'
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
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-color-name'>Color Name</FieldLabel>
                                    <SuggestiveTextInput
                                        {...register('color', { required: true })}
                                        defaultValue={filament?.color || ''}
                                        options={keyValueFromArr(knownColors)}
                                        label="Select Color"
                                        buttonLabel='Select Color'
                                        id='filament-color-name'
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-color-material'>Material</FieldLabel>
                                    <Select
                                        {...register('material', { required: true })}
                                        defaultValue={filament?.material || 'PLA'}
                                    >
                                        <SelectTrigger id='filament-color-material'>
                                            <SelectValue placeholder="Select Material" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {arrMaterial.map((material) => (
                                                <SelectItem key={material} value={material}>{material}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-brand'>Brand</FieldLabel>
                                    <SuggestiveTextInput
                                        {...register('brand', { required: true })}
                                        options={keyValueFromArr(knownBrands)}
                                        id='filament-brand'
                                        buttonLabel='Select Brand'
                                        label='Select Brand'
                                        defaultValue={filament?.brand || ''}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-diameter'>Diameter (mm)</FieldLabel>
                                    <Input
                                        type='number'
                                        {...register('diameter', { required: true })}
                                        defaultValue={filament?.diameter || 1.75}
                                        min={0}
                                        step={0.01}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-cost'>Cost</FieldLabel>
                                    <Input
                                        type='number'
                                        {...register('cost')}
                                        defaultValue={filament?.cost || ''}
                                        min={0}
                                        step={0.01}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-supplier'>Supplier</FieldLabel>
                                    <SuggestiveTextInput
                                        {...register('supplier')}
                                        defaultValue={filament?.supplier || ''}
                                        id='filament-supplier'
                                        buttonLabel='Select Supplier'
                                        label='Select Supplier'
                                        options={keyValueFromArr(knownSuppliers)}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-weight'>Weight (g)</FieldLabel>
                                    <Input
                                        type='number'
                                        {...register('weight', { required: true })}
                                        defaultValue={filament?.weight || 1000}
                                        min={0}
                                        step={5}
                                    />
                                </Field>
                                <div className='flex gap-2'>
                                    <div>
                                        <Field className='h-full flex-shrink-0 flex items-center justify-center'>
                                            <FieldLabel htmlFor='filament-in-stock'>In Stock</FieldLabel>
                                            <FieldContent className='h-full flex justify-center items-center'>
                                                <Checkbox
                                                    {...register('inStock', { required: true })}
                                                    defaultChecked={filament?.inStock || false}
                                                />
                                            </FieldContent>
                                        </Field>
                                    </div>
                                    <div className='flex-1'>
                                        <Field>
                                            <FieldLabel htmlFor='filament-weight-left'>Weight Left (g)</FieldLabel>
                                            <Input
                                                disabled={!watch('inStock')}
                                                type='number'
                                                {...register('weightLeft', { required: true })}
                                                defaultValue={filament?.weightLeft || 1000}
                                                min={0}
                                                step={5}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </FieldGroup>
                        </FieldSet>
                        {/* Print Settings FieldSet */}
                        <FieldSet>
                            <FieldLegend>Print Settings</FieldLegend>
                            <FieldDescription>Configure the print settings for the filament.</FieldDescription>
                        </FieldSet>
                        {/* Notes FieldSet */}
                        <FieldSet>
                            <FieldLegend>Notes</FieldLegend>
                            <FieldDescription>Add any additional notes or comments about the filament.</FieldDescription>
                        </FieldSet>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form >
        </Dialog >
    )
}

export default FilamentForm
