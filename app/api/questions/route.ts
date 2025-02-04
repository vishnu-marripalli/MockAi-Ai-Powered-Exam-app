export const dynamic = 'force-static'


import { NextResponse } from "next/server";
import { fetchQuestions } from "@/lib/aiClient";

export async function POST(req: Request) {
    // "use server";  // Ensure it's treated as a server function

  const { topic } = await req.json(); // Get topic from frontend/
  try {
    const questions = await fetchQuestions(topic);
    // console.log(questions);
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch questions" });
  }
}
