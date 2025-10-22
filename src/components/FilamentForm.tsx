import React, { useEffect } from 'react'
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
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'

type FilamentFormProps = {
    filament?: filament;
    onSubmit: (filamentData: filament) => void;
}

function FilamentForm({ filament, onSubmit }: FilamentFormProps) {
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
            <form onSubmit={handleSubmit(submitForm)}>
                <DialogTrigger asChild>
                    <Button variant="outline"><Plus />Add new Filament</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{filament ? 'Edit' : 'Add'} Filament</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        {/* Basic Info FieldSet */}
                        <FieldSet>
                            <FieldLegend>Basic Info</FieldLegend>
                            <FieldDescription>Enter the basic information about the filament.</FieldDescription>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor='filament-identifier'>Identifier</FieldLabel>
                                    <Input id='filament-identifier' {...register('identifier', { required: true })} defaultValue={filament?.identifier || ''} />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor='filament-type'>Type</FieldLabel>
                                    <Select {...register('type', { required: true })} defaultValue={filament?.type || ''}>
                                        <SelectTrigger id="filament-type-trigger">
                                            <SelectValue placeholder="Select Material" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {arrMaterial.map((material) => (
                                                <option key={material} value={material}>{material}</option>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <Input id='filament-color-name' {...register('color')} defaultValue={filament?.color || ''} />
                                </Field>
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
            </form>
        </Dialog>
    )
}

export default FilamentForm
