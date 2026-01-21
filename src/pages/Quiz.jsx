import { useState } from "react";
import SkinmuseLogo2 from "../assets/images/skinmuselogo2.png";

const Quiz = () => {
  const questions = [
    {
      question: "How does your skin usually feel a few hours after washing it?",
      options: [
        "Tight or rough",
        "Shiny or greasy",
        "Shiny in T-zone, dry on cheeks",
        "Comfortable and balanced",
        "Itchy, red, or easily irritated",
      ],
    },
    {
      question: "How often does your skin feel oily?",
      options: ["Rarely", "Sometimes", "Often", "Almost always"],
    },
    {
      question: "How does your skin react to the sun?",
      options: [
        "Burns easily",
        "Tans gradually",
        "Rarely burns or tans",
        "Not sure",
      ],
    },
    {
      question: "How sensitive is your skin to skincare products?",
      options: [
        "Very sensitive, reacts easily",
        "Somewhat sensitive",
        "Not sensitive at all",
        "Unsure",
      ],
    },
    {
      question: "How would you describe your skin's overall texture?",
      options: [
        "Rough or flaky",
        "Oily and smooth",
        "Combination (varies by area)",
        "Soft and even",
        "Red or irritated",
      ],
    },
  ];

  const skinTypeDescriptions = {
    Dry: "Your skin tends to feel tight, flaky, or rough. It needs deep hydration and gentle care.",
    Oily: "Your skin often looks shiny or greasy. Focus on lightweight, oil-controlling products.",
    Combination:
      "You have both oily and dry areas. Balanced care works best for you.",
    Normal: "Your skin feels balanced and even. Gentle maintenance is key!",
    Sensitive:
      "Your skin reacts easily to products or the environment. Use calming, hypoallergenic products.",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState([]);
  const [skinType, setSkinType] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const calculateSkinType = (answers) => {
    const score = {
      Dry: 0,
      Oily: 0,
      Combination: 0,
      Normal: 0,
      Sensitive: 0,
    };

    answers.forEach((answer) => {
      if (
        answer.includes("Tight") ||
        answer.includes("Rough") ||
        answer === "Rarely" ||
        answer === "Rough or flaky"
      )
        score.Dry++;

      if (
        answer.includes("greasy") ||
        answer === "Often" ||
        answer === "Almost always" ||
        answer === "Oily and smooth"
      )
        score.Oily++;

      if (
        answer.includes("T-zone") ||
        answer === "Sometimes" ||
        answer === "Combination (varies by area)"
      )
        score.Combination++;

      if (
        answer.includes("balanced") ||
        answer === "Tans gradually" ||
        answer === "Not sensitive at all" ||
        answer === "Soft and even" ||
        answer === "Rarely burns or tans"
      )
        score.Normal++;

      if (
        answer.includes("irritated") ||
        answer.includes("sensitive") ||
        answer === "Burns easily" ||
        answer === "Red or irritated"
      )
        score.Sensitive++;
    });

    const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  const handleNext = () => {
    if (!selectedOption) {
      alert("Please select an answer!");
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
      <div className="bg-gradient-to-b from-[#fad1e3] to-[#ff65aa]/10 min-h-screen flex flex-col items-center justify-center font-kaisei px-4">
        <img
          src={SkinmuseLogo2}
          alt="Skinmuse Logo"
          className="mb-10 w-72 h-auto"
        />
        <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-10 w-full max-w-xl text-center font-inter">
          <h2 className="text-3xl font-bold mb-4 text-[#d14b6e]">
            💫 Your Skin Type is:{" "}
            <span className="text-yellow-300">{skinType}</span>
          </h2>
          <p className="text-lg mb-8 text-[#d14b6e]">{description}</p>

          <a
            href="/products"
            className="inline-block px-6 py-3 text-lg bg-[#A55166] text-white rounded-xl font-semibold hover:bg-[#914257] transition"
          >
            See Recommended Products
          </a>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-gradient-to-b h-full from-[#fad1e3] to-[#ff65aa]/10 flex flex-col items-center justify-center font-kaisei min-h-screen">
      <img
        src={SkinmuseLogo2}
        alt="Skinmuse Logo"
        className="w-72 h-auto -mt-20"
      />

      <div className="w-[700px] p-8 rounded-2xl shadow-lg bg-opacity-25 backdrop-blur-md border bg-[#A55166]">
        <h2 className="text-white text-2xl font-bold mb-6 text-center font-inter">
          {currentQuestion.question}
        </h2>

        <div className="grid gap-4 mb-6">
          {currentQuestion.options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`p-4 rounded-xl shadow-md cursor-pointer text-center font-inter font-bold transition-transform duration-200
                ${
                  selectedOption === option
                    ? "bg-[#A55166] text-white -translate-y-1"
                    : "bg-white text-[#A55166] hover:bg-[#A55166] hover:text-white hover:-translate-y-1"
                }
              `}
            >
              {option}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-xl font-bold font-inter transition
              ${
                currentQuestionIndex === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-[#A55166] text-white hover:bg-[#914257]"
              }
            `}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="bg-[#A55166] text-white px-6 py-2 rounded-xl font-bold font-inter hover:bg-[#914257] transition"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
