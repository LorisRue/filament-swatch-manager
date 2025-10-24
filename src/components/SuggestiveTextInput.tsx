import React, { useEffect, useState, forwardRef } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Plus } from 'lucide-react'

interface Props {
    options?: { label: string, value: string }[],
    buttonLabel?: string,
    label?: string,
    id: string
    defaultValue?: string
    value?: string
    onChange?: (value: string) => void
    name?: string
}

const SuggestiveTextInput = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const { options, buttonLabel, id, label, defaultValue, value, onChange, name } = props
    const [values, setValues] = useState<{ label: string, value: string }[]>(options || [])
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (!options) {
            setValues([])
            return
        }
        setValues(options.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())))
    }, [query, options])

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.length === 1 || e.key === ' ') {
            e.stopPropagation()
        }
    }

    return (
        <Select
            defaultValue={defaultValue}
            value={value}
            onValueChange={onChange}
            name={name}
        >
            <SelectTrigger id={id} ref={ref}>
                <SelectValue placeholder={buttonLabel} />
            </SelectTrigger>
            <SelectContent className='max-h-72 overflow-y-scroll'>
                <SelectGroup>
                    {label && <SelectLabel>{label}</SelectLabel>}
                    <Input
                        className='mb-1'
                        placeholder='Search...'
                        value={query || ''}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                    />
                    {query && !values.find((item) => item.value.toLocaleLowerCase() === query.toLowerCase()) &&
                        <SelectItem key={query} value={query}><Plus />{query}</SelectItem>
                    }
                    {values.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
})

SuggestiveTextInput.displayName = 'SuggestiveTextInput'

export default SuggestiveTextInput