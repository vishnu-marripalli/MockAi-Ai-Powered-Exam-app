// export const config = { runtime: "edge" };

export const runtime = "edge";

import { NextResponse } from "next/server";
import { fetchQuestions } from "@/lib/aiClient";

export async function POST(req: Request) {
    try {
        const { topic,difficulty } = await req.json();
        // console.log("data",topic,difficulty);
        // console.log("time of request", new Date().toLocaleTimeString());
        const questions = await fetchQuestions(topic,difficulty);
        // console.log("time of response", new Date().toLocaleTimeString());
        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch questions" });
    }
}
