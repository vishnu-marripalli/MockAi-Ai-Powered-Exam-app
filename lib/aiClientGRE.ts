import { GoogleGenerativeAI } from "@google/generative-ai";

export async function fetchQuestions() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate a 54-question GRE mock test matching the new 2023 format:

**Section Structure:**
1. **Verbal Reasoning** (27 questions total)
   - Section 1: 12 questions (18 minutes)
   - Section 2: 12 questions (23 minutes)
   - Question Types:
     • Text Completion (33%)  
     • Sentence Equivalence (33%)  
     • Reading Comprehension (33%)

2. **Quantitative Reasoning** (27 questions total)
   - Section 1: 12 questions (21 minutes)
   - Section 2: 12 questions (26 minutes)
   - Question Types:
     • Multiple Choice (45%)  
     • Numeric Entry (30%)  
     • Data Interpretation (25%)

**Key Requirements:**
- Follow the computer-adaptive format (Section 2 difficulty depends on Section 1 performance)
- Include modern vocabulary (e.g., "sustainable", "algorithmic bias")
- Focus on real-world math applications (climate data, financial literacy)
- Use contemporary RC topics: AI ethics, genetic engineering, economic trends

**Sample JSON Format:**
[
  {
    "section": "verbal_reasoning",
    "questions": [
      {
        "type": "text_completion",
        "question": "While the initial hypothesis seemed ______, further experimentation revealed significant flaws in its underlying assumptions.",
        "options": ["plausible", "specious", "irrefutable", "anachronistic", "meticulous"],
        "correct_answer": "plausible"
      },
      {
        "type": "sentence_equivalence",
        "question": "The negotiations were ______ by persistent disagreements, resulting in a stalemate.",
        "options": ["facilitated", "hindered", "impeded", "expedited", "augmented", "precipitated"],
        "correct_answers": ["hindered", "impeded"]
      }
    ]
  },
  {
    "section": "quantitative_reasonation",
    "questions": [
      {
        "type": "data_interpretation",
        "chart_data": "Bar graph showing renewable energy adoption rates (2020-2023)",
        "questions": [
          {
            "question": "Calculate the average annual growth rate over 3 years",
            "correct_answer": "8.3%"
          }
        ]
      },
      {
        "type": "algebra",
        "question": "Solve for x: 2(x + 3) - 5 = 3(4 - x)",
        "correct_answer": "2.2"
      }
    ]
  }
]`;

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