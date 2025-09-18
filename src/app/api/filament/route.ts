import { sampleFilaments } from "@/data/sampleFilaments";

export async function GET() {
    return Response.json({ filaments: sampleFilaments });
}

// TODO: POST