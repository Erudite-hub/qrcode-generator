"use client";
import React from "react";
import { motion } from "framer-motion";

interface FileUploaderProps {
  label: string;
  accept: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText: string;
  uploaded: boolean;
  isUploading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  accept,
  onFileChange,
  buttonText,
  uploaded,
  isUploading,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className={`text-xs font-medium ${uploaded ? "text-emerald-600" : "text-slate-400"}`}>
          {uploaded ? "Ready" : "Optional"}
        </span>
      </div>
      <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="group relative">
        <div
          className={`flex min-h-[118px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
            uploaded
              ? "border-emerald-300 bg-emerald-50/70 shadow-sm"
              : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-white"
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={onFileChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${uploaded ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-[#034592]"}`}>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <span className={`text-sm font-medium ${uploaded ? "text-emerald-700" : "text-slate-600"}`}>
            {uploaded ? "Uploaded successfully" : buttonText}
          </span>
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/85">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="h-7 w-7 rounded-full border-b-2 border-[#034592] md:h-8 md:w-8"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FileUploader;
