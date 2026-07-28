"use client";
import React from "react";
import { motion } from "framer-motion";

interface StyleControlsProps {
  dotColor: string;
  setDotColor: React.Dispatch<React.SetStateAction<string>>;
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  dotType: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  setDotType: React.Dispatch<React.SetStateAction<"rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded">>;
}

const StyleControls: React.FC<StyleControlsProps> = ({
  dotColor,
  setDotColor,
  bgColor,
  setBgColor,
  dotType,
  setDotType,
}) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1 md:space-y-2">
          <label className="block text-xs md:text-sm font-medium text-gray-700">Dot Color</label>
          <motion.input
            whileHover={{ scale: 1.05 }}
            type="color"
            value={dotColor}
            onChange={(e) => setDotColor(e.target.value)}
            className="w-full h-10 md:h-12 rounded-lg cursor-pointer shadow-sm"
          />
        </div>
        <div className="space-y-1 md:space-y-2">
          <label className="block text-xs md:text-sm font-medium text-gray-700">Background</label>
          <motion.input
            whileHover={{ scale: 1.05 }}
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 md:h-12 rounded-lg cursor-pointer shadow-sm"
          />
        </div>
      </div>
      <div className="space-y-1 md:space-y-2">
        <label className="block text-xs md:text-sm font-medium text-gray-700">Dot Style</label>
        <motion.select
          whileFocus={{ scale: 1.02 }}
          value={dotType}
          onChange={(e) => setDotType(e.target.value as "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded")}
          className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:border-[#034592] focus:ring-2 focus:ring-[#034592] transition-all"
        >
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
          <option value="square">Square</option>
          <option value="extra-rounded">Extra Rounded</option>
        </motion.select>
      </div>
    </div>
  );
};

export default StyleControls;