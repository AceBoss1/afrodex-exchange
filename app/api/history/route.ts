// THIS FILE IS A TEMPORARY PLACEHOLDER
// It ensures a clean production build by removing imports that rely on missing backend modules
// and explicitly forcing dynamic rendering for Vercel.

import { NextResponse } from "next/server";

// CRITICAL FIX: Force the route to be dynamic to prevent static rendering errors on Vercel
export const dynamic = 'force-dynamic';

export async function POST() {
    console.error("API Route functionality is disabled in this environment build.");
    return NextResponse.json(
        { error: "Backend logic dependencies are missing. Functionality is disabled." },
        { status: 501 } // 501 Not Implemented
    );
}

export async function GET() {
    return POST(); // Use the same disabled response for GET requests
}
