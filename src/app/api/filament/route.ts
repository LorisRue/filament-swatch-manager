import { supabase } from "@/lib/supabaseClient";
import { convertFilamentToDb } from "@/lib/utils";
import { filament } from "@/types/filament";

// TODO: Add Serverside caching
export async function GET() {
  const { data, error } = await supabase.from("Filaments").select("*");

  if (error) {
    console.error("Error fetching filaments:", error);
    return new Response("Error fetching filaments", { status: 500 });
  }

  return Response.json({ filaments: data }, { status: 200 });
}

export async function POST(request: Request) {
  const filament: filament = await request.json();

  filament.dateAdded = filament.dateAdded || new Date().toISOString();

  const filamentDb = convertFilamentToDb(filament);
  const { error } = await supabase.from("Filaments").insert([filamentDb]);

  if (error) {
    console.error("Error inserting filament:", error);
    return new Response("Error inserting filament", { status: 500 });
  }

  return Response.json(
    { message: "Filament added successfully" },
    { status: 201 }
  );
}
