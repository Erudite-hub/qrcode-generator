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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Visual Style</h3>
          <p className="text-xs text-slate-500">Fine-tune the look of your QR code.</p>
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Custom
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Dot Color
          </label>
          <motion.input
            whileHover={{ scale: 1.02 }}
            type="color"
            value={dotColor}
            onChange={(e) => setDotColor(e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
            Background
          </label>
          <motion.input
            whileHover={{ scale: 1.02 }}
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Dot Style
        </label>
        <motion.select
          whileFocus={{ scale: 1.02 }}
          value={dotType}
          onChange={(e) => setDotType(e.target.value as "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded")}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 transition-all focus:border-[#034592] focus:ring-2 focus:ring-[#034592]"
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