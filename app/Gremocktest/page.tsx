"use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Timer } from "lucide-react";
// import { Progress } from "@/components/ui/progress";

// // Type definitions
// type QuestionOption = string;
// type CorrectAnswer = string | string[];

// interface Question {
//   type: 'text_completion' | 'multiple_choice' | 'sentence_equivalence' | 'reading_comprehension' | 'numeric_entry' | 'data_interpretation' | 'algebra' | 'geometry';
//   question: string;
//   options?: QuestionOption[];
//   correct_answer?: string;
//   correct_answers?: string[];
//   passage?: string;
//   chart_data?: string;
//   questions?: SubQuestion[];
// }

// interface SubQuestion {
//   question: string;
//   correct_answer: string;
// }

// interface Section {
//   section: string;
//   section_number: number;
//   questions: Question[];
// }

// interface ExamResults {
//   totalQuestions: number;
//   correctAnswers: number;
//   percentageScore: string;
//   sectionResults: Record<string, {
//     total: number;
//     correct: number;
//     percentage: string;
//   }>;
// }

export default function ExamPage() {
//   const [examData, setExamData] = useState<Section[]>([]);
//   const [currentSection, setCurrentSection] = useState<number>(0);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
//   const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
//   const [examResults, setExamResults] = useState<ExamResults | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState<number>(3600);
//   const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//  useEffect(() => {
//     async function fetchQuestions() {
//       try {
//         const res = await fetch("/api/Grequestions", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           console.log(data);
//           setExamData(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchQuestions();
//   }, []);

//   const handleQuestionNavigation = (sectionIndex: number, questionIndex: number) => {
//     setCurrentSection(sectionIndex);
//     setCurrentQuestionIndex(questionIndex);
//   };

//   const renderQuestionNavigationSidebar = () => (
//     <div className="w-64 border-l p-4 overflow-y-auto">
//       <h3 className="font-bold mb-4">Exam Navigation</h3>
//       {examData.map((section, sectionIndex) => (
//         <div key={sectionIndex} className="mb-4">
//           <h4 className="font-semibold mb-2">
//             {section.section.replace('_', ' ').toUpperCase()} Section {section.section_number}
//           </h4>
//           <div className="grid grid-cols-5 gap-2">
//             {section.questions.map((_, questionIndex) => (
//               <Button
//                 key={questionIndex}
//                 variant={
//                   sectionIndex === currentSection && questionIndex === currentQuestionIndex 
//                     ? 'default' 
//                     : 'outline'
//                 }
//                 size="sm"
//                 onClick={() => handleQuestionNavigation(sectionIndex, questionIndex)}
//               >
//                 {sectionIndex * section.questions.length + questionIndex + 1}
//               </Button>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   useEffect(() => {
//     if (isExamStarted && timeRemaining > 0) {
//       timerRef.current = setInterval(() => {
//         setTimeRemaining(prev => {
//           if (prev <= 1) {
//             clearInterval(timerRef.current);
//             evaluateExam();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [isExamStarted]);

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//   };

//   const handleAnswerSelection = (questionId: string, answer: string | string[]) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }));
//   };

//   const moveToNextQuestion = () => {
//     const currentSectionQuestions = examData[currentSection].questions;
//     if (currentQuestionIndex < currentSectionQuestions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     } else if (currentSection < examData.length - 1) {
//       setCurrentSection(prev => prev + 1);
//       setCurrentQuestionIndex(0);
//     } else {
//       evaluateExam();
//     }
//   };

//   const evaluateExam = () => {
//     let totalQuestions = 0;
//     let correctAnswers = 0;
//     let sectionResults: Record<string, { total: number; correct: number; percentage: string }> = {};

//     examData.forEach(section => {
//       let sectionCorrect = 0;
//       let sectionTotal = 0;

//       section.questions.forEach(question => {
//         // Handle different question types
//         if (question.type === 'data_interpretation' && question.questions) {
//           // Special handling for data interpretation
//           question.questions.forEach(subQuestion => {
//             totalQuestions++;
//             sectionTotal++;
//             const userAnswer = selectedAnswers[subQuestion.question];
            
//             if (userAnswer === subQuestion.correct_answer) {
//               correctAnswers++;
//               sectionCorrect++;
//             }
//           });
//         } else {
//           totalQuestions++;
//           sectionTotal++;
          
//           const userAnswer = selectedAnswers[question.question];
          
//           // Handling different question types
//           switch (question.type) {
//             case 'text_completion':
//             case 'multiple_choice':
//               if (userAnswer === question.correct_answer) {
//                 correctAnswers++;
//                 sectionCorrect++;
//               }
//               break;
            
//             case 'sentence_equivalence':
//               if (Array.isArray(question.correct_answers) && 
//                   question.correct_answers.some(ans => 
//                     Array.isArray(userAnswer) && userAnswer.includes(ans)
//                   )) {
//                 correctAnswers++;
//                 sectionCorrect++;
//               }
//               break;
            
//             case 'reading_comprehension':
//               if (userAnswer === question.correct_answer) {
//                 correctAnswers++;
//                 sectionCorrect++;
//               }
//               break;
            
//             case 'numeric_entry':
//             case 'algebra':
//             case 'geometry':
//               if (userAnswer === question.correct_answer) {
//                 correctAnswers++;
//                 sectionCorrect++;
//               }
//               break;
//           }
//         }
//       });

//       sectionResults[section.section] = {
//         total: sectionTotal,
//         correct: sectionCorrect,
//         percentage: ((sectionCorrect / sectionTotal) * 100).toFixed(2)
//       };
//     });

//     const percentageScore = ((correctAnswers / totalQuestions) * 100).toFixed(2);

//     setExamResults({
//       totalQuestions,
//       correctAnswers,
//       percentageScore,
//       sectionResults
//     });

//     setIsResultModalOpen(true);
//   };

//   const renderCurrentQuestion = () => {
//     if (!examData || !isExamStarted) return null;

//     const currentQuestion = examData[currentSection].questions[currentQuestionIndex];

//     switch (currentQuestion.type) {
//       case "text_completion":
//       case "multiple_choice":
//         return (
//           <RadioGroup 
//             onValueChange={(value) => handleAnswerSelection(currentQuestion.question, value)}
//           >
//             {currentQuestion.options?.map((option, idx) => (
//               <div key={idx} className="flex items-center space-x-2 my-2">
//                 <RadioGroupItem value={option} id={`option-${idx}`} />
//                 <Label htmlFor={`option-${idx}`}>{option}</Label>
//               </div>
//             ))}
//           </RadioGroup>
//         );

//       case "sentence_equivalence":
//         return (
//           <div>
//             {currentQuestion.options?.map((option, idx) => (
//               <div key={idx} className="flex items-center space-x-2 my-2">
//                 <Checkbox 
//                   id={`option-${idx}`}
//                   onCheckedChange={(checked) => {
//                     const currentSelected = selectedAnswers[currentQuestion.question] || [];
//                     const newSelected = checked 
//                       ? [...(currentSelected as string[]), option]
//                       : (currentSelected as string[]).filter(item => item !== option);
//                     handleAnswerSelection(currentQuestion.question, newSelected);
//                   }}
//                 />
//                 <Label htmlFor={`option-${idx}`}>{option}</Label>
//               </div>
//             ))}
//           </div>
//         );

//         case "reading_comprehension":
//             return (
//               <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold text-gray-800 mb-4">Passage</h2>
//                   <p className="text-gray-700 leading-relaxed">{currentQuestion.passage}</p>
//                 </div>
          
//                 {currentQuestion.questions?.map((subQuestion, subQuestionIndex) => (
//                   <div key={subQuestionIndex} className="mb-5 p-4 bg-white rounded-lg shadow-sm">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">{subQuestion.question}</h3>
//                     <div className="space-y-2">
//                       {subQuestion.options?.map((option, optionIndex) => (
//                         <button 
//                           key={optionIndex}
//                           onClick={() => handleAnswerSelection(
//                             subQuestion.question, 
//                             option
//                           )}
//                           className={`w-full text-left p-3 border border-gray-300 rounded-md 
//                             hover:bg-blue-50 hover:border-blue-500 transition-colors
//                             focus:outline-none focus:ring-2 focus:ring-blue-400
//                             ${selectedAnswers[subQuestion.question] === option 
//                               ? 'bg-blue-100 border-blue-500' 
//                               : ''}`}
//                         >
//                           {option}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             );
//       case "numeric_entry":
//       case "algebra":
//       case "geometry":
//         return (
//           <div className="flex items-center space-x-2">
//             <Input 
//               type="text" 
//               placeholder="Enter your answer"
//               onChange={(e) => handleAnswerSelection(currentQuestion.question, e.target.value)}
//             />
//           </div>
//         );

//       case "data_interpretation":
//         return (
//           <div>
//             <p className="mb-4 italic text-sm">{currentQuestion.chart_data}</p>
//             {currentQuestion.questions?.map((subQuestion, idx) => (
//               <div key={idx} className="mb-4">
//                 <p className="mb-2">{subQuestion.question}</p>
//                 <Input 
//                   type="text" 
//                   placeholder="Enter your answer"
//                   onChange={(e) => handleAnswerSelection(subQuestion.question, e.target.value)}
//                 />
//               </div>
//             ))}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   const renderResultModal = () => {
//     if (!examResults) return null;

//     return (
//       <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Exam Results</DialogTitle>
//             <DialogDescription>
//               <div className="space-y-4">
//                 <p>Total Questions: {examResults.totalQuestions}</p>
//                 <p>Correct Answers: {examResults.correctAnswers}</p>
//                 <p>Score: {examResults.percentageScore}%</p>
                
//                 <div>
//                   <h4 className="font-bold mb-2">Section Breakdown</h4>
//                   {Object.entries(examResults.sectionResults).map(([section, result]) => (
//                     <div key={section} className="mb-2">
//                       <p>{section.replace('_', ' ').toUpperCase()}</p>
//                       <p>Correct: {result.correct}/{result.total} ({result.percentage}%)</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   if (isLoading) return <div>Loading...</div>;

//   return (
//     <div className="flex">
//       <div className="flex-grow">
//         {!isExamStarted ? (
//           <Card>
//             <CardHeader>
//               <CardTitle>Exam Preparation</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center">
//                 <p>Total Sections: {examData.length}</p>
//                 <p>Exam Duration: 1 hour</p>
//                 <Button onClick={() => setIsExamStarted(true)} className="mt-4">
//                   Start Exam
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ) : (
//           <Card>
//             <CardHeader className="flex flex-row justify-between items-center">
//               <CardTitle>
//                 {examData[currentSection].section.replace('_', ' ').toUpperCase()} Section {examData[currentSection].section_number}
//               </CardTitle>
//               <div className="flex items-center space-x-2">
//                 <Timer className="h-5 w-5" />
//                 <span>{formatTime(timeRemaining)}</span>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Progress 
//                 value={((currentSection * examData[0].questions.length + currentQuestionIndex + 1) / 
//                         (examData.length * examData[0].questions.length)) * 100} 
//                 className="mb-4"
//               />
//               <div className="mb-4">
//                 <p>{examData[currentSection].questions[currentQuestionIndex].question}</p>
//               </div>
//               {renderCurrentQuestion()}
//               <Button 
//                 onClick={moveToNextQuestion} 
//                 className="mt-4"
//                 disabled={!selectedAnswers[examData[currentSection].questions[currentQuestionIndex].question]}
//               >
//                 {currentSection === examData.length - 1 && 
//                  currentQuestionIndex === examData[currentSection].questions.length - 1 
//                  ? 'Submit Exam' : 'Next Question'}
//               </Button>
//             </CardContent>
//           </Card>
//         )}
        
//         {renderResultModal()}
//       </div>
      
//       {isExamStarted && renderQuestionNavigationSidebar()}
//     </div>
//   );
}