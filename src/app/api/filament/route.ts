import { supabase } from "@/lib/supabaseClient";
import { validateFilament } from "@/lib/validateFilament";
import { convertFilamentToDb } from "@/lib/utils";
import { filament } from "@/types/filament";
import { arrMaterial } from "@/types/filament";

const COLOR_HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const validateFilamentPayload = (
  payload: unknown,
): { valid: boolean; message?: string } => {
  if (!isObject(payload)) {
    return { valid: false, message: "Invalid JSON payload" };
  }

  const requiredStringFields = [
    "identifier",
    "type",
    "color",
    "colorHex",
    "material",
    "brand",
  ] as const;
  for (const field of requiredStringFields) {
    const value = payload[field];
    if (typeof value !== "string" || value.trim() === "") {
      return { valid: false, message: `Missing or invalid field: ${field}` };
    }
  }

  if (!arrMaterial.includes(payload.material as (typeof arrMaterial)[number])) {
    return { valid: false, message: "Invalid material value" };
  }

  if (!COLOR_HEX_REGEX.test(String(payload.colorHex))) {
    return { valid: false, message: "Invalid colorHex format" };
  }

  if (typeof payload.diameter !== "number" || payload.diameter <= 0) {
    return { valid: false, message: "Invalid diameter value" };
  }

  if (typeof payload.weight !== "number" || payload.weight <= 0) {
    return { valid: false, message: "Invalid weight value" };
  }

  if (typeof payload.inStock !== "boolean") {
    return { valid: false, message: "Invalid inStock value" };
  }

  if (!isObject(payload.printSettings)) {
    return { valid: false, message: "Missing printSettings object" };
  }

  return { valid: true };
};

// TODO: Add Serverside caching
export async function GET() {
  const { data, error } = await supabase.from("Filaments").select("*");

  if (error) {
    console.error("Error fetching filaments:", error);
    return new Response("Error fetching filaments", { status: 500 });
  }

  return new Response(JSON.stringify({ filaments: data }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const validation = validateFilamentPayload(payload);
  if (!validation.valid) {
    return new Response(validation.message ?? "Invalid request", {
      status: 400,
    });
  }

  const filament: filament = payload as filament;

  const validationErrors = validateFilament(filament);
  if (validationErrors.length > 0) {
    return new Response(JSON.stringify({ errors: validationErrors }), {
      status: 422,
      headers: { "content-type": "application/json" },
    });
  }

  filament.dateAdded = filament.dateAdded || new Date().toISOString();

  const filamentDb = convertFilamentToDb(filament);
  const { error } = await supabase.from("Filaments").insert([filamentDb]);

  if (error) {
    if (error.code === "23505") {
      return new Response("Filament already exists", { status: 409 });
    }
    console.error("Error inserting filament:", error);
    return new Response("Error inserting filament", { status: 500 });
  }

  return new Response(
    JSON.stringify({ message: "Filament added successfully" }),
    {
      status: 201,
      headers: { "content-type": "application/json" },
    },
  );
}
