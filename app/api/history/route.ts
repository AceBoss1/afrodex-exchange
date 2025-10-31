// THIS FILE IS A TEMPORARY PLACEHOLDER
// It ensures a clean production build by removing imports that rely on missing backend modules.

import { NextResponse } from "next/server";

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
