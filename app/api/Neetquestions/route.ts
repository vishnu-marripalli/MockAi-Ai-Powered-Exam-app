export const dynamic = 'force-static'


import { NextResponse } from "next/server";
import { fetchQuestions } from "@/lib/aiClientforNEET";

export async function POST(req: Request) {
    "use server";  // Ensure it's treated as a server function
  try {
    const questions = await fetchQuestions();
    // console.log(questions);
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch questions" });
  }
}
