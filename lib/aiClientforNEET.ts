import { GoogleGenerativeAI } from "@google/generative-ai";

export async function fetchQuestions() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Generate a 100-question mock test based on the NEET exam pattern. The test should consist of three sections: Physics, Chemistry,Zoology, and Botany, with 25 questions in each section. Each section should include:

1. **Physics**: Mechanics, Thermodynamics, Electromagnetism, Optics, Modern Physics, Laws of Motion, Gravitation, and other important NEET topics.
2. **Chemistry**:
   - Organic: Basic Principles, Hydrocarbons, Biomolecules
   - Inorganic: Periodic Table, Coordination Compounds
   - Physical: Solutions, Electrochemistry, Chemical Kinetics
3. **Biology**:
   - Botany: Plant Physiology, Genetics, Ecology
   - Zoology: Human Physiology, Reproduction, Biotechnology

Each question should have:
1. A clear, concise question statement
2. Four options (A, B, C, D) with one correct answer
3. Marked with "Correct Answer: [Option]"
4. Difficulty levels: Easy (30%), Moderate (50%), Difficult (20%)

Question Types:
- Physics: Numerical problems & conceptual questions
- Chemistry: Reaction mechanisms & application-based
- Biology: Diagram-based & process-oriented questions

Format:
[
  {
    "subject": "physics",
    "questions": [
      {
        "question": "A convex lens of focal length 15cm forms an image at 30cm. What is the object distance?",
        "options": ["10 cm", "30 cm", "15 cm", "45 cm"],
        "correct_answer": "30 cm"
      }
    ]
  },
  {
    "subject": "chemistry",
    "questions": [
      {
        "question": "Which catalyst is used in Friedel-Crafts acylation?",
        "options": ["Ni", "Pd", "Anhydrous AlCl3", "Fe"],
        "correct_answer": "Anhydrous AlCl3"
      }
    ]
  },
  {
    "subject": "Botany",
    "questions": [
      {
        "question": "Which plant hormone promotes cell division?",
        "options": ["Auxin", "Gibberellin", "Cytokinin", "Ethylene"],
        "correct_answer": "Cytokinin"
      }
    ]
  },
   {
    "subject": "Zoology",
    "questions": [
      {
        "question": "Which plant hormone promotes cell division?",
        "options": ["Auxin", "Gibberellin", "Cytokinin", "Ethylene"],
        "correct_answer": "Cytokinin"
      }
    ]
  }
]

Important:
- Follow latest NCERT syllabus
- Include NCERT exemplar-type questions
- Balance theory (60%) and numericals (40%) in Physics/Chemistry
- Focus on NEET previous year question patterns
- Ensure medical relevance in biology questions
- Avoid advanced JEE-level mathematics
-ensure that the response is in the format of the above JSON.`;

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