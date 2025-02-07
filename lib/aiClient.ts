import { GoogleGenerativeAI } from "@google/generative-ai";

export async function fetchQuestions(topic: string,difficulty:string): Promise<any> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate 10 unique and non-repetitive multiple-choice questions on the topic "${topic}" with a difficulty level of "${difficulty}". 
Each question should cover a different concept within the topic. 

Format:
[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct_answer": "Paris",
    "explanation":"Because Paris is captail of france",
  }
]

Guidelines:
1. The difficulty level can be "easy", "medium", or "hard".
2. Ensure each question covers a different aspect of the topic.
3. Make the questions challenging and avoid duplication.
4. Provide exactly four answer choices, with only one being correct.
5. Ensure questions are well-structured and grammatically correct.

Generate fresh and unique questions each time.`
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textOutput = response.text();
        // console.log("Raw AI Response:", textOutput);

        // Extract JSON part from AI response
        const jsonMatch = textOutput.match(/\[.*\]/s);
        const questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      // console.log(questions);
        return questions;
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
}
