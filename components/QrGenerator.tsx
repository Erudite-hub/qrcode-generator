"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeCanvas, { QRCodeCanvasRef } from "./QrCodeCanvas";
import FileUploader from "./FileUploader";
import FilePreview from "./FilePreview";
import StyleControls from "./StyleControl";
import InstructionModal from "./InstructionModal";  // <-- Import the modal

const uploadToCloudinary = async (
  file: File,
  type: "image" | "video" | "audio" | "raw",
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset!);
  formData.append("resource_type", type);

  try {
    setIsUploading(true);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    return "";
  } finally {
    setIsUploading(false);
  }
};

const QrGenerator: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [fileData, setFileData] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [dotColor, setDotColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [dotType, setDotType] = useState<
    | "rounded"
    | "dots"
    | "classy"
    | "classy-rounded"
    | "square"
    | "extra-rounded"
  >("rounded");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true); // New state for modal

  const qrCodeCanvasRef = useRef<QRCodeCanvasRef>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileData("");
    setFileType("");

    let mediaType: "image" | "video" | "audio" | "raw";
    if (file.type.startsWith("image/")) {
      mediaType = "image";
    } else if (file.type.startsWith("video/")) {
      mediaType = "video";
    } else if (file.type.startsWith("audio/")) {
      mediaType = "audio";
    } else if (file.type === "application/pdf") {
      mediaType = "raw";
    } else {
      console.error("Unsupported file type");
      return;
    }

    const uploadedUrl = await uploadToCloudinary(
      file,
      mediaType,
      setIsUploading
    );
    if (uploadedUrl) {
      setFileData(uploadedUrl);
      setFileType(file.type);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadToCloudinary(file, "image", setIsUploading);
    if (uploadedUrl) {
      setLogoUrl(uploadedUrl);
    }
  };

  const payload: Record<string, string> = {};
  if (text.trim()) payload.text = text.trim();
  if (fileData) payload.file = fileData;
  if (fileType) payload.fileType = fileType;
  const qrData = JSON.stringify(payload);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen py-8">

      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <motion.div
            variants={itemVariants}
            className="bg-[#034592] p-4 md:p-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            QR Code Generator
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm md:text-base text-center text-[#fff] mt-1 md:mt-2"
            >
              Create beautiful, customizable QR codes
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="p-4 md:p-6 space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* QR Code Data Input */}
              <motion.div
                variants={itemVariants}
                className="space-y-1 md:space-y-2"
              >
                <label className="block text-xs md:text-sm font-medium text-gray-700">
                  QR Code Content
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter URL or text..."
                  className="w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base border-2 border-[#034592] rounded-lg focus:border-[#034592] focus:ring-2 focus:ring-[#034592] transition-all"
                />
              </motion.div>

              {/* Logo Uploader */}
              <FileUploader
                label="Center Logo"
                accept="image/*"
                onFileChange={handleLogoChange}
                buttonText={logoUrl ? "Logo uploaded!" : "Click to upload logo"}
                uploaded={!!logoUrl}
                isUploading={isUploading}
              />

              {/* File Attachment Uploader */}
              <FileUploader
                label="File Attachment"
                accept="image/*,video/*,audio/*,application/pdf"
                onFileChange={handleFileChange}
                buttonText={
                  fileData ? "File attached!" : "Drag & drop or click to upload"
                }
                uploaded={!!fileData}
                isUploading={isUploading}
              />

              {/* Style Controls */}
              <StyleControls
                dotColor={dotColor}
                setDotColor={setDotColor}
                bgColor={bgColor}
                setBgColor={setBgColor}
                dotType={dotType}
                setDotType={setDotType}
              />
            </div>

            {/* Preview & QR Code Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 p-3 md:p-4 rounded-xl border-2 border-dashed border-gray-200 min-h-48 md:min-h-64 flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fileData ? "preview" : "empty"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <FilePreview fileData={fileData} fileType={fileType} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 p-3 md:p-4 rounded-xl border-2 border-dashed border-gray-200 min-h-48 md:min-h-64 flex flex-col items-center justify-center"
              >
                <QRCodeCanvas
                  ref={qrCodeCanvasRef}
                  data={qrData}
                  dotColor={dotColor}
                  dotType={dotType}
                  bgColor={bgColor}
                  logoUrl={logoUrl}
                />
              </motion.div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => qrCodeCanvasRef.current?.download()}
                className="w-full py-3 px-5 md:py-4 md:px-6 bg-[#034592]  text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base flex items-center justify-center"
              >
                Download QR Code
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 inline-block ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => qrCodeCanvasRef.current?.share()}
                className="w-full py-3 px-5 md:py-4 md:px-6 bg-[#034592] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base flex items-center justify-center"
              >
                Share QR Code
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 inline-block ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QrGenerator;
