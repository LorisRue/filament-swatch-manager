import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    const { data, error } = await supabase
        .from('Filaments')
        .select('*');

    if (error) {
        console.error("Error fetching filaments:", error);
        return new Response("Error fetching filaments", { status: 500 });
    }

    return Response.json({ filaments: data });
}

// TODO: POST