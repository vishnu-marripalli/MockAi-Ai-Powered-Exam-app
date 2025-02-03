import { GoogleGenerativeAI } from "@google/generative-ai";

export async function fetchQuestions() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate a 60-question mock test based on the JEE exam pattern. The test should consist of three sections: Physics, Chemistry, and Mathematics, with 20 questions in each section. Each section should include:

1. **Physics**: Mechanics, Electromagnetism, Thermodynamics, Modern Physics, Optics, Waves, and other important JEE topics.
2. **Chemistry**: Organic Chemistry, Inorganic Chemistry, Physical Chemistry.
3. **Mathematics**: Algebra, Calculus, Coordinate Geometry, Trigonometry, Probability, and Statistics.

Each question should have the following format:
1. A clear, concise question statement.
2. Four options (A, B, C, D) where one is correct.
3. Indicate the correct answer using the format: "Correct Answer: [Option]".
4. Questions should cover varying difficulty levels: Easy, Moderate, and Difficult.

For each subject:
- Provide **conceptual** and **application-based** questions.
- Include a balance of **theory-based questions** and **numerical problems**.
- Ensure the questions follow the format of typical JEE questions.

Format:
[
  {
    "subject": "math",
    "questions": [
      {
        "question": "What is the value of 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correct_answer": "4"
      }
    ]
  },
  {
    "subject": "physics",
    "questions": [
      {
        "question": "What is the formula for acceleration?",
        "options": ["A = V/t", "A = F/m", "A = m*g", "A = F*d"],
        "correct_answer": "A = F/m"
      }
    ]
  },
  {
    "subject": "chemistry",
    "questions": [
      {
        "question": "What is the atomic number of carbon?",
        "options": ["4", "6", "8", "12"],
        "correct_answer": "6"
      }
    ]
  }
]

Ensure that the questions are appropriate for the JEE syllabus, and maintain clarity and accuracy in the formulation of both theoretical and numerical questions.`;

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
        console.error('JSON Parsing Error:', {
          error
         
        });
        return [];
      }
}