import React from 'react'

interface Props {
    params: { id: string }
}

function Page(props: Props) {
    const { params } = props

    return (
        <div>
            <h1>Filament Details</h1>
            <p>ID: {params.id}</p>
        </div>
    )
}

export default Page
