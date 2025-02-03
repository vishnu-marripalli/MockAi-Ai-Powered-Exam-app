"use client";

import React from "react";
import { motion } from "framer-motion";

const CreativeAILoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-screen z-50 fixed top-0 left-0 w-full bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="relative w-80 h-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 300"
            className="absolute top-0 left-0 w-full h-full"
          >
            {/* Circular Background Pulse */}
            <motion.circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="#6366F1"
              strokeWidth="4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 1], opacity: [0, 0.3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />

            {/* Interconnected Neural Network */}
            {[
              { x: 100, y: 100, color: "#3B82F6" },
              { x: 200, y: 100, color: "#6366F1" },
              { x: 150, y: 200, color: "#8B5CF6" },
              { x: 100, y: 50, color: "#EC4899" },
              { x: 200, y: 50, color: "#10B981" },
            ].map((node, index) => (
              <React.Fragment key={index}>
                {/* Connecting Lines */}
                {[
                  { x: 100, y: 100 },
                  { x: 200, y: 100 },
                  { x: 150, y: 200 },
                ].map((targetNode, lineIndex) => (
                  <motion.line
                    key={`${index}-${lineIndex}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#A78BFA"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                ))}

                {/* Nodes */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  fill={node.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1], rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />
              </React.Fragment>
            ))}

            {/* Central AI Core */}
            <motion.circle
              cx="150"
              cy="150"
              r="30"
              fill="#4F46E5"
              initial={{ scale: 0.7, opacity: 0.6 }}
              animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </svg>
        </div>

        {/* Animated Text */}
        <motion.div
          className="mt-8 text-xl font-bold text-indigo-700 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          AI Generating Questions. Please wait for a moment...
        </motion.div>

        {/* Loading Dots */}
        <div className="flex mt-4 space-x-2">
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-purple-500 rounded-full"
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeAILoader;
