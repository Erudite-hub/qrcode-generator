"use client";

import { useState } from "react";
import QrGenerator from "../components/QrGenerator";

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  const highlights = [
    {
      icon: "🔒",
      title: "Secure by design",
      text: "Create QR codes that support secure content delivery and modern digital sharing.",
    },
    {
      icon: "⚡",
      title: "Instant generation",
      text: "Build, preview, and export your QR code in seconds with a smooth interactive experience.",
    },
    {
      icon: "🎨",
      title: "Highly customizable",
      text: "Adjust colors, styles, logos, and attachments to fit your brand or project theme.",
    },
  ];

  const architecture = [
    {
      title: "Frontend",
      body: "Next.js and React power the responsive interface and interactive user flow.",
    },
    {
      title: "Design Layer",
      body: "Tailwind CSS and Framer Motion create a polished and animated experience.",
    },
    {
      title: "Media Handling",
      body: "Cloudinary securely stores uploaded files and makes media attachment seamless.",
    },
  ];

  const stack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Cloudinary"];

  return (
    <main className={isDark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2ff_100%)] text-slate-900"}>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className={isDark ? "mb-8 rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 shadow-[0_20px_80px_-24px_rgba(2,8,23,0.75)] backdrop-blur-xl sm:p-8 lg:p-10" : "mb-8 rounded-[32px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_80px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8 lg:p-10"}>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className={isDark ? "rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100" : "rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"}
            >
              {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <span className={isDark ? "mb-4 inline-flex items-center rounded-full border border-blue-800 bg-blue-950/60 px-3 py-1 text-sm font-semibold text-blue-300" : "mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"}>
                Secure • Fast • Customizable
              </span>
              <h1 className={isDark ? "text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl" : "text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"}>
                Build a polished QR experience for your next presentation.
              </h1>
              <p className={isDark ? "mx-auto mt-5 max-w-2xl text-lg text-slate-300 lg:mx-0" : "mx-auto mt-5 max-w-2xl text-lg text-slate-600 lg:mx-0"}>
                This project combines secure content sharing, modern UI design, and flexible customization into one professional web app.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
                <span className={isDark ? "rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-900" : "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"}>
                  Final Year Project
                </span>
                <span className={isDark ? "rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200" : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"}>
                  Web App Demo
                </span>
              </div>
            </div>

            <div className={isDark ? "rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 text-white shadow-xl" : "rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-700 p-6 text-white shadow-xl"}>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <h2 className="text-xl font-semibold">Why this project stands out</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-100">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-base">✓</span>
                    <span>Modern UI with a premium, presentation-ready look.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-base">✓</span>
                    <span>Interactive QR generation with real-time preview and styling controls.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-base">✓</span>
                    <span>Useful for real-world scenarios such as portfolios, contacts, and file sharing.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className={isDark ? "rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm backdrop-blur" : "rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"}>
              <div className="mb-3 text-4xl">{item.icon}</div>
              <h3 className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>{item.title}</h3>
              <p className={isDark ? "mt-2 text-sm leading-6 text-slate-400" : "mt-2 text-sm leading-6 text-slate-600"}>{item.text}</p>
            </div>
          ))}
        </div>

        <div className={isDark ? "mb-8 rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-sm backdrop-blur lg:p-8" : "mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur lg:p-8"}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className={isDark ? "text-2xl font-semibold text-white" : "text-2xl font-semibold text-slate-900"}>Project Architecture & Tech Stack</h2>
              <p className={isDark ? "mt-2 max-w-2xl text-sm text-slate-400" : "mt-2 max-w-2xl text-sm text-slate-600"}>A clear view of the system design and tools used to build this final-year project.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((tool) => (
                <span key={tool} className={isDark ? "rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm font-medium text-slate-200" : "rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {architecture.map((item) => (
              <div key={item.title} className={isDark ? "rounded-2xl border border-slate-800 bg-slate-950/70 p-4" : "rounded-2xl border border-slate-200 bg-slate-50 p-4"}>
                <h3 className={isDark ? "text-lg font-semibold text-white" : "text-lg font-semibold text-slate-900"}>{item.title}</h3>
                <p className={isDark ? "mt-2 text-sm leading-6 text-slate-400" : "mt-2 text-sm leading-6 text-slate-600"}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="generator">
          <QrGenerator />
        </div>

        <div className={isDark ? "mt-8 rounded-[28px] border border-slate-800 bg-gradient-to-r from-slate-900 to-blue-950 p-8 text-center text-white shadow-sm" : "mt-8 rounded-[28px] border border-slate-200 bg-gradient-to-r from-slate-900 to-blue-700 p-8 text-center text-white shadow-sm"}>
          <h2 className="text-2xl font-semibold">Ready to present this project?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            This version is polished, interactive, and suitable for showcasing in class, during viva, or in a portfolio.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#generator" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:scale-105">
              Try the Generator
            </a>
            <a href="#top" className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              Back to Top
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}