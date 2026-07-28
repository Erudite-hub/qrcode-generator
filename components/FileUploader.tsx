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
    <div className="space-y-1 md:space-y-2">
      <label className="block text-xs md:text-sm font-medium text-gray-700">
        {label}
      </label>
      <motion.div whileHover="hover" whileTap="tap" className="relative group">
        <div className="flex flex-col items-center justify-center h-full p-3 md:p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-[#034592] transition-colors cursor-pointer">
          <input
            type="file"
            accept={accept}
            onChange={onFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-[#034592] mb-1 md:mb-2"
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
          <span className="text-xs md:text-sm text-gray-500 text-center">
            {uploaded ? "Uploaded!" : buttonText}
          </span>
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-[#034592]"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FileUploader;
