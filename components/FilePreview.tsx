"use client";
import React from "react";

interface FilePreviewProps {
  fileData: string;
  fileType: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, fileType }) => {
  if (!fileData) {
    return <div className="text-gray-400">No file uploaded</div>;
  }
  if (fileType.startsWith("image/")) {
    return <img src={fileData} alt="Uploaded" className="object-contain w-full h-full rounded" />;
  }
  if (fileType.startsWith("video/")) {
    return <video src={fileData} controls className="object-contain w-full h-full rounded" />;
  }
  if (fileType.startsWith("audio/")) {
    return <audio src={fileData} controls className="w-full" />;
  }
  if (fileType === "application/pdf") {
    return <embed src={fileData} type="application/pdf" className="object-contain w-full h-full rounded" />;
  }
  return null;
};

export default FilePreview;
