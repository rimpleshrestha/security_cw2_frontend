import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const steps = [
    {
      title: "Step 1: Take the Skin Quiz",
      description:
        "Answer a few quick questions to understand your skin type and its unique needs.",
    },
    {
      title: "Step 2: Get Personalized Recommendations",
      description:
        "Explore curated product suggestions tailored specifically for your skin type and concerns.",
    },
    {
      title: "Step 3: Curate a List of Products to Try",
      description:
        "Save recommended products to your personal list so you can easily track what you want to test.",
    },
    {
      title: "Step 4: Be Your Own Muse",
      description:
        "With the right tools and insights, embrace your natural beauty and take control of your skincare journey.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fad1e3] via-[#ffe2eb] to-[#ffedf5] flex flex-col items-center px-6 py-16 font-inter overflow-hidden">
      {/* Motto */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-[#A55166] text-center mb-10"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        “You Are Your Own Muse”
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-700 text-center max-w-3xl mb-16 leading-relaxed"
      >
        At SkinMuse, we believe that beauty is personal and unique. Our mission
        is to help you understand your skin better, discover the right products,
        and keep a list of what you want to try – empowering you to be your own
        muse.
      </motion.p>

      {/* Flow Steps */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
            className="bg-white shadow-lg rounded-3xl p-8 text-center hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-[#A55166] mb-3">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
