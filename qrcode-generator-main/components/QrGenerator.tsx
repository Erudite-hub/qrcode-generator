"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeCanvas, { QRCodeCanvasRef } from "./QrCodeCanvas";
import FileUploader from "./FileUploader";
import FilePreview from "./FilePreview";
import StyleControls from "./StyleControl";

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
  const [statusMessage, setStatusMessage] = useState<string>(
    "Add content to generate your first QR code."
  );

  const qrCodeCanvasRef = useRef<QRCodeCanvasRef>(null);

  const presets = [
    { label: "Website", value: "https://example.com" },
    { label: "Portfolio", value: "https://yourportfolio.com" },
    { label: "Contact", value: "https://wa.me/2348012345678" },
    { label: "Demo", value: "Final Year Project Demo" },
  ];

  const featureHighlights = [
    {
      title: "Secure uploads",
      description: "Supports image, audio, video, and PDF attachments for modern demos.",
    },
    {
      title: "Custom styling",
      description: "Adjust colors and patterns to match your product or brand identity.",
    },
    {
      title: "Easy sharing",
      description: "Download or share the finished QR directly from the app.",
    },
  ];

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
      setStatusMessage("Attachment ready. Your QR payload now includes a file preview.");
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadToCloudinary(file, "image", setIsUploading);
    if (uploadedUrl) {
      setLogoUrl(uploadedUrl);
      setStatusMessage("Logo uploaded. Your QR now has a polished center branding element.");
    }
  };

  const handlePresetSelect = (value: string) => {
    setText(value);
    setStatusMessage("Preset content loaded. Customize the QR and export it.");
  };

  const handleReset = () => {
    setText("");
    setFileData("");
    setFileType("");
    setLogoUrl("");
    setDotColor("#000000");
    setBgColor("#ffffff");
    setDotType("rounded");
    setStatusMessage("Session reset. Start a fresh QR design.");
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2ff_100%)] px-3 py-8 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_80px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-700 px-6 py-8 text-center sm:px-8 md:px-10 md:py-10"
          >
            <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-slate-100">
                Secure • Fast • Customizable
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Secure QR Generator
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto mt-3 max-w-2xl text-sm text-slate-200 sm:text-base"
            >
              Create polished QR codes with vibrant colors, attachments, and a centered logo in seconds.
            </motion.p>
          </motion.div>

          <div className="space-y-6 p-4 md:p-6 lg:p-8">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm md:p-5"
                >
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    QR Code Content
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setStatusMessage("Content updated. Your QR preview will refresh instantly.");
                    }}
                    placeholder="Enter URL or text..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-200"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePresetSelect(preset.value)}
                        className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-blue-500 hover:text-blue-700"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Tip: use a live link, portfolio URL, or contact detail to make the demo feel realistic.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{statusMessage}</span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-blue-500 hover:text-blue-700"
                    >
                      Reset
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                >
                  <FileUploader
                    label="Center Logo"
                    accept="image/*"
                    onFileChange={handleLogoChange}
                    buttonText={logoUrl ? "Logo uploaded successfully" : "Upload a logo to personalize your QR"}
                    uploaded={!!logoUrl}
                    isUploading={isUploading}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                >
                  <FileUploader
                    label="File Attachment"
                    accept="image/*,video/*,audio/*,application/pdf"
                    onFileChange={handleFileChange}
                    buttonText={
                      fileData ? "File attached successfully" : "Attach a file for extra context"
                    }
                    uploaded={!!fileData}
                    isUploading={isUploading}
                  />
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-4 shadow-sm md:p-5"
              >
                <StyleControls
                  dotColor={dotColor}
                  setDotColor={setDotColor}
                  bgColor={bgColor}
                  setBgColor={setBgColor}
                  dotType={dotType}
                  setDotType={setDotType}
                />
              </motion.div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {featureHighlights.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-slate-800">{feature.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <motion.div
                variants={itemVariants}
                className="flex min-h-[280px] items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fileData ? "preview" : "empty"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full"
                  >
                    <FilePreview fileData={fileData} fileType={fileType} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 shadow-inner"
              >
                <div className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Live Preview
                </div>
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

            <div className="flex w-full flex-col gap-3 md:flex-row">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => qrCodeCanvasRef.current?.download()}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#034592] to-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl md:py-4 md:text-base"
              >
                Download QR Code
                <svg
                  className="ml-2 h-4 w-4 md:h-5 md:w-5"
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => qrCodeCanvasRef.current?.share()}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0f4c81] to-indigo-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl md:py-4 md:text-base"
              >
                Share QR Code
                <svg
                  className="ml-2 h-4 w-4 md:h-5 md:w-5"
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
