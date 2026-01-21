import React from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const steps = [
    {
      title: "Step 1: The Skin Diagnostic",
      description:
        "Understand your skin's unique texture, oil levels, and undertones through our specialized beauty quiz.",
    },
    {
      title: "Step 2: Custom Makeup Match",
      description:
        "Receive a curated collection of foundation, eye, and lip products formulated specifically to perform best on your skin type.",
    },
    {
      title: "Step 3: Explore Honest Reviews",
      description:
        "Browse feedback from the MakeupMuse community. Filter reviews by skin type to see how products actually wear on people like you.",
    },
    {
      title: "Step 4: Share Your Artistry",
      description:
        "Give back to the community by leaving your own reviews. Help others find their perfect match while becoming your own muse.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAFA] flex flex-col items-center px-6 py-20 font-inter overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FAD1E3]/30 to-transparent pointer-events-none"></div>

      {/* Motto */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-7xl font-light text-[#3D3436] text-center mb-8 relative z-10"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        You Are Your Own{" "}
        <span className="text-[#A55166] italic font-bold">Muse</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-lg md:text-xl text-[#7A6B6E] text-center max-w-2xl mb-20 leading-relaxed font-light relative z-10"
      >
        At <span className="font-semibold text-[#A55166]">MakeupMuse</span>, we
        bridge the gap between skin health and makeup artistry. Discover
        products that won't just cover your skin, but celebrate it.
      </motion.p>

      {/* Flow Steps - Vertical Timeline or Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group bg-white border border-[#F2E8E4] rounded-[40px] p-10 flex flex-col items-start hover:border-[#A55166]/30 hover:shadow-[0_20px_40px_rgba(165,81,102,0.05)] transition-all duration-500"
          >
            <div className="w-12 h-12 bg-[#FAD1E3]/20 rounded-full flex items-center justify-center mb-6 text-[#A55166] font-bold group-hover:bg-[#A55166] group-hover:text-white transition-colors duration-500">
              {index + 1}
            </div>
            <h3
              className="text-2xl font-bold text-[#3D3436] mb-4"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            >
              {step.title}
            </h3>
            <p className="text-[#7A6B6E] leading-relaxed font-light">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Call to Action Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-24 text-center"
      >
        <button className="bg-[#3D3436] text-white px-12 py-5 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-[#A55166] transition-all shadow-xl">
          Join the Community
        </button>
      </motion.div>
    </div>
  );
}
