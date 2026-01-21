import { useState } from "react";

const Quiz = () => {
  const questions = [
    {
      question: "How does your skin look 3 hours after applying foundation?",
      options: [
        "Patchy, flaky, or clinging to dry spots",
        "Very shiny or the makeup is 'sliding' off",
        "Oily on the nose/forehead but dry elsewhere",
        "Smooth and still mostly in place",
        "Red, bumpy, or feeling quite itchy",
      ],
    },
    {
      question: "What is your primary concern when picking a base product?",
      options: [
        "Adding moisture and a healthy glow",
        "Controlling oil and staying matte",
        "Finding a balance for different zones",
        "Just evening out my natural tone",
        "Avoiding ingredients that cause redness",
      ],
    },
    {
      question: "How do your pores usually behave under makeup?",
      options: [
        "They are nearly invisible",
        "They look large and get filled with oil",
        "Only visible in the T-zone area",
        "Normal and easy to cover",
        "They often get inflamed or irritated",
      ],
    },
    {
      question: "Which finish do you usually prefer for your makeup?",
      options: [
        "Dewy and ultra-hydrating",
        "Strictly matte and long-wearing",
        "Natural or satin finish",
        "Anything feels comfortable",
        "Fragrance-free and hypoallergenic only",
      ],
    },
    {
      question: "If you use a face powder, how does it feel on your skin?",
      options: [
        "Too drying, makes me look cakey",
        "Essential to stop me from looking greasy",
        "Good for my nose, but bad for my cheeks",
        "Sets my makeup perfectly",
        "Sometimes makes my skin feel tight and itchy",
      ],
    },
  ];

  const skinTypeDescriptions = {
    Dry: "Your skin needs moisture-rich formulas. We recommend cream-based blushes and hydrating foundations to keep your glow alive.",
    Oily: "You suit matte, oil-free products. Look for long-wear primers and setting powders to keep your look locked in all day.",
    Combination:
      "You need a versatile kit. Try mattifying your T-zone while using luminous products on your cheeks for a balanced finish.",
    Normal:
      "You have the perfect canvas! Most makeup textures will work for you, from light tints to full-coverage glam.",
    Sensitive:
      "Gentle is best. We recommend mineral-based makeup and fragrance-free formulas to prevent irritation and redness.",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [skinType, setSkinType] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const calculateSkinType = (answers) => {
    const score = { Dry: 0, Oily: 0, Combination: 0, Normal: 0, Sensitive: 0 };

    answers.forEach((answer) => {
      if (
        answer.includes("Patchy") ||
        answer.includes("moisture") ||
        answer.includes("drying")
      )
        score.Dry++;
      if (
        answer.includes("shiny") ||
        answer.includes("matte") ||
        answer.includes("large")
      )
        score.Oily++;
      if (
        answer.includes("T-zone") ||
        answer.includes("balance") ||
        answer.includes("different zones")
      )
        score.Combination++;
      if (
        answer.includes("Smooth") ||
        answer.includes("evening out") ||
        answer.includes("perfectly")
      )
        score.Normal++;
      if (
        answer.includes("Red") ||
        answer.includes("redness") ||
        answer.includes("inflamed") ||
        answer.includes("Fragrance-free")
      )
        score.Sensitive++;
    });

    const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  const handleNext = () => {
    if (!selectedOption) {
      alert("Please select a beauty preference!");
      return;
    }
    const updatedAnswers = [...answers, selectedOption];
    setAnswers(updatedAnswers);
    setSelectedOption("");

    if (currentQuestionIndex === questions.length - 1) {
      const result = calculateSkinType(updatedAnswers);
      setSkinType(result);
    }
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentQuestionIndex === 0) return;
    setSelectedOption("");
    setAnswers((prev) => prev.slice(0, -1));
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  if (skinType) {
    const description = skinTypeDescriptions[skinType];
    return (
      <div className="bg-[#FCFAFA] min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-xl border border-[#F2E8E4] p-12 text-center">
          <h2 className="text-sm tracking-[0.3em] uppercase text-[#A55166] font-bold mb-2">
            Analysis Complete
          </h2>
          <h3
            className="text-4xl font-light text-[#332B2D] mb-6"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            The{" "}
            <span className="italic text-[#A55166] font-bold">{skinType}</span>{" "}
            Edit
          </h3>
          <p className="text-[#7A6B6E] text-lg mb-10 leading-relaxed font-light">
            {description}
          </p>
          <a
            href="/products"
            className="inline-block bg-[#332B2D] text-white px-10 py-4 rounded-full font-bold tracking-widest text-xs hover:bg-[#A55166] transition-all shadow-lg"
          >
            VIEW PRODUCTS JUST FOR YOU
          </a>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-[#FAF8F7] min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="w-full max-w-3xl bg-white rounded-[40px] shadow-2xl border border-[#F2E8E4] overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#F2E8E4]">
          <div
            className="h-full bg-[#A55166] transition-all duration-500"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>

        <div className="p-10 md:p-16">
          <p className="text-center text-[#A55166] text-xs font-bold tracking-widest uppercase mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h2
            className="text-[#332B2D] text-2xl md:text-3xl font-light text-center mb-10 leading-snug"
            style={{ fontFamily: "'Julius Sans One', sans-serif" }}
          >
            {currentQuestion.question}
          </h2>

          <div className="grid gap-3 mb-10">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left px-8 font-medium
                  ${
                    selectedOption === option
                      ? "border-[#A55166] bg-[#FDF2F0] text-[#A55166]"
                      : "border-[#F2E8E4] bg-white text-[#7A6B6E] hover:border-[#A55166]/30"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`text-sm font-bold tracking-widest uppercase transition ${
                currentQuestionIndex === 0
                  ? "opacity-0 cursor-default"
                  : "text-[#A55166] hover:text-[#332B2D]"
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              className="bg-[#332B2D] text-white px-10 py-4 rounded-full font-bold tracking-widest text-xs hover:bg-[#A55166] transition-all shadow-md"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Get My Edit"
                : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
