"use client";
import React from "react";

interface FilePreviewProps {
  fileData: string;
  fileType: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, fileType }) => {
  if (!fileData) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-6 text-center text-slate-500">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-700">No file uploaded yet</h3>
        <p className="mt-1 text-sm text-slate-500">Add a file to preview it here.</p>
      </div>
    );
  }

  if (fileType.startsWith("image/")) {
    return <img src={fileData} alt="Uploaded preview" className="h-full w-full rounded-2xl object-contain" />;
  }
  if (fileType.startsWith("video/")) {
    return <video src={fileData} controls className="h-full w-full rounded-2xl object-contain" />;
  }
  if (fileType.startsWith("audio/")) {
    return <audio src={fileData} controls className="w-full" />;
  }
  if (fileType === "application/pdf") {
    return <embed src={fileData} type="application/pdf" className="h-full w-full rounded-2xl" />;
  }
  return null;
};

export default FilePreview;
