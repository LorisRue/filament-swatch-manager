import { supabase } from "@/lib/supabaseClient";
import { convertDbToFilament } from "@/lib/utils";
import type { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } | Promise<{ id: string }> }
) {
    // Next's generated types may provide params as a Promise or a plain object.
    // Awaiting ensures compatibility with both shapes.
    const { id } = await params;

    const { data, error } = await supabase
        .from('Filaments')
        .select('*')
        .eq('identifier', id);

    if (error) {
        console.error("Error fetching filaments:", error);
        return Response.json({ error: "Error fetching filaments" }, { status: 500 });
    }

    if (!data || data.length === 0) {
        return Response.json({ error: "Filament not found" }, { status: 404 });
    }

    const filament = convertDbToFilament(data[0]);

    return Response.json({ filament }, { status: 200 });


    // TODO: POST
}

// TODO: PUT, PATCH, DELETE