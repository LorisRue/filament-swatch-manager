import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Plus } from 'lucide-react'

interface Props {
    options?: { label: string, value: string }[],
    buttonLabel?: string,
    label?: string,
    id: string
    defaultValue?: string
}

function SuggestiveTextInput(props: Props) {
    const { options, buttonLabel, id, label, defaultValue } = props

    const [values, setValues] = useState<{ label: string, value: string }[]>(options || [])
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (!options) {
            setValues([])
            return
        }
        setValues(options.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())))
    }, [query, options])

    // Stop printable key events from bubbling up to the Radix Select
    // Radix Select listens for type-to-select on keydown; when the search
    // input is focused we want typing to update the input only.
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // e.key is a single character for printable keys; keep this simple
        // and block those so the Select doesn't react. Allow control keys
        // (Enter, Escape, Arrow keys, Backspace, etc.) to bubble if needed.
        if (e.key.length === 1 || e.key === ' ') {
            e.stopPropagation()
        }
    }

    return (
        <Select defaultValue={defaultValue}>
            <SelectTrigger id={id}>
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
                    {query && !values.find((item) => item.value.toLocaleLowerCase() === query.toLowerCase()) && <SelectItem key={query} value={query}><Plus />{query}</SelectItem>}
                    {values.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SuggestiveTextInput
