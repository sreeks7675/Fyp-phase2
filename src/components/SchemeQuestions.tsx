/* working  version */
import { useState, useEffect } from "react";
import VoiceInterface  from "./VoiceInterface";
const API_BASE_URL = 'http://localhost:5001';
type Language = "ta"|"en";
interface Question {
  key: string;
  label: string;
  labelEn: string;
}

interface SchemeQuestionsProps {
  schemeName: string;
  questions: Question[];
  language: Language;
  onComplete: (answers: Record<string, string>) => void;
}

export const SchemeQuestions = ({
  schemeName,
  questions,
  language,
  onComplete,
}: SchemeQuestionsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textAnswer,setTextAnswer]=useState("");
  const [transcript, setTranscript] = useState("");
  const [agentText, setAgentText] = useState("");

  const submitTextAnswer = async () => {
    if (!textAnswer.trim()) return;
    
    // For scheme questions, validate the answer using the backend
    try {
      const response = await fetch(`${API_BASE_URL}/validate_scheme_field`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_key: questions[currentStep].key,
          field_label: language === 'ta' ? questions[currentStep].label : questions[currentStep].labelEn,
          value: textAnswer.trim(),
          language: language
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.is_valid) {
          handleStepComplete(questions[currentStep].key, textAnswer.trim());
          setTextAnswer("");
        } else {
          // Show error message
          setAgentText(data.agent_text || (language === 'ta' ? "மீண்டும் முயற்சிக்கவும்." : "Please try again."));
        }
      } else {
        // If validation endpoint doesn't exist, use basic validation
        const isValid = validateTextAnswer(questions[currentStep].key, textAnswer.trim());
        if (isValid) {
          handleStepComplete(questions[currentStep].key, textAnswer.trim());
          setTextAnswer("");
        } else {
          setAgentText(language === 'ta' ? "மீண்டும் முயற்சிக்கவும்." : "Please try again.");
        }
      }
    } catch (error) {
      // If validation fails, use basic validation
      console.error("Validation error:", error);
      const isValid = validateTextAnswer(questions[currentStep].key, textAnswer.trim());
      if (isValid) {
        handleStepComplete(questions[currentStep].key, textAnswer.trim());
        setTextAnswer("");
      } else {
        setAgentText(language === 'ta' ? "மீண்டும் முயற்சிக்கவும்." : "Please try again.");
      }
    }
  };
  
  const validateTextAnswer = (fieldKey: string, value: string): boolean => {
    if (!value || value.trim() === "") return false;
    
    // Basic validation similar to backend
    if (fieldKey === "farmSize" || fieldKey === "land_size") {
      return /\d+/.test(value);
    } else if (fieldKey === "annualIncome" || fieldKey === "loanAmount" || fieldKey === "loan_amount") {
      return /\d+/.test(value);
    }
    
    return value.length >= 1;
  };

  const handleStepComplete = (key: string, data: string) => {
    const newAnswers = { ...answers, [key]: data };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Clear transcript for next question
      setTranscript("");
    } else {
      onComplete(newAnswers);
    }
  };
  
  // Update agent text from VoiceInterface
  useEffect(() => {
    // This will be updated by VoiceInterface when it receives responses
  }, []);
  const currentQuestion =
  language === "ta"
    ? questions[currentStep]?.label
    : questions[currentStep]?.labelEn;
  
  // Update agent text when step changes
  useEffect(() => {
    if (questions[currentStep]) {
      const questionText = language === "ta" ? questions[currentStep]?.label : questions[currentStep]?.labelEn;
      setAgentText(questionText || "");
    }
  }, [currentStep, language, questions]);


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-kiosk-header mb-2">
          {language === "ta" ? "கூடுதல் தகவல் தேவை" : "Additional Information Required"}
        </h2>
        <p className="text-muted-foreground">
          {schemeName}
        </p>
      </div>
      <div className="mb-6 text-center">
        <p className="text-xl font-semibold text-kiosk-header">
          {currentQuestion}
        </p>
      </div>
      
      <VoiceInterface
        isListening={isListening}
        onListeningChange={setIsListening}
        currentStep={currentStep}
        onStepComplete={handleStepComplete}
        language={language}
        steps={questions}
        transcript={transcript}
        onTranscriptChange={setTranscript}
      />
      {agentText && agentText !== currentQuestion && (
        <div className="mb-4 text-center">
          <p className="text-lg text-red-600">
            {agentText}
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <p className="text-sm font-medium mb-2">
          {language==="ta"
          ? "அல்லது இங்கே எழுதுங்கள்"
          : "Or type your answer here"}
        </p>
        <textarea
          className="w-full border rounded p-2 text-sm"
          rows={2}
          value={textAnswer}
          onChange={(e)=>setTextAnswer(e.target.value)}
          placeholder={
            language==="ta"
            ? "உங்கள் பதிலை இங்கே உள்ளிடவும்..."
            : "Enter your answer here..."
          }
        />
        <button
          onClick={submitTextAnswer}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {language==="ta" ? "பதில்களை சமர்ப்பிக்கவும்" : "Submit Answer"}
        </button>
      </div>
    </div>
  );
};

