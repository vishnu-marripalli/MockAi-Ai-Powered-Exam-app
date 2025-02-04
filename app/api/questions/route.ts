export const config = { runtime: "edge" };

import { NextResponse } from "next/server";
import { fetchQuestions } from "@/lib/aiClient";

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();
        const questions = await fetchQuestions(topic);
        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch questions" });
    }
}
